'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import {
  Target,
  Zap,
  BarChart3,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';
import SectionTag from '@/components/shared/SectionTag';
import Link from 'next/link';

const benefits = [
  {
    icon: Target,
    title: 'Architecture First',
    description: 'Every system is designed with robust architecture for maximum scalability and performance.',
    number: '01',
  },
  {
    icon: Zap,
    title: 'Rapid Execution',
    description: 'Agile development cycles that deliver fully functional software without compromising quality.',
    number: '02',
  },
  {
    icon: BarChart3,
    title: 'Automated Workflows',
    description: 'Replace manual tasks with intelligent AI agents and seamless data integrations.',
    number: '03',
  },
  {
    icon: Lightbulb,
    title: 'Code Quality',
    description: 'Clean, maintainable, and modern codebases that future-proof your digital product.',
    number: '04',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

function BenefitCard({ benefit, index, isInView }: { benefit: typeof benefits[0]; index: number; isInView: boolean }) {
  const Icon = benefit.icon;
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const positions = [
    'lg:justify-self-end lg:mr-4 xl:mr-10',
    'lg:justify-self-start lg:ml-4 xl:ml-10',
    'lg:justify-self-end lg:mr-4 xl:mr-10',
    'lg:justify-self-start lg:ml-4 xl:ml-10',
  ];

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={`${positions[index]}`}
    >
      <div 
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative overflow-hidden bg-gradient-to-br from-blue-600/[0.04] via-indigo-500/[0.015] to-transparent backdrop-blur-2xl p-6 md:p-7 lg:p-8 min-h-[200px] md:min-h-[220px] flex flex-col justify-between rounded-[2rem] border border-indigo-300/30 ring-1 ring-indigo-400/10 shadow-[0_10px_30px_rgba(99,102,241,0.05),inset_0_1px_0_rgba(255,255,255,0.45)] transition-all duration-700 group hover:-translate-y-2 hover:border-indigo-300/50 hover:shadow-[0_16px_40px_rgba(99,102,241,0.08),inset_0_1px_0_rgba(255,255,255,0.55)]"
      >
        {/* Spotlight overlay */}
        {isHovered && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-0"
            style={{
              background: `radial-gradient(350px circle at ${coords.x}px ${coords.y}px, rgba(99, 102, 241, 0.12), transparent 80%)`,
            }}
          />
        )}

        {/* Subtle light sweep */}
        <div className="absolute top-0 left-[-100%] w-[50%] h-[200%] bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-[30deg] opacity-0 group-hover:opacity-100 group-hover:left-[200%] transition-all duration-1000 pointer-events-none z-0" />

        {/* Number badge */}
        <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-300/30 flex items-center justify-center z-10">
          <span className="text-[10px] font-mono font-bold text-indigo-500">{benefit.number}</span>
        </div>

        <div className="relative z-10 flex flex-col h-full">
          <div className="w-14 h-14 rounded-2xl bg-white/50 backdrop-blur-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-50 transition-all duration-500 border border-white/60 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
            <Icon className="w-6 h-6 text-indigo-500 transition-colors drop-shadow-sm" />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 transition-colors tracking-tight leading-tight">
              {benefit.title}
            </h3>
            <p className="text-foreground/75 text-base md:text-lg leading-relaxed font-medium">
              {benefit.description}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="about"
      ref={ref}
      className="section-anchor relative bg-transparent py-8 md:py-12 lg:py-16 overflow-hidden"
    >
      {/* Dynamic Background Gradients */}
      <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-indigo-200/50 rounded-full blur-[120px] pointer-events-none animate-orb-2" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-violet-200/40 rounded-full blur-[120px] pointer-events-none animate-orb-3" />

      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 relative z-10">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-8 md:mb-16 lg:mb-20">
          <div>
            <SectionTag text="WHY CHOOSE US" variant="light" />
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight tracking-tight"
            >
              We don&apos;t just write code. We build{' '}
              <span className="bg-indigo-500/10 border border-indigo-300/40 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-2 py-0.5 rounded-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">systems</span>{' '}
              that scale.
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col justify-end items-start"
          >
            <p className="text-foreground/80 text-lg md:text-xl leading-relaxed mb-8">
              Managed solely by the founder of <strong>Cognisa</strong>, we specialize in delivering high-performance custom web applications and AI-driven automation. We partner closely with businesses to transform manual bottlenecks into scalable, automated tech solutions.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-blue-600/[0.08] via-indigo-500/[0.04] to-transparent border border-indigo-300/40 rounded-full font-semibold text-foreground hover:from-blue-600/[0.15] hover:via-indigo-500/[0.08] transition-all shadow-[0_4px_12px_rgba(59,130,246,0.08),inset_0_1px_0_rgba(255,255,255,1)] group"
            >
              More About Us
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Orbit Layout */}
        <div className="relative pt-8 md:pt-10 lg:pt-12 pb-10 md:pb-12 lg:pb-14">
          {/* Central Element - Desktop */}
          <div className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* Iridescent blob background */}
              <div className="absolute inset-0 -m-16 iridescent-blob opacity-40 scale-75 blur-sm" />

              {/* Central glass circle with holographic core */}
              <div className="relative w-40 h-40 rounded-full glass-surface-strong border border-indigo-300/40 flex flex-col items-center justify-center shadow-[0_16px_48px_rgba(99,102,241,0.15)] overflow-hidden group">
                {/* Rotating holographic background glow */}
                <div 
                  className="absolute inset-0 bg-gradient-to-tr from-[#38bdf8]/15 via-[#6366f1]/20 to-[#c084fc]/15 opacity-60 group-hover:opacity-80 transition-all duration-1000 animate-spin" 
                  style={{ animationDuration: '10s' }} 
                />
                
                {/* Glow ring */}
                <div className="absolute inset-1 rounded-full border border-indigo-500/10 shadow-[inset_0_0_15px_rgba(99,102,241,0.1)] pointer-events-none" />

                <span className="relative z-10 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 drop-shadow-sm font-sans tracking-tight">
                  Cognisa
                </span>
                <span className="relative z-10 text-[10px] font-mono text-foreground/45 uppercase tracking-wider mt-1">
                  Est. 2020
                </span>
                <span className="relative z-10 text-[9px] font-mono text-foreground/35 mt-0.5">
                  New York, NY
                </span>
              </div>
            </motion.div>
          </div>

          {/* Benefit Cards - Diamond Layout on Desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-x-8 lg:gap-y-6 lg:px-24 mt-8 md:mt-10 lg:mt-14 pb-6 md:pb-8 lg:pb-10">
            {benefits.map((benefit, i) => (
              <BenefitCard key={benefit.title} benefit={benefit} index={i} isInView={isInView} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
