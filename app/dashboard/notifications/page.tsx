'use client';

// ============================================
// R$Q - NOTIFICATION SETTINGS
// ============================================
// Pagină pentru gestionarea notificărilor
// Pentru începători: învață notification API, state management

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  BellOff, 
  CheckCircle, 
  AlertCircle,
  Send,
  Settings as SettingsIcon
} from 'lucide-react';
import AuthWrapper from '@/components/AuthWrapper';
import {
  checkNotificationStatus,
  requestNotificationPermission,
  sendTestNotification,
  sendMatchNotification,
} from '@/lib/notifications';

// ============================================
// COMPONENTA PRINCIPALĂ
// ============================================

export default function NotificationSettingsPage() {
  
  // ============================================
  // STATE
  // ============================================
  
  const [notificationStatus, setNotificationStatus] = useState({
    supported: false,
    permission: 'default' as NotificationPermission,
    ready: false,
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // ============================================
  // LOAD STATUS
  // ============================================
  
  useEffect(() => {
    loadNotificationStatus();
  }, []);
  
  const loadNotificationStatus = async () => {
    const status = await checkNotificationStatus();
    setNotificationStatus(status);
    
    console.log('📊 Notification status:', status);
  };
  
  // ============================================
  // HANDLERS
  // ============================================
  
  /**
   * Cere permisiune pentru notificări
   */
  const handleRequestPermission = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      const granted = await requestNotificationPermission();
      
      if (granted) {
        setMessage({ 
          type: 'success', 
          text: '✅ Permisiune acordată! Acum poți primi notificări.' 
        });
        
        // Reload status
        await loadNotificationStatus();
        
        // Trimite notificare de test automat
        setTimeout(() => {
          handleSendTest();
        }, 1000);
      } else {
        setMessage({ 
          type: 'error', 
          text: '❌ Permisiune refuzată. Verifică setările browser-ului.' 
        });
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
      setMessage({ 
        type: 'error', 
        text: '❌ Eroare la cererea permisiunii.' 
      });
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Trimite notificare de test
   */
  const handleSendTest = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      const success = await sendTestNotification();
      
      if (success) {
        setMessage({ 
          type: 'success', 
          text: '✅ Notificare de test trimisă! Verifică colțul ecranului.' 
        });
      } else {
        setMessage({ 
          type: 'error', 
          text: '❌ Nu s-a putut trimite notificarea. Verifică permisiunile.' 
        });
      }
    } catch (error) {
      console.error('Error sending test notification:', error);
      setMessage({ 
        type: 'error', 
        text: '❌ Eroare la trimiterea notificării.' 
      });
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Trimite notificare demo pentru meci
   */
  const handleSendMatchDemo = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      const success = await sendMatchNotification(
        {
          homeTeam: 'Arsenal',
          awayTeam: 'Chelsea',
          league: 'Premier League',
          minute: 67,
          matchId: 99999,
        },
        ['Cornere Over 8', 'Atacuri Intense']
      );
      
      if (success) {
        setMessage({ 
          type: 'success', 
          text: '✅ Notificare demo trimisă! Așa vor arăta alertele pentru meciuri.' 
        });
      } else {
        setMessage({ 
          type: 'error', 
          text: '❌ Nu s-a putut trimite notificarea.' 
        });
      }
    } catch (error) {
      console.error('Error sending match notification:', error);
      setMessage({ 
        type: 'error', 
        text: '❌ Eroare la trimiterea notificării.' 
      });
    } finally {
      setLoading(false);
    }
  };
  
  // ============================================
  // RENDER
  // ============================================
  
  return (
    <AuthWrapper>
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* ========== HEADER ========== */}
          <div>
            <h1 className="text-3xl font-display font-bold gradient-text mb-2">
              🔔 Notificări
            </h1>
            <p className="text-text-secondary">
              Gestionează setările pentru notificări push
            </p>
          </div>
          
          {/* ========== STATUS CARD ========== */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-display font-semibold mb-4 flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-accent-cyan" />
              Status Notificări
            </h3>
            
            <div className="space-y-4">
              {/* Browser Support */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-glass-light">
                <div className="flex items-center gap-3">
                  {notificationStatus.supported ? (
                    <CheckCircle className="w-5 h-5 text-accent-green" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-accent-red" />
                  )}
                  <div>
                    <p className="font-semibold">Browser Support</p>
                    <p className="text-sm text-text-muted">
                      {notificationStatus.supported 
                        ? 'Browser-ul tău suportă notificări' 
                        : 'Browser-ul tău NU suportă notificări'}
                    </p>
                  </div>
                </div>
                <span className={`
                  px-3 py-1 rounded-full text-xs font-semibold
                  ${notificationStatus.supported 
                    ? 'bg-accent-green/10 text-accent-green' 
                    : 'bg-accent-red/10 text-accent-red'}
                `}>
                  {notificationStatus.supported ? 'Supported' : 'Not Supported'}
                </span>
              </div>
              
              {/* Permission Status */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-glass-light">
                <div className="flex items-center gap-3">
                  {notificationStatus.permission === 'granted' ? (
                    <CheckCircle className="w-5 h-5 text-accent-green" />
                  ) : notificationStatus.permission === 'denied' ? (
                    <AlertCircle className="w-5 h-5 text-accent-red" />
                  ) : (
                    <Bell className="w-5 h-5 text-accent-amber" />
                  )}
                  <div>
                    <p className="font-semibold">Permisiune</p>
                    <p className="text-sm text-text-muted">
                      {notificationStatus.permission === 'granted' && 'Permisiune acordată'}
                      {notificationStatus.permission === 'denied' && 'Permisiune refuzată'}
                      {notificationStatus.permission === 'default' && 'Permisiune nu a fost cerută'}
                    </p>
                  </div>
                </div>
                <span className={`
                  px-3 py-1 rounded-full text-xs font-semibold
                  ${notificationStatus.permission === 'granted' 
                    ? 'bg-accent-green/10 text-accent-green' 
                    : notificationStatus.permission === 'denied'
                    ? 'bg-accent-red/10 text-accent-red'
                    : 'bg-accent-amber/10 text-accent-amber'}
                `}>
                  {notificationStatus.permission}
                </span>
              </div>
              
              {/* Overall Status */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-glass-light">
                <div className="flex items-center gap-3">
                  {notificationStatus.ready ? (
                    <CheckCircle className="w-5 h-5 text-accent-green" />
                  ) : (
                    <BellOff className="w-5 h-5 text-text-muted" />
                  )}
                  <div>
                    <p className="font-semibold">Status General</p>
                    <p className="text-sm text-text-muted">
                      {notificationStatus.ready 
                        ? 'Notificările sunt ACTIVE și funcționale' 
                        : 'Notificările NU sunt active'}
                    </p>
                  </div>
                </div>
                <span className={`
                  px-3 py-1 rounded-full text-xs font-semibold
                  ${notificationStatus.ready 
                    ? 'bg-accent-green/10 text-accent-green' 
                    : 'bg-text-muted/10 text-text-muted'}
                `}>
                  {notificationStatus.ready ? 'READY' : 'NOT READY'}
                </span>
              </div>
            </div>
          </div>
          
          {/* ========== MESSAGE ========== */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`
                p-4 rounded-xl border
                ${message.type === 'success' 
                  ? 'bg-accent-green/10 border-accent-green/20 text-accent-green' 
                  : 'bg-accent-red/10 border-accent-red/20 text-accent-red'}
              `}
            >
              <p className="text-sm">{message.text}</p>
            </motion.div>
          )}
          
          {/* ========== ACTIONS ========== */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-xl font-display font-semibold mb-4">
              ⚡ Acțiuni
            </h3>
            
            {/* Request Permission */}
            {notificationStatus.permission !== 'granted' && (
              <div className="p-4 rounded-xl bg-accent-cyan/5 border border-accent-cyan/20">
                <div className="flex items-start gap-3 mb-3">
                  <Bell className="w-5 h-5 text-accent-cyan flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold mb-1">Activează Notificările</p>
                    <p className="text-sm text-text-muted">
                      Pentru a primi alerte când meciurile match-uiesc filtrele tale, 
                      trebuie să acorzi permisiune pentru notificări.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRequestPermission}
                  disabled={loading || !notificationStatus.supported}
                  className="btn-primary w-full"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Se procesează...
                    </span>
                  ) : (
                    <>
                      <Bell className="w-5 h-5 inline mr-2" />
                      Activează Notificările
                    </>
                  )}
                </button>
              </div>
            )}
            
            {/* Test Buttons */}
            {notificationStatus.ready && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Simple Test */}
                  <button
                    onClick={handleSendTest}
                    disabled={loading}
                    className="btn-secondary p-4 text-left"
                  >
                    <div className="flex items-start gap-3">
                      <Send className="w-5 h-5 text-accent-cyan flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold mb-1">Test Simplu</p>
                        <p className="text-xs text-text-muted">
                          Trimite o notificare de test
                        </p>
                      </div>
                    </div>
                  </button>
                  
                  {/* Match Demo */}
                  <button
                    onClick={handleSendMatchDemo}
                    disabled={loading}
                    className="btn-secondary p-4 text-left"
                  >
                    <div className="flex items-start gap-3">
                      <Bell className="w-5 h-5 text-accent-green flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold mb-1">Demo Meci</p>
                        <p className="text-xs text-text-muted">
                          Simulează alertă pentru meci
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>
          
          {/* ========== INFO ========== */}
          <div className="glass-card p-4 text-sm">
            <h4 className="font-semibold text-accent-cyan mb-2">
              💡 Cum funcționează notificările?
            </h4>
            <ul className="space-y-1 text-text-muted">
              <li>• Aplicația scanează meciurile live la fiecare 45 secunde</li>
              <li>• Când un meci match-uiește filtrele tale active → primești notificare</li>
              <li>• Notificările apar în colțul ecranului (Windows: dreapta-jos, Mac: dreapta-sus)</li>
              <li>• Poți activa/dezactiva notificări per filtru în secțiunea Filtre</li>
              <li>• Notificările funcționează DOAR dacă aplicația e deschisă în browser</li>
              <li>• Pentru notificări permanente (chiar când aplicația e închisă) → upgrade la PWA full</li>
            </ul>
          </div>
          
          {/* Browser permissions help */}
          {notificationStatus.permission === 'denied' && (
            <div className="glass-card p-4 border-l-4 border-accent-amber">
              <h4 className="font-semibold text-accent-amber mb-2">
                ⚠️ Permisiune refuzată - Cum să o resetezi?
              </h4>
              <div className="text-sm text-text-muted space-y-2">
                <p><strong>Chrome/Edge:</strong></p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Click pe icon-ul 🔒 (lacăt) din stânga URL-ului</li>
                  <li>Găsește &quot;Notifications&quot; → selectează &quot;Allow&quot;</li>
                  <li>Refresh pagina (F5)</li>
                </ol>
                
                <p className="mt-3"><strong>Firefox:</strong></p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Click pe icon-ul (i) din stânga URL-ului</li>
                  <li>Permissions → Notifications → Allow</li>
                  <li>Refresh pagina (F5)</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthWrapper>
  );
}
