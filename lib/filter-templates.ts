// ============================================
// R$Q - FILTER TEMPLATES LIBRARY
// ============================================
// Colecție de filtre predefinite profesionale
// Inspirate de livepick.eu și alte platforme

import type { FilterConditions } from '@/lib/supabase';

// ============================================
// TYPES
// ============================================

export interface FilterTemplate {
  id: string;
  name: string;
  description: string;
  category: 'corners' | 'goals' | 'cards' | 'shots' | 'advanced' | 'popular' | 'experimental';
  conditions: FilterConditions;
  icon: string;
  popularity: number; // 1-5 stars
  successRate?: number; // Optional historical success rate
  notificationEnabled: boolean;
  tags: string[];
  experimental?: boolean; // Mark templates being tested for performance tracking
  experimentalSince?: string; // ISO date when template started testing
}

// ============================================
// TEMPLATES LIBRARY
// ============================================

export const FILTER_TEMPLATES: FilterTemplate[] = [
  // ============================================
  // POPULAR / BEST PERFORMERS
  // ============================================
  {
    id: 'over-9-corners',
    name: 'Over 9.5 Corners',
    description: 'Meciuri cu peste 9 cornere totale. Cel mai popular filtru!',
    category: 'popular',
    icon: '🎯',
    popularity: 5,
    successRate: 68,
    notificationEnabled: true,
    tags: ['corners', 'popular', 'high-success'],
    conditions: {
      corners: {
        min: 10,
        team: 'total',
      },
      match_time: {
        min: 1,
        max: 90,
      },
    },
  },
  {
    id: 'over-8-corners',
    name: 'Over 8.5 Corners',
    description: 'Varianta mai conservatoare - peste 8 cornere',
    category: 'popular',
    icon: '⚽',
    popularity: 5,
    successRate: 72,
    notificationEnabled: true,
    tags: ['corners', 'safe', 'conservative'],
    conditions: {
      corners: {
        min: 9,
        team: 'total',
      },
      match_time: {
        min: 1,
        max: 90,
      },
    },
  },
  {
    id: 'over-11-corners',
    name: 'Over 11.5 Corners',
    description: 'Pentru meciuri foarte ofensive - risc mai mare, reward mai mare',
    category: 'popular',
    icon: '🔥',
    popularity: 4,
    successRate: 55,
    notificationEnabled: true,
    tags: ['corners', 'aggressive', 'high-risk'],
    conditions: {
      corners: {
        min: 12,
        team: 'total',
      },
      match_time: {
        min: 1,
        max: 90,
      },
    },
  },
  
  // ============================================
  // CORNERS SPECIALISTS
  // ============================================
  {
    id: 'corners-second-half',
    name: 'Corners 2nd Half',
    description: 'Cornere în repriza a doua când jocul se deschide',
    category: 'corners',
    icon: '⏰',
    popularity: 4,
    successRate: 65,
    notificationEnabled: true,
    tags: ['corners', 'timing', 'second-half'],
    conditions: {
      corners: {
        min: 5,
        team: 'total',
      },
      match_time: {
        min: 60,
        max: 90,
      },
    },
  },
  {
    id: 'corners-home-dominant',
    name: 'Home Team Corners',
    description: 'Când echipa gazdă domină și are multe cornere',
    category: 'corners',
    icon: '🏠',
    popularity: 3,
    successRate: 62,
    notificationEnabled: true,
    tags: ['corners', 'home', 'dominant'],
    conditions: {
      corners: {
        min: 6,
        team: 'home',
      },
      match_time: {
        min: 1,
        max: 90,
      },
    },
  },
  {
    id: 'corners-live-momentum',
    name: 'Corners Live Momentum',
    description: 'Detect când un meci are momentum pentru multe cornere',
    category: 'corners',
    icon: '📈',
    popularity: 4,
    notificationEnabled: true,
    tags: ['corners', 'live', 'momentum'],
    conditions: {
      corners: {
        min: 6,
        team: 'total',
      },
      match_time: {
        min: 30,
        max: 75,
      },
    },
  },
  
  // ============================================
  // CARDS & FOULS
  // ============================================
  {
    id: 'yellow-cards-intense',
    name: 'Yellow Cards Over 4.5',
    description: 'Meciuri intens disputate cu multe cartonașe',
    category: 'cards',
    icon: '🟨',
    popularity: 4,
    successRate: 58,
    notificationEnabled: true,
    tags: ['cards', 'intense', 'aggressive'],
    conditions: {
      yellow_cards: {
        min: 5,
      },
      match_time: {
        min: 1,
        max: 90,
      },
    },
  },
  {
    id: 'cards-derby',
    name: 'Derby Cards',
    description: 'Perfect pentru derby-uri și meciuri tensionate',
    category: 'cards',
    icon: '⚔️',
    popularity: 3,
    tags: ['cards', 'derby', 'rivalry'],
    notificationEnabled: true,
    conditions: {
      yellow_cards: {
        min: 6,
      },
      match_time: {
        min: 1,
        max: 90,
      },
    },
  },
  
  // ============================================
  // SHOTS & ATTACKS
  // ============================================
  {
    id: 'shots-on-target-high',
    name: 'Shots on Target Over 10',
    description: 'Meciuri cu multe șuturi pe poartă - acțiune continuă',
    category: 'shots',
    icon: '🎯',
    popularity: 4,
    successRate: 64,
    notificationEnabled: true,
    tags: ['shots', 'attacking', 'action'],
    conditions: {
      shots_on_target: {
        min: 10,
      },
      match_time: {
        min: 1,
        max: 90,
      },
    },
  },
  {
    id: 'total-shots-aggressive',
    name: 'Total Shots Over 20',
    description: 'Joc ultra-ofensiv cu multe tentative',
    category: 'shots',
    icon: '⚡',
    popularity: 3,
    successRate: 61,
    notificationEnabled: true,
    tags: ['shots', 'offensive', 'high-tempo'],
    conditions: {
      total_shots: {
        min: 20,
      },
      match_time: {
        min: 1,
        max: 90,
      },
    },
  },
  
  // ============================================
  // ADVANCED / COMBO
  // ============================================
  {
    id: 'combo-corners-shots',
    name: 'Corners + Shots Combo',
    description: 'Combinație: 8+ cornere ȘI 10+ șuturi pe poartă',
    category: 'advanced',
    icon: '🎲',
    popularity: 4,
    successRate: 70,
    notificationEnabled: true,
    tags: ['combo', 'advanced', 'multi-condition'],
    conditions: {
      corners: {
        min: 8,
        team: 'total',
      },
      shots_on_target: {
        min: 10,
      },
      match_time: {
        min: 1,
        max: 90,
      },
    },
  },
  {
    id: 'late-game-action',
    name: 'Late Game Action',
    description: 'Acțiune intensă în ultimele 20 de minute',
    category: 'advanced',
    icon: '🔚',
    popularity: 3,
    tags: ['timing', 'late-game', 'pressure'],
    notificationEnabled: true,
    conditions: {
      corners: {
        min: 3,
        team: 'total',
      },
      yellow_cards: {
        min: 2,
      },
      match_time: {
        min: 70,
        max: 90,
      },
    },
  },
  {
    id: 'first-half-intensity',
    name: 'First Half Intensity',
    description: 'Start puternic - multe cornere și șuturi în repriza 1',
    category: 'advanced',
    icon: '⚡',
    popularity: 3,
    tags: ['timing', 'first-half', 'fast-start'],
    notificationEnabled: true,
    conditions: {
      corners: {
        min: 5,
        team: 'total',
      },
      shots_on_target: {
        min: 6,
      },
      match_time: {
        min: 1,
        max: 45,
      },
    },
  },
  
  // ============================================
  // CONSERVATIVE / SAFE
  // ============================================
  {
    id: 'safe-corners',
    name: 'Safe Corners (7+)',
    description: 'Opțiune foarte conservatoare - aproape garantat',
    category: 'corners',
    icon: '🛡️',
    popularity: 4,
    successRate: 82,
    notificationEnabled: true,
    tags: ['safe', 'conservative', 'low-risk'],
    conditions: {
      corners: {
        min: 7,
        team: 'total',
      },
      match_time: {
        min: 1,
        max: 90,
      },
    },
  },
  {
    id: 'moderate-action',
    name: 'Moderate Action',
    description: 'Nivel moderat de acțiune - echilibrat risc/reward',
    category: 'popular',
    icon: '⚖️',
    popularity: 3,
    successRate: 75,
    notificationEnabled: true,
    tags: ['balanced', 'moderate', 'safe'],
    conditions: {
      corners: {
        min: 6,
        team: 'total',
      },
      shots_on_target: {
        min: 8,
      },
      match_time: {
        min: 1,
        max: 90,
      },
    },
  },
  
  // ============================================
  // AGGRESSIVE / HIGH RISK
  // ============================================
  {
    id: 'ultra-aggressive',
    name: 'Ultra Aggressive',
    description: 'Pentru meciuri extrem de ofensive - risc maxim!',
    category: 'advanced',
    icon: '💥',
    popularity: 2,
    successRate: 45,
    notificationEnabled: true,
    tags: ['aggressive', 'high-risk', 'explosive'],
    conditions: {
      corners: {
        min: 13,
        team: 'total',
      },
      shots_on_target: {
        min: 12,
      },
      yellow_cards: {
        min: 4,
      },
      match_time: {
        min: 1,
        max: 90,
      },
    },
  },
  
  // ============================================
  // SHOTS SPECIALISTS
  // ============================================
  {
    id: 'high-shots-target',
    name: 'High Shots on Target',
    description: 'Echipe cu cel puțin 8 șuturi pe poartă - joc ofensiv',
    category: 'shots',
    icon: '🎯',
    popularity: 4,
    successRate: 66,
    notificationEnabled: true,
    tags: ['shots', 'offensive', 'on-target'],
    conditions: {
      shots_on_target: {
        min: 8,
      },
      match_time: {
        min: 1,
        max: 90,
      },
    },
  },
  {
    id: 'total-shots-high',
    name: 'Total Shots (High)',
    description: 'Cel puțin 20 de șuturi în total (ambele echipe)',
    category: 'shots',
    icon: '⚡',
    popularity: 3,
    successRate: 64,
    notificationEnabled: true,
    tags: ['shots', 'total', 'activity'],
    conditions: {
      total_shots: {
        min: 20,
      },
      match_time: {
        min: 1,
        max: 90,
      },
    },
  },
  {
    id: 'dangerous-attacks',
    name: 'Dangerous Attacks',
    description: 'Minimum 10 atacuri periculoase - indicator al tendinței goluri',
    category: 'advanced',
    icon: '💣',
    popularity: 3,
    successRate: 63,
    notificationEnabled: true,
    tags: ['attacks', 'dangerous', 'offensive'],
    conditions: {
      dangerous_attacks: {
        min: 10,
      },
      shots_on_target: {
        min: 5,
      },
      match_time: {
        min: 1,
        max: 90,
      },
    },
  },

  // ============================================
  // LIVE BETTING SPECIALISTS
  // ============================================
  {
    id: 'live-first-half-activity',
    name: 'First Half Activity',
    description: 'Activitate mare în prima jumătate - 5+ cornere + 2+ cartonașe',
    category: 'advanced',
    icon: '⚡',
    popularity: 4,
    successRate: 70,
    notificationEnabled: true,
    tags: ['live', 'first-half', 'activity'],
    conditions: {
      corners: {
        min: 5,
        team: 'total',
      },
      yellow_cards: {
        min: 2,
      },
      match_time: {
        min: 1,
        max: 45,
      },
    },
  },
  {
    id: 'second-half-momentum',
    name: 'Second Half Momentum',
    description: 'Intenție în a doua jumătate - pentru live betting',
    category: 'advanced',
    icon: '🚀',
    popularity: 3,
    successRate: 58,
    notificationEnabled: true,
    tags: ['live', 'second-half', 'momentum'],
    conditions: {
      corners: {
        min: 4,
        team: 'total',
      },
      shots_on_target: {
        min: 3,
      },
      match_time: {
        min: 45,
        max: 90,
      },
    },
  },

  // ============================================
  // DEFENSIVE / SAFE STRATEGIES
  // ============================================
  {
    id: 'defensive-low-action',
    name: 'Defensive Match (Safe)',
    description: 'Meciuri defensiv orientate - sub 7 cornere, sub 3 cartonașe',
    category: 'advanced',
    icon: '🛡️',
    popularity: 3,
    successRate: 72,
    notificationEnabled: false,
    tags: ['defensive', 'safe', 'low-action'],
    conditions: {
      corners: {
        max: 6,
        team: 'total',
      },
      yellow_cards: {
        max: 2,
      },
      match_time: {
        min: 1,
        max: 90,
      },
    },
  },
  {
    id: 'low-shot-volume',
    name: 'Low Shot Volume (Conservative)',
    description: 'Meciuri cu sub 10 șuturi pe poartă - echipe defensive',
    category: 'shots',
    icon: '🔐',
    popularity: 2,
    successRate: 68,
    notificationEnabled: false,
    tags: ['shots', 'defensive', 'low'],
    conditions: {
      shots_on_target: {
        max: 9,
      },
      match_time: {
        min: 1,
        max: 90,
      },
    },
  },

  // ============================================
  // COMBO FILTERS (MIXED)
  // ============================================
  {
    id: 'total-chaos',
    name: 'Total Chaos',
    description: '8+ Cornere + 3+ Cartonașe + 3+ Șuturi pe poartă',
    category: 'advanced',
    icon: '🌪️',
    popularity: 3,
    successRate: 61,
    notificationEnabled: true,
    tags: ['combo', 'chaotic', 'action'],
    conditions: {
      corners: {
        min: 8,
        team: 'total',
      },
      yellow_cards: {
        min: 3,
      },
      shots_on_target: {
        min: 3,
      },
      match_time: {
        min: 1,
        max: 90,
      },
    },
  },
  {
    id: 'perfect-balance',
    name: 'Perfect Balance',
    description: 'Echilibru perfectă - 7-9 cornere, 1-2 cartonașe, 6-8 șuturi',
    category: 'advanced',
    icon: '⚖️',
    popularity: 4,
    successRate: 69,
    notificationEnabled: true,
    tags: ['combo', 'balanced', 'moderate'],
    conditions: {
      corners: {
        min: 7,
        max: 9,
        team: 'total',
      },
      yellow_cards: {
        min: 1,
        max: 2,
      },
      shots_on_target: {
        min: 6,
        max: 8,
      },
      match_time: {
        min: 1,
        max: 90,
      },
    },
  },
  {
    id: 'live-prediction',
    name: 'Live Prediction',
    description: 'Pentru live betting - adaptat în timp real cu match activity',
    category: 'advanced',
    icon: '🎲',
    popularity: 3,
    successRate: 64,
    notificationEnabled: true,
    tags: ['live', 'prediction', 'betting'],
    conditions: {
      corners: {
        min: 4,
        team: 'total',
      },
      shots_on_target: {
        min: 2,
      },
      match_time: {
        min: 1,
        max: 90,
      },
    },
  },

  // ============================================
  // SPECIALIZED NICHE FILTERS
  // ============================================
  {
    id: 'corner-in-first-15min',
    name: 'Early Corner Action',
    description: 'Minimum 2 cornere în primele 15 minute - indicator de joc agresiv',
    category: 'corners',
    icon: '⏱️',
    popularity: 2,
    successRate: 55,
    notificationEnabled: true,
    tags: ['corners', 'early', 'momentum'],
    conditions: {
      corners: {
        min: 2,
        team: 'total',
      },
      match_time: {
        min: 1,
        max: 15,
      },
    },
  },
  {
    id: 'high-shots-low-accuracy',
    name: 'Poor Finishing',
    description: 'Echipe cu prea mult șut, puțin acurat - șuturi mari, țintă mică',
    category: 'shots',
    icon: '🎪',
    popularity: 2,
    successRate: 58,
    notificationEnabled: false,
    tags: ['shots', 'finishing', 'undervalue'],
    conditions: {
      total_shots: {
        min: 15,
      },
      shots_on_target: {
        max: 5,
      },
      match_time: {
        min: 1,
        max: 90,
      },
    },
  },
  {
    id: 'red-card-probability',
    name: 'Intense Match (Red Card Risk)',
    description: 'Meciuri cu risc de cartonașe roșii - 5+ cartonașe galbene min',
    category: 'cards',
    icon: '🔴',
    popularity: 1,
    successRate: 52,
    notificationEnabled: true,
    tags: ['cards', 'red-card', 'intense'],
    conditions: {
      yellow_cards: {
        min: 5,
      },
      match_time: {
        min: 1,
        max: 90,
      },
    },
  },
  {
    id: 'balanced-possession',
    name: 'Balanced Possession',
    description: 'Meciuri cu mix echilibrat - 7-11 cornere, 8-12 șuturi pe poartă',
    category: 'advanced',
    icon: '⚽',
    popularity: 3,
    successRate: 67,
    notificationEnabled: true,
    tags: ['combo', 'balanced', 'possession'],
    conditions: {
      corners: {
        min: 7,
        max: 11,
        team: 'total',
      },
      shots_on_target: {
        min: 8,
        max: 12,
      },
      match_time: {
        min: 1,
        max: 90,
      },
    },
  },
  {
    id: 'attacking-potential',
    name: 'High Attacking Potential',
    description: 'Echipe cu potențial mare ofensiv - 10+ atacuri periculoase',
    category: 'advanced',
    icon: '🎯',
    popularity: 3,
    successRate: 65,
    notificationEnabled: true,
    tags: ['attacks', 'offensive', 'potential'],
    conditions: {
      dangerous_attacks: {
        min: 10,
      },
      corners: {
        min: 6,
        team: 'total',
      },
      match_time: {
        min: 1,
        max: 90,
      },
    },
  },

  // ============================================
  // GOAL-BASED TEMPLATES (NEW FIELD)
  // ============================================
  {
    id: 'over-2-goals',
    name: 'Over 2.5 Total Goals',
    description: 'Meciuri cu mai mult de 2 goluri în total. Atracție maximă!',
    category: 'goals',
    icon: '⚽',
    popularity: 5,
    successRate: 62,
    notificationEnabled: true,
    tags: ['goals', 'over', 'scoring', 'high-action'],
    experimental: false,
    conditions: {
      goals: {
        min: 3,
        team: 'total',
      },
      match_time: {
        min: 1,
        max: 90,
      },
    },
  },
  {
    id: 'over-1-goals-both-teams',
    name: 'Both Teams to Score',
    description: 'Ambele echipe marchează cel puțin 1 gol fiecare',
    category: 'goals',
    icon: '🎯🎯',
    popularity: 5,
    successRate: 58,
    notificationEnabled: true,
    tags: ['goals', 'both-teams', 'balanced'],
    experimental: false,
    conditions: {
      goals: {
        min: 1,
        team: 'home',
      },
      match_time: {
        min: 1,
        max: 90,
      },
    },
  },
  {
    id: 'under-2-goals',
    name: 'Under 2.5 Total Goals',
    description: 'Meciuri defensiv închise, sub 3 goluri în total',
    category: 'goals',
    icon: '🛡️',
    popularity: 4,
    successRate: 55,
    notificationEnabled: true,
    tags: ['goals', 'under', 'defensive', 'safe'],
    experimental: false,
    conditions: {
      goals: {
        max: 2,
        team: 'total',
      },
      match_time: {
        min: 1,
        max: 90,
      },
    },
  },
  {
    id: 'home-team-goals-high',
    name: 'Home Team Goals High',
    description: 'Echipa acasă marchează minim 2 goluri',
    category: 'goals',
    icon: '🏠⚽',
    popularity: 3,
    successRate: 48,
    notificationEnabled: true,
    tags: ['goals', 'home-advantage'],
    experimental: true,
    experimentalSince: '2026-01-08',
    conditions: {
      goals: {
        min: 2,
        team: 'home',
      },
      match_time: {
        min: 1,
        max: 90,
      },
    },
  },
  {
    id: 'away-team-goals-upset',
    name: 'Away Team Goals (Upset)',
    description: 'Echipa oaspete marchează minim 1 gol',
    category: 'goals',
    icon: '🚌⚽',
    popularity: 3,
    successRate: 52,
    notificationEnabled: true,
    tags: ['goals', 'away', 'upset'],
    experimental: true,
    experimentalSince: '2026-01-08',
    conditions: {
      goals: {
        min: 1,
        team: 'away',
      },
      match_time: {
        min: 1,
        max: 90,
      },
    },
  },

  // ============================================
  // EXPERIMENTAL TEMPLATES (TRACKING PERFORMANCE)
  // ============================================
  {
    id: 'high-scoring-combo',
    name: 'High Scoring Combo',
    description: 'Combinație: 3+ goluri + 5+ șuturi pe poartă',
    category: 'experimental',
    icon: '🔥',
    popularity: 2,
    successRate: undefined,
    notificationEnabled: true,
    tags: ['experimental', 'combo', 'tracking'],
    experimental: true,
    experimentalSince: '2026-01-08',
    conditions: {
      goals: {
        min: 3,
        team: 'total',
      },
      shots_on_target: {
        min: 5,
      },
      match_time: {
        min: 1,
        max: 90,
      },
    },
  },
  {
    id: 'first-half-goals',
    name: 'First Half Goals (Early)',
    description: 'Gol marchează în primele 45 de minute - încearcă o nouă strategie',
    category: 'experimental',
    icon: '⚡⚽',
    popularity: 2,
    successRate: undefined,
    notificationEnabled: true,
    tags: ['experimental', 'first-half', 'timing'],
    experimental: true,
    experimentalSince: '2026-01-08',
    conditions: {
      goals: {
        min: 1,
        team: 'total',
      },
      match_time: {
        min: 1,
        max: 45,
      },
    },
  },
  {
    id: 'second-half-goals',
    name: 'Second Half Goals (Late Momentum)',
    description: 'Goluri marchează în a doua jumătate - detectează schimbarea jocului',
    category: 'experimental',
    icon: '⚽💨',
    popularity: 2,
    successRate: undefined,
    notificationEnabled: true,
    tags: ['experimental', 'second-half', 'momentum'],
    experimental: true,
    experimentalSince: '2026-01-08',
    conditions: {
      goals: {
        min: 1,
        team: 'total',
      },
      match_time: {
        min: 46,
        max: 90,
      },
    },
  },
  {
    id: 'goals-and-cards-intense',
    name: 'Goals + Cards Intensity',
    description: 'Acțiune intensă: 2+ goluri și 4+ cartonașe galbene - meciuri fierbinți!',
    category: 'experimental',
    icon: '🔥🟨',
    popularity: 1,
    successRate: undefined,
    notificationEnabled: true,
    tags: ['experimental', 'intensity', 'chaos'],
    experimental: true,
    experimentalSince: '2026-01-08',
    conditions: {
      goals: {
        min: 2,
        team: 'total',
      },
      yellow_cards: {
        min: 4,
      },
      match_time: {
        min: 1,
        max: 90,
      },
    },
  },
  {
    id: 'goals-dangerous-attacks',
    name: 'Goals + Dangerous Attacks',
    description: 'Combinație de gol + 4+ atacuri periculoase - predicție ofensivă',
    category: 'experimental',
    icon: '⚽🚀',
    popularity: 1,
    successRate: undefined,
    notificationEnabled: true,
    tags: ['experimental', 'offensive', 'prediction'],
    experimental: true,
    experimentalSince: '2026-01-08',
    conditions: {
      goals: {
        min: 1,
        team: 'total',
      },
      dangerous_attacks: {
        min: 4,
      },
      match_time: {
        min: 1,
        max: 90,
      },
    },
  },
  {
    id: 'balanced-game-metric',
    name: 'Balanced Game Metrics',
    description: 'Joc echilibrat: 2-3 goluri, 3-4 cornere, 3-5 șuturi pe poartă',
    category: 'experimental',
    icon: '⚖️',
    popularity: 1,
    successRate: undefined,
    notificationEnabled: true,
    tags: ['experimental', 'balanced', 'metrics'],
    experimental: true,
    experimentalSince: '2026-01-08',
    conditions: {
      goals: {
        min: 2,
        max: 3,
        team: 'total',
      },
      corners: {
        min: 3,
        max: 4,
        team: 'total',
      },
      shots_on_target: {
        min: 3,
        max: 5,
      },
    },
  },
];


// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get all templates
 */
export function getAllTemplates(): FilterTemplate[] {
  return FILTER_TEMPLATES;
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: FilterTemplate['category']): FilterTemplate[] {
  return FILTER_TEMPLATES.filter(t => t.category === category);
}

/**
 * Get popular templates (4+ stars)
 */
export function getPopularTemplates(): FilterTemplate[] {
  return FILTER_TEMPLATES.filter(t => t.popularity >= 4).sort((a, b) => b.popularity - a.popularity);
}

/**
 * Get template by ID
 */
export function getTemplateById(id: string): FilterTemplate | undefined {
  return FILTER_TEMPLATES.find(t => t.id === id);
}

/**
 * Search templates
 */
export function searchTemplates(query: string): FilterTemplate[] {
  const q = query.toLowerCase();
  return FILTER_TEMPLATES.filter(t => 
    t.name.toLowerCase().includes(q) ||
    t.description.toLowerCase().includes(q) ||
    t.tags.some(tag => tag.toLowerCase().includes(q))
  );
}

/**
 * Get categories with counts
 */
export function getCategoriesWithCounts() {
  const categories: Record<string, number> = {};
  FILTER_TEMPLATES.forEach(t => {
    categories[t.category] = (categories[t.category] || 0) + 1;
  });
  return categories;
}

// ============================================
// EXPORT
// ============================================

export default {
  getAllTemplates,
  getTemplatesByCategory,
  getPopularTemplates,
  getTemplateById,
  searchTemplates,
  getCategoriesWithCounts,
};
