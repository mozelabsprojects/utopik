import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateRelationship } from "@/lib/game-engine";

export async function POST(request: Request) {
  try {
    const { gameId, partnerName, action } = await request.json();

    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: { worldCountries: true }
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
        return NextResponse.json({ error: "Savaş ilan etmek için en az 20 Siyasi Sermaye gerekiyor." }, { status: 400 });
      }
      updatedPoliticalCapital -= 20;
      
      // Sebepsiz savaş cezası
      if (relationship >= 20) {
        updatedStability -= 40; // Çok ağır ceza
      } else {
        updatedStability -= 15; // Normal savaş ilanı
      }
      
      diplomacyState[partnerName] = { type: 'war', turnsRemaining: -1 };
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
