import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MarketState } from "@/lib/types";

const EXPERT_BASE_COSTS = {
  1: 1000, // Stajyer (1 random)
  2: 3000, // Çaylak (2 random)
  3: 8000, // Kıdemli (4 random)
  4: 20000 // Wall Street Kurdu (Hepsi)
};

const EXPERT_COMMISSION = {
  1: 0.02, // %2
  2: 0.05, // %5
  3: 0.10, // %10
  4: 0.20  // %20
};

export async function POST(request: Request) {
  try {
    const { gameId, expertLevel } = await request.json();

    const game = await prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      return NextResponse.json({ error: "Oyun bulunamadı" }, { status: 404 });
    }

    if (![1, 2, 3, 4].includes(expertLevel)) {
      return NextResponse.json({ error: "Geçersiz uzman seviyesi" }, { status: 400 });
    }

    const baseCost = EXPERT_BASE_COSTS[expertLevel as 1 | 2 | 3 | 4];
    const commission = Math.floor(game.budget * EXPERT_COMMISSION[expertLevel as 1 | 2 | 3 | 4]);
    const totalCost = baseCost + commission;

    if (game.budget < totalCost) {
      return NextResponse.json({ error: "Yetersiz bütçe" }, { status: 400 });
    }

    let marketState: MarketState = {
      prices: { energy: 100, food: 50, tech: 200, medical: 150, arms: 300, minerals: 80 },
      inventory: { energy: 0, food: 0, tech: 0, medical: 0, arms: 0, minerals: 0 },
      history: []
    };
    try {
      const parsedMarket = JSON.parse(game.marketState);
      if (parsedMarket.prices && parsedMarket.inventory) {
        marketState = {
          ...parsedMarket,
          prices: { ...marketState.prices, ...parsedMarket.prices },
          inventory: { ...marketState.inventory, ...parsedMarket.inventory },
          history: parsedMarket.history || []
        };
      }
    } catch {}

    // Eğer stajyer veya diğerleriyse rastgele bir "focus" oluşturabiliriz ama bunu UI'da yapacağız.
    // Ancak stajyerin her satın alındığında farklı (random) bir emtiayı seçmesi için buraya kaydedebiliriz:
    const allKeys = ["energy", "food", "tech", "medical", "arms", "minerals"];
    marketState.activeExpertLevel = expertLevel;
    marketState.expertTurnsRemaining = 4;
    
    // Rastgele seçimi marketState'in içine kaydediyoruz (visibleKeys) ki sayfayı yenileyince değişmesin
    if (expertLevel === 1) {
      marketState.expertVisibleKeys = [allKeys[Math.floor(Math.random() * allKeys.length)]];
    } else if (expertLevel === 2) {
      const shuffled = [...allKeys].sort(() => 0.5 - Math.random());
      marketState.expertVisibleKeys = shuffled.slice(0, 2);
    } else if (expertLevel === 3) {
      const shuffled = [...allKeys].sort(() => 0.5 - Math.random());
      marketState.expertVisibleKeys = shuffled.slice(0, 4);
    } else {
      marketState.expertVisibleKeys = allKeys;
    }

    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: {
        budget: game.budget - totalCost,
        marketState: JSON.stringify(marketState)
      }
    });

    return NextResponse.json({ game: updatedGame });
  } catch (error) {
    console.error("Uzman kiralama hatası:", error);
    return NextResponse.json(
      { error: "Uzman kiralama işlemi gerçekleştirilemedi" },
      { status: 500 }
    );
  }
}
