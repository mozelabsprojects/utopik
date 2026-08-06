import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { gameId, code } = await request.json();

    const game = await prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      return NextResponse.json({ error: "Oyun bulunamadı" }, { status: 404 });
    }

    const updatedData: any = {};

    if (code === "hesoyam") {
      updatedData.budget = game.budget + 100000;
      updatedData.politicalCapital = game.politicalCapital + 500;
    } else if (code === "aezakmi") {
      updatedData.military = 100;
      updatedData.happiness = 100;
      updatedData.health = 100;
      updatedData.education = 100;
      updatedData.environment = 100;
      updatedData.stability = 100;
      updatedData.foreignRelations = 100;
      updatedData.popularity = 100;
    } else {
      return NextResponse.json({ error: "Geçersiz şifre" }, { status: 400 });
    }

    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: updatedData,
      include: { worldCountries: { orderBy: { name: 'asc' } } }
    });

    return NextResponse.json({ game: updatedGame });
  } catch (error) {
    console.error("Hile hatası:", error);
    return NextResponse.json({ error: "İşlem başarısız" }, { status: 500 });
  }
}
