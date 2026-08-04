import { StatEffects } from "./types";
import { FactionId } from "./factions";

export interface Petition {
  id: string;
  title: string;
  description: string;
  acceptEffects: StatEffects;
  acceptFactionEffects?: Partial<Record<FactionId, number>>;
  rejectEffects: StatEffects;
  rejectFactionEffects?: Partial<Record<FactionId, number>>;
}

export const PETITIONS: Petition[] = [
  {
    id: "pet_farmers_subsidy",
    title: "Çiftçilerden Mazot Desteği Talebi",
    description: "Kuraklık vuran bölgelerdeki çiftçiler, meclis önünde toplanarak tarım sübvansiyonu talep ediyorlar.",
    acceptEffects: { budget: -300, happiness: 2 },
    acceptFactionEffects: { workers: 5, nationalists: 2 },
    rejectEffects: { stability: -2 },
    rejectFactionEffects: { workers: -5 },
  },
  {
    id: "pet_student_protest",
    title: "Öğrencilerin Yurt Talebi",
    description: "Üniversite öğrencileri barınma sorunu yaşadıklarını belirterek yeni devlet yurtları inşa edilmesini istiyor.",
    acceptEffects: { budget: -500, education: 2, happiness: 1 },
    acceptFactionEffects: { intellectuals: 5 },
    rejectEffects: { stability: -2, popularity: -1 },
    rejectFactionEffects: { intellectuals: -5 },
  },
  {
    id: "pet_corporate_tax_break",
    title: "Şirketlerden Vergi İndirimi Talebi",
    description: "Büyük sanayi odaları, istihdamı artırmak için kurumsal vergilerde indirim istiyor.",
    acceptEffects: { budget: -400, stability: 1 },
    acceptFactionEffects: { capitalists: 10, workers: -2 },
    rejectEffects: { budget: 100 },
    rejectFactionEffects: { capitalists: -10, workers: 2 },
  },
  {
    id: "pet_military_parade",
    title: "Ordu Geçit Töreni Talebi",
    description: "Generaller, ordunun moralini yükseltmek ve gövde gösterisi yapmak için devasa bir askeri geçit töreni bütçesi istiyor.",
    acceptEffects: { budget: -200, military: 1, foreignRelations: -1 },
    acceptFactionEffects: { military: 5, nationalists: 5, intellectuals: -2 },
    rejectEffects: { popularity: -1 },
    rejectFactionEffects: { military: -5, nationalists: -2 },
  },
  {
    id: "pet_environmental_activists",
    title: "Yeşil Alan Koruma İsteği",
    description: "Çevreciler, sanayi bölgesine yapılmak istenen orman kıyımını durdurmanız için dilekçe verdi.",
    acceptEffects: { environment: 3, budget: -100 },
    acceptFactionEffects: { intellectuals: 5, capitalists: -3 },
    rejectEffects: { environment: -2, stability: -1 },
    rejectFactionEffects: { intellectuals: -5, capitalists: 2 },
  },
];

export function getRandomPetition(activePetitionIds: string[]): Petition | null {
  const available = PETITIONS.filter(p => !activePetitionIds.includes(p.id));
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
}
