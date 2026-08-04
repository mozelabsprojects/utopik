import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MarketState } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const { gameId, resource, action, amount } = await request.json();

    const game = await prisma.game.findUnique({
      where: { id: gameId }
    });

    if (!game) {
      return NextResponse.json({ error: "Oyun bulunamadı" }, { status: 404 });
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

    const pricePerUnit = marketState.prices[resource as keyof typeof marketState.prices];
    const totalCost = pricePerUnit * amount;

    if (action === "buy") {
      if (game.budget < totalCost) {
        return NextResponse.json({ error: "Yetersiz bütçe" }, { status: 400 });
      }
      marketState.inventory[resource as keyof typeof marketState.inventory] += amount;
      
      await prisma.game.update({
        where: { id: gameId },
        data: {
          budget: game.budget - totalCost,
          marketState: JSON.stringify(marketState)
        }
      });
    } else if (action === "sell") {
      const currentInv = marketState.inventory[resource as keyof typeof marketState.inventory];
      if (currentInv < amount) {
        return NextResponse.json({ error: "Yetersiz envanter" }, { status: 400 });
      }
      marketState.inventory[resource as keyof typeof marketState.inventory] -= amount;

      await prisma.game.update({
        where: { id: gameId },
        data: {
          budget: game.budget + totalCost,
          marketState: JSON.stringify(marketState)
        }
      });
    } else {
      return NextResponse.json({ error: "Geçersiz işlem" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Market hatası:", error);
    return NextResponse.json({ error: "Borsa işlemi başarısız oldu" }, { status: 500 });
  }
}
