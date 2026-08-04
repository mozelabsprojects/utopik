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
  bonusEffects: StatEffects;
  factionEffects: Partial<Record<FactionId, number>>;
  isVictoryCondition: boolean; // Does completing this win the game?
}

export const MEGA_PROJECTS: Record<MegaProjectId, MegaProject> = {
  space_program: {
    id: "space_program",
    name: "Mars Kolonizasyon Programı",
    description: "İnsanoğlunun Mars'a ilk adımını atması için devasa bir uzay programı. Muazzam bir prestij ve bilimsel ilerleme sağlar.",
    cost: 50000,
    requiredTurn: 50,
    requiredStats: {
      education: 90,
      popularity: 60,
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
    cost: 40000,
    requiredTurn: 40,
    requiredStats: {
      education: 85,
      environment: 60,
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
    cost: 60000,
    requiredTurn: 60,
    requiredStats: {
      health: 90,
      happiness: 90,
      stability: 90,
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
      military: -10, // Barışçıl bir proje olduğu için asabiler
    },
    isVictoryCondition: true,
  },
  world_peace: {
    id: "world_peace",
    name: "Küresel Barış İttifakı",
    description: "Dünya ülkelerini tek bir bayrak altında, barış içinde yaşamak için birleştiren nihai diplomatik başarı.",
    cost: 30000,
    requiredTurn: 50,
    requiredStats: {
      foreignRelations: 95,
      popularity: 80,
      politicalCapital: 200,
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
      nationalists: -20, // Ulusal kimlik silindiği için kızarlar
    },
    isVictoryCondition: true,
  }
};

export function canStartMegaProject(state: GameState, projectId: MegaProjectId): boolean {
  const project = MEGA_PROJECTS[projectId];
  if (!project) return false;
  if (state.turn < project.requiredTurn) return false;
  if (state.budget < project.cost) return false;

  const reqs = project.requiredStats;
  if (reqs.education && state.education < reqs.education) return false;
  if (reqs.health && state.health < reqs.health) return false;
  if (reqs.happiness && state.happiness < reqs.happiness) return false;
  if (reqs.stability && state.stability < reqs.stability) return false;
  if (reqs.military && state.military < reqs.military) return false;
  if (reqs.environment && state.environment < reqs.environment) return false;
  if (reqs.foreignRelations && state.foreignRelations < reqs.foreignRelations) return false;
  if (reqs.popularity && state.popularity < reqs.popularity) return false;
  if (reqs.politicalCapital && state.politicalCapital < reqs.politicalCapital) return false;

  return true;
}
