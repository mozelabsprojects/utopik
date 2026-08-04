import { GameState } from "./types";
import { FactionsState } from "./factions";

export interface AdvisorHint {
  type: "danger" | "warning" | "info" | "success";
  text: string;
}

export function generateAdvisorHints(state: GameState, factionsStr?: string): AdvisorHint[] {
  const hints: AdvisorHint[] = [];

  // Bütçe Uyarıları
  if (state.budget < 0) {
    hints.push({ type: "danger", text: "Ülke iflas durumunda! Acilen 'Ekonomi' politikalarına yönelin veya yatırımları kısın." });
  } else if (state.budget < 500) {
    hints.push({ type: "warning", text: "Bütçe kısıtlı. Gelir artırıcı kararlar almazsanız yatırımlar durma noktasına gelebilir." });
  }

  // İstikrar Uyarıları
  if (state.stability < 30) {
    hints.push({ type: "danger", text: "İstikrar çok düşük, halk kaosa sürükleniyor! İç savaş riski kapıda." });
  } else if (state.stability < 50) {
    hints.push({ type: "warning", text: "Toplumsal gerilim artıyor. İstikrarı sağlamak için sosyal ve askeri dengelere dikkat edin." });
  }

  // Sağlık Uyarıları
  if (state.health < 30) {
    hints.push({ type: "danger", text: "Sağlık sistemi çöktü. Salgın hastalıklar başlamadan önce Sağlık yatırımlarını artırın." });
  } else if (state.health < 50) {
    hints.push({ type: "warning", text: "Hastanelerde kapasite sorunları var. Sağlık sektörünü ihmal etmeyin." });
  }

  // Çevre Uyarıları
  if (state.environment < 30) {
    hints.push({ type: "danger", text: "Çevre felaketleri yaşanıyor! Hava kirliliği halkı hasta etmeye başlayacak." });
  }

  // Eğitim
  if (state.education < 30) {
    hints.push({ type: "danger", text: "Eğitim sistemi çökmüş durumda. Nitelikli iş gücü bulmak çok zorlaşıyor." });
  }

  // Askeri
  if (state.military < 30 && state.foreignRelations < 40) {
    hints.push({ type: "danger", text: "Ordu zayıf ve dış ilişkilerimiz kötü. Dış tehditlere karşı tamamen savunmasız durumdayız!" });
  }

  // Popülarite / Seçim
  if (state.popularity < 30) {
    hints.push({ type: "danger", text: "Halk desteği taban yapmış durumda. Seçimleri kaybetmemek için popülist politikalara ihtiyacımız var." });
  }

  // Factions
  if (factionsStr) {
    try {
      const factions: FactionsState = JSON.parse(factionsStr);
      if (factions.workers?.support < 25) {
        hints.push({ type: "warning", text: "İşçi sınıfı öfkeli ve genel grev riski artıyor." });
      }
      if (factions.military?.support < 25) {
        hints.push({ type: "warning", text: "Ordu mensupları gidişattan rahatsız. Darbe söylentileri dolaşmaya başladı." });
      }
      if (factions.capitalists?.support < 25) {
        hints.push({ type: "warning", text: "Sermaye sahipleri ülkeyi terk etmeyi düşünüyor. Ekonomik kriz kapıda." });
      }
    } catch (e) {}
  }

  // Eğer her şey çok iyiyse
  if (hints.length === 0) {
    if (state.popularity > 80 && state.stability > 80) {
      hints.push({ type: "success", text: "Sayın Başkan, ülke adeta bir Altın Çağ yaşıyor. Halk size minnettar." });
    } else {
      hints.push({ type: "info", text: "Şu an için acil bir kriz görünmüyor. Ancak rehavete kapılmamakta fayda var." });
    }
  }

  // Önem sırasına göre sıralama (danger > warning > info/success)
  hints.sort((a, b) => {
    const weights: Record<string, number> = { danger: 3, warning: 2, success: 1, info: 0 };
    return weights[b.type] - weights[a.type];
  });

  // Çok fazla hint varsa ilk 4'ünü alalım ki UI çok dolmasın
  return hints.slice(0, 4);
}
