'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import SectionTag from '@/components/shared/SectionTag';
import { ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';
import { insightsData } from '@/data/insights';
import TerminalTyping from '@/components/shared/TerminalTyping';

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] } }),
};

function InsightCard({ article, index, isInView }: { article: typeof insightsData[0]; index: number; isInView: boolean }) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div 
      custom={index} 
      variants={cardVariants} 
      initial="hidden" 
      animate={isInView ? 'visible' : 'hidden'}
    >
      <Link 
        href={`/insights/${article.slug}`} 
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group flex flex-col h-full relative overflow-hidden bg-gradient-to-br from-blue-600/[0.04] via-indigo-500/[0.015] to-transparent backdrop-blur-2xl rounded-3xl p-6 border border-indigo-300/30 ring-1 ring-indigo-400/10 shadow-[0_10px_30px_rgba(99,102,241,0.04),inset_0_1px_0_rgba(255,255,255,0.45)] transition-all duration-500 hover:-translate-y-2 hover:border-indigo-300/50 hover:shadow-[0_16px_40px_rgba(99,102,241,0.06),inset_0_1px_0_rgba(255,255,255,0.55)]"
      >
        {/* Spotlight overlay */}
        {isHovered && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-0"
            style={{
              background: `radial-gradient(300px circle at ${coords.x}px ${coords.y}px, rgba(99, 102, 241, 0.12), transparent 80%)`,
            }}
          />
        )}

        {/* Subtle light sweep */}
        <div className="absolute top-0 left-[-100%] w-[50%] h-[200%] bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-[30deg] opacity-0 group-hover:opacity-100 group-hover:left-[200%] transition-all duration-1000 pointer-events-none z-0" />

        <div className="flex items-center gap-4 mb-6 relative z-10">
          <span className="bg-foreground/5 text-foreground/80 border border-foreground/10 px-3 py-1 rounded-full text-xs font-mono tracking-wide flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            {article.category}
          </span>
          <span className="flex items-center gap-1.5 text-foreground/50 text-xs font-mono"><Clock className="w-3.5 h-3.5" />{article.readTime}</span>
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-indigo-500 transition-colors leading-snug relative z-10">{article.title}</h3>
        <p className="text-foreground/70 leading-relaxed mt-auto relative z-10 font-medium">{article.shortDescription}</p>
        <div className="mt-8 flex items-center gap-2 text-foreground/50 group-hover:text-indigo-500 transition-colors relative z-10 font-medium">
          <span className="text-sm">Read more</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>
    </motion.div>
  );
}

export default function Insights() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="section-anchor bg-transparent py-8 md:py-12 lg:py-16 z-[40]" id="insights">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-16 gap-8">
          <div className="max-w-2xl">
            <SectionTag text="INSIGHTS & RESOURCES" variant="light" />
            <motion.h2 initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="text-2xl md:text-4xl font-bold text-foreground mt-6 leading-tight">
              Your pocket-sized library of tips, tricks, and <span className="text-indigo-500 bg-transparent font-serif italic font-medium">&apos;why didn&apos;t I think of that?&apos;</span>
            </motion.h2>
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-3 h-5"
            >
              <TerminalTyping
                commands={[
                  '> cat latest-insights.md --published',
                  '> grep "AI\|architecture\|growth" *',
                  '> ls ./articles/ | wc -l',
                ]}
                typingSpeed={40}
                deleteSpeed={20}
                pauseDuration={2500}
              />
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }} transition={{ delay: 0.3, duration: 0.7 }}>
            <Link
              href="/insights"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-blue-600/[0.08] via-indigo-500/[0.04] to-transparent border border-indigo-300/40 rounded-full font-semibold text-foreground hover:from-blue-600/[0.15] hover:via-indigo-500/[0.08] transition-all shadow-[0_4px_12px_rgba(59,130,246,0.08),inset_0_1px_0_rgba(255,255,255,1)] group"
            >
              Read all articles
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {insightsData.map((article, i) => (
            <InsightCard key={article.title} article={article} index={i} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}
