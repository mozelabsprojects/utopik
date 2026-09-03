import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MarketState } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const { gameId, resource, action, amount } = await request.json();

    if (amount <= 0 || isNaN(amount)) {
      return NextResponse.json({ error: "Geçersiz miktar" }, { status: 400 });
    }

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
      if (!marketState.lastBoughtTurn) marketState.lastBoughtTurn = {};
      marketState.lastBoughtTurn[resource as keyof typeof marketState.prices] = game.turn;
      
      let updateData: any = {
        budget: game.budget - totalCost,
        marketState: JSON.stringify(marketState)
      };
      if (resource === "energy") updateData.energy = Math.min(999, game.energy + amount);
      if (resource === "food") updateData.food = Math.min(999, game.food + amount);
      if (resource === "minerals") updateData.materials = Math.min(999, game.materials + amount);

      await prisma.game.update({
        where: { id: gameId },
        data: updateData
      });
    } else if (action === "sell") {
      if (marketState.lastBoughtTurn && marketState.lastBoughtTurn[resource as keyof typeof marketState.prices] === game.turn) {
        return NextResponse.json({ error: "Bu tur satın aldığınız hisseleri ancak bir sonraki tur satabilirsiniz!" }, { status: 400 });
      }
      const currentInv = marketState.inventory[resource as keyof typeof marketState.inventory];
      if (currentInv < amount) {
        return NextResponse.json({ error: "Yetersiz envanter" }, { status: 400 });
      }
      marketState.inventory[resource as keyof typeof marketState.inventory] -= amount;

      let updateData: any = {
        budget: game.budget + totalCost,
        marketState: JSON.stringify(marketState)
      };
      if (resource === "energy") updateData.energy = Math.max(0, game.energy - amount);
      if (resource === "food") updateData.food = Math.max(0, game.food - amount);
      if (resource === "minerals") updateData.materials = Math.max(0, game.materials - amount);

      await prisma.game.update({
        where: { id: gameId },
        data: updateData
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
