import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateRelationship } from "@/lib/game-engine";

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

    let diplomacyState: Record<string, { type: 'war' | 'alliance', turnsRemaining: number }> = {};
    try {
      diplomacyState = JSON.parse(game.diplomacyState);
    } catch {}

    if (action !== "peace" && diplomacyState[partnerName]) {
      return NextResponse.json({ error: "Bu ülkeyle zaten aktif bir savaş/ittifak durumu var." }, { status: 400 });
    }
    
    if (action === "peace" && diplomacyState[partnerName]?.type !== "war") {
      return NextResponse.json({ error: "Barış ilan etmek için bu ülkeyle savaşta olmalısınız." }, { status: 400 });
    }

    let updatedBudget = game.budget;
    let updatedPoliticalCapital = game.politicalCapital;
    let updatedStability = game.stability;

    if (action === "war") {
      if (game.politicalCapital < 20) {
        return NextResponse.json({ error: "Savaş/İşgal ilan etmek için en az 20 Siyasi Sermaye gerekiyor." }, { status: 400 });
      }
      updatedPoliticalCapital -= 20;
      
      // Sebepsiz savaş cezası
      if (relationship >= 20) {
        updatedStability -= 40; // Çok ağır ceza
      } else {
        updatedStability -= 15; // Normal savaş ilanı
      }

      // Savaş Algoritması (RNG + Military)
      const playerRoll = Math.random() * game.military;
      const targetRoll = Math.random() * partner.military;
      
      let battleResultText = "";
      
      if (playerRoll > targetRoll) {
        // KAZANDI
        const loot = partner.budget * 0.5; // Rakibin bütçesinin %50'sini al
        const foodLoot = 30;
        const energyLoot = 30;
        
        updatedBudget += loot;
        // Resources exist in game, but we need to update them.
        const currentEnergy = game.energy || 50;
        const currentFood = game.food || 50;
        
        battleResultText = `ZAFER! ${partnerName} başarıyla işgal edildi. $${Math.floor(loot)} ganimet, gıda ve enerji ele geçirildi!`;
        
        await prisma.game.update({
          where: { id: gameId },
          data: {
            budget: updatedBudget,
            politicalCapital: updatedPoliticalCapital,
            stability: Math.max(0, updatedStability),
            happiness: Math.min(100, game.happiness + 20),
            popularity: Math.min(100, game.popularity + 30),
            energy: Math.min(100, currentEnergy + energyLoot),
            food: Math.min(100, currentFood + foodLoot)
          }
        });
        
        return NextResponse.json({ success: true, message: battleResultText });
      } else {
        // KAYBETTİ
        const loss = game.budget * 0.3; // Bütçenin %30'u gider
        updatedBudget -= loss;
        
        battleResultText = `HEZİMET! ${partnerName} ordumuzu darmadağın etti. Savaş tazminatı olarak $${Math.floor(loss)} kaybettik, ordu ve istikrar çöktü!`;
        
        await prisma.game.update({
          where: { id: gameId },
          data: {
            budget: updatedBudget,
            politicalCapital: updatedPoliticalCapital,
            stability: Math.max(0, updatedStability - 20),
            happiness: Math.max(0, game.happiness - 30),
            military: Math.max(0, game.military - 40),
            popularity: Math.max(0, game.popularity - 30),
          }
        });
        
        return NextResponse.json({ success: true, message: battleResultText });
      }
    } else if (action === "alliance") {
      if (game.politicalCapital < 10) {
        return NextResponse.json({ error: "İttifak kurmak için en az 10 Siyasi Sermaye gerekiyor." }, { status: 400 });
      }
      if (game.budget < 500) {
        return NextResponse.json({ error: "İttifak kurmak için en az $500 bütçe (Elçilik masrafı) gerekiyor." }, { status: 400 });
      }
      updatedPoliticalCapital -= 10;
      updatedBudget -= 500;
      diplomacyState[partnerName] = { type: 'alliance', turnsRemaining: 20 }; // Alliances last 20 turns
    } else if (action === "peace") {
      if (game.politicalCapital < 30) {
        return NextResponse.json({ error: "Barış antlaşması imzalamak için en az 30 Siyasi Sermaye gerekiyor." }, { status: 400 });
      }
      if (game.budget < 1000) {
        return NextResponse.json({ error: "Savaş tazminatı ve antlaşma masrafları için en az $1000 bütçe gerekiyor." }, { status: 400 });
      }
      updatedPoliticalCapital -= 30;
      updatedBudget -= 1000;
      delete diplomacyState[partnerName]; // Savaşı bitir
    } else {
      return NextResponse.json({ error: "Geçersiz işlem." }, { status: 400 });
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
