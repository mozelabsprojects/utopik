import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getEventById } from "@/lib/events-data";
import { GameEvent } from "@/lib/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get("gameId");

    if (!gameId) {
      return NextResponse.json(
        { error: "gameId parametresi gerekli" },
        { status: 400 }
      );
    }

    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: { 
        investments: true,
        worldCountries: { orderBy: { name: 'asc' } },
        tradeAgreements: true
      },
    });

    if (!game) {
      return NextResponse.json(
        { error: "Oyun bulunamadı" },
        { status: 404 }
      );
    }

    let currentEvents: GameEvent[] = [];
    if (game.currentEventId) {
      try {
        const parsedIds = JSON.parse(game.currentEventId);
        if (Array.isArray(parsedIds)) {
          currentEvents = parsedIds.map(id => getEventById(id)).filter(e => e !== undefined);
        } else {
          const ev = getEventById(game.currentEventId);
          if (ev) currentEvents = [ev];
        }
      } catch (e) {
        // Eski kayıtlarda doğrudan ID olarak tutuluyordu
        const ev = getEventById(game.currentEventId);
        if (ev) currentEvents = [ev];
      }
    }

    // Oyuncunun güncel statlerini WorldCountry listesine anlık olarak (in-memory) yansıt (Sıralama Bug'ı Çözümü)
    const playerWC = game.worldCountries.find(c => c.isPlayer);
    if (playerWC) {
      playerWC.budget = game.budget;
      playerWC.military = game.military;
      playerWC.stability = game.stability;
      playerWC.education = game.education;
      playerWC.health = game.health;
      playerWC.environment = game.environment;
      playerWC.happiness = game.happiness;
      playerWC.foreignRelations = game.foreignRelations;
    }

    return NextResponse.json({ game, currentEvents });
  } catch (error) {
    console.error("Oyun durumu hatası:", error);
    return NextResponse.json(
      { error: "Oyun durumu alınamadı" },
      { status: 500 }
    );
  }
}
