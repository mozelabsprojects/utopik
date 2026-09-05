import { StatEffects } from "./types";
import { FactionId, modifyFactionSupport, FactionsState } from "./factions";

export type MinisterId =
  | "eco_capitalist" | "eco_socialist"
  | "def_hawk" | "def_dove"
  | "int_authoritarian" | "int_liberal"
  | "for_globalist" | "for_nationalist"
  | "edu_academic" | "edu_vocational"
  | "hlt_social" | "hlt_private"
  | "env_radical" | "env_industrial"
  | "ai_luvi" | "ai_luddite"
  | "soc_viral" | "soc_censor"
  | "esp_gamer" | "esp_boomer";

export type MinistryType = "economy" | "defense" | "internal" | "foreign" | "education" | "health" | "environment" | "ai" | "social_media" | "esports";

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
    name: "Ahmet Selim Arslantürk",
    title: "Serbest Piyasa Uzmanı",
    ministry: "economy",
    description: "Serbest piyasayı destekler. Her tur +$1000 Bütçe sağlar ancak Mutluluğu -1 düşürür.",
    avatar: "🤵‍♂️",
    requiredFactionId: "capitalists",
    hireCost: 20,
    passiveEffects: { budget: 1000, happiness: -1 },
    passiveFactionEffects: { capitalists: 1, workers: -1 },
  },
  eco_socialist: {
    id: "eco_socialist",
    name: "Mox Bernie",
    title: "Halkçı Ekonomist",
    ministry: "economy",
    description: "Zenginden alıp fakire verir. Her tur +2 Mutluluk sağlar ancak Bütçeye -$800 zarar yazar.",
    avatar: "👩‍🌾",
    requiredFactionId: "workers",
    hireCost: 20,
    passiveEffects: { budget: -800, happiness: 2 },
    passiveFactionEffects: { workers: 1, capitalists: -2 },
  },

  // === SAVUNMA ===
  def_hawk: {
    id: "def_hawk",
    name: "General Bard",
    title: "Şahin (Savaş Yanlısı)",
    ministry: "defense",
    description: "Orduyu güçlendirir. Her tur +2 Askeriye sağlar ancak Bütçeden -$500 yer ve Dış İlişkileri -1 düşürür.",
    avatar: "🦅",
    requiredFactionId: "military",
    hireCost: 20,
    passiveEffects: { military: 2, budget: -500, foreignRelations: -1 },
    passiveFactionEffects: { military: 1, nationalists: 1, intellectuals: -1 },
  },
  def_dove: {
    id: "def_dove",
    name: "Dr. Aris Thorne",
    title: "Güvercin (Barış Yanlısı)",
    ministry: "defense",
    description: "Diplomasiye öncelik verir. Her tur +2 Dış İlişkiler ve +$400 Bütçe sağlar ancak Askeriye'yi -2 zayıflatır.",
    avatar: "🕊️",
    requiredFactionId: "intellectuals",
    hireCost: 20,
    passiveEffects: { military: -2, foreignRelations: 2, budget: 400 },
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
    hireCost: 20,
    passiveEffects: { happiness: 3, stability: -2 },
    passiveFactionEffects: { intellectuals: 2, workers: 1, nationalists: -2 },
  },

  // === DIŞİŞLERİ ===
  for_globalist: {
    id: "for_globalist",
    name: "Creed İpekci",
    title: "Küresel Sermaye Temsilcisi",
    ministry: "foreign",
    description: "Sınırları kaldırıp küresel sermayeyi çekmeyi hedefler. Dış İlişkiler +1, İstikrar -1.",
    avatar: "💼",
    requiredFactionId: "capitalists",
    hireCost: 20,
    passiveEffects: { foreignRelations: 1, stability: -1 },
    passiveFactionEffects: { capitalists: 1, nationalists: -2 },
  },
  for_nationalist: {
    id: "for_nationalist",
    name: "Ulrich Von Blitz",
    title: "Aşırı Milliyetçi Diplomat",
    ministry: "foreign",
    description: "Sınırları kapatıp izolasyonist bir politika izler. Askeriye +1, Bütçe -$500.",
    avatar: "🏰",
    requiredFactionId: "nationalists",
    hireCost: 25,
    passiveEffects: { military: 1, budget: -500 },
    passiveFactionEffects: { nationalists: 2, intellectuals: -1 },
  },

  // === YAPAY ZEKA VE TEKNOLOJİ ===
  ai_luvi: {
    id: "ai_luvi",
    name: "Luvi Wright",
    title: "Yapay Zeka Mimarı & Teknofütürist",
    ministry: "ai",
    description: "Tüm devleti algoritmalarla yönetmek ister. Bütçe +$1500, ancak İşsizlik artışıyla Mutluluk -2.",
    avatar: "🤖",
    requiredFactionId: "capitalists",
    hireCost: 35,
    passiveEffects: { budget: 1500, happiness: -2 },
    passiveFactionEffects: { intellectuals: 1, workers: -2 },
  },
  ai_luddite: {
    id: "ai_luddite",
    name: "Dr. Aslı Data",
    title: "Siber Etik Savunucusu",
    ministry: "ai",
    description: "Yapay zekaya sıkı kotalar getirir. Mutluluk +1, Bütçe -$800.",
    avatar: "🛡️",
    requiredFactionId: "intellectuals",
    hireCost: 20,
    passiveEffects: { happiness: 1, budget: -800 },
    passiveFactionEffects: { workers: 1, capitalists: -1 },
  },

  // === SOSYAL MEDYA VE İLETİŞİM ===
  soc_viral: {
    id: "soc_viral",
    name: "Berkecan Streamer",
    title: "Viral Fenomen",
    ministry: "social_media",
    description: "Kanunları TikTok danslarıyla açıklar. Mutluluk +2, İstikrar -1.",
    avatar: "🤳",
    requiredFactionId: "intellectuals", // Default youth not defined
    hireCost: 25,
    passiveEffects: { happiness: 2, stability: -1 },
    passiveFactionEffects: { intellectuals: 2 },
  },
  soc_censor: {
    id: "soc_censor",
    name: "Güvenlikçi Turgut",
    title: "Dezenformasyon Şefi",
    ministry: "social_media",
    description: "İnterneti kısıtlar ve muhalif mizahı yasaklar. İstikrar +2, Mutluluk -2.",
    avatar: "🚫",
    requiredFactionId: "nationalists",
    hireCost: 25,
    passiveEffects: { stability: 2, happiness: -2 },
    passiveFactionEffects: { nationalists: 1 },
  },

  // === ESPOR VE DİJİTAL GENÇLİK ===
  esp_gamer: {
    id: "esp_gamer",
    name: "Emre 'Headshot' Kaya",
    title: "Pro Gamer",
    ministry: "esports",
    description: "Milli Eğitim bütçesini gaming salonlarına aktarır. Mutluluk +2, Eğitim -1, Bütçe -$500.",
    avatar: "🎮",
    requiredFactionId: "intellectuals",
    hireCost: 20,
    passiveEffects: { happiness: 2, education: -1, budget: -500 },
    passiveFactionEffects: { intellectuals: 2 },
  },
  esp_boomer: {
    id: "esp_boomer",
    name: "Mürebbiye Hatice",
    title: "Ekran Kısıtlayıcı",
    ministry: "esports",
    description: "Gençleri doğa yürüyüşüne zorlar. İstikrar +1, Mutluluk -1.",
    avatar: "👵",
    requiredFactionId: "nationalists",
    hireCost: 15,
    passiveEffects: { stability: 1, happiness: -1 },
    passiveFactionEffects: { nationalists: 2 },
  },

  // === EĞİTİM ===
  edu_academic: {
    id: "edu_academic",
    name: "Prof. Dr. Ege Demirci",
    title: "Akademik Reformist",
    ministry: "education",
    description: "Bilimsel eğitime odaklanır. Her tur +2 Eğitim sağlar ancak Bütçeye -$500 zarar yazar.",
    avatar: "👨‍🏫",
    requiredFactionId: "intellectuals",
    hireCost: 20,
    passiveEffects: { education: 2, budget: -500 },
    passiveFactionEffects: { intellectuals: 2, workers: -1 },
  },
  edu_vocational: {
    id: "edu_vocational",
    name: "Usta Kemal",
    title: "Mesleki Eğitimci",
    ministry: "education",
    description: "Sanayi odaklı eğitim verir. Her tur +$600 Bütçe sağlar ancak Mutluluğu -1 düşürür.",
    avatar: "👷",
    requiredFactionId: "workers",
    hireCost: 20,
    passiveEffects: { budget: 600, happiness: -1 },
    passiveFactionEffects: { workers: 2, intellectuals: -1 },
  },

  // === SAĞLIK ===
  hlt_social: {
    id: "hlt_social",
    name: "Zei Bernie",
    title: "Halk Sağlığı Uzmanı",
    ministry: "health",
    description: "Herkese ücretsiz sağlık hedefler. Her tur +2 Sağlık ve +1 Mutluluk sağlar ancak -$1000 Bütçe açığı yaratır.",
    avatar: "👩‍⚕️",
    requiredFactionId: "workers",
    hireCost: 20,
    passiveEffects: { health: 2, happiness: 1, budget: -1000 },
    passiveFactionEffects: { workers: 2, capitalists: -2 },
  },
  hlt_private: {
    id: "hlt_private",
    name: "CEO Barkın",
    title: "Özel Sektör Temsilcisi",
    ministry: "health",
    description: "Hastaneleri özelleştirir. Her tur +$1000 Bütçe sağlar ancak Sağlık'ı -2 ve Mutluluğu -1 düşürür.",
    avatar: "🏥",
    requiredFactionId: "capitalists",
    hireCost: 20,
    passiveEffects: { budget: 1000, health: -2, happiness: -1 },
    passiveFactionEffects: { capitalists: 2, workers: -3 },
  },

  // === ÇEVRE ===
  env_radical: {
    id: "env_radical",
    name: "Cemre Yeşil",
    title: "Aktivist Çevreci",
    ministry: "environment",
    description: "Sert çevre yasaları getirir. Her tur +2 Çevre sağlar ancak Bütçeden -$500 yer.",
    avatar: "🌱",
    requiredFactionId: "intellectuals",
    hireCost: 20,
    passiveEffects: { environment: 2, budget: -500 },
    passiveFactionEffects: { intellectuals: 2, capitalists: -2 },
  },
  env_industrial: {
    id: "env_industrial",
    name: "Sanayici Rıza",
    title: "Kalkınma Odaklı",
    ministry: "environment",
    description: "Doğayı hiçe sayıp sanayiye alan açar. Her tur +$800 Bütçe ve +1 İstikrar sağlar ancak Çevreyi -2 düşürür.",
    avatar: "🏭",
    requiredFactionId: "capitalists",
    hireCost: 20,
    passiveEffects: { budget: 800, stability: 1, environment: -2 },
    passiveFactionEffects: { capitalists: 2, intellectuals: -3 },
  },
};
