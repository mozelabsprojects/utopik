import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { gameId, action } = await request.json();
    const game = await prisma.game.findUnique({ where: { id: gameId } });

    if (!game) return NextResponse.json({ error: "Oyun bulunamadı" }, { status: 404 });

    let updatedPopularity = game.popularity;
    let updatedPoliticalCapital = game.politicalCapital;
    let updatedStability = game.stability;
    let message = "";
    let gameOver = false;

    if (action === "campaign") {
      if (updatedPoliticalCapital < 20) {
        return NextResponse.json({ error: "Yeterli siyasi sermayeniz yok." }, { status: 400 });
      }
      updatedPoliticalCapital -= 20;
      updatedPopularity += 15;
    } else if (action === "rig") {
      const caught = Math.random() < 0.5; // %50 yakalanma riski
      if (caught) {
        updatedStability -= 30;
        updatedPopularity -= 40;
        message = "HİLE SKANDALI! Seçimlere müdahale ettiğiniz ortaya çıktı. Halk ayaklandı, istikrar yerle bir oldu!";
      } else {
        updatedPopularity = 100;
        message = "Seçimlere başarılı bir şekilde müdahale ettiniz. Kimse fark etmeden sandıklardan zaferle çıktınız!";
      }
    }

    if (action !== "rig" || (action === "rig" && updatedPopularity < 50)) {
      if (updatedPopularity >= 50) {
        message = "SEÇİM ZAFERİ! Halk size bir dönem daha yetki verdi. Kutlamalar sokaklara taştı!";
        updatedStability += 10;
        updatedPoliticalCapital += 50; // Win bonus
      } else {
        message = "SEÇİM HEZİMETİ! Halk desteğini kaybettiniz ve muhalefet iktidarı devraldı. Oyun bitti.";
        gameOver = true;
      }
    }

    const nextElectionTurn = game.turn + 10; // Next election in 10 turns

    await prisma.game.update({
      where: { id: gameId },
      data: {
        popularity: Math.min(100, Math.max(0, updatedPopularity)),
        politicalCapital: Math.max(0, updatedPoliticalCapital),
        stability: Math.min(100, Math.max(0, updatedStability)),
        nextElectionTurn: nextElectionTurn,
        isGameOver: gameOver,
        gameOverReason: gameOver ? "Seçimleri kaybettiniz." : null
      }
    });

    return NextResponse.json({ success: true, message, gameOver });
  } catch (error) {
    console.error("Seçim hatası:", error);
    return NextResponse.json({ error: "Seçim gerçekleştirilemedi." }, { status: 500 });
  }
}
