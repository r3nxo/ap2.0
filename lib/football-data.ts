// ============================================
// R$Q - FOOTBALL-DATA.ORG API
// ============================================
// Alternative la API-Football - FREE cu 10 req/min!
// https://www.football-data.org/

const FOOTBALL_DATA_API_KEY = process.env.NEXT_PUBLIC_FOOTBALL_DATA_KEY;
// ⚠️ NU mai facem request direct! Folosim API route proxy!
// const BASE_URL = 'https://api.football-data.org/v4';
const PROXY_URL = '/api/football-data'; // Next.js API route (server-side)

// ============================================
// TYPES (compatibile cu API-Football)
// ============================================

export interface LiveMatch {
  fixture: {
    id: number;
    date: string;
    timestamp: number;
    status: {
      long: string;
      short: string;
      elapsed: number | null;
    };
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string;
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
    };
    away: {
      id: number;
      name: string;
      logo: string;
    };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score: {
    halftime: {
      home: number | null;
      away: number | null;
    };
    fulltime: {
      home: number | null;
      away: number | null;
    };
  };
}

export interface MatchStatistics {
  team: {
    id: number;
    name: string;
  };
  statistics: Array<{
    type: string;
    value: number | string | null;
  }>;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Convert Football-Data match to our format
 */
function convertMatch(match: any): LiveMatch {
  const status = match.status;
  const isLive = status === 'IN_PLAY' || status === 'PAUSED';
  
  // Calculează minutul
  let elapsed = null;
  if (isLive && match.minute) {
    elapsed = match.minute;
  }
  
  return {
    fixture: {
      id: match.id,
      date: match.utcDate,
      timestamp: new Date(match.utcDate).getTime() / 1000,
      status: {
        long: getStatusLong(status),
        short: getStatusShort(status),
        elapsed: elapsed,
      },
    },
    league: {
      id: match.competition.id,
      name: match.competition.name,
      country: match.area?.name || 'International',
      logo: match.competition.emblem || '',
      flag: match.area?.flag || '',
    },
    teams: {
      home: {
        id: match.homeTeam.id,
        name: match.homeTeam.name,
        logo: match.homeTeam.crest || '',
      },
      away: {
        id: match.awayTeam.id,
        name: match.awayTeam.name,
        logo: match.awayTeam.crest || '',
      },
    },
    goals: {
      home: match.score.fullTime.home,
      away: match.score.fullTime.away,
    },
    score: {
      halftime: {
        home: match.score.halfTime.home,
        away: match.score.halfTime.away,
      },
      fulltime: {
        home: match.score.fullTime.home,
        away: match.score.fullTime.away,
      },
    },
  };
}

/**
 * Get status long name
 */
function getStatusLong(status: string): string {
  const statusMap: Record<string, string> = {
    'SCHEDULED': 'Not Started',
    'TIMED': 'Not Started',
    'IN_PLAY': 'Match In Progress',
    'PAUSED': 'Halftime',
    'FINISHED': 'Match Finished',
    'POSTPONED': 'Match Postponed',
    'CANCELLED': 'Match Cancelled',
    'SUSPENDED': 'Match Suspended',
  };
  return statusMap[status] || status;
}

/**
 * Get status short name
 */
function getStatusShort(status: string): string {
  const statusMap: Record<string, string> = {
    'SCHEDULED': 'NS',
    'TIMED': 'NS',
    'IN_PLAY': 'LIVE',
    'PAUSED': 'HT',
    'FINISHED': 'FT',
    'POSTPONED': 'PST',
    'CANCELLED': 'CANC',
    'SUSPENDED': 'SUSP',
  };
  return statusMap[status] || 'NS';
}

// ============================================
// API CALLS
// ============================================

/**
 * Get live matches
 */
export async function getLiveMatches(): Promise<LiveMatch[]> {
  if (!FOOTBALL_DATA_API_KEY) {
    throw new Error('Football-Data API key not configured');
  }
  
  try {
    console.log('🔍 Fetching live matches from Football-Data.org (via proxy)...');
    
    // Folosim API route proxy (server-side, NO CORS!)
    const response = await fetch(`${PROXY_URL}?endpoint=/matches&status=LIVE`, {
      method: 'GET',
      cache: 'no-store', // Nu cache pentru date live
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Football-Data API error: ${error.error || response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.matches || data.matches.length === 0) {
      console.log('⚠️ No live matches found');
      return [];
    }
    
    const matches = data.matches.map(convertMatch);
    
    console.log(`✅ Found ${matches.length} live matches`);
    
    return matches;
    
  } catch (error) {
    console.error('❌ Error fetching live matches:', error);
    throw error;
  }
}

/**
 * Get match statistics
 */
export async function getMatchStatistics(matchId: number): Promise<MatchStatistics[]> {
  if (!FOOTBALL_DATA_API_KEY) {
    throw new Error('Football-Data API key not configured');
  }
  
  try {
    console.log(`🔍 Fetching statistics for match ${matchId} (via proxy)...`);
    
    // Folosim API route proxy
    const response = await fetch(`${PROXY_URL}?endpoint=/matches/${matchId}`, {
      method: 'GET',
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Football-Data nu returnează statistici detaliate în free tier
    // Returnăm doar score-ul ca statistici de bază
    const homeStats = {
      team: {
        id: data.homeTeam.id,
        name: data.homeTeam.name,
      },
      statistics: [
        { type: 'Goals', value: data.score.fullTime.home },
      ],
    };
    
    const awayStats = {
      team: {
        id: data.awayTeam.id,
        name: data.awayTeam.name,
      },
      statistics: [
        { type: 'Goals', value: data.score.fullTime.away },
      ],
    };
    
    console.log(`✅ Statistics loaded for match ${matchId}`);
    
    return [homeStats, awayStats];
    
  } catch (error) {
    console.error(`❌ Error fetching match statistics:`, error);
    // Return empty stats rather than throwing
    return [];
  }
}

/**
 * Get today's matches (toate, nu doar live)
 */
export async function getTodayMatches(): Promise<LiveMatch[]> {
  if (!FOOTBALL_DATA_API_KEY) {
    throw new Error('Football-Data API key not configured');
  }
  
  try {
    const today = new Date().toISOString().split('T')[0];
    
    console.log(`🔍 Fetching matches for ${today} (via proxy)...`);
    
    // Folosim API route proxy
    const response = await fetch(`${PROXY_URL}?endpoint=/matches&dateFrom=${today}&dateTo=${today}`, {
      method: 'GET',
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.matches || data.matches.length === 0) {
      console.log('⚠️ No matches found for today');
      return [];
    }
    
    const matches = data.matches.map(convertMatch);
    
    console.log(`✅ Found ${matches.length} matches for today`);
    
    return matches;
    
  } catch (error) {
    console.error('❌ Error fetching today matches:', error);
    throw error;
  }
}

/**
 * Check API status
 */
export async function checkAPIStatus(): Promise<{ success: boolean; message: string }> {
  if (!FOOTBALL_DATA_API_KEY) {
    return {
      success: false,
      message: 'API key not configured',
    };
  }
  
  try {
    // Folosim API route proxy pentru a testa conectivitatea
    const response = await fetch(`${PROXY_URL}?endpoint=/competitions`, {
      method: 'GET',
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        message: `Football-Data.org connected via proxy (${data.count || 0} competitions available)`,
      };
    } else {
      const error = await response.json();
      return {
        success: false,
        message: error.error || `API error: ${response.status}`,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================
// EXPORT
// ============================================

export default {
  getLiveMatches,
  getMatchStatistics,
  getTodayMatches,
  checkAPIStatus,
};
