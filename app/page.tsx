'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Activity, Zap, Bell, Filter } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: Activity,
      title: 'Live Scanning',
      description: 'Scanare meciuri la fiecare 45 de secunde',
      color: 'cyan',
    },
    {
      icon: Filter,
      title: 'Filtre Personalizate',
      description: '100+ condiții de filtrare disponibile',
      color: 'amber',
    },
    {
      icon: Bell,
      title: 'Notificări Instant',
      description: 'Push + Telegram în timp real',
      color: 'green',
    },
    {
      icon: Zap,
      title: 'Lightspeed',
      description: 'Optimizat pentru performanță maximă',
      color: 'cyan',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-cyan/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-amber/5 rounded-full blur-3xl animate-pulse-slow animation-delay-200" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl w-full space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-card mb-4">
            <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
            <span className="text-sm font-display text-accent-cyan">PAS 1 - Setup Complete</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-display font-bold">
            <span className="gradient-text">R$Q</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-text-secondary max-w-2xl mx-auto">
            Football scanner PWA cu filtrare inteligentă și notificări în timp real
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                className="glass-card-hover p-6 space-y-3"
              >
                <div className={`w-12 h-12 rounded-xl bg-accent-${feature.color}/10 flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 text-accent-${feature.color}`} />
                </div>
                <h3 className="text-xl font-display font-semibold">{feature.title}</h3>
                <p className="text-text-secondary">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="glass-card p-8"
        >
          <div className="grid grid-cols-3 gap-6">
            <div className="stat-card">
              <div className="stat-label">Scanare</div>
              <div className="stat-value">45s</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Filtre</div>
              <div className="stat-value">100+</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Users</div>
              <div className="stat-value">2</div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/login" className="btn-primary">
            Începe Scanarea
          </Link>
          <Link href="/dashboard" className="btn-secondary">
            Dashboard
          </Link>
        </motion.div>

        {/* PWA Install Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="text-center text-text-muted text-sm"
        >
          <p>📱 Instalează aplicația pe iPhone pentru experiență completă</p>
        </motion.div>
      </div>
    </div>
  );
}