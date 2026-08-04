import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { POLICIES, PolicyId } from "@/lib/policies";
import { FactionsState, modifyFactionSupport, INITIAL_FACTIONS } from "@/lib/factions";

export async function POST(request: Request) {
  try {
    const { gameId, policyId, action } = await request.json(); // action: "enact" or "repeal"

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

    const cost = action === "enact" ? policy.politicalCost : Math.max(1, Math.round(policy.politicalCost / 2));
    if (game.politicalCapital < cost) {
      return NextResponse.json({ error: "Yetersiz siyasi sermaye" }, { status: 400 });
    }

    let activeLaws: PolicyId[] = [];
    try { activeLaws = JSON.parse(game.activeLaws); } catch {}

    let factions: FactionsState = INITIAL_FACTIONS;
    try { factions = JSON.parse(game.factions); } catch { factions = INITIAL_FACTIONS; }
    
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

    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: {
        politicalCapital: game.politicalCapital - cost,
        activeLaws: JSON.stringify(activeLaws),
        factions: JSON.stringify(factions),
        turnReports: JSON.stringify(turnReports)
      }
    });

    return NextResponse.json({ game: updatedGame });
  } catch (error) {
    console.error("Yasa işlem hatası:", error);
    return NextResponse.json(
      { error: "Yasa işlemi gerçekleştirilemedi" },
      { status: 500 }
    );
  }
}
