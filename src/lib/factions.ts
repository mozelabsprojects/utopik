export type FactionId = "capitalists" | "workers" | "military" | "intellectuals" | "nationalists";

export interface Faction {
  id: FactionId;
  name: string;
  description: string;
  support: number; // 0-100
}

export type FactionsState = Record<FactionId, Faction>;

export const INITIAL_FACTIONS: FactionsState = {
  capitalists: {
    id: "capitalists",
    name: "İş Dünyası",
    description: "Şirketler ve zengin zümre. Düşük vergi, serbest piyasa ve iç istikrar isterler.",
    support: 50,
  },
  workers: {
    id: "workers",
    name: "İşçi Sınıfı",
    description: "Halkın büyük çoğunluğu. Sağlık, eğitim ve yüksek yaşam standartları isterler.",
    support: 50,
  },
  military: {
    id: "military",
    name: "Askeriye",
    description: "Ordu mensupları. Yüksek savunma bütçesi ve dış tehditlere karşı sert duruş isterler.",
    support: 50,
  },
  intellectuals: {
    id: "intellectuals",
    name: "Aydınlar ve Çevreciler",
    description: "Eğitimliler ve aktivistler. Yüksek eğitim, çevre duyarlılığı ve özgürlük isterler.",
    support: 50,
  },
  nationalists: {
    id: "nationalists",
    name: "Muhafazakar / Milliyetçiler",
    description: "Gelenekçiler. Güçlü bir devlet otoritesi, istikrar ve güvenlik isterler.",
    support: 50,
  }
};

// Yasa veya olay sonuçlarına göre fraksiyon desteklerini clamp ile 0-100 arasında tutar
export function modifyFactionSupport(
  factions: FactionsState,
  changes: Partial<Record<FactionId, number>>
): FactionsState {
  // Deep copy: her fraksiyon objesini ayrı ayrı kopyala (shallow copy mutasyon bugını önler)
  const newFactions = Object.fromEntries(
    Object.entries(factions).map(([k, v]) => [k, { ...v }])
  ) as FactionsState;
  for (const [key, val] of Object.entries(changes)) {
    const k = key as FactionId;
    if (newFactions[k] && val !== undefined) {
      newFactions[k].support = Math.max(0, Math.min(100, newFactions[k].support + val));
    }
  }
  return newFactions;
}
