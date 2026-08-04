import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { gameId, investmentAmount } = await request.json();

    const game = await prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      return NextResponse.json({ error: "Oyun bulunamadı" }, { status: 404 });
    }

    if (game.budget < investmentAmount) {
      return NextResponse.json({ error: "Yetersiz bütçe" }, { status: 400 });
    }
    
    if (game.stability < 30) {
      return NextResponse.json({ error: "İstikrar çok düşük, yerel şirketler risk almak istemiyor." }, { status: 400 });
    }

    // Maksimum aktif anlaşma kontrolü (iç ve dış toplamı veya sadece iç?)
    // Oyuncu toplam 5 ticaret anlaşması yapabilsin
    const activeAgreementsCount = await prisma.tradeAgreement.count({
      where: { gameId: game.id }
    });
    if (activeAgreementsCount >= 5) {
      return NextResponse.json({ error: "Aynı anda maksimum 5 ticaret anlaşmanız olabilir." }, { status: 400 });
    }

    // İstikrar maliyeti (Bürokratik yük)
    const stabilityCost = 1;

    // İç ticaret formülü: Daha güvenli ama risk barındırıyor
    // İstikrara göre başarı şansı (Örn: İstikrar 80 ise %80 şans)
    const successChance = game.stability / 100;
    const isSuccess = Math.random() < successChance;
    
    let totalExpectedReturn = 0;
    if (isSuccess) {
      // Başarılı yatırım: +%20 ile +%50 arası kar
      const baseReturn = 1.20;
      const variableReturn = Math.random() * 0.30;
      totalExpectedReturn = investmentAmount * (baseReturn + variableReturn);
    } else {
      // Başarısız yatırım (Zarar): %10 ile %50 arası zarar
      const lossSeverity = 0.1 + (Math.random() * 0.4); // 0.1 - 0.5
      totalExpectedReturn = investmentAmount * (1 - lossSeverity);
    }
    
    const incomePerTurn = Math.round(totalExpectedReturn / 5);

    // Bütçeden ve istikrardan düş
    await prisma.game.update({
      where: { id: gameId },
      data: {
        budget: game.budget - investmentAmount,
        stability: Math.max(0, game.stability - stabilityCost),
      }
    });

    // Anlaşmayı "Yerel Endüstri" olarak kaydet
    const agreement = await prisma.tradeAgreement.create({
      data: {
        gameId: game.id,
        partnerName: "Yerel Endüstri",
        incomePerTurn: incomePerTurn,
        turnsRemaining: 5,
      }
    });

    return NextResponse.json({ agreement, newBudget: game.budget - investmentAmount });
  } catch (error) {
    console.error("İç Ticaret hatası:", error);
    return NextResponse.json(
      { error: "Yerel yatırım yapılamadı" },
      { status: 500 }
    );
  }
}
