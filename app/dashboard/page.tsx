'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Activity,
  TrendingUp,
  Bell,
  Filter as FilterIcon,
  Zap,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import AuthWrapper from '@/components/AuthWrapper';
import { authHelpers, dbHelpers } from '@/lib/supabase';
import type { Filter } from '@/lib/supabase';
import { getLiveMatches, type LiveMatch } from '@/lib/unified-api';

export default function DashboardPage() {
  const router = useRouter();
  
  // ============================================
  // STATE
  // ============================================
  const [user, setUser] = useState<any>(null);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [liveMatches, setLiveMatches] = useState<LiveMatch[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({
    totalFilters: 0,
    activeFilters: 0,
    withNotifications: 0,
    liveMatches: 0,
    todayTriggers: 0,
    successRate: 0,
  });

  // ============================================
  // LOAD DATA (Optimizat cu useCallback)
  // ============================================
  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const currentUser = authHelpers.getCurrentUser();
      if (!currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);
      
      // Încarcă filtrele din Supabase
      const userFilters = await dbHelpers.getUserFilters(currentUser.id);
      setFilters(userFilters);
      
      // Încarcă meciurile Live
      let matches: LiveMatch[] = [];
      try {
        matches = await getLiveMatches();
        setLiveMatches(matches);
      } catch (err) {
        console.error('Error loading matches:', err);
      }
      
      // Calculează statistici reale
      const activeFilters = userFilters.filter(f => f.is_active);
      const withNotifications = userFilters.filter(f => f.is_active && f.notification_enabled);
      const totalTriggers = userFilters.reduce((sum, f) => sum + (f.trigger_count || 0), 0);
      const avgSuccessRate = userFilters.length > 0
        ? userFilters.reduce((sum, f) => sum + (f.success_rate || 0), 0) / userFilters.length
        : 0;
      
      setStats({
        totalFilters: userFilters.length,
        activeFilters: activeFilters.length,
        withNotifications: withNotifications.length,
        liveMatches: matches.length,
        todayTriggers: totalTriggers,
        successRate: avgSuccessRate,
      });
      
    } catch (err) {
      console.error('❌ Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // ============================================
  // HELPERS
  // ============================================
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bună dimineața';
    if (hour < 18) return 'Bună ziua';
    return 'Bună seara';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-4 border-accent-cyan border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-text-secondary font-display">Sincronizare R$Q LIVE...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-primary p-6 text-text-primary">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* HEADER */}
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold gradient-text mb-2">
                {getGreeting()}, {user?.full_name || user?.username || 'User'}! 👋
              </h1>
              <p className="text-text-secondary">Centrul de comandă este operațional.</p>
            </div>
            <div className="hidden md:block text-right">
              <div className="text-xs text-text-muted uppercase tracking-widest mb-1">Status Server</div>
              <div className="flex items-center gap-2 text-accent-green font-bold">
                <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
                SISTEM ACTIV 2026
              </div>
            </div>
          </div>
          
          {/* STATS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Live Matches Card */}
            <motion.div
              whileHover={{ y: -5 }}
              onClick={() => router.push('/dashboard/live')}
              className="glass-card-hover p-6 cursor-pointer border-l-4 border-l-accent-green"
            >
              <div className="flex justify-between mb-4">
                <div className="p-3 rounded-xl bg-accent-green/10 text-accent-green">
                  <Activity size={24} />
                </div>
                <span className="status-live">LIVE</span>
              </div>
              <div className="stat-value">{stats.liveMatches}</div>
              <div className="stat-label">Meciuri în Scanare</div>
            </motion.div>

            {/* Active Filters Card */}
            <motion.div
              whileHover={{ y: -5 }}
              onClick={() => router.push('/dashboard/filters')}
              className="glass-card-hover p-6 cursor-pointer border-l-4 border-l-accent-cyan"
            >
              <div className="flex justify-between mb-4">
                <div className="p-3 rounded-xl bg-accent-cyan/10 text-accent-cyan">
                  <FilterIcon size={24} />
                </div>
                <Zap size={18} className="text-accent-amber" />
              </div>
              <div className="stat-value">{stats.activeFilters}</div>
              <div className="stat-label">Filtre Active</div>
            </motion.div>

            {/* Success Rate Card */}
            <motion.div
              whileHover={{ y: -5 }}
              className="glass-card-hover p-6 border-l-4 border-l-accent-amber"
            >
              <div className="flex justify-between mb-4">
                <div className="p-3 rounded-xl bg-accent-amber/10 text-accent-amber">
                  <TrendingUp size={24} />
                </div>
                <CheckCircle size={18} className="text-accent-green" />
              </div>
              <div className="stat-value">{Math.round(stats.successRate)}%</div>
              <div className="stat-label">Rată de Succes</div>
            </motion.div>

            {/* Alerts Card */}
            <motion.div
              whileHover={{ y: -5 }}
              onClick={() => router.push('/dashboard/notifications')}
              className="glass-card-hover p-6 cursor-pointer border-l-4 border-l-accent-red"
            >
              <div className="flex justify-between mb-4">
                <div className="p-3 rounded-xl bg-accent-red/10 text-accent-red">
                  <Bell size={24} />
                </div>
                <AlertCircle size={18} className="text-text-muted" />
              </div>
              <div className="stat-value">{stats.withNotifications}</div>
              <div className="stat-label">Alerte Telegram</div>
            </motion.div>

          </div>

          {/* QUICK ACTIONS / INFO */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-card p-8">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Zap className="text-accent-cyan" size={20} /> Activitate Recentă
              </h3>
              <div className="space-y-4">
                {liveMatches.length > 0 ? (
                   <p className="text-text-secondary italic text-sm text-center py-10">Meciurile live sunt procesate în fundal...</p>
                ) : (
                  <div className="text-center py-10 border border-dashed border-white/10 rounded-xl">
                    <p className="text-text-muted">Niciun trigger detectat în ultimele 60 secunde.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="glass-card p-8 bg-gradient-to-br from-accent-cyan/5 to-transparent">
              <h3 className="text-xl font-bold mb-4">Quick Setup</h3>
              <p className="text-sm text-text-secondary mb-6">Configurează un filtru nou pentru a primi notificări instant.</p>
              <button 
                onClick={() => router.push('/dashboard/filters/new')}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                Creează Filtru Nou
              </button>
            </div>
          </div>

        </div>
      </div>
    </AuthWrapper>
  );
}
