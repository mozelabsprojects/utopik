import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clampStat } from "@/lib/game-engine";

export async function POST(request: Request) {
  try {
    const { gameId, targetCountryId, action } = await request.json(); // action: "alliance" | "embargo" | "war"

    const game = await prisma.game.findUnique({ 
      where: { id: gameId },
      include: { worldCountries: { orderBy: { name: 'asc' } } }
    });
    
    if (!game) return NextResponse.json({ error: "Oyun bulunamadı" }, { status: 404 });
    if (game.isGameOver) return NextResponse.json({ error: "Oyun bitti" }, { status: 400 });

    const targetCountry = game.worldCountries.find(c => c.id === targetCountryId);
    if (!targetCountry || targetCountry.isPlayer) {
      return NextResponse.json({ error: "Geçersiz hedef ülke" }, { status: 400 });
    }

    let turnReports: string[];
    try { turnReports = JSON.parse(game.turnReports); } catch { turnReports = []; }

    let budget = game.budget;
    let military = game.military;
    let foreignRelations = game.foreignRelations;
    let stability = game.stability;
    let popularity = game.popularity;
    let politicalCapital = game.politicalCapital;

    if (action === "alliance") {
      if (politicalCapital < 30) return NextResponse.json({ error: "Yetersiz siyasi sermaye (30 gerekli)" }, { status: 400 });
      politicalCapital -= 30;
      foreignRelations = clampStat(foreignRelations + 10);
      military = clampStat(military + 5);
      turnReports.push(`🤝 DİPLOMASİ: ${targetCountry.name} ile askeri ittifak kuruldu.`);
    } else if (action === "embargo") {
      if (politicalCapital < 20) return NextResponse.json({ error: "Yetersiz siyasi sermaye (20 gerekli)" }, { status: 400 });
      politicalCapital -= 20;
      foreignRelations = clampStat(foreignRelations - 15);
      budget += 1000; // Yerli üretim artışı kısa vade
      stability = clampStat(stability - 5);
      turnReports.push(`🚫 DİPLOMASİ: ${targetCountry.name} ülkesine ambargo uygulandı.`);
    } else if (action === "war") {
      if (politicalCapital < 100) return NextResponse.json({ error: "Yetersiz siyasi sermaye (100 gerekli)" }, { status: 400 });
      if (military < targetCountry.military) {
        return NextResponse.json({ error: "Ordunuz bu ülke için çok zayıf!" }, { status: 400 });
      }
      politicalCapital -= 100;
      budget -= 5000;
      foreignRelations = clampStat(foreignRelations - 40);
      military = clampStat(military - 20); // Kayıplar
      popularity = clampStat(popularity + 10); // Savaş zamanı milliyetçilik
      turnReports.push(`⚔️ SAVAŞ İLANI: ${targetCountry.name} işgal edildi! (Bütçe ve askeri kayıplar yaşandı)`);
      
      // Ülkeyi yok et / pasifize et
      await prisma.worldCountry.update({
        where: { id: targetCountry.id },
        data: { military: 0, budget: 0, stability: 0 }
      });
    }

    await prisma.game.update({
      where: { id: gameId },
      data: {
        budget,
        military,
        foreignRelations,
        stability,
        popularity,
        politicalCapital,
        turnReports: JSON.stringify(turnReports)
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Diplomasi işlemi başarısız" }, { status: 500 });
  }
}
