import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { POLICIES, PolicyId } from "@/lib/policies";
import { FactionsState, modifyFactionSupport, INITIAL_FACTIONS, calculateParliamentSeats } from "@/lib/factions";

export async function POST(request: Request) {
  try {
    const { gameId, policyId, action, isLobbying } = await request.json(); // action: "enact" or "repeal"

    const game = await prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      return NextResponse.json({ error: "Oyun bulunamadı" }, { status: 404 });
    }

    const policy = POLICIES[policyId as PolicyId];
    if (!policy) {
      return NextResponse.json({ error: "Geçersiz politika" }, { status: 400 });
    }

    let activeLaws: PolicyId[] = [];
    try { activeLaws = JSON.parse(game.activeLaws); } catch {}

    let factions: FactionsState = INITIAL_FACTIONS;
    try { factions = JSON.parse(game.factions); } catch { factions = INITIAL_FACTIONS; }
    
    // MECLİS (PARLAMENTO) OYLAMA SİSTEMİ
    const parliamentSeats = calculateParliamentSeats(factions);
    let yesVotes = 0;
    let noVotes = 0;
    
    Object.entries(parliamentSeats).forEach(([fIdStr, seats]) => {
      const fId = fIdStr as keyof FactionsState;
      const impact = action === "enact" 
          ? (policy.factionImpactOnEnact[fId] || 0) 
          : -(policy.factionImpactOnEnact[fId] || 0); 
          
      if (impact > 0) yesVotes += seats;
      else if (impact < 0) noVotes += seats;
      else {
        // Kararsız/Etkilenmeyenler: Oylar yarı yarıya bölünür
        yesVotes += Math.floor(seats / 2);
        noVotes += Math.ceil(seats / 2);
      }
    });

    const passNaturally = yesVotes >= 51; // 100 üzerinden salt çoğunluk 51'dir

    if (!passNaturally && !isLobbying) {
      return NextResponse.json({ 
        error: `Yasa meclisten geçmedi. (Evet: %${Math.round(yesVotes)}, Hayır: %${Math.round(noVotes)})`, 
        requiresLobbying: true, 
        votes: { yes: Math.round(yesVotes), no: Math.round(noVotes) } 
      }, { status: 400 });
    }

    const baseCost = action === "enact" ? policy.politicalCost : Math.max(1, Math.round(policy.politicalCost / 2));
    const finalCost = isLobbying ? baseCost * 2 : baseCost;

    if (game.politicalCapital < finalCost) {
      return NextResponse.json({ error: "Yetersiz siyasi sermaye" }, { status: 400 });
    }

    let turnReports: string[] = [];
    try { turnReports = JSON.parse(game.turnReports); } catch {}

    if (action === "enact") {
      if (activeLaws.includes(policyId)) {
        return NextResponse.json({ error: "Bu yasa zaten yürürlükte" }, { status: 400 });
      }
      activeLaws.push(policyId);
      // Anlık etki (Fraksiyonlara)
      factions = modifyFactionSupport(factions, policy.factionImpactOnEnact);
      turnReports.push(`📜 YENİ YASA: ${policy.name} yürürlüğe girdi.`);
    } else if (action === "repeal") {
      if (!activeLaws.includes(policyId)) {
        return NextResponse.json({ error: "Bu yasa yürürlükte değil" }, { status: 400 });
      }
      activeLaws = activeLaws.filter(l => l !== policyId);
      // İptal edildiğinde tam tersi etkiyi hafifletilmiş olarak uygula
      const reverseImpact = Object.fromEntries(
        Object.entries(policy.factionImpactOnEnact).map(([k, v]) => [k, -(v as number) * 0.5])
      );
      factions = modifyFactionSupport(factions, reverseImpact);
      turnReports.push(`🗑️ YASA İPTALİ: ${policy.name} yürürlükten kaldırıldı.`);
    } else {
      return NextResponse.json({ error: "Geçersiz işlem" }, { status: 400 });
    }

    const totalNewSupport = Object.values(factions).reduce((acc, f) => acc + f.support, 0);
    const newPopularity = Math.round(totalNewSupport / 5);

    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: {
        politicalCapital: game.politicalCapital - finalCost,
        popularity: newPopularity,
        activeLaws: JSON.stringify(activeLaws),
        factions: JSON.stringify(factions),
        turnReports: JSON.stringify(turnReports)
      }
    });

    const formatImpact = (impactObj: any) => {
      const parts: string[] = [];
      if (impactObj.workers) parts.push(`İşçiler: ${impactObj.workers > 0 ? '+' : ''}${impactObj.workers}`);
      if (impactObj.capitalists) parts.push(`Sermaye: ${impactObj.capitalists > 0 ? '+' : ''}${impactObj.capitalists}`);
      if (impactObj.intellectuals) parts.push(`Aydınlar: ${impactObj.intellectuals > 0 ? '+' : ''}${impactObj.intellectuals}`);
      if (impactObj.nationalists) parts.push(`Milliyetçiler: ${impactObj.nationalists > 0 ? '+' : ''}${impactObj.nationalists}`);
      if (impactObj.military) parts.push(`Askeriye: ${impactObj.military > 0 ? '+' : ''}${impactObj.military}`);
      return parts.join(', ');
    };
    
    const impactStr = action === "enact" ? formatImpact(policy.factionImpactOnEnact) : formatImpact(Object.fromEntries(
        Object.entries(policy.factionImpactOnEnact).map(([k, v]) => [k, -(v as number) * 0.5])
    ));

    return NextResponse.json({ game: updatedGame, impactString: impactStr });
  } catch (error) {
    console.error("Yasa işlem hatası:", error);
    return NextResponse.json(
      { error: "Yasa işlemi gerçekleştirilemedi" },
      { status: 500 }
    );
  }
}
