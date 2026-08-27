import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MINISTERS, MinisterId } from "@/lib/ministers";

export async function POST(request: Request) {
  try {
    const { gameId, ministerId, action } = await request.json();

    const game = await prisma.game.findUnique({ where: { id: gameId } });
    if (!game) return NextResponse.json({ error: "Oyun bulunamadı" }, { status: 404 });
    if (game.isGameOver) return NextResponse.json({ error: "Oyun bitti" }, { status: 400 });

    const minister = MINISTERS[ministerId as MinisterId];
    if (!minister) return NextResponse.json({ error: "Bakan bulunamadı" }, { status: 400 });

    let ministers: Record<string, string> = {};
    try { ministers = JSON.parse(game.ministers); } catch {}

    let eventFlags: string[] = [];
    try { eventFlags = JSON.parse(game.eventFlags); } catch {}

    if (action === "fire") {
      // Kovma İşlemi
      const flagPrefix = `minister_${minister.ministry}_hired_`;
      const hireFlag = eventFlags.find(f => f.startsWith(flagPrefix));
      if (hireFlag) {
        const hireTurn = parseInt(hireFlag.replace(flagPrefix, ""), 10);
        if (game.turn - hireTurn < 5) {
          return NextResponse.json({ error: `Bakanı kovmak için ${5 - (game.turn - hireTurn)} tur daha beklemelisiniz.` }, { status: 400 });
        }
      }
      
      delete ministers[minister.ministry];
      eventFlags = eventFlags.filter(f => !f.startsWith(flagPrefix));
      
      await prisma.game.update({
        where: { id: gameId },
        data: {
          ministers: JSON.stringify(ministers),
          eventFlags: JSON.stringify(eventFlags)
        }
      });
      return NextResponse.json({ success: true });
    }

    // Atama İşlemi
    if (game.politicalCapital < minister.hireCost) {
      return NextResponse.json({ error: "Yetersiz siyasi sermaye" }, { status: 400 });
    }

    let factions: Record<string, { support: number }> = {};
    try {
      factions = JSON.parse(game.factions);
    } catch {}

    const reqFaction = factions[minister.requiredFactionId];
    if (reqFaction && reqFaction.support < 20) {
      return NextResponse.json({ error: "Bu bakanın temsil ettiği grubun halk desteği %20'nin altında olduğu için atama yapılamaz." }, { status: 400 });
    }

    // Aynı bakanlığa başka biri atanmışsa değiştir (üzerine yaz)
    ministers[minister.ministry] = minister.id;
    
    // Eski atama flag'ini temizle ve yenisini ekle
    const flagPrefix = `minister_${minister.ministry}_hired_`;
    eventFlags = eventFlags.filter(f => !f.startsWith(flagPrefix));
    eventFlags.push(`${flagPrefix}${game.turn}`);

    let updatedHappiness = game.happiness;
    let easterEggName = null;
    
    // Easter Egg: General Bard (def_hawk), Prof. Dr. Ege Demirci, veya Creed İpekci (for_globalist)
    if (minister.id === "def_hawk") {
      updatedHappiness = Math.min(100, updatedHappiness + 1);
      easterEggName = "General Bard";
    } else if (minister.id === "edu_academic" || minister.name === "Prof. Dr. Ege Demirci") {
      updatedHappiness = Math.min(100, updatedHappiness + 1);
      easterEggName = "Prof. Dr. Ege Demirci";
    } else if (minister.id === "for_globalist" || minister.name === "Creed İpekci") {
      updatedHappiness = Math.min(100, updatedHappiness + 1);
      easterEggName = "Creed İpekci";
    }

    await prisma.game.update({
      where: { id: gameId },
      data: {
        politicalCapital: game.politicalCapital - minister.hireCost,
        happiness: updatedHappiness,
        ministers: JSON.stringify(ministers),
        eventFlags: JSON.stringify(eventFlags)
      }
    });

    return NextResponse.json({ success: true, easterEggName });
  } catch (error) {
    return NextResponse.json({ error: "Atama başarısız" }, { status: 500 });
  }
}
