import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface GamificationHeaderProps {
  level: number;
  xp: number;
  xpToNextLevel: number;
}

const GamificationHeader: React.FC<GamificationHeaderProps> = ({ level, xp, xpToNextLevel }) => {
  const progressPercent = (xp / xpToNextLevel) * 100;

  return (
    // Updated background for distinct light/dark modes
    <div className="p-6 rounded-xl mb-6 shadow-lg 
                    bg-gradient-to-br from-blue-50 to-white border border-blue-100
                    dark:from-[#1d2b3a] dark:to-[#2c3e50] dark:border-black/20">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
        {/* Left side: Level and Title */}
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ scale: 0.5, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.2 }}
            className="relative w-20 h-20"
          >
             {/* Glow effect with light/dark variants */}
             <div className="absolute inset-0 rounded-full blur-xl 
                           bg-blue-300 opacity-40 
                           dark:bg-dark-gold dark:opacity-40"></div>
             {/* Main circle with light/dark variants */}
             <div className="relative w-full h-full rounded-full flex flex-col items-center justify-center shadow-inner-strong
                           bg-white/50 border-2 border-white/80 text-blue-800
                           dark:bg-black/50 dark:border-2 dark:border-black/30 dark:text-dark-gold">
                <span className="text-xs font-bold leading-none tracking-widest 
                               text-blue-600/80
                               dark:text-dark-gold/80">LEVEL</span>
                <span className="text-4xl font-black leading-tight tracking-tighter
                               text-slate-800
                               dark:text-white">{level}</span>
            </div>
          </motion.div>
          <div>
            {/* Title text with light/dark variants */}
            <h2 className="text-2xl font-bold 
                         text-slate-800 
                         dark:text-white">Your Discipline Level</h2>
            <p className="text-gray-500
                         dark:text-gray-400">Complete tasks to level up your skills!</p>
          </div>
        </div>

        {/* Right side: XP Bar */}
        <div className="w-full sm:w-1/2 lg:w-1/3">
          <div className="flex justify-between items-center text-sm mb-1 font-semibold">
            {/* XP text with light/dark variants */}
            <span className="flex items-center gap-1
                           text-blue-600
                           dark:text-dark-gold">
              <Star size={16} className="fill-current"/>
              {xp} / {xpToNextLevel} XP
            </span>
            {/* "Next Level" text with light/dark variants */}
            <span className="text-gray-500
                           dark:text-gray-400">Next Level</span>
          </div>
          {/* Progress bar background with light/dark variants */}
          <div className="w-full rounded-full h-3 overflow-hidden shadow-inner border
                        bg-blue-100 border-blue-200/50
                        dark:bg-black/30 dark:border-gray-900/50">
            {/* Progress bar fill with light/dark variants */}
            <motion.div
              className="h-full rounded-full
                        bg-blue-500
                        dark:bg-dark-gold"
              initial={{ width: '0%' }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamificationHeader;