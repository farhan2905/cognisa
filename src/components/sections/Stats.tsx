'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { CinematicContainer, CinematicFragment } from '@/components/shared/animations/CinematicReveal';
import RadarScanner from '@/components/shared/RadarScanner';

const stats = [
  {
    value: 200,
    suffix: '+',
    label: 'Projects Delivered',
    type: 'bars' as const,
    bars: [40, 55, 45, 70, 85],
  },
  {
    value: 50,
    suffix: '+',
    label: 'Happy Clients',
    type: 'dots' as const,
    dots: 12,
  },
  {
    value: 98,
    suffix: '%',
    label: 'Client Satisfaction',
    type: 'ring' as const,
  },
  {
    value: 5,
    suffix: '+',
    label: 'Years Experience',
    type: 'ticks' as const,
    ticks: 5,
  },
];

function AnimatedCounter({ value, suffix, inView }: { value: number; suffix: string; inView: boolean }) {
  const [displayValue, setDisplayValue] = useState(0);
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest));

  useEffect(() => {
    if (inView) {
      const controls = animate(motionValue, value, { duration: 2, ease: [0.22, 1, 0.36, 1] });
      return controls.stop;
    }
  }, [inView, motionValue, value]);

  useEffect(() => {
    const unsubscribe = rounded.on('change', (latest) => { setDisplayValue(latest); });
    return unsubscribe;
  }, [rounded]);

  return (
    <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tabular-nums">
      {displayValue}
      <span className="text-indigo-500">{suffix}</span>
    </span>
  );
}

