import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Quest } from "@/lib/types";

// Görev sistemi: Basitçe rastgele görevler üretmek ve mevcut görevleri kabul etmek için kullanılacak.
// Bu V2 versiyonunda görev yönetimi UI tarafında handle edilip sadece sonuçları API'ye bildirilecek veya
// API üzerinden quest oluşturulup verilecek.

export async function POST(request: Request) {
  try {
    const { gameId, action, questId, questData } = await request.json();

    const game = await prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      return NextResponse.json({ error: "Oyun bulunamadı" }, { status: 404 });
    }

    let activeQuests: Quest[] = JSON.parse(game.activeQuests || "[]");

    if (action === "add") {
      // Yeni görev ekle
      activeQuests.push(questData);
    } else if (action === "complete") {
      // Görevi tamamla ve ödülleri ver
      const quest = activeQuests.find((q) => q.id === questId);
      if (quest) {
        // Ödülleri ver (Basitçe Game modeline uygulayalım)
        const newBudget = game.budget + (quest.rewardEffects.budget || 0);
        const newPop = game.popularity + (quest.rewardEffects.popularity || 0);
        
        await prisma.game.update({
          where: { id: gameId },
          data: {
            budget: newBudget,
            popularity: Math.min(100, Math.max(0, newPop)),
            activeQuests: JSON.stringify(activeQuests.filter(q => q.id !== questId))
          }
        });
        return NextResponse.json({ success: true, message: "Görev tamamlandı!" });
      }
    } else if (action === "fail" || action === "remove") {
      // Görevi sil
      activeQuests = activeQuests.filter((q) => q.id !== questId);
    }

    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: {
        activeQuests: JSON.stringify(activeQuests),
      }
    });

    return NextResponse.json({ activeQuests });
  } catch (error) {
    console.error("Görev (Quest) hatası:", error);
    return NextResponse.json(
      { error: "Görev işlemi yapılamadı" },
      { status: 500 }
    );
  }
}
