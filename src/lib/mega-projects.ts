import { GameState, StatEffects } from "./types";
import { FactionId, modifyFactionSupport, FactionsState } from "./factions";

export type MegaProjectId = "space_program" | "nuclear_fusion" | "utopia_city" | "world_peace";

export interface MegaProject {
  id: MegaProjectId;
  name: string;
  description: string;
  cost: number;
  requiredTurn: number;
  requiredStats: {
    education?: number;
    health?: number;
    happiness?: number;
    stability?: number;
    military?: number;
    environment?: number;
    foreignRelations?: number;
    popularity?: number;
    politicalCapital?: number;
  };
  requiredResources?: {
    energy?: number;
    food?: number;
    materials?: number;
  };
  bonusEffects: StatEffects;
  factionEffects: Partial<Record<FactionId, number>>;
  isVictoryCondition: boolean;
}

export const MEGA_PROJECTS: Record<MegaProjectId, MegaProject> = {
  space_program: {
    id: "space_program",
    name: "Mars Kolonizasyon Programı",
    description: "İnsanoğlunun Mars'a ilk adımını atması için devasa bir uzay programı. Muazzam bir prestij ve bilimsel ilerleme sağlar.",
    cost: 100000,
    requiredTurn: 40,
    requiredStats: {
      education: 90,
      popularity: 60,
    },
    requiredResources: {
      energy: 80,
      materials: 90,
    },
    bonusEffects: {
      stability: 10,
      happiness: 20,
    },
    factionEffects: {
      intellectuals: 30,
      nationalists: 20,
      workers: 20,
      capitalists: 15,
    },
    isVictoryCondition: true,
  },
  nuclear_fusion: {
    id: "nuclear_fusion",
    name: "Ticari Nükleer Füzyon",
    description: "Sınırsız ve temiz enerji. Ülkenin enerji sorununu sonsuza dek çözer ve çevre kirliliğini sıfıra indirir.",
    cost: 80000,
    requiredTurn: 30,
    requiredStats: {
      education: 85,
      environment: 60,
    },
    requiredResources: {
      energy: 70,
      materials: 80,
    },
    bonusEffects: {
      environment: 40,
      happiness: 15,
      stability: 15,
      budget: 10000,
    },
    factionEffects: {
      capitalists: 20,
      intellectuals: 20,
      workers: 10,
    },
    isVictoryCondition: true,
  },
  utopia_city: {
    id: "utopia_city",
    name: "Ütopya Şehri",
    description: "Dünyanın en yaşanabilir, suç oranının sıfır olduğu, yapay zeka ile yönetilen mega şehri.",
    cost: 120000,
    requiredTurn: 50,
    requiredStats: {
      health: 90,
      happiness: 90,
      stability: 90,
    },
    requiredResources: {
      food: 80,
      energy: 90,
      materials: 70,
    },
    bonusEffects: {
      happiness: 50,
      health: 50,
      stability: 50,
    },
    factionEffects: {
      workers: 30,
      capitalists: 15,
      intellectuals: 20,
      military: -10,
    },
    isVictoryCondition: true,
  },
  world_peace: {
    id: "world_peace",
    name: "Küresel Barış İttifakı",
    description: "Dünya ülkelerini tek bir bayrak altında, barış içinde yaşamak için birleştiren nihai diplomatik başarı.",
    cost: 70000,
    requiredTurn: 40,
    requiredStats: {
      foreignRelations: 95,
      popularity: 80,
      politicalCapital: 200,
    },
    requiredResources: {
      food: 60,
      materials: 50,
    },
    bonusEffects: {
      stability: 40,
      foreignRelations: 50,
      happiness: 20,
    },
    factionEffects: {
      intellectuals: 40,
      workers: 30,
      capitalists: 30,
      nationalists: -20,
    },
    isVictoryCondition: true,
  }
};

export function canStartMegaProject(state: GameState, projectId: MegaProjectId, difficulty: string = "Dengeli"): { canStart: boolean; reason?: string } {
  const project = MEGA_PROJECTS[projectId];
  if (!project) return { canStart: false, reason: "Proje bulunamadı" };
  if (state.turn < project.requiredTurn) return { canStart: false, reason: `Bu proje en erken ${project.requiredTurn}. turda başlatılabilir` };
  
  // Zorluk bazlı maliyet çarpanı
  let costMultiplier = 1.0;
  if (difficulty === "Kolay") costMultiplier = 0.7;
  else if (difficulty === "Zor") costMultiplier = 1.3;
  else if (difficulty === "Çok Zor") costMultiplier = 1.5;
  
  const adjustedCost = Math.round(project.cost * costMultiplier);
  if (state.budget < adjustedCost) return { canStart: false, reason: `Yetersiz bütçe. Gereken: $${adjustedCost.toLocaleString()}` };

  const reqs = project.requiredStats;
  if (reqs.education && state.education < reqs.education) return { canStart: false, reason: `Eğitim yetersiz (${state.education}/${reqs.education})` };
  if (reqs.health && state.health < reqs.health) return { canStart: false, reason: `Sağlık yetersiz (${state.health}/${reqs.health})` };
  if (reqs.happiness && state.happiness < reqs.happiness) return { canStart: false, reason: `Mutluluk yetersiz (${state.happiness}/${reqs.happiness})` };
  if (reqs.stability && state.stability < reqs.stability) return { canStart: false, reason: `İstikrar yetersiz (${state.stability}/${reqs.stability})` };
  if (reqs.military && state.military < reqs.military) return { canStart: false, reason: `Askeriye yetersiz (${state.military}/${reqs.military})` };
  if (reqs.environment && state.environment < reqs.environment) return { canStart: false, reason: `Çevre yetersiz (${state.environment}/${reqs.environment})` };
  if (reqs.foreignRelations && state.foreignRelations < reqs.foreignRelations) return { canStart: false, reason: `Dış İlişkiler yetersiz (${state.foreignRelations}/${reqs.foreignRelations})` };
  if (reqs.popularity && state.popularity < reqs.popularity) return { canStart: false, reason: `Popülarite yetersiz (${state.popularity}/${reqs.popularity})` };
  if (reqs.politicalCapital && state.politicalCapital < reqs.politicalCapital) return { canStart: false, reason: `Siyasi Sermaye yetersiz (${state.politicalCapital}/${reqs.politicalCapital})` };

  // KAYNAK GEREKSİNİMLERİ (Enerji, Gıda, Materyal)
  const res = project.requiredResources;
  if (res) {
    if (res.energy && state.energy < res.energy) return { canStart: false, reason: `⚡ Enerji yetersiz (${state.energy}/${res.energy}). Borsadan enerji satın alın veya ticari anlaşma yapın.` };
    if (res.food && state.food < res.food) return { canStart: false, reason: `🍞 Gıda yetersiz (${state.food}/${res.food}). Borsadan gıda satın alın veya ticari anlaşma yapın.` };
    if (res.materials && state.materials < res.materials) return { canStart: false, reason: `⛏️ Materyal yetersiz (${state.materials}/${res.materials}). Borsadan maden satın alın veya ticari anlaşma yapın.` };
  }

  return { canStart: true };
}

export function getMegaProjectCost(projectId: MegaProjectId, difficulty: string = "Dengeli"): number {
  const project = MEGA_PROJECTS[projectId];
  if (!project) return 0;
  let costMultiplier = 1.0;
  if (difficulty === "Kolay") costMultiplier = 0.7;
  else if (difficulty === "Zor") costMultiplier = 1.3;
  else if (difficulty === "Çok Zor") costMultiplier = 1.5;
  return Math.round(project.cost * costMultiplier);
}
