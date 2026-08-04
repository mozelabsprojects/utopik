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
    description: "Vergileri düşük tutarak devasa yatırım çeker, ama halkın cebini yakar.",
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
    description: "Zenginden alıp fakire verir. Halkı mutlu eder ama bütçe açığı yaratır.",
    avatar: "👩‍🌾",
    requiredFactionId: "workers",
    hireCost: 25,
    passiveEffects: { budget: -300, happiness: 2 },
    passiveFactionEffects: { workers: 1, capitalists: -2 },
  },

  // === SAVUNMA ===
  def_hawk: {
    id: "def_hawk",
    name: "General Vance",
    title: "Şahin (Savaş Yanlısı)",
    ministry: "defense",
    description: "Askeri harcamaları artırır, sınır güvenliğini sağlar ama uluslararası tepki çeker.",
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
    description: "Askeri harcamaları kısarak bütçe yaratır ve diplomaside elimizi güçlendirir.",
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
    description: "Ülkedeki her muhalif sesi bastırarak muazzam bir istikrar sağlar.",
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
    description: "Sansürü ve baskıyı azaltır. Ülke çok mutlu olur ama istikrar sallanabilir.",
    avatar: "🗽",
    requiredFactionId: "intellectuals",
    hireCost: 30,
    passiveEffects: { happiness: 3, stability: -2 },
    passiveFactionEffects: { intellectuals: 2, workers: 1, nationalists: -2 },
  },

  // === DIŞİŞLERİ ===
  for_globalist: {
    id: "for_globalist",
    name: "Jean-Paul Dupont",
    title: "Küresel Vizyoner",
    ministry: "foreign",
    description: "Tüm dünyayla iyi geçinir, ticareti kolaylaştırır ama yerli üretici kızar.",
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
    description: "Önce bizim ülkemiz. İzolasyonist politika izler, dış dünyayı umursamaz.",
    avatar: "🛡️",
    requiredFactionId: "nationalists",
    hireCost: 20,
    passiveEffects: { foreignRelations: -3, stability: 2 },
    passiveFactionEffects: { nationalists: 3, capitalists: -1 },
  },
};
