import { StatEffects } from "./types";
import { FactionId, modifyFactionSupport, FactionsState } from "./factions";

export type MinisterId =
  | "eco_capitalist" | "eco_socialist"
  | "def_hawk" | "def_dove"
  | "int_authoritarian" | "int_liberal"
  | "for_globalist" | "for_nationalist"
  | "edu_academic" | "edu_vocational"
  | "hlt_social" | "hlt_private"
  | "env_radical" | "env_industrial";

export type MinistryType = "economy" | "defense" | "internal" | "foreign" | "education" | "health" | "environment";

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
    name: "Mox Bernie",
    title: "Halkçı Ekonomist",
    ministry: "economy",
    description: "Zenginden alıp fakire verir. Her tur +2 Mutluluk sağlar ancak Bütçeye -$300 zarar yazar.",
    avatar: "👩‍🌾",
    requiredFactionId: "workers",
    hireCost: 20,
    passiveEffects: { budget: -300, happiness: 1 },
    passiveFactionEffects: { workers: 1, capitalists: -2 },
  },

  // === SAVUNMA ===
  def_hawk: {
    id: "def_hawk",
    name: "General Bard",
    title: "Şahin (Savaş Yanlısı)",
    ministry: "defense",
    description: "Orduyu güçlendirir. Her tur +2 Askeriye sağlar ancak Bütçeden -$200 yer ve Dış İlişkileri -1 düşürür.",
    avatar: "🦅",
    requiredFactionId: "military",
    hireCost: 20,
    passiveEffects: { military: 1, budget: -200, foreignRelations: -1 },
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
    passiveEffects: { military: -1, foreignRelations: 1, budget: 150 },
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
    hireCost: 20,
    passiveEffects: { stability: 2, happiness: -1, education: -1 },
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
    hireCost: 20,
    passiveEffects: { happiness: 2, stability: -1 },
    passiveFactionEffects: { intellectuals: 2, workers: 1, nationalists: -2 },
  },

  // === DIŞİŞLERİ ===
  for_globalist: {
    id: "for_globalist",
    name: "Alexander Sicksallander",
    title: "Küresel Vizyoner",
    ministry: "foreign",
    description: "Ticareti kolaylaştırır. Her tur +3 Dış İlişkiler ve +$200 Bütçe sağlar ancak İstikrarı -1 düşürür.",
    avatar: "🌍",
    requiredFactionId: "capitalists",
    hireCost: 20,
    passiveEffects: { foreignRelations: 2, budget: 200, stability: -1 },
    passiveFactionEffects: { capitalists: 1, nationalists: -2 },
  },
  for_nationalist: {
    id: "for_nationalist",
    name: "Am-in Feriadi",
    title: "Milli Çıkarlar Muhafızı",
    ministry: "foreign",
    description: "İzolasyonist politika izler. Her tur +2 İstikrar sağlar ancak Dış İlişkileri -3 düşürür.",
    avatar: "🛡️",
    requiredFactionId: "nationalists",
    hireCost: 20,
    passiveEffects: { foreignRelations: -1, stability: 1 },
    passiveFactionEffects: { nationalists: 3, capitalists: -1 },
  },

  // === EĞİTİM ===
  edu_academic: {
    id: "edu_academic",
    name: "Prof. Dr.Ege Demirci",
    title: "Akademik Reformist",
    ministry: "education",
    description: "Bilimsel eğitime odaklanır. Her tur +1 Eğitim sağlar ancak Bütçeye -$150 zarar yazar.",
    avatar: "👨‍🏫",
    requiredFactionId: "intellectuals",
    hireCost: 20,
    passiveEffects: { education: 1, budget: -150 },
    passiveFactionEffects: { intellectuals: 2, workers: -1 },
  },
  edu_vocational: {
    id: "edu_vocational",
    name: "Usta Kemal",
    title: "Mesleki Eğitimci",
    ministry: "education",
    description: "Sanayi odaklı eğitim verir. Her tur +$200 Bütçe sağlar ancak Mutluluğu -1 düşürür.",
    avatar: "👷",
    requiredFactionId: "workers",
    hireCost: 20,
    passiveEffects: { budget: 200, happiness: -1 },
    passiveFactionEffects: { workers: 2, intellectuals: -1 },
  },

  // === SAĞLIK ===
  hlt_social: {
    id: "hlt_social",
    name: "Dr. Aylin",
    title: "Halk Sağlığı Uzmanı",
    ministry: "health",
    description: "Herkese ücretsiz sağlık hedefler. Her tur +1 Sağlık ve +1 Mutluluk sağlar ancak -$300 Bütçe açığı yaratır.",
    avatar: "👩‍⚕️",
    requiredFactionId: "workers",
    hireCost: 20,
    passiveEffects: { health: 1, happiness: 1, budget: -300 },
    passiveFactionEffects: { workers: 2, capitalists: -2 },
  },
  hlt_private: {
    id: "hlt_private",
    name: "CEO Barkın",
    title: "Özel Sektör Temsilcisi",
    ministry: "health",
    description: "Hastaneleri özelleştirir. Her tur +$300 Bütçe sağlar ancak Sağlık ve Mutluluğu -1 düşürür.",
    avatar: "🏥",
    requiredFactionId: "capitalists",
    hireCost: 20,
    passiveEffects: { budget: 300, health: -1, happiness: -1 },
    passiveFactionEffects: { capitalists: 2, workers: -3 },
  },

  // === ÇEVRE ===
  env_radical: {
    id: "env_radical",
    name: "Cemre Yeşil",
    title: "Aktivist Çevreci",
    ministry: "environment",
    description: "Sert çevre yasaları getirir. Her tur +1 Çevre sağlar ancak Bütçeden -$200 yer.",
    avatar: "🌱",
    requiredFactionId: "intellectuals",
    hireCost: 20,
    passiveEffects: { environment: 1, budget: -200 },
    passiveFactionEffects: { intellectuals: 2, capitalists: -2 },
  },
  env_industrial: {
    id: "env_industrial",
    name: "Sanayici Rıza",
    title: "Kalkınma Odaklı",
    ministry: "environment",
    description: "Doğayı hiçe sayıp sanayiye alan açar. Her tur +$250 Bütçe ve +1 İstikrar sağlar ancak Çevreyi -1 düşürür.",
    avatar: "🏭",
    requiredFactionId: "capitalists",
    hireCost: 20,
    passiveEffects: { budget: 250, stability: 1, environment: -1 },
    passiveFactionEffects: { capitalists: 2, intellectuals: -3 },
  },
};
