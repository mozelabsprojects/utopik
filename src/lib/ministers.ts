import { StatEffects } from "./types";
import { FactionId, modifyFactionSupport, FactionsState } from "./factions";

export type MinisterId = 
  | "eco_capitalist" | "eco_socialist" 
  | "def_hawk" | "def_dove" 
  | "int_authoritarian" | "int_liberal" 
  | "for_globalist" | "for_nationalist";

export type MinistryType = "economy" | "defense" | "internal" | "foreign";

export interface Minister {
  id: MinisterId;
  name: string;
  title: string;
  ministry: MinistryType;
  description: string;
  avatar: string; // Emoji avatar
  requiredFactionId: FactionId; // İstifa etmemesi için desteklemesi gereken ana fraksiyon
  hireCost: number; // in political capital
  passiveEffects: StatEffects;
  passiveFactionEffects?: Partial<Record<FactionId, number>>;
}

export const MINISTERS: Record<MinisterId, Minister> = {
  // === EKONOMİ ===
  eco_capitalist: {
    id: "eco_capitalist",
    name: "Arthur Sterling",
    title: "Serbest Piyasa Uzmanı",
    ministry: "economy",
    description: "Serbest piyasayı destekler. Her tur +$500 Bütçe sağlar ancak Mutluluğu -1 düşürür.",
    avatar: "🤵‍♂️",
    requiredFactionId: "capitalists",
    hireCost: 20,
    passiveEffects: { budget: 500, happiness: -1 },
    passiveFactionEffects: { capitalists: 1, workers: -1 },
  },
  eco_socialist: {
    id: "eco_socialist",
    name: "Elena Rostova",
    title: "Halkçı Ekonomist",
    ministry: "economy",
    description: "Zenginden alıp fakire verir. Her tur +2 Mutluluk sağlar ancak Bütçeye -$300 zarar yazar.",
    avatar: "👩‍🌾",
    requiredFactionId: "workers",
    hireCost: 25,
    passiveEffects: { budget: -300, happiness: 2 },
    passiveFactionEffects: { workers: 1, capitalists: -2 },
  },

  // === SAVUNMA ===
  def_hawk: {
    id: "def_hawk",
    name: "Bard Ozan",
    title: "Şahin (Savaş Yanlısı)",
    ministry: "defense",
    description: "Orduyu güçlendirir. Her tur +2 Askeriye sağlar ancak Bütçeden -$200 yer ve Dış İlişkileri -1 düşürür.",
    avatar: "🦅",
    requiredFactionId: "military",
    hireCost: 30,
    passiveEffects: { military: 2, budget: -200, foreignRelations: -1 },
    passiveFactionEffects: { military: 1, nationalists: 1, intellectuals: -1 },
  },
  def_dove: {
    id: "def_dove",
    name: "Dr. Aris Thorne",
    title: "Güvercin (Barış Yanlısı)",
    ministry: "defense",
    description: "Diplomasiye öncelik verir. Her tur +2 Dış İlişkiler ve +$150 Bütçe sağlar ancak Askeriye'yi -2 zayıflatır.",
    avatar: "🕊️",
    requiredFactionId: "intellectuals",
    hireCost: 20,
    passiveEffects: { military: -2, foreignRelations: 2, budget: 150 },
    passiveFactionEffects: { intellectuals: 1, military: -2 },
  },

  // === İÇİŞLERİ ===
  int_authoritarian: {
    id: "int_authoritarian",
    name: "Viktor Kael",
    title: "Demir Yumruk",
    ministry: "internal",
    description: "Otoriter yönetim sergiler. Her tur +3 İstikrar sağlar ancak -2 Mutluluk ve -1 Eğitim cezası verir.",
    avatar: "🪖",
    requiredFactionId: "nationalists",
    hireCost: 40,
    passiveEffects: { stability: 3, happiness: -2, education: -1 },
    passiveFactionEffects: { nationalists: 2, intellectuals: -3 },
  },
  int_liberal: {
    id: "int_liberal",
    name: "Sarah Jenkins",
    title: "Özgürlük Savunucusu",
    ministry: "internal",
    description: "Özgürlükleri genişletir. Her tur +3 Mutluluk sağlar ancak -2 İstikrar cezası verir.",
    avatar: "🗽",
    requiredFactionId: "intellectuals",
    hireCost: 30,
    passiveEffects: { happiness: 3, stability: -2 },
    passiveFactionEffects: { intellectuals: 2, workers: 1, nationalists: -2 },
  },

  // === DIŞİŞLERİ ===
  for_globalist: {
    id: "for_globalist",
    name: "Ege Demirci",
    title: "Küresel Vizyoner",
    ministry: "foreign",
    description: "Ticareti kolaylaştırır. Her tur +3 Dış İlişkiler ve +$200 Bütçe sağlar ancak İstikrarı -1 düşürür.",
    avatar: "🌍",
    requiredFactionId: "capitalists",
    hireCost: 25,
    passiveEffects: { foreignRelations: 3, budget: 200, stability: -1 },
    passiveFactionEffects: { capitalists: 1, nationalists: -2 },
  },
  for_nationalist: {
    id: "for_nationalist",
    name: "Tariq Al-Fayed",
    title: "Milli Çıkarlar Muhafızı",
    ministry: "foreign",
    description: "İzolasyonist politika izler. Her tur +2 İstikrar sağlar ancak Dış İlişkileri -3 düşürür.",
    avatar: "🛡️",
    requiredFactionId: "nationalists",
    hireCost: 20,
    passiveEffects: { foreignRelations: -3, stability: 2 },
    passiveFactionEffects: { nationalists: 3, capitalists: -1 },
  },
};
