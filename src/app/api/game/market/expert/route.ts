import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MarketState } from "@/lib/types";

const EXPERT_COSTS = {
  1: 1000,
  2: 3000,
  3: 8000
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

    if (![1, 2, 3].includes(expertLevel)) {
      return NextResponse.json({ error: "Geçersiz uzman seviyesi" }, { status: 400 });
    }

    const cost = EXPERT_COSTS[expertLevel as 1 | 2 | 3];
    if (game.budget < cost) {
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

    // 4 tur boyunca uzman aktif kalır
    marketState.activeExpertLevel = expertLevel;
    marketState.expertTurnsRemaining = 4;

    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: {
        budget: game.budget - cost,
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
