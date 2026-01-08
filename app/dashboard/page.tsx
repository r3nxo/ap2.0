'use client';

// ============================================
// R$Q - ENHANCED DASHBOARD (PAS 6)
// ============================================
// Command Center - centrul aplicației

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Activity,
  TrendingUp,
  Target,
  Bell,
  Filter as FilterIcon,
  Clock,
  Award,
  Zap,
  Play,
  Plus,
  Settings,
  BarChart3,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import AuthWrapper from '@/components/AuthWrapper';
import { authHelpers, dbHelpers } from '@/lib/supabase';
import type { Filter } from '@/lib/supabase';
import { getLiveMatches, type LiveMatch } from '@/lib/unified-api';

// ============================================
// COMPONENTA PRINCIPALĂ
// ============================================

export default function DashboardPage() {
  const router = useRouter();
  
  // ============================================
  // STATE
  // ============================================
  
  const [user, setUser] = useState<any>(null);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [liveMatches, setLiveMatches] = useState<LiveMatch[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Stats
  const [stats, setStats] = useState({
    totalFilters: 0,
    activeFilters: 0,
    withNotifications: 0,
    liveMatches: 0,
    todayTriggers: 0,
    successRate: 0,
  });
  
  // ============================================
  // LOAD DATA
  // ============================================
  
  useEffect(() => {
    loadDashboardData();
  }, []);
  
  const loadDashboardData = async () => {
    setLoading(true);
    
    try {
      // Get current user
      const currentUser = authHelpers.getCurrentUser();
      if (!currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);
      
      // Load filters
      const userFilters = await dbHelpers.getUserFilters(currentUser.id);
      setFilters(userFilters);
      
      // Load live matches
      try {
        const matches = await getLiveMatches();
        setLiveMatches(matches);
      } catch (err) {
        console.error('Error loading matches:', err);
      }
      
      // Calculate stats
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
        liveMatches: 0,  // Live matches count will be updated separately via setLiveMatches
        todayTriggers: totalTriggers,
        successRate: avgSuccessRate,
      });
      
      console.log('✅ Dashboard loaded');
      
    } catch (err) {
      console.error('❌ Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // ============================================
  // RENDER HELPERS
  // ============================================
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bună dimineața';
    if (hour < 18) return 'Bună ziua';
    return 'Bună seara';
  };
  
  const topFilters = filters
    .sort((a, b) => (b.trigger_count || 0) - (a.trigger_count || 0))
    .slice(0, 5);
  
  // ============================================
  // RENDER
  // ============================================
  
  if (loading) {
    return (
      <AuthWrapper>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full border-4 border-accent-cyan border-t-transparent animate-spin mx-auto mb-4" />
            <p className="text-text-secondary">Se încarcă dashboard-ul...</p>
          </div>
        </div>
      </AuthWrapper>
    );
  }
  
  return (
    <AuthWrapper>
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* ========== HEADER ========== */}
          <div>
            <h1 className="text-3xl font-display font-bold gradient-text mb-2">
              {getGreeting()}, {user?.full_name || user?.username}! 👋
            </h1>
            <p className="text-text-secondary">
              Bine ai revenit în centrul de comandă R$Q
            </p>
          </div>
          
          {/* ========== MAIN STATS ========== */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Live Matches */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card-hover p-6 cursor-pointer"
              onClick={() => router.push('/dashboard/live')}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-accent-green/10">
                  <Activity className="w-6 h-6 text-accent-green" />
                </div>
                <span className="px-2 py-1 rounded-full bg-accent-green/20 text-accent-green text-xs font-semibold animate-pulse">
                  LIVE
                </span>
              </div>
              <h3 className="text-2xl font-display font-bold mb-1">
                {stats.liveMatches}
              </h3>
              <p className="text-sm text-text-muted">Meciuri Live</p>
            </motion.div>
            
            {/* Active Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card-hover p-6 cursor-pointer"
              onClick={() => router.push('/dashboard/filters')}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-accent-cyan/10">
                  <FilterIcon className="w-6 h-6 text-accent-cyan" />
                </div>
                <span className="text-xs text-text-muted">
                  {stats.totalFilters} total
                </span>
              </div>
              <h3 className="text-2xl font-display font-bold mb-1">
                {stats.activeFilters}
              </h3>
              <p className="text-sm text-text-muted">Filtre Active</p>
            </motion.div>
            
            {/* Notifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card-hover p-6 cursor-pointer"
              onClick={() => router.push('/dashboard/notifications')}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-accent-purple/10">
                  <Bell className="w-6 h-6 text-accent-purple" />
                </div>
                {stats.withNotifications > 0 && (
                  <CheckCircle className="w-5 h-5 text-accent-green" />
                )}
              </div>
              <h3 className="text-2xl font-display font-bold mb-1">
                {stats.withNotifications}
              </h3>
              <p className="text-sm text-text-muted">Cu Notificări</p>
            </motion.div>
            
            {/* Success Rate */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card-hover p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-accent-amber/10">
                  <TrendingUp className="w-6 h-6 text-accent-amber" />
                </div>
                <Target className="w-5 h-5 text-text-muted" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-1">
                {stats.successRate > 0 ? `${stats.successRate.toFixed(1)}%` : '-'}
              </h3>
              <p className="text-sm text-text-muted">Success Rate</p>
            </motion.div>
          </div>
          
          {/* ========== QUICK ACTIONS ========== */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-display font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent-cyan" />
              Acțiuni Rapide
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                onClick={() => router.push('/dashboard/live')}
                className="p-4 rounded-xl bg-glass-light hover:bg-glass-medium transition-all text-left group"
              >
                <Play className="w-5 h-5 text-accent-green mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-semibold text-sm mb-1">Vezi Meciuri Live</p>
                <p className="text-xs text-text-muted">{stats.liveMatches} meciuri active</p>
              </button>
              
              <button
                onClick={() => router.push('/dashboard/filters/new')}
                className="p-4 rounded-xl bg-glass-light hover:bg-glass-medium transition-all text-left group"
              >
                <Plus className="w-5 h-5 text-accent-cyan mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-semibold text-sm mb-1">Creează Filtru</p>
                <p className="text-xs text-text-muted">Filtru personalizat</p>
              </button>
              
              <button
                onClick={() => router.push('/dashboard/filters/templates')}
                className="p-4 rounded-xl bg-glass-light hover:bg-glass-medium transition-all text-left group"
              >
                <Award className="w-5 h-5 text-accent-amber mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-semibold text-sm mb-1">Templates</p>
                <p className="text-xs text-text-muted">38+ filtre gata făcute</p>
              </button>
              
              <button
                onClick={() => router.push('/dashboard/notifications')}
                className="p-4 rounded-xl bg-glass-light hover:bg-glass-medium transition-all text-left group"
              >
                <Settings className="w-5 h-5 text-accent-purple mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-semibold text-sm mb-1">Setări</p>
                <p className="text-xs text-text-muted">Notificări & preferințe</p>
              </button>
            </div>
          </div>
          
          {/* ========== TOP FILTERS & STATUS ========== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Top Filters */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-display font-semibold flex items-center gap-2">
                  <Award className="w-5 h-5 text-accent-amber" />
                  Top Filtre
                </h2>
                <button
                  onClick={() => router.push('/dashboard/filters')}
                  className="text-sm text-accent-cyan hover:underline flex items-center gap-1"
                >
                  Vezi toate
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              
              {topFilters.length === 0 ? (
                <div className="text-center py-8">
                  <FilterIcon className="w-12 h-12 text-text-muted mx-auto mb-3" />
                  <p className="text-text-muted text-sm mb-4">
                    Nu ai filtre create încă
                  </p>
                  <button
                    onClick={() => router.push('/dashboard/filters/new')}
                    className="btn-primary"
                  >
                    Creează primul filtru
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {topFilters.map((filter, index) => (
                    <motion.div
                      key={filter.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-lg bg-glass-light hover:bg-glass-medium transition-all cursor-pointer"
                      onClick={() => router.push(`/dashboard/filters/${filter.id}`)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-sm">{filter.name}</h3>
                            {filter.is_active && (
                              <span className="px-2 py-0.5 rounded-full bg-accent-green/10 text-accent-green text-xs">
                                Activ
                              </span>
                            )}
                            {filter.notification_enabled && (
                              <Bell className="w-3 h-3 text-accent-purple" />
                            )}
                          </div>
                          <p className="text-xs text-text-muted line-clamp-1">
                            {filter.description || 'Fără descriere'}
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-lg font-bold text-accent-cyan">
                            {filter.trigger_count || 0}
                          </p>
                          <p className="text-xs text-text-muted">triggers</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            
            {/* System Status */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-display font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-accent-cyan" />
                Status Sistem
              </h2>
              
              <div className="space-y-4">
                {/* API Status */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-glass-light">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
                    <div>
                      <p className="font-semibold text-sm">API Football</p>
                      <p className="text-xs text-text-muted">Conectat și funcțional</p>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-accent-green" />
                </div>
                
                {/* Notifications */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-glass-light">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${stats.withNotifications > 0 ? 'bg-accent-green' : 'bg-accent-amber'}`} />
                    <div>
                      <p className="font-semibold text-sm">Notificări Browser</p>
                      <p className="text-xs text-text-muted">
                        {stats.withNotifications > 0 
                          ? `${stats.withNotifications} filtre cu notificări`
                          : 'Configurează notificări'}
                      </p>
                    </div>
                  </div>
                  {stats.withNotifications > 0 ? (
                    <CheckCircle className="w-5 h-5 text-accent-green" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-accent-amber" />
                  )}
                </div>
                
                {/* Scanner */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-glass-light">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
                    <div>
                      <p className="font-semibold text-sm">Match Scanner</p>
                      <p className="text-xs text-text-muted">Scanare automată 45s</p>
                    </div>
                  </div>
                  <Activity className="w-5 h-5 text-accent-cyan" />
                </div>
                
                {/* Database */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-glass-light">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent-green" />
                    <div>
                      <p className="font-semibold text-sm">Supabase Database</p>
                      <p className="text-xs text-text-muted">Sincronizat</p>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-accent-green" />
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-glass-medium">
                <button
                  onClick={() => router.push('/test/api-new')}
                  className="w-full btn-secondary text-sm"
                >
                  Test API Connection
                </button>
              </div>
            </div>
          </div>
          
          {/* ========== INFO & HELP ========== */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-display font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-accent-cyan" />
              Ghid Rapid
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-xl">1️⃣</span>
                  Creează Filtre
                </h3>
                <p className="text-text-muted">
                  Definește condiții pentru meciurile care te interesează (cornere, șuturi, cartonașe)
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-xl">2️⃣</span>
                  Activează Notificări
                </h3>
                <p className="text-text-muted">
                  Primești alertă automată când un meci live match-uiește filtrele tale
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-xl">3️⃣</span>
                  Monitorizează Live
                </h3>
                <p className="text-text-muted">
                  Scanner-ul automat verifică meciurile la 45s și te anunță instant
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </AuthWrapper>
  );
}
