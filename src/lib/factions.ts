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
    name: "Sermayedarlar",
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

// 100 koltuklu meclis dağılımını fraksiyonların destek oranlarına göre (0-100) orantısal olarak hesaplar.
export function calculateParliamentSeats(factions: FactionsState): Record<FactionId, number> {
  let totalSupport = 0;
  const seats: Record<FactionId, number> = {
    capitalists: 0,
    workers: 0,
    military: 0,
    intellectuals: 0,
    nationalists: 0
  };

  for (const k in factions) {
    totalSupport += factions[k as FactionId].support;
  }

  // Eğer hiç destek yoksa (imkansız ama tedbir) eşit dağıt
  if (totalSupport === 0) {
    return { capitalists: 20, workers: 20, military: 20, intellectuals: 20, nationalists: 20 };
  }

  let totalSeatsAssigned = 0;
  // Largest Remainder Method (Hare-Niemeyer) kullanarak 100 koltuğu tam sayı olarak dağıtalım
  const remainders: { id: FactionId; remainder: number }[] = [];

  for (const k in factions) {
    const id = k as FactionId;
    const exactSeats = (factions[id].support / totalSupport) * 100;
    const baseSeats = Math.floor(exactSeats);
    seats[id] = baseSeats;
    totalSeatsAssigned += baseSeats;
    remainders.push({ id, remainder: exactSeats - baseSeats });
  }

  // Kalan koltukları (genelde 0-4 arası kalır) en büyük ondalık küsurata sahip olanlara dağıt
  remainders.sort((a, b) => b.remainder - a.remainder);
  let seatsLeft = 100 - totalSeatsAssigned;
  let i = 0;
  while (seatsLeft > 0 && i < remainders.length) {
    seats[remainders[i].id] += 1;
    seatsLeft -= 1;
    i++;
  }

  return seats;
}
