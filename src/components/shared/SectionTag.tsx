'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface SectionTagProps {
  text: string;
  variant?: 'light' | 'dark';
  className?: string;
}

export default function SectionTag({ text, variant = 'light', className }: SectionTagProps) {
  const isLight = variant === 'light';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className={cn('flex items-center gap-4 mb-8 group', className)}
    >
      {/* Glass container */}
      <div className={cn(
        'inline-flex items-center gap-4 px-6 py-3 rounded-2xl border backdrop-blur-[100px] transition-all duration-500',
        isLight 
          ? 'bg-gradient-to-r from-white/8 via-white/4 to-white/2 border-indigo-300/40 hover:border-indigo-400/60 shadow-[inset_0_2px_2px_rgba(255,255,255,0.4),0_8px_24px_rgba(99,102,241,0.05)]'
          : 'bg-gradient-to-r from-white/6 via-white/3 to-white/1 border-indigo-300/30 hover:border-indigo-400/50 shadow-[inset_0_2px_2px_rgba(255,255,255,0.3),0_8px_24px_rgba(99,102,241,0.04)]'
      )}>
        <span className="relative w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform">
          <span className="absolute inset-0 rounded-md bg-gradient-to-br from-indigo-400 to-indigo-600 animate-ping opacity-40" />
          <span className="relative block w-4 h-4 rounded-md bg-gradient-to-br from-indigo-400 to-indigo-600" />
        </span>
        <span
          className={cn(
            'text-sm md:text-base font-mono uppercase tracking-[0.2em] font-bold text-transparent bg-clip-text',
            isLight 
              ? 'bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400' 
              : 'bg-gradient-to-r from-indigo-300 via-violet-300 to-purple-300'
          )}
        >
          {text}
        </span>
        <span
          className={cn(
            'h-1 flex-grow max-w-[80px] rounded-full bg-gradient-to-r',
            isLight ? 'from-indigo-400/60 to-transparent' : 'from-indigo-300/50 to-transparent'
          )}
        />
      </div>
    </motion.div>
  );
}
