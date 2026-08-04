import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { COUNTRIES } from "@/lib/countries-data";
import { getRandomEvent } from "@/lib/events-data";
import { INITIAL_FACTIONS } from "@/lib/factions";

export async function POST(request: Request) {
  try {
    const { countryName, leaderProfile } = await request.json();

    const country = COUNTRIES.find((c) => c.name === countryName);
    if (!country) {
      return NextResponse.json(
        { error: "Geçersiz ülke seçimi" },
        { status: 400 }
      );
    }

    // WorldCountry verilerini oluştur
    const worldCountriesData = COUNTRIES.map((c) => ({
      name: c.name,
      budget: c.budget,
      military: c.military,
      happiness: c.happiness,
      health: c.health,
      environment: c.environment,
      education: c.education,
      stability: c.stability,
      foreignRelations: c.foreignRelations,
      isPlayer: c.name === country.name,
    }));

    // İlk olayı seç
    const firstEvent = getRandomEvent([]);

    let eventFlags: string[] = [];

    if (leaderProfile === "technocrat") {
      eventFlags.push("LEADER_TECHNOCRAT");
    } else if (leaderProfile === "general") {
      eventFlags.push("LEADER_GENERAL");
    } else if (leaderProfile === "economist") {
      eventFlags.push("LEADER_ECONOMIST");
    } else if (leaderProfile === "populist") {
      eventFlags.push("LEADER_POPULIST");
    }

    const game = await prisma.game.create({
      data: {
        countryName: country.name,
        budget: country.budget,
        military: country.military,
        happiness: country.happiness,
        health: country.health,
        environment: country.environment,
        education: country.education,
        stability: country.stability,
        foreignRelations: country.foreignRelations,
        popularity: 50,
        politicalCapital: 100,
        nextElectionTurn: 10,
        currentEventId: firstEvent.id,
        usedEventIds: JSON.stringify([firstEvent.id]),
        turnReports: JSON.stringify(["📅 Yeni oyun başladı. Hoş geldiniz başkanım!"]),
        factions: JSON.stringify(INITIAL_FACTIONS),
        activeCrises: "[]",
        activeLaws: "[]",
        megaProjects: "[]",
        ministers: "{}",
        activePetitions: "[]",
        diplomacyState: "{}",
        marketState: JSON.stringify({
          prices: { energy: 100, food: 50, tech: 200 },
          inventory: { energy: 0, food: 0, tech: 0 }
        }),
        eventFlags: JSON.stringify(eventFlags),
        worldCountries: {
          create: worldCountriesData,
        },
      },
    });


    return NextResponse.json({ game, firstEvent });
  } catch (error) {
    console.error("Oyun başlatma hatası:", error);
    return NextResponse.json(
      { error: "Oyun başlatılamadı" },
      { status: 500 }
    );
  }
}
