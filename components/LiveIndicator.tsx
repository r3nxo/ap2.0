// ============================================
// R$Q - LIVE INDICATOR COMPONENT
// ============================================
// Un indicator animat care arată că meciul e LIVE
// Pentru începători: învață despre animations, CSS classes

import { motion } from 'framer-motion'; // Bibliotecă pentru animații smooth

// ============================================
// COMPONENTA
// ============================================

/**
 * LiveIndicator - Afișează un dot roșu pulsing + text "LIVE"
 * 
 * Props:
 * @param minute - Minutul curent al meciului (opțional)
 * @param className - CSS classes extra (opțional)
 * 
 * Usage:
 * <LiveIndicator minute={67} />
 * <LiveIndicator /> // fără minut
 */
interface LiveIndicatorProps {
  minute?: number | null;     // Minutul curent (ex: 67)
  className?: string;          // CSS classes extra
}

export default function LiveIndicator({ minute, className = '' }: LiveIndicatorProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Dot roșu animat */}
      <div className="relative flex items-center justify-center">
        {/* Outer pulse (cerculețul mare care pulsează) */}
        <motion.div
          className="absolute w-3 h-3 rounded-full bg-accent-red"
          animate={{
            scale: [1, 1.5, 1],           // Mărește și micșorează
            opacity: [0.7, 0, 0.7],       // Fade in/out
          }}
          transition={{
            duration: 2,                   // 2 secunde per ciclu
            repeat: Infinity,              // Repetă la infinit
            ease: "easeInOut",             // Animație smooth
          }}
        />
        
        {/* Inner dot (cerculețul mic fix) */}
        <div className="relative w-2 h-2 rounded-full bg-accent-red" />
      </div>
      
      {/* Text "LIVE" */}
      <span className="text-accent-red font-display font-bold text-sm tracking-wider">
        LIVE
      </span>
      
      {/* Minutul (dacă există) */}
      {minute !== null && minute !== undefined && (
        <span className="text-text-muted text-sm">
          {minute}&apos;
        </span>
      )}
    </div>
  );
}

// ============================================
// EXPORT COMPONENT
// ============================================

// USAGE EXAMPLES:
/*
import LiveIndicator from '@/components/LiveIndicator';

// Cu minut
<LiveIndicator minute={67} />

// Fără minut
<LiveIndicator />

// Cu className custom
<LiveIndicator minute={45} className="ml-4" />
*/
