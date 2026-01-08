'use client';

// ============================================
// R$Q - LIVE MATCHES PAGE (WITH AUTO-SCANNER)
// ============================================
// Versiune optimizată cu Match Scanner integrat

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  RefreshCw, 
  Filter as FilterIcon, 
  Activity, 
  Target, 
  Bell, 
  BellOff, 
  Zap,
  Settings
} from 'lucide-react';
import { getLiveMatches, LiveMatch } from '@/lib/unified-api';
import MatchCard from '@/components/MatchCard';
import AuthWrapper from '@/components/AuthWrapper';
import { authHelpers, dbHelpers } from '@/lib/supabase';
import type { Filter } from '@/lib/supabase';
import { applyFiltersToMatches, FilterMatchResult } from '@/lib/filter-engine';
import { useMatchScanner } from '@/hooks/useMatchScanner';
import { checkNotificationStatus, requestNotificationPermission } from '@/lib/notifications';
import { useRouter } from 'next/navigation';

// ============================================
// COMPONENTA PRINCIPALĂ
// ============================================

export default function LiveMatchesPage() {
  const router = useRouter();
  
  // ============================================
  // STATE
  // ============================================
  
  const [matches, setMatches] = useState<LiveMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  
  // Filter state
  const [selectedLeague, setSelectedLeague] = useState<string>('all');
  const [userFilters, setUserFilters] = useState<Filter[]>([]);
  const [filterResults, setFilterResults] = useState<Map<number, FilterMatchResult[]>>(new Map());
  const [showOnlyFiltered, setShowOnlyFiltered] = useState(false);
  const [applyingFilters, setApplyingFilters] = useState(false);
  
  // Scanner state
  const [scannerEnabled, setScannerEnabled] = useState(false);
  const [notificationsReady, setNotificationsReady] = useState(false);
  
  // ============================================
  // MATCH SCANNER HOOK
  // ============================================
  
  const { stats: scannerStats, resetNotifications } = useMatchScanner(
    matches,
    userFilters,
    scannerEnabled,
    45 // Scanează la 45 secunde
  );
  
  // ============================================
  // LOAD FUNCTIONS
  // ============================================
  
  const loadUserFilters = async () => {
    try {
      const currentUser = authHelpers.getCurrentUser();
      if (!currentUser) return;
      
      const filters = await dbHelpers.getUserFilters(currentUser.id);
      setUserFilters(filters);
      
      console.log(`✅ Loaded ${filters.length} user filters`);
    } catch (err) {
      console.error('Error loading filters:', err);
    }
  };
  
  const applyFilters = async (matchesToFilter: LiveMatch[]) => {
    if (userFilters.length === 0) {
      setFilterResults(new Map());
      return;
    }
    
    setApplyingFilters(true);
    
    try {
      console.log('🎯 Applying filters to matches...');
      const results = await applyFiltersToMatches(matchesToFilter, userFilters);
      setFilterResults(results);
      
      console.log(`✅ ${results.size} matches have filter matches`);
    } catch (err) {
      console.error('Error applying filters:', err);
    } finally {
      setApplyingFilters(false);
    }
  };
  
  const fetchMatches = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Fetching live matches...');
      const liveMatches = await getLiveMatches();
      
      setMatches(liveMatches);
      setLastUpdate(new Date());
      
      console.log(`✅ Loaded ${liveMatches.length} live matches`);
      
      await applyFilters(liveMatches);
      
    } catch (err) {
      console.error('❌ Error fetching matches:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch matches');
    } finally {
      setLoading(false);
    }
  };
  
  const checkNotificationPermissions = async () => {
    const status = await checkNotificationStatus();
    setNotificationsReady(status.ready);
    console.log('🔔 Notification status:', status);
    
    if (!status.ready && status.supported) {
      console.log('⚠️ Notifications not ready. User needs to grant permission.');
    }
  };
  
  // ============================================
  // EFFECTS
  // ============================================
  
  useEffect(() => {
    loadUserFilters();
    fetchMatches();
    checkNotificationPermissions();
  }, []);
  
  useEffect(() => {
    if (matches.length > 0 && userFilters.length > 0) {
      applyFilters(matches);
    }
  }, [userFilters]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('⏰ Auto-refresh matches...');
      fetchMatches();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  // ============================================
  // FILTER LOGIC
  // ============================================
  
  const matchesWithFilters = Array.from(filterResults.keys()).length;
  const activeFiltersCount = userFilters.filter(f => f.is_active).length;
  const filtersWithNotifications = userFilters.filter(f => f.is_active && f.notification_enabled).length;
  
  let filteredMatches = selectedLeague === 'all' 
    ? matches 
    : matches.filter(m => m.league.name === selectedLeague);
  
  if (showOnlyFiltered) {
    filteredMatches = filteredMatches.filter(m => filterResults.has(m.fixture.id));
  }
  
  const leagues = Array.from(new Set(matches.map(m => m.league.name)));
  
  // ============================================
  // HANDLERS
  // ============================================
  
  const handleMatchClick = (match: LiveMatch) => {
    const matchedFilters = filterResults.get(match.fixture.id);
    
    if (matchedFilters && matchedFilters.length > 0) {
      const filterNames = matchedFilters.map(r => r.filter.name).join(', ');
      const conditions = matchedFilters[0].matchedConditions.join('\n');
      
      alert(
        `⚽ ${match.teams.home.name} vs ${match.teams.away.name}\n\n` +
        `✅ Matched Filters (${matchedFilters.length}):\n${filterNames}\n\n` +
        `📊 Conditions:\n${conditions}`
      );
    } else {
      alert(
        `⚽ ${match.teams.home.name} vs ${match.teams.away.name}\n\n` +
        `Match ID: ${match.fixture.id}\n` +
        `Liga: ${match.league.name}\n\n` +
        `❌ No filters matched`
      );
    }
  };
  
  const handleRefresh = () => {
    fetchMatches();
  };
  
  const handleToggleScanner = async () => {
    if (!scannerEnabled && !notificationsReady) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        alert('Trebuie să acorzi permisiune pentru notificări pentru a activa scanner-ul!');
        return;
      }
      setNotificationsReady(true);
    }
    
    setScannerEnabled(!scannerEnabled);
    console.log(`🔄 Scanner ${!scannerEnabled ? 'ENABLED' : 'DISABLED'}`);
  };
  
  // ============================================
  // RENDER
  // ============================================
  
  return (
    <AuthWrapper>
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* ========== HEADER ========== */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold gradient-text mb-2">
                ⚽ Live Matches
              </h1>
              <p className="text-text-secondary">
                {lastUpdate ? (
                  <>Ultimul update: {lastUpdate.toLocaleTimeString()}</>
                ) : (
                  'Se încarcă meciuri...'
                )}
              </p>
            </div>
            
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="btn-secondary flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
          
          {/* ========== STATS BAR ========== */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="stat-card">
              <div className="stat-label">Meciuri Live</div>
              <div className="stat-value">{matches.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Cu Filtre</div>
              <div className="stat-value text-accent-green">{matchesWithFilters}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Filtre Active</div>
              <div className="stat-value text-accent-cyan">{activeFiltersCount}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Scans</div>
              <div className="stat-value text-accent-amber">{scannerStats.totalScans}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Notificări</div>
              <div className="stat-value text-accent-purple">{scannerStats.notificationsSent}</div>
            </div>
          </div>
          
          {/* ========== SCANNER CONTROL ========== */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  {scannerEnabled ? (
                    <Zap className="w-6 h-6 text-accent-green animate-pulse" />
                  ) : (
                    <Zap className="w-6 h-6 text-text-muted" />
                  )}
                  <div>
                    <h3 className="font-display font-semibold text-lg">
                      Auto-Scanner
                      {scannerStats.isScanning && (
                        <span className="ml-2 text-sm text-accent-cyan">Scanează...</span>
                      )}
                    </h3>
                    <p className="text-sm text-text-muted">
                      {scannerEnabled ? (
                        <>
                          ✅ Activ - scanează automat la 45s
                          {scannerStats.lastScanTime && (
                            <> • Ultimul scan: {scannerStats.lastScanTime.toLocaleTimeString()}</>
                          )}
                        </>
                      ) : (
                        'Dezactivat - activează pentru notificări automate'
                      )}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Notification Status */}
                {!notificationsReady && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent-amber/10">
                    <Bell className="w-4 h-4 text-accent-amber" />
                    <span className="text-sm text-accent-amber">Permisiune necesară</span>
                  </div>
                )}
                
                {/* Scanner Toggle */}
                <button
                  onClick={handleToggleScanner}
                  className={`
                    px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2
                    ${scannerEnabled 
                      ? 'bg-accent-green/20 text-accent-green hover:bg-accent-green/30 border-2 border-accent-green' 
                      : 'bg-glass-light text-text-secondary hover:bg-glass-medium border-2 border-glass-medium'}
                  `}
                >
                  {scannerEnabled ? (
                    <>
                      <BellOff className="w-5 h-5" />
                      Oprește Scanner
                    </>
                  ) : (
                    <>
                      <Bell className="w-5 h-5" />
                      Pornește Scanner
                    </>
                  )}
                </button>
                
                {/* Settings Button */}
                <button
                  onClick={() => router.push('/dashboard/notifications')}
                  className="btn-secondary p-3"
                  title="Notification Settings"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Scanner Info */}
            {scannerEnabled && (
              <div className="mt-4 pt-4 border-t border-glass-medium">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-text-muted mb-1">Filtre monitorizate</p>
                    <p className="font-semibold text-accent-cyan">{filtersWithNotifications}</p>
                  </div>
                  <div>
                    <p className="text-text-muted mb-1">Meciuri scanate</p>
                    <p className="font-semibold">{matches.length} × {scannerStats.totalScans} = {matches.length * scannerStats.totalScans}</p>
                  </div>
                  <div>
                    <p className="text-text-muted mb-1">Success rate</p>
                    <p className="font-semibold text-accent-green">
                      {scannerStats.totalScans > 0 
                        ? ((scannerStats.notificationsSent / (scannerStats.totalScans * matches.length || 1)) * 100).toFixed(1) 
                        : '0'}%
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Warning când nu sunt filtre cu notificări */}
            {scannerEnabled && filtersWithNotifications === 0 && (
              <div className="mt-4 p-3 rounded-lg bg-accent-amber/10 border border-accent-amber/20">
                <p className="text-sm text-accent-amber flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Nu ai filtre active cu notificări! Activează notificări la filtre în secțiunea Filtre.
                </p>
              </div>
            )}
          </div>
          
          {/* ========== FILTERS ========== */}
          <div className="glass-card p-4">
            <div className="flex items-center gap-4 flex-wrap">
              <FilterIcon className="w-5 h-5 text-accent-cyan" />
              <span className="font-display font-semibold">Filtre:</span>
              
              <select
                value={selectedLeague}
                onChange={(e) => setSelectedLeague(e.target.value)}
                className="input-field max-w-xs"
              >
                <option value="all">Toate ligile ({matches.length})</option>
                {leagues.map(league => {
                  const count = matches.filter(m => m.league.name === league).length;
                  return (
                    <option key={league} value={league}>
                      {league} ({count})
                    </option>
                  );
                })}
              </select>
              
              {activeFiltersCount > 0 && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showOnlyFiltered}
                    onChange={(e) => setShowOnlyFiltered(e.target.checked)}
                    className="w-4 h-4 rounded border-glass-medium bg-glass-light accent-accent-cyan"
                  />
                  <span className="text-sm">
                    <Target className="w-4 h-4 inline mr-1 text-accent-green" />
                    Doar cu filtre ({matchesWithFilters})
                  </span>
                </label>
              )}
              
              {applyingFilters && (
                <span className="text-sm text-text-muted flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Applying filters...
                </span>
              )}
              
              <span className="text-text-muted text-sm ml-auto">
                {activeFiltersCount === 0 ? (
                  '💡 Creează filtre în secțiunea Filtre'
                ) : (
                  `✅ ${activeFiltersCount} filtre active`
                )}
              </span>
            </div>
          </div>
          
          {/* ========== LOADING ========== */}
          {loading && matches.length === 0 && (
            <div className="glass-card p-12 text-center">
              <div className="w-16 h-16 rounded-full border-4 border-accent-cyan border-t-transparent animate-spin mx-auto mb-4" />
              <p className="text-text-secondary">Se încarcă meciuri live...</p>
            </div>
          )}
          
          {/* ========== ERROR ========== */}
          {error && (
            <div className="glass-card p-6 border-l-4 border-accent-red">
              <h3 className="text-accent-red font-semibold mb-2">
                ❌ Eroare la încărcare
              </h3>
              <p className="text-text-secondary text-sm mb-3">{error}</p>
              <button onClick={handleRefresh} className="btn-primary">
                Încearcă din nou
              </button>
            </div>
          )}
          
          {/* ========== MECIURI ========== */}
          {!loading && !error && filteredMatches.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-4"
            >
              {filteredMatches.map((match, index) => (
                <motion.div
                  key={match.fixture.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <MatchCard
                    match={match}
                    onClick={() => handleMatchClick(match)}
                    showStatistics={false}
                    filterResults={filterResults.get(match.fixture.id)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
          
          {/* ========== EMPTY STATE ========== */}
          {!loading && !error && filteredMatches.length === 0 && (
            <div className="glass-card p-12 text-center">
              <Activity className="w-16 h-16 text-text-muted mx-auto mb-4" />
              <h3 className="text-xl font-display font-semibold mb-2">
                Nu sunt meciuri live în acest moment
              </h3>
              <p className="text-text-secondary mb-4">
                {matches.length > 0 
                  ? 'Niciun meci nu match-uiește filtrul selectat.'
                  : 'Încearcă din nou când sunt meciuri programate (de obicei după-amiază/seară).'}
              </p>
              <button onClick={handleRefresh} className="btn-primary">
                <RefreshCw className="w-4 h-4 inline mr-2" />
                Verifică din nou
              </button>
            </div>
          )}
          
          {/* ========== INFO ========== */}
          <div className="glass-card p-4 text-sm">
            <h4 className="font-semibold text-accent-cyan mb-2">
              💡 Cum funcționează Auto-Scanner-ul?
            </h4>
            <ul className="space-y-1 text-text-muted">
              <li>• Scanner-ul verifică meciurile la fiecare 45 secunde</li>
              <li>• Când un meci match-uiește un filtru activ → primești notificare automat!</li>
              <li>• Notificările se trimit o singură dată per meci + filtru (nu primești duplicate)</li>
              <li>• Poți activa/dezactiva notificări per filtru în secțiunea Filtre</li>
              <li>• Refresh-ul meciurilor ruleată la 30s, scanner-ul la 45s (pentru optimizare API)</li>
            </ul>
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
}
