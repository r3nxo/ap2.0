'use client';

// ============================================
// R$Q - TELEGRAM SETTINGS PAGE
// ============================================
// Connect and manage Telegram notifications

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Copy,
  ExternalLink,
  Loader2,
  MessageCircle,
} from 'lucide-react';
import AuthWrapper from '@/components/AuthWrapper';
import { authHelpers, dbHelpers } from '@/lib/supabase';
import { 
  testTelegramConnection, 
  verifyTelegramChatId,
  sendTelegramMessage,
  isTelegramConfigured,
} from '@/lib/telegram';

// ============================================
// COMPONENTA PRINCIPALĂ
// ============================================

export default function TelegramSettingsPage() {
  // ============================================
  // STATE
  // ============================================
  
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  
  const [chatId, setChatId] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [botInfo, setBotInfo] = useState<any>(null);
  const [configured, setConfigured] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // ============================================
  // LOAD DATA
  // ============================================
  
  useEffect(() => {
    loadSettings();
  }, []);
  
  const loadSettings = async () => {
    setLoading(true);
    
    try {
      // Get current user
      const currentUser = authHelpers.getCurrentUser();
      if (!currentUser) return;
      
      setUser(currentUser);
      
      // Load profile
      const userProfile = await dbHelpers.getUserProfile(currentUser.id);
      setProfile(userProfile);
      
      if (userProfile?.telegram_chat_id) {
        setChatId(userProfile.telegram_chat_id);
      }
      
      // Test Telegram connection
      const result = await testTelegramConnection();
      setConfigured(result.configured);
      setBotInfo(result.botInfo);
      
      if (!result.configured) {
        setError(result.error || 'Telegram Bot not configured');
      }
      
    } catch (err) {
      console.error('Error loading settings:', err);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };
  
  // ============================================
  // HANDLERS
  // ============================================
  
  const handleVerify = async () => {
    if (!chatId) {
      setError('Please enter your Chat ID');
      return;
    }
    
    setVerifying(true);
    setError(null);
    setSuccess(null);
    
    try {
      console.log('🔍 Verifying Chat ID:', chatId);
      
      const result = await verifyTelegramChatId(chatId);
      
      if (!result.success) {
        setError(result.error || 'Verification failed');
        return;
      }
      
      console.log('✅ Verified:', result.user);
      
      setSuccess(
        `✅ Verified! Connected to ${result.user?.first_name || 'Unknown User'}`
      );
      
    } catch (err) {
      console.error('Error verifying:', err);
      setError('Verification failed');
    } finally {
      setVerifying(false);
    }
  };
  
  const handleTestMessage = async () => {
    if (!chatId) {
      setError('Please enter and verify your Chat ID first');
      return;
    }
    
    setTesting(true);
    setError(null);
    setSuccess(null);
    
    try {
      const message = `
🎯 <b>R$Q Test Notification</b>

✅ Telegram integration is working!

You will receive notifications here when your filters match live matches.

💡 Make sure to enable Telegram notifications in your filter settings.
      `.trim();
      
      const result = await sendTelegramMessage(chatId, message, 'HTML');
      
      if (!result.success) {
        setError(result.error || 'Failed to send test message');
        return;
      }
      
      setSuccess('✅ Test message sent! Check your Telegram!');
      
    } catch (err) {
      console.error('Error sending test:', err);
      setError('Failed to send test message');
    } finally {
      setTesting(false);
    }
  };
  
  const handleSave = async () => {
    if (!user || !chatId) return;
    
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Save to Supabase
      const { error: updateError } = await dbHelpers.updateUserProfile(user.id, {
        telegram_chat_id: chatId,
        telegram_enabled: true,
        telegram_verified_at: new Date().toISOString(),
      });
      
      if (updateError) {
        setError(updateError);
        return;
      }
      
      setSuccess('✅ Telegram settings saved!');
      
      // Reload profile
      const updated = await dbHelpers.getUserProfile(user.id);
      setProfile(updated);
      
    } catch (err) {
      console.error('Error saving:', err);
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };
  
  const handleDisconnect = async () => {
    if (!user) return;
    
    if (!confirm('Are you sure you want to disconnect Telegram?')) return;
    
    setSaving(true);
    
    try {
      const { error: updateError } = await dbHelpers.updateUserProfile(user.id, {
        telegram_chat_id: null,
        telegram_enabled: false,
        telegram_verified_at: null,
      });
      
      if (updateError) {
        setError(updateError);
        return;
      }
      
      setChatId('');
      setSuccess('Telegram disconnected');
      
    } catch (err) {
      console.error('Error disconnecting:', err);
      setError('Failed to disconnect');
    } finally {
      setSaving(false);
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess('Copied to clipboard!');
    setTimeout(() => setSuccess(null), 2000);
  };
  
  // ============================================
  // RENDER
  // ============================================
  
  if (loading) {
    return (
      <AuthWrapper>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent-cyan" />
        </div>
      </AuthWrapper>
    );
  }
  
  return (
    <AuthWrapper>
      <div className="min-h-screen p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          
          {/* ========== HEADER ========== */}
          <div>
            <h1 className="text-3xl font-display font-bold gradient-text mb-2 flex items-center gap-2">
              <Send className="w-8 h-8" />
              Telegram Notifications
            </h1>
            <p className="text-text-secondary">
              Receive match alerts directly on Telegram
            </p>
          </div>
          
          {/* ========== STATUS ========== */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-semibold">Connection Status</h2>
              {configured ? (
                <div className="flex items-center gap-2 text-accent-green">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-semibold">Bot Configured</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-accent-red">
                  <XCircle className="w-5 h-5" />
                  <span className="text-sm font-semibold">Not Configured</span>
                </div>
              )}
            </div>
            
            {configured && botInfo && (
              <div className="p-4 rounded-lg bg-glass-light">
                <p className="text-sm text-text-muted mb-2">Connected Bot:</p>
                <p className="font-semibold flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-accent-cyan" />
                  @{botInfo.username}
                </p>
              </div>
            )}
            
            {!configured && (
              <div className="p-4 rounded-lg bg-accent-amber/10 border border-accent-amber/20">
                <p className="text-sm text-accent-amber">
                  ⚠️ Telegram Bot is not configured. Contact administrator.
                </p>
              </div>
            )}
          </div>
          
          {/* ========== SETUP GUIDE ========== */}
          {configured && !profile?.telegram_chat_id && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6"
            >
              <h2 className="text-xl font-display font-semibold mb-4">
                📝 Setup Guide
              </h2>
              
              <div className="space-y-4 text-sm">
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-cyan/20 text-accent-cyan flex items-center justify-center font-bold">
                    1
                  </span>
                  <div>
                    <p className="font-semibold mb-1">Start the Bot</p>
                    <p className="text-text-muted mb-2">
                      Open Telegram and start a chat with the bot:
                    </p>
                    {botInfo && (
                      <button
                        onClick={() => window.open(`https://t.me/${botInfo.username}`, '_blank')}
                        className="btn-secondary text-sm flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open @{botInfo.username}
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-cyan/20 text-accent-cyan flex items-center justify-center font-bold">
                    2
                  </span>
                  <div>
                    <p className="font-semibold mb-1">Get Your Chat ID</p>
                    <p className="text-text-muted mb-2">
                      Send <code className="px-2 py-0.5 rounded bg-glass-dark">/start</code> to the bot
                    </p>
                    <p className="text-text-muted">
                      The bot will reply with your Chat ID
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-cyan/20 text-accent-cyan flex items-center justify-center font-bold">
                    3
                  </span>
                  <div>
                    <p className="font-semibold mb-1">Enter Chat ID Below</p>
                    <p className="text-text-muted">
                      Copy your Chat ID and paste it in the form below
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* ========== CHAT ID FORM ========== */}
          {configured && (
            <div className="glass-card p-6">
              <h2 className="text-xl font-display font-semibold mb-4">
                {profile?.telegram_chat_id ? 'Telegram Connection' : 'Connect Telegram'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Telegram Chat ID
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatId}
                      onChange={(e) => setChatId(e.target.value)}
                      placeholder="Enter your Chat ID (e.g., 123456789)"
                      className="input-field flex-1"
                      disabled={!!profile?.telegram_chat_id}
                    />
                    {profile?.telegram_chat_id && (
                      <button
                        onClick={() => copyToClipboard(chatId)}
                        className="btn-secondary px-4"
                        title="Copy Chat ID"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-text-muted mt-1">
                    Get your Chat ID by messaging the bot
                  </p>
                </div>
                
                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  {!profile?.telegram_chat_id ? (
                    <>
                      <button
                        onClick={handleVerify}
                        disabled={!chatId || verifying}
                        className="btn-secondary flex items-center gap-2"
                      >
                        {verifying ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Verify
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={handleSave}
                        disabled={!chatId || saving}
                        className="btn-primary flex items-center gap-2"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Save
                          </>
                        )}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleTestMessage}
                        disabled={testing}
                        className="btn-primary flex items-center gap-2"
                      >
                        {testing ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Send Test
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={handleDisconnect}
                        className="btn-secondary text-accent-red flex items-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Disconnect
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              {/* Messages */}
              {error && (
                <div className="mt-4 p-3 rounded-lg bg-accent-red/10 border border-accent-red/20">
                  <p className="text-sm text-accent-red flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </p>
                </div>
              )}
              
              {success && (
                <div className="mt-4 p-3 rounded-lg bg-accent-green/10 border border-accent-green/20">
                  <p className="text-sm text-accent-green flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    {success}
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* ========== INFO ========== */}
          <div className="glass-card p-6">
            <h3 className="font-semibold text-accent-cyan mb-3">
              💡 How it works
            </h3>
            <ul className="space-y-2 text-sm text-text-muted">
              <li>• Connect your Telegram account once</li>
              <li>• Enable Telegram notifications on your filters</li>
              <li>• Receive instant alerts when matches meet your criteria</li>
              <li>• Works on all devices - phone, tablet, desktop</li>
              <li>• No need to keep browser open!</li>
            </ul>
          </div>
          
        </div>
      </div>
    </AuthWrapper>
  );
}