function MicroChart({ type, bars, dots, ticks, inView }: {
  type: 'bars' | 'dots' | 'ring' | 'ticks';
  bars?: number[];
  dots?: number;
  ticks?: number;
  inView: boolean;
}) {
  if (type === 'bars' && bars) {
    return (
      <div className="flex items-end gap-1 h-12 mt-4">
        {bars.map((h, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-t-sm bg-gradient-to-t from-indigo-500/20 to-indigo-400/40"
            initial={{ height: 0 }}
            animate={inView ? { height: `${h}%` } : {}}
            transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
      </div>
    );
  }

  if (type === 'dots' && dots) {
    return (
      <div className="flex flex-wrap gap-1.5 mt-4 justify-center">
        {Array.from({ length: dots }).map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-indigo-400/40"
            initial={{ opacity: 0, scale: 0 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
      </div>
    );
  }

  if (type === 'ring') {
    return (
      <div className="relative w-16 h-16 mx-auto mt-2">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(99,102,241,0.1)" strokeWidth="2" />
          <motion.circle
            cx="18"
            cy="18"
            r="15.9"
            fill="none"
            stroke="#6366f1"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="100"
            initial={{ strokeDashoffset: 100 }}
            animate={inView ? { strokeDashoffset: 2 } : {}}
            transition={{ duration: 2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-mono font-bold text-indigo-500">
          98%
        </span>
      </div>
    );
  }

  if (type === 'ticks' && ticks) {
    return (
      <div className="flex items-center gap-2 mt-4 justify-center">
        {Array.from({ length: ticks }).map((_, i) => (
          <motion.div
            key={i}
            className="w-1 h-6 rounded-full"
            initial={{ opacity: 0.2, backgroundColor: 'rgba(99,102,241,0.2)' }}
            animate={inView ? { opacity: 1, backgroundColor: 'rgba(99,102,241,0.6)' } : {}}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.2, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
      </div>
    );
  }

  return null;
}

function StatCard({ stat, index, isInView }: { stat: typeof stats[0]; index: number; isInView: boolean }) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <CinematicFragment
      direction="bottom"
      delay={index * 0.08}
      className="w-full"
    >
      <div 
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="text-center relative overflow-hidden bg-gradient-to-br from-blue-600/[0.03] via-indigo-500/[0.015] to-transparent backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-indigo-300/20 ring-1 ring-indigo-400/10 group transition-all duration-500 hover:border-indigo-300/40"
      >
        {/* Spotlight overlay */}
        {isHovered && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-0"
            style={{
              background: `radial-gradient(200px circle at ${coords.x}px ${coords.y}px, rgba(99, 102, 241, 0.06), transparent 80%)`,
            }}
          />
        )}

        {/* Subtle light sweep */}
        <div className="absolute top-0 left-[-100%] w-[50%] h-[200%] bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-[30deg] opacity-0 group-hover:opacity-100 group-hover:left-[200%] transition-all duration-1000 pointer-events-none z-0" />

        <div className="relative z-10">
          <AnimatedCounter value={stat.value} suffix={stat.suffix} inView={isInView} />
          <p className="text-foreground/55 text-sm mt-3 font-medium">{stat.label}</p>
          <MicroChart
            type={stat.type}
            bars={stat.bars}
            dots={stat.dots}
            ticks={stat.ticks}
            inView={isInView}
          />
          {/* Hover tooltip */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-[9px] font-mono text-indigo-400/60 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-md border border-indigo-300/30">
              Updated 2m ago
            </span>
          </div>
        </div>
      </div>
    </CinematicFragment>
  );
}

export default function Stats() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [timestamp, setTimestamp] = useState('');
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const update = () => {
      setTimestamp(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setPulse(true);
      setTimeout(() => setPulse(false), 300);
    };
    update();
    const timer = setInterval(update, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="stats" ref={ref} className="section-anchor relative bg-transparent py-8 md:py-12 lg:py-16 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-200 rounded-full blur-[200px] opacity-[0.06]" />
      {/* Radar scanner behind counter */}
      <div className="absolute right-[5%] top-1/2 -translate-y-1/2 w-72 h-72 md:w-96 md:h-96 opacity-[0.06] pointer-events-none hidden lg:block">
        <RadarScanner className="w-full h-full" />
      </div>
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 relative z-10">
        <CinematicContainer className="text-center mb-8 md:mb-16">
          <CinematicFragment direction="top">
            <div className="inline-flex items-center gap-4 px-6 py-3 rounded-2xl border backdrop-blur-[100px] bg-gradient-to-r from-white/8 via-white/4 to-white/2 border-indigo-300/40 hover:border-white/35 shadow-[inset_0_2px_2px_rgba(255,255,255,0.3),0_8px_24px_rgba(31,38,135,0.1)] mb-6 group">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-sm md:text-base font-mono uppercase tracking-[0.2em] font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400">
                The Numbers
              </span>
              <span className="h-1 w-12 md:w-16 rounded-full bg-gradient-to-r from-indigo-400/60 to-transparent" />
            </div>
          </CinematicFragment>
          <CinematicFragment direction="bottom" delay={0.1}>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
              Results that <span className="bg-indigo-500/10 border border-indigo-300/40 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-650 to-violet-600 px-2 py-0.5 rounded-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">speak</span> for themselves
            </h2>
          </CinematicFragment>
        </CinematicContainer>

        {/* Dashboard Panel */}
        <CinematicContainer className="w-full">
          <CinematicFragment direction="deep-space" className="w-full" delay={0.2}>
            <div className="glass-surface-strong rounded-[2.5rem] p-6 md:p-10 border border-indigo-300/40 ring-1 ring-indigo-400/15 shadow-[0_16px_48px_rgba(59,130,246,0.12),inset_0_1px_0_rgba(255,255,255,0.45)]">
              {/* Panel Header */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-indigo-300/20">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-60" />
                  </div>
                  <span className="text-[10px] font-mono text-foreground/45 uppercase tracking-wider">Live Dashboard</span>
                </div>
                <motion.span
                  className="text-[10px] font-mono text-foreground/30 tabular-nums"
                  animate={pulse ? { opacity: [0.3, 1, 0.3] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  Updated: {timestamp} UTC
                </motion.span>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {stats.map((stat, i) => (
                  <StatCard key={stat.label} stat={stat} index={i} isInView={isInView} />
                ))}
              </div>
            </div>
          </CinematicFragment>
        </CinematicContainer>
      </div>
    </section>
  );
}
