'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Zap, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-6">
      <div className="absolute inset-0 bg-cyan-500/5 blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center space-y-8"
      >
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Zap className="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter">
          R$Q <span className="text-cyan-500">LIVE</span>
        </h1>
        
        <p className="text-gray-400 text-xl max-w-md mx-auto">
          Sistem privat de scanare fotbalistică. <br/> Acces restricționat 2026.
        </p>

        <div className="flex flex-col gap-4 max-w-xs mx-auto">
          <Link href="/login" className="py-4 px-8 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2">
            LOGARE SISTEM <ArrowRight size={20} />
          </Link>
          <p className="text-xs text-gray-600">© Toate drepturile rezervate R$Q Scanner</p>
        </div>
      </motion.div>
    </div>
  );
}
