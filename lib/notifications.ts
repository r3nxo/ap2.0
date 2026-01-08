// ============================================
// R$Q - NOTIFICATION HELPERS
// ============================================
// Funcții pentru browser push notifications
// Pentru începători: învață Notification API, Service Workers

// ============================================
// TYPES
// ============================================

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
}

// ============================================
// PERMISSION MANAGEMENT
// ============================================

/**
 * Verifică dacă browser-ul suportă notificări
 */
export function isNotificationSupported(): boolean {
  return 'Notification' in window && 'serviceWorker' in navigator;
}

/**
 * Obține status-ul permisiunii pentru notificări
 * 
 * @returns 'granted' | 'denied' | 'default'
 * 
 * EXPLICAȚIE:
 * - granted = utilizatorul a dat permisiune
 * - denied = utilizatorul a refuzat
 * - default = încă nu a fost întrebat
 */
export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) {
    return 'denied';
  }
  
  return Notification.permission;
}

/**
 * Cere permisiune pentru notificări
 * 
 * @returns Promise<boolean> - true dacă s-a dat permisiune
 * 
 * EXPLICAȚIE:
 * Afișează un popup browser cu "Allow" sau "Block"
 * User-ul decide dacă vrea notificări
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNotificationSupported()) {
    console.warn('❌ Notifications not supported in this browser');
    return false;
  }
  
  // Dacă deja avem permisiune, returnăm true
  if (Notification.permission === 'granted') {
    console.log('✅ Notification permission already granted');
    return true;
  }
  
  // Dacă a fost refuzat, nu mai putem cere din nou
  if (Notification.permission === 'denied') {
    console.warn('❌ Notification permission denied by user');
    return false;
  }
  
  try {
    // Cerem permisiune
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('✅ Notification permission granted!');
      return true;
    } else {
      console.warn('❌ Notification permission denied');
      return false;
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
}

// ============================================
// SEND NOTIFICATIONS
// ============================================

/**
 * Trimite o notificare browser
 * 
 * @param payload - Datele notificării
 * @returns Promise<boolean> - true dacă s-a trimis cu succes
 * 
 * EXPLICAȚIE:
 * Creează o notificare care apare în colțul ecranului
 * Pe Windows: colț dreapta-jos
 * Pe Mac: colț dreapta-sus
 */
export async function sendNotification(
  payload: NotificationPayload
): Promise<boolean> {
  
  // Verificări
  if (!isNotificationSupported()) {
    console.warn('Notifications not supported');
    return false;
  }
  
  if (Notification.permission !== 'granted') {
    console.warn('Notification permission not granted');
    return false;
  }
  
  try {
    // Verifică dacă avem service worker
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      // Trimite prin service worker (mai bun pentru PWA)
      const registration = await navigator.serviceWorker.ready;
      
      await registration.showNotification(payload.title, {
        body: payload.body,
        icon: payload.icon || '/icons/icon-192x192.svg',
        badge: payload.badge || '/icons/icon-72x72.svg',
        tag: payload.tag || 'rsq-notification',
        data: payload.data,
        requireInteraction: true, // Notificarea rămâne până user-ul dă click
        vibrate: [200, 100, 200], // Vibrație pe mobile
      } as any);
      
      console.log('✅ Notification sent via Service Worker');
    } else {
      // Fallback: trimite direct (pentru testing în development)
      new Notification(payload.title, {
        body: payload.body,
        icon: payload.icon || '/icons/icon-192x192.svg',
        tag: payload.tag || 'rsq-notification',
        data: payload.data,
      });
      
      console.log('✅ Notification sent directly');
    }
    
    return true;
    
  } catch (error) {
    console.error('Error sending notification:', error);
    return false;
  }
}

// ============================================
// MATCH NOTIFICATION HELPERS
// ============================================

/**
 * Trimite notificare pentru un meci care match-uiește filtre
 * 
 * @param matchInfo - Info despre meci
 * @param filterNames - Numele filtrelor matched
 */
export async function sendMatchNotification(
  matchInfo: {
    homeTeam: string;
    awayTeam: string;
    league: string;
    minute?: number;
    matchId: number;
  },
  filterNames: string[]
): Promise<boolean> {
  
  const title = `🎯 R$Q Alert - Match Found!`;
  const body = 
    `⚽ ${matchInfo.homeTeam} vs ${matchInfo.awayTeam}\n` +
    `📊 ${matchInfo.league}\n` +
    `🎯 Filters: ${filterNames.join(', ')}` +
    (matchInfo.minute ? `\n⏱️ ${matchInfo.minute}'` : '');
  
  return await sendNotification({
    title,
    body,
    tag: `match-${matchInfo.matchId}`, // Tag unic per meci (evită duplicate)
    data: {
      type: 'match',
      matchId: matchInfo.matchId,
      filters: filterNames,
    },
  });
}

/**
 * Trimite notificare de test
 */
export async function sendTestNotification(): Promise<boolean> {
  return await sendNotification({
    title: '🎯 R$Q Test Notification',
    body: 'Notifications are working! You will receive alerts when matches match your filters.',
    tag: 'test-notification',
  });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Verifică dacă notificările sunt permise și funcționale
 */
export async function checkNotificationStatus(): Promise<{
  supported: boolean;
  permission: NotificationPermission;
  ready: boolean;
}> {
  const supported = isNotificationSupported();
  const permission = supported ? getNotificationPermission() : 'denied';
  const ready = supported && permission === 'granted';
  
  return {
    supported,
    permission,
    ready,
  };
}

// ============================================
// EXPORT
// ============================================

export default {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  sendNotification,
  sendMatchNotification,
  sendTestNotification,
  checkNotificationStatus,
};

// ============================================
// USAGE EXAMPLES
// ============================================

/*
import { 
  requestNotificationPermission, 
  sendMatchNotification,
  sendTestNotification 
} from '@/lib/notifications';

// 1. Cere permisiune la început
const hasPermission = await requestNotificationPermission();

if (hasPermission) {
  // 2. Trimite notificare de test
  await sendTestNotification();
  
  // 3. Trimite notificare pentru meci
  await sendMatchNotification(
    {
      homeTeam: 'Arsenal',
      awayTeam: 'Chelsea',
      league: 'Premier League',
      minute: 67,
      matchId: 12345,
    },
    ['Cornere Over 8', 'Atacuri Intense']
  );
}
*/
