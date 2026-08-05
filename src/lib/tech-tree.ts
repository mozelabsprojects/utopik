export type TechId = 
  | "modern_agriculture" 
  | "ai_infrastructure" 
  | "advanced_robotics" 
  | "cyber_warfare" 
  | "gene_therapy" 
  | "quantum_computing" 
  | "fusion_power" 
  | "space_mining";

export interface TechNode {
  id: TechId;
  name: string;
  description: string;
  cost: number;
  requires: TechId[];
  icon: string;
  passiveEffects?: {
    budget?: number;
    happiness?: number;
    health?: number;
    military?: number;
    stability?: number;
    environment?: number;
    education?: number;
    foreignRelations?: number;
  };
  specialEffect?: string; 
}

export const TECH_TREE: Record<TechId, TechNode> = {
  modern_agriculture: {
    id: "modern_agriculture",
    name: "Modern Tarım Teknolojileri",
    description: "Tarımda verimliliği maksimize eder. Halk sağlığı ve mutluluğu düzenli olarak artar.",
    cost: 50,
    requires: [],
    icon: "🌾",
    passiveEffects: { health: 1, happiness: 1, budget: 100 }
  },
  ai_infrastructure: {
    id: "ai_infrastructure",
    name: "Yapay Zeka Altyapısı",
    description: "Devlet daireleri ve vergi sistemleri yapay zeka ile yönetilir. Bakım masraflarını %15 düşürür.",
    cost: 100,
    requires: ["modern_agriculture"],
    icon: "🧠",
    passiveEffects: { education: 1 },
    specialEffect: "maintenance_discount" // Handled in game-engine.ts
  },
  advanced_robotics: {
    id: "advanced_robotics",
    name: "İleri Robotik Üretimi",
    description: "Sanayi robotik sistemlerle donatılır. Büyük bütçe geliri sağlar.",
    cost: 120,
    requires: ["ai_infrastructure"],
    icon: "🤖",
    passiveEffects: { budget: 800 }
  },
  cyber_warfare: {
    id: "cyber_warfare",
    name: "Siber Savaş Ağı",
    description: "Uluslararası siber operasyon yeteneği. Askeri gücü ve istikrarı kalıcı olarak artırır.",
    cost: 150,
    requires: ["ai_infrastructure"],
    icon: "💻",
    passiveEffects: { military: 1, stability: 1, foreignRelations: -1 }
  },
  gene_therapy: {
    id: "gene_therapy",
    name: "Gen Terapisi",
    description: "Kişiselleştirilmiş genetik tedavi yöntemleriyle hastalıkları yok eder.",
    cost: 200,
    requires: ["advanced_robotics"],
    icon: "🧬",
    passiveEffects: { health: 1, happiness: 1 }
  },
  quantum_computing: {
    id: "quantum_computing",
    name: "Kuantum Bilgisayarlar",
    description: "Ekonomik verimliliği akılalmaz boyutlara ulaştırır. Araştırma puanı üretimini artırır.",
    cost: 300,
    requires: ["cyber_warfare", "advanced_robotics"],
    icon: "⚛️",
    passiveEffects: { education: 1, budget: 1200 },
    specialEffect: "research_boost" // Handled in game-engine.ts
  },
  fusion_power: {
    id: "fusion_power",
    name: "Füzyon Enerjisi",
    description: "Sınırsız ve temiz enerji kaynağı. Çevre ve ekonomiyi aynı anda kurtarır.",
    cost: 400,
    requires: ["quantum_computing", "gene_therapy"],
    icon: "☀️",
    passiveEffects: { environment: 2, budget: 1500, happiness: 1 }
  },
  space_mining: {
    id: "space_mining",
    name: "Uzay Madenciliği",
    description: "Asteroit madenciliğiyle devasa ekonomik güç. Ütopya çağına giden nihai adım.",
    cost: 500,
    requires: ["fusion_power"],
    icon: "🚀",
    passiveEffects: { budget: 4000, military: 1 }
  }
};
