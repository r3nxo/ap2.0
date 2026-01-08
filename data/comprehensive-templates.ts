// ============================================
// R$Q - COMPREHENSIVE FILTER TEMPLATES
// ============================================
// 50+ Advanced templates with extended conditions

import { ExtendedFilterConditions } from '@/lib/extended-filters';

export interface FilterTemplate {
  name: string;
  description: string;
  category: string;
  conditions: ExtendedFilterConditions;
  tags: string[];
}

// ============================================
// TEMPLATE CATEGORIES
// ============================================

export const CATEGORIES = {
  CORNERS: 'Cornere',
  SHOTS: 'Șuturi',
  CARDS: 'Cartonașe',
  SCORE: 'Scor',
  POSSESSION: 'Posesie',
  ADVANCED: 'Avansate',
  LIVE_BETTING: 'Live Betting',
  DEFENSIVE: 'Defensive',
  HIGH_SCORING: 'High Scoring',
  TEAM_SPECIFIC: 'Specifice Echipă',
};

// ============================================
// TEMPLATES
// ============================================

export const filterTemplates: FilterTemplate[] = [
  // ========== CORNERS (10 templates) ==========
  
  {
    name: 'Over 9.5 Cornere',
    description: 'Minim 10 cornere total în meci',
    category: CATEGORIES.CORNERS,
    conditions: {
      corners: { total: { min: 10 } },
      match_time: { after: 30 },
    },
    tags: ['popular', 'cornere', 'total'],
  },
  
  {
    name: 'Over 11.5 Cornere',
    description: 'Minim 12 cornere total',
    category: CATEGORIES.CORNERS,
    conditions: {
      corners: { total: { min: 12 } },
      match_time: { after: 35 },
    },
    tags: ['cornere', 'high'],
  },
  
  {
    name: 'Gazde Dominant Cornere',
    description: 'Gazde cu minim 7 cornere, oaspeți max 3',
    category: CATEGORIES.CORNERS,
    conditions: {
      corners: {
        home: { min: 7 },
        away: { max: 3 },
      },
      match_time: { after: 40 },
    },
    tags: ['cornere', 'gazde', 'dominant'],
  },
  
  {
    name: 'Oaspeți Dominant Cornere',
    description: 'Oaspeți cu minim 7 cornere, gazde max 3',
    category: CATEGORIES.CORNERS,
    conditions: {
      corners: {
        away: { min: 7 },
        home: { max: 3 },
      },
      match_time: { after: 40 },
    },
    tags: ['cornere', 'oaspeți', 'dominant'],
  },
  
  {
    name: 'Cornere Echilibrate',
    description: 'Ambele echipe 4-6 cornere fiecare',
    category: CATEGORIES.CORNERS,
    conditions: {
      corners: {
        home: { min: 4, max: 6 },
        away: { min: 4, max: 6 },
      },
      match_time: { after: 50 },
    },
    tags: ['cornere', 'echilibrat'],
  },
  
  {
    name: 'Cornere Repriza 2',
    description: 'Minim 6 cornere după minutul 60',
    category: CATEGORIES.CORNERS,
    conditions: {
      corners: { total: { min: 6 } },
      match_time: { after: 60 },
    },
    tags: ['cornere', 'repriza-2', 'late'],
  },
  
  {
    name: 'Cornere Finale Meci',
    description: 'Peste 12 cornere înainte de min 85',
    category: CATEGORIES.CORNERS,
    conditions: {
      corners: { total: { min: 12 } },
      match_time: { before: 85 },
    },
    tags: ['cornere', 'final', 'urgent'],
  },
  
  {
    name: 'Cornere Rapid Start',
    description: 'Minim 5 cornere înainte de min 25',
    category: CATEGORIES.CORNERS,
    conditions: {
      corners: { total: { min: 5 } },
      match_time: { before: 25 },
    },
    tags: ['cornere', 'early', 'fast'],
  },
  
  {
    name: 'Cornere Interval',
    description: '6+ cornere între min 20-45',
    category: CATEGORIES.CORNERS,
    conditions: {
      corners: { total: { min: 6 } },
      match_time: { between: [20, 45] },
    },
    tags: ['cornere', 'interval', 'first-half'],
  },
  
  {
    name: 'Cornere Low Activity',
    description: 'Sub 6 cornere după min 60 (safe under)',
    category: CATEGORIES.CORNERS,
    conditions: {
      corners: { total: { max: 5 } },
      match_time: { after: 60 },
    },
    tags: ['cornere', 'under', 'defensive'],
  },
  
  // ========== SHOTS (10 templates) ==========
  
  {
    name: 'Over 20 Șuturi',
    description: 'Minim 21 șuturi total',
    category: CATEGORIES.SHOTS,
    conditions: {
      shots: { total: { min: 21 } },
      match_time: { after: 40 },
    },
    tags: ['șuturi', 'offensive', 'total'],
  },
  
  {
    name: 'Șuturi pe Poartă 10+',
    description: 'Minim 10 șuturi pe poartă total',
    category: CATEGORIES.SHOTS,
    conditions: {
      shots_on_target: { total: { min: 10 } },
      match_time: { after: 50 },
    },
    tags: ['șuturi', 'pe-poartă', 'precision'],
  },
  
  {
    name: 'Gazde Attack Minded',
    description: 'Gazde 12+ șuturi, 5+ pe poartă',
    category: CATEGORIES.SHOTS,
    conditions: {
      shots: { home: { min: 12 } },
      shots_on_target: { home: { min: 5 } },
      match_time: { after: 45 },
    },
    tags: ['șuturi', 'gazde', 'attack'],
  },
  
  {
    name: 'Oaspeți Counter Attack',
    description: 'Oaspeți 8+ șuturi, 4+ pe poartă',
    category: CATEGORIES.SHOTS,
    conditions: {
      shots: { away: { min: 8 } },
      shots_on_target: { away: { min: 4 } },
      match_time: { after: 40 },
    },
    tags: ['șuturi', 'oaspeți', 'counter'],
  },
  
  {
    name: 'High Accuracy',
    description: 'Minim 50% șuturi pe poartă (8/16)',
    category: CATEGORIES.SHOTS,
    conditions: {
      shots: { total: { min: 16 } },
      shots_on_target: { total: { min: 8 } },
      match_time: { after: 55 },
    },
    tags: ['șuturi', 'acuratețe', 'quality'],
  },
  
  {
    name: 'Șuturi Repriza 1',
    description: '10+ șuturi înainte de pauză',
    category: CATEGORIES.SHOTS,
    conditions: {
      shots: { total: { min: 10 } },
      match_time: { before: 45 },
    },
    tags: ['șuturi', 'first-half', 'early'],
  },
  
  {
    name: 'Late Pressure',
    description: '15+ șuturi după min 70',
    category: CATEGORIES.SHOTS,
    conditions: {
      shots: { total: { min: 15 } },
      match_time: { after: 70 },
    },
    tags: ['șuturi', 'late', 'pressure'],
  },
  
  {
    name: 'Balanced Shooting',
    description: 'Ambele echipe 8-12 șuturi',
    category: CATEGORIES.SHOTS,
    conditions: {
      shots: {
        home: { min: 8, max: 12 },
        away: { min: 8, max: 12 },
      },
      match_time: { after: 60 },
    },
    tags: ['șuturi', 'balanced', 'equal'],
  },
  
  {
    name: 'Shooting Frenzy',
    description: 'Peste 30 șuturi total!',
    category: CATEGORIES.SHOTS,
    conditions: {
      shots: { total: { min: 30 } },
      match_time: { after: 60 },
    },
    tags: ['șuturi', 'extreme', 'frenzy'],
  },
  
  {
    name: 'Low Shots Defensive',
    description: 'Sub 12 șuturi după min 50 (defensive match)',
    category: CATEGORIES.SHOTS,
    conditions: {
      shots: { total: { max: 11 } },
      match_time: { after: 50 },
    },
    tags: ['șuturi', 'under', 'defensive'],
  },
  
  // ========== CARDS (10 templates) ==========
  
  {
    name: 'Over 4.5 Cartonașe',
    description: 'Minim 5 cartonașe galbene total',
    category: CATEGORIES.CARDS,
    conditions: {
      yellow_cards: { total: { min: 5 } },
      match_time: { after: 50 },
    },
    tags: ['cartonașe', 'galbene', 'rough'],
  },
  
  {
    name: 'Cartonaș Roșu Probabil',
    description: '6+ galbene, căutăm roșu',
    category: CATEGORIES.CARDS,
    conditions: {
      yellow_cards: { total: { min: 6 } },
      red_cards: { total: { max: 0 } },
      match_time: { after: 55, before: 85 },
    },
    tags: ['cartonașe', 'roșu', 'escalation'],
  },
  
  {
    name: 'Cartonaș Roșu Dat',
    description: 'Măcar un cartonaș roșu în meci',
    category: CATEGORIES.CARDS,
    conditions: {
      red_cards: { total: { min: 1 } },
    },
    tags: ['cartonașe', 'roșu', 'expulsion'],
  },
  
  {
    name: 'Meci Nervos',
    description: '7+ galbene, 2+ roșii sau dublă galbenă',
    category: CATEGORIES.CARDS,
    conditions: {
      combined: {
        any: [
          { yellow_cards: { total: { min: 7 } } },
          { red_cards: { total: { min: 2 } } },
        ],
      },
      match_time: { after: 60 },
    },
    tags: ['cartonașe', 'extreme', 'nervous'],
  },
  
  {
    name: 'Gazde Aggressive',
    description: 'Gazde 4+ cartonașe, oaspeți max 2',
    category: CATEGORIES.CARDS,
    conditions: {
      yellow_cards: {
        home: { min: 4 },
        away: { max: 2 },
      },
      match_time: { after: 50 },
    },
    tags: ['cartonașe', 'gazde', 'aggressive'],
  },
  
  {
    name: 'Oaspeți Rough Play',
    description: 'Oaspeți 4+ cartonașe',
    category: CATEGORIES.CARDS,
    conditions: {
      yellow_cards: { away: { min: 4 } },
      match_time: { after: 45 },
    },
    tags: ['cartonașe', 'oaspeți', 'rough'],
  },
  
  {
    name: 'Early Cards',
    description: '3+ cartonașe înainte de min 30',
    category: CATEGORIES.CARDS,
    conditions: {
      yellow_cards: { total: { min: 3 } },
      match_time: { before: 30 },
    },
    tags: ['cartonașe', 'early', 'aggressive-start'],
  },
  
  {
    name: 'Late Cards Tension',
    description: '4+ cartonașe după min 75',
    category: CATEGORIES.CARDS,
    conditions: {
      yellow_cards: { total: { min: 4 } },
      match_time: { after: 75 },
    },
    tags: ['cartonașe', 'late', 'tension'],
  },
  
  {
    name: 'Clean Match',
    description: 'Max 2 cartonașe după min 60 (fair play)',
    category: CATEGORIES.CARDS,
    conditions: {
      yellow_cards: { total: { max: 2 } },
      red_cards: { total: { exact: 0 } },
      match_time: { after: 60 },
    },
    tags: ['cartonașe', 'under', 'clean'],
  },
  
  {
    name: 'Balanced Cards',
    description: 'Ambele echipe 2-3 cartonașe',
    category: CATEGORIES.CARDS,
    conditions: {
      yellow_cards: {
        home: { min: 2, max: 3 },
        away: { min: 2, max: 3 },
      },
      match_time: { after: 55 },
    },
    tags: ['cartonașe', 'balanced', 'even'],
  },
  
  // ========== SCORE (10 templates) ==========
  
  {
    name: '0-0 Defensiv',
    description: 'Scor 0-0, meci defensiv, după min 60',
    category: CATEGORIES.SCORE,
    conditions: {
      score: { exact: { home: 0, away: 0 } },
      match_time: { after: 60 },
      shots_on_target: { total: { max: 4 } },
    },
    tags: ['scor', '0-0', 'defensive'],
  },
  
  {
    name: '0-0 Atacant',
    description: '0-0 dar multe ocazii, gol probabil',
    category: CATEGORIES.SCORE,
    conditions: {
      score: { exact: { home: 0, away: 0 } },
      shots_on_target: { total: { min: 8 } },
      match_time: { after: 50, before: 75 },
    },
    tags: ['scor', '0-0', 'btts-likely'],
  },
  
  {
    name: 'Gazde Conduc 1-0',
    description: 'Gazde conduc 1-0, după min 55',
    category: CATEGORIES.SCORE,
    conditions: {
      score: { exact: { home: 1, away: 0 } },
      match_time: { after: 55 },
    },
    tags: ['scor', '1-0', 'gazde-lead'],
  },
  
  {
    name: 'Over 2.5 Goals',
    description: 'Minim 3 goluri în meci',
    category: CATEGORIES.SCORE,
    conditions: {
      score: { total_goals: { min: 3 } },
      match_time: { after: 50 },
    },
    tags: ['scor', 'over-2.5', 'goals'],
  },
  
  {
    name: 'Over 3.5 Goals',
    description: 'Minim 4 goluri, meci spectaculos',
    category: CATEGORIES.SCORE,
    conditions: {
      score: { total_goals: { min: 4 } },
      match_time: { after: 60 },
    },
    tags: ['scor', 'over-3.5', 'high-scoring'],
  },
  
  {
    name: 'Egalitate Târzie',
    description: 'Scor egal, după min 70, presiune pentru câștig',
    category: CATEGORIES.SCORE,
    conditions: {
      score: { difference: { exact: 0 } },
      match_time: { after: 70 },
    },
    tags: ['scor', 'draw', 'late', 'pressure'],
  },
  
  {
    name: 'Gazde Winning Big',
    description: 'Gazde conduc cu 2+ goluri',
    category: CATEGORIES.SCORE,
    conditions: {
      score: { difference: { min: 2 } },
      combined: {
        all: [
          { score: { home: { min: 2 } } },
        ],
      },
      match_time: { after: 60 },
    },
    tags: ['scor', 'big-lead', 'gazde'],
  },
  
  {
    name: 'Comeback Potential',
    description: 'Pierde cu 1 gol, mult presiune, posibil comeback',
    category: CATEGORIES.SCORE,
    conditions: {
      score: { difference: { exact: 1 } },
      shots: { total: { min: 15 } },
      corners: { total: { min: 8 } },
      match_time: { after: 65, before: 85 },
    },
    tags: ['scor', 'comeback', 'pressure', 'live-betting'],
  },
  
  {
    name: 'BTTS Yes',
    description: 'Ambele echipe au marcat',
    category: CATEGORIES.SCORE,
    conditions: {
      score: {
        home: { min: 1 },
        away: { min: 1 },
      },
      match_time: { after: 50 },
    },
    tags: ['scor', 'btts', 'both-score'],
  },
  
  {
    name: 'Under 1.5 First Half',
    description: 'Max 1 gol în repriza 1',
    category: CATEGORIES.SCORE,
    conditions: {
      score: { total_goals: { max: 1 } },
      match_time: { before: 45 },
    },
    tags: ['scor', 'under', 'first-half', 'defensive'],
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: string): FilterTemplate[] {
  return filterTemplates.filter(t => t.category === category);
}

/**
 * Get templates by tag
 */
export function getTemplatesByTag(tag: string): FilterTemplate[] {
  return filterTemplates.filter(t => t.tags.includes(tag));
}

/**
 * Search templates
 */
export function searchTemplates(query: string): FilterTemplate[] {
  const lowerQuery = query.toLowerCase();
  return filterTemplates.filter(t =>
    t.name.toLowerCase().includes(lowerQuery) ||
    t.description.toLowerCase().includes(lowerQuery) ||
    t.tags.some(tag => tag.includes(lowerQuery))
  );
}

/**
 * Get all categories
 */
export function getAllCategories(): string[] {
  return Object.values(CATEGORIES);
}

/**
 * Get all tags
 */
export function getAllTags(): string[] {
  const tags = new Set<string>();
  filterTemplates.forEach(t => t.tags.forEach(tag => tags.add(tag)));
  return Array.from(tags).sort();
}

// ============================================
// EXPORT
// ============================================

export default {
  filterTemplates,
  CATEGORIES,
  getTemplatesByCategory,
  getTemplatesByTag,
  searchTemplates,
  getAllCategories,
  getAllTags,
};
