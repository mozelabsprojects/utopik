import { prisma } from "./src/lib/prisma";
import { COUNTRIES } from "./src/lib/countries-data";
import { getRandomEvent } from "./src/lib/events-data";
import { INITIAL_FACTIONS } from "./src/lib/factions";

async function main() {
  const countryName = "Türkiye";
  const country = COUNTRIES.find((c) => c.name === countryName);
  
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
    isPlayer: c.name === country?.name,
  }));

  const firstEvent = getRandomEvent([]);
  const eventFlags: string[] = ["LEADER_TECHNOCRAT"];

  try {
    const game = await prisma.game.create({
      data: {
        countryName: country!.name,
        population: country!.population,
        budget: country!.budget,
        military: country!.military,
        happiness: country!.happiness,
        health: country!.health,
        environment: country!.environment,
        education: country!.education,
        stability: country!.stability,
        foreignRelations: country!.foreignRelations,
        popularity: 50,
        politicalCapital: 100,
        nextElectionTurn: 10,
        currentEventId: firstEvent.id,
        usedEventIds: JSON.stringify([firstEvent.id]),
        turnReports: JSON.stringify(["📅 Yeni oyun başladı."]),
        factions: JSON.stringify(INITIAL_FACTIONS),
        activeCrises: "[]",
        activeLaws: "[]",
        megaProjects: "[]",
        ministers: "{}",
        activePetitions: "[]",
        diplomacyState: "{}",
        marketState: JSON.stringify({
          prices: { food: 50, minerals: 50, energy: 50, medical: 50, arms: 50, tech: 50 },
          inventory: { energy: 0, food: 0, tech: 0, medical: 0, arms: 0, minerals: 0 },
          history: []
        }),
        historicalData: JSON.stringify([{
          turn: 1, budget: country!.budget, population: country!.population, inflation: 5.0, stability: country!.stability, happiness: country!.happiness, taxIncome: 0
        }]),
        eventFlags: JSON.stringify(eventFlags),
        worldCountries: {
          create: worldCountriesData,
        },
      },
    });
    console.log("Success:", game.id);
  } catch (err) {
    console.error("Prisma error:", err);
  }
}

main().catch(console.error);
