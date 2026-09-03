import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateRelationship } from "@/lib/game-engine";
import { COUNTRIES } from "@/lib/countries-data";

export async function POST(request: Request) {
  try {
    const { gameId, partnerName, action } = await request.json();

    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: { worldCountries: { orderBy: { name: 'asc' } } }
    });

    if (!game) {
      return NextResponse.json({ error: "Oyun bulunamadı" }, { status: 404 });
    }
    
    const partner = game.worldCountries.find(c => c.name === partnerName);
    if (!partner) return NextResponse.json({ error: "Ülke bulunamadı" }, { status: 404 });

    const relationship = calculateRelationship(game, partner);

    let diplomacyState: any = { westernRelations: 50, easternRelations: 50, activeEmbargoes: [] };
    try {
      if (game.diplomacyState) {
         diplomacyState = JSON.parse(game.diplomacyState);
      }
      if (!diplomacyState.activeEmbargoes) diplomacyState.activeEmbargoes = [];
    } catch {}

    if (action !== "peace" && action !== "lift_embargo" && diplomacyState[partnerName]) {
      return NextResponse.json({ error: "Bu ülkeyle zaten aktif bir savaş/ittifak durumu var." }, { status: 400 });
    }
    
    if (action === "peace" && diplomacyState[partnerName]?.type !== "war") {
      return NextResponse.json({ error: "Barış ilan etmek için bu ülkeyle savaşta olmalısınız." }, { status: 400 });
    }

    let updatedBudget = game.budget;
    let updatedPoliticalCapital = game.politicalCapital;
    let updatedStability = game.stability;
    let battleResultText = "";

    if (action === "war") {
      if (game.politicalCapital < 100) {
        return NextResponse.json({ error: "Savaş/İşgal ilan etmek için en az 100 Siyasi Sermaye gerekiyor." }, { status: 400 });
      }
      updatedPoliticalCapital -= 100;
      
      // Savaş açılan bloğun tepkisi (Diplomatik Ceza)
      const targetAlignment = COUNTRIES.find(c => c.name === partnerName)?.alignment;
      if (targetAlignment === 'western') {
        diplomacyState.westernRelations = Math.max(0, (diplomacyState.westernRelations || 50) - 30);
      } else if (targetAlignment === 'eastern') {
        diplomacyState.easternRelations = Math.max(0, (diplomacyState.easternRelations || 50) - 30);
      }
      
      if (relationship >= 20) {
        updatedStability -= 40; // İhanet
      } else {
        updatedStability -= 15;
      }

      const playerRoll = Math.random() * game.military;
      const targetRoll = Math.random() * partner.military;
      
      if (playerRoll > targetRoll) {
        // Dinamik Ganimet: Hedefin Bütçesi + (Askeri gücü * 150) + (İstikrarı * 100)
        // Minimum $5,000 ganimet garantisi.
        const loot = Math.max(5000, partner.budget + (partner.military * 150) + (partner.stability * 100));
        updatedBudget += loot;
        const currentEnergy = game.energy || 50;
        const currentFood = game.food || 50;
        
        battleResultText = `ZAFER! ${partnerName} başarıyla işgal edildi. $${Math.floor(loot).toLocaleString()} ganimet ele geçirildi!`;
        
        await prisma.game.update({
          where: { id: gameId },
          data: {
            budget: updatedBudget,
            politicalCapital: updatedPoliticalCapital,
            stability: Math.max(0, updatedStability),
            happiness: Math.min(100, game.happiness + 20),
            popularity: Math.min(100, game.popularity + 30),
            energy: Math.min(100, currentEnergy + 30),
            food: Math.min(100, currentFood + 30),
            diplomacyState: JSON.stringify(diplomacyState)
          }
        });
        
        return NextResponse.json({ success: true, message: battleResultText });
      } else {
        // Kayıp: Oyuncunun bütçesinin %15'i (Eskiden %30'du) veya en az $5000.
        const loss = Math.max(5000, game.budget * 0.15);
        updatedBudget -= loss;
        
        battleResultText = `HEZİMET! ${partnerName} ordumuzu darmadağın etti. Savaş tazminatı olarak $${Math.floor(loss).toLocaleString()} kaybettik!`;
        
        await prisma.game.update({
          where: { id: gameId },
          data: {
            budget: updatedBudget,
            politicalCapital: updatedPoliticalCapital,
            stability: Math.max(0, updatedStability - 20),
            happiness: Math.max(0, game.happiness - 30),
            military: Math.max(0, game.military - 40),
            popularity: Math.max(0, game.popularity - 30),
            diplomacyState: JSON.stringify(diplomacyState)
          }
        });
        
        return NextResponse.json({ success: true, message: battleResultText });
      }
    } else if (action === "alliance") {
      if (game.politicalCapital < 30) {
        return NextResponse.json({ error: "İttifak kurmak için en az 30 Siyasi Sermaye gerekiyor." }, { status: 400 });
      }
      updatedPoliticalCapital -= 30;
      diplomacyState[partnerName] = { type: 'alliance', turnsRemaining: 20 };
    } else if (action === "peace") {
      if (game.politicalCapital < 50) {
        return NextResponse.json({ error: "Barış antlaşması imzalamak için en az 50 Siyasi Sermaye gerekiyor." }, { status: 400 });
      }
      if (game.budget < 1000) {
        return NextResponse.json({ error: "Savaş tazminatı ve antlaşma masrafları için en az $1000 bütçe gerekiyor." }, { status: 400 });
      }
      updatedPoliticalCapital -= 50;
      updatedBudget -= 1000;
      delete diplomacyState[partnerName];
    } else if (action === "embargo") {
      if (game.politicalCapital < 20) {
         return NextResponse.json({ error: "Ambargo uygulamak için en az 20 Siyasi Sermaye gerekiyor." }, { status: 400 });
      }
      updatedPoliticalCapital -= 20;
      // Biz ambargo atarsak ilişkiler kalıcı bozulur ama aktif bir ceza uygulanmaz. (Trade route engellenmesi ui tarafında eklenebilir)
      // Ancak UI tarafındaki uyumluluk için eklenmiştir.
    } else if (action === "lift_embargo") {
      if (game.politicalCapital < 20) {
         return NextResponse.json({ error: "Ambargoyu kaldırmak için en az 20 Siyasi Sermaye gerekiyor." }, { status: 400 });
      }
      if (game.budget < 1000) {
         return NextResponse.json({ error: "Diplomatik arabuluculuk masrafları için en az $1000 gerekiyor." }, { status: 400 });
      }
      if (!diplomacyState.activeEmbargoes.includes(partnerName)) {
         return NextResponse.json({ error: "Bu ülke size ambargo uygulamıyor." }, { status: 400 });
      }
      updatedPoliticalCapital -= 20;
      updatedBudget -= 1000;
      diplomacyState.activeEmbargoes = diplomacyState.activeEmbargoes.filter((name: string) => name !== partnerName);
    } else {
      return NextResponse.json({ error: "Geçersiz işlem." }, { status: 400 });
    }

    // Yüzdeleri Yeniden Hesapla
    let totalPower = 0;
    let westPower = 0;
    let eastPower = 0;

    for (const ai of game.worldCountries) {
      if (!ai.isPlayer) {
        const powerScore = ai.military + (ai.budget / 1000) + ai.stability;
        totalPower += powerScore;
        const cData = COUNTRIES.find(c => c.name === ai.name);
        if (cData?.alignment === 'western') westPower += powerScore;
        else if (cData?.alignment === 'eastern') eastPower += powerScore;
      }
    }

    const playerPowerScore = game.military + (updatedBudget / 1000) + updatedStability;
    totalPower += playerPowerScore;
    
    let playerIsWestern = false;
    let playerIsEastern = false;
    Object.entries(diplomacyState).forEach(([name, dip]) => {
      if ((dip as any).type === 'alliance') {
        const cd = COUNTRIES.find(c => c.name === name);
        if (cd?.alignment === 'western') playerIsWestern = true;
        if (cd?.alignment === 'eastern') playerIsEastern = true;
      }
    });

    if (playerIsWestern && !playerIsEastern) westPower += playerPowerScore;
    else if (playerIsEastern && !playerIsWestern) eastPower += playerPowerScore;

    if (totalPower > 0) {
      diplomacyState.westernRelations = Math.min(100, Math.max(0, (westPower / totalPower) * 100));
      diplomacyState.easternRelations = Math.min(100, Math.max(0, (eastPower / totalPower) * 100));
    }

    await prisma.game.update({
      where: { id: gameId },
      data: {
        budget: updatedBudget,
        politicalCapital: updatedPoliticalCapital,
        stability: Math.max(0, updatedStability),
        diplomacyState: JSON.stringify(diplomacyState)
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Diplomasi eylemi hatası:", error);
    return NextResponse.json({ error: "İşlem gerçekleştirilemedi." }, { status: 500 });
  }
}
