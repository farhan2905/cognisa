'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import SectionTag from '@/components/shared/SectionTag';
import { ArrowRight, Globe, BrainCircuit, Wallet, HelpCircle, Rocket, ShieldCheck, Clock, Users, Code2, Bot, Settings, Headphones } from 'lucide-react';
import Link from 'next/link';

/* ═══════════════════════════════════════════════
   KORE.AI-INSPIRED TABBED CHALLENGE CARDS
   Tabs at top → grid of animated cards below
   Cards animate in/out on tab switch with stagger
   ═══════════════════════════════════════════════ */

interface ChallengeCard {
  id: string;
  category: 'website' | 'ai' | 'cost';
  icon: React.ElementType;
  question: string;
  answer: string;
  badge?: string;
}

const challenges: ChallengeCard[] = [
  {
    id: 'Q01',
    category: 'website',
    icon: Globe,
    question: 'What kind of website does my business actually need?',
    answer: 'We audit your goals, audience, and growth stage to recommend the exact architecture — from landing pages to full SaaS platforms.',
  },
  {
    id: 'Q02',
    category: 'website',
    icon: Clock,
    question: 'How long does it take to build a custom website or app?',
    answer: 'Most MVPs ship in 4–6 weeks. Complex platforms typically take 8–12 weeks with weekly deliverables you can test.',
  },
  {
    id: 'Q03',
    category: 'website',
    icon: Code2,
    question: 'Do I need a simple webpage, or a full custom application?',
    answer: 'If you have users logging in, processing data, or making payments — you need an application. We help you decide in the first call.',
  },
  {
    id: 'Q04',
    category: 'website',
    icon: Users,
    question: 'What features are actually important for my customers?',
    answer: 'We run user-journey mapping and competitor teardowns to prioritize features that drive conversion, not vanity.',
  },
  {
    id: 'Q05',
    category: 'ai',
    icon: BrainCircuit,
    question: 'Everyone is talking about AI, but how does it help ME?',
    answer: 'AI automates the repetitive tasks draining your team — customer support, data entry, scheduling, and reporting — 24/7.',
    badge: 'Popular',
  },
  {
    id: 'Q06',
    category: 'ai',
    icon: Bot,
    question: 'Can software really do the boring tasks my team hates?',
    answer: 'Yes. We build custom agents that handle emails, forms, invoices, and follow-ups with human-level accuracy.',
  },
  {
    id: 'Q07',
    category: 'ai',
    icon: Settings,
    question: 'Will this "automation" thing be too complicated for us?',
    answer: 'We design every interface for non-technical users. If your team can use Slack, they can use our systems.',
  },
  {
    id: 'Q08',
    category: 'ai',
    icon: Rocket,
    question: 'Does adding AI mean I have to rebuild my whole business?',
    answer: 'No. We integrate AI into your existing stack — CRMs, spreadsheets, websites — without disruption.',
  },
  {
    id: 'Q09',
    category: 'cost',
    icon: Wallet,
    question: 'How much is all of this tech actually going to cost me?',
    answer: 'We provide fixed-price proposals based on scope, not open-ended hourly billing. No surprises.',
  },
  {
    id: 'Q10',
    category: 'cost',
    icon: ShieldCheck,
    question: 'Who manages the website and software after it\'s built?',
    answer: 'We offer managed hosting, monitoring, and updates. Your site stays secure, fast, and current — hands-free.',
  },
  {
    id: 'Q11',
    category: 'cost',
    icon: Headphones,
    question: 'What if something breaks — how do we get it fixed?',
    answer: '24/7 monitoring catches issues before you do. Our SLA guarantees response within 2 hours for critical bugs.',
  },
  {
    id: 'Q12',
    category: 'cost',
    icon: Users,
    question: 'Do I need to hire my own IT guy to run this?',
    answer: 'No. We are your IT team. One partner for strategy, build, launch, and maintenance.',
  },
];

const tabs = [
  {
    key: 'website' as const,
    label: 'Website & Apps',
    icon: Globe,
    description: 'Build fast, scalable digital products that solve real business problems.',
    color: 'from-blue-500 to-indigo-500',
    accentBg: 'from-blue-600/[0.06] via-indigo-500/[0.025]',
  },
  {
    key: 'ai' as const,
    label: 'AI & Automation',
    icon: BrainCircuit,
    description: 'Replace manual workflows with intelligent agents that operate 24/7.',
    color: 'from-violet-500 to-purple-500',
    accentBg: 'from-violet-600/[0.06] via-purple-500/[0.025]',
    badge: 'NEW',
  },
  {
    key: 'cost' as const,
    label: 'Cost & Management',
    icon: Wallet,
    description: 'Transparent pricing and managed solutions — zero surprises.',
    color: 'from-amber-500 to-orange-500',
    accentBg: 'from-amber-600/[0.06] via-orange-500/[0.025]',
  },
];

/* ─── Individual Challenge Card ─── */

function ChallengeCardItem({
  card,
  index,
  activeTab,
}: {
  card: ChallengeCard;
  index: number;
  activeTab: string;
}) {
  const Icon = card.icon;
  const tabConfig = tabs.find((t) => t.key === card.category)!;
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.95, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -20, scale: 0.95, filter: 'blur(6px)' }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-2xl border border-indigo-300/30 bg-gradient-to-br ${tabConfig.accentBg} to-transparent backdrop-blur-2xl ring-1 ring-indigo-400/10 shadow-[0_10px_30px_rgba(99,102,241,0.04),inset_0_1px_0_rgba(255,255,255,0.45)] transition-all duration-500 hover:border-indigo-300/50 hover:shadow-[0_16px_40px_rgba(99,102,241,0.08),inset_0_1px_0_rgba(255,255,255,0.55)] hover:-translate-y-1.5 group cursor-default flex flex-col`}
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

      {/* Light sweep */}
      <div className="absolute top-0 left-[-100%] w-[50%] h-[200%] bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-[30deg] opacity-0 group-hover:opacity-100 group-hover:left-[200%] transition-all duration-1000 pointer-events-none z-0" />

      {/* Content */}
      <div className="relative z-10 p-5 md:p-6 flex flex-col flex-1">
        {/* Top row: icon + badge */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-white/50 backdrop-blur-xl border border-white/60 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-50 transition-all duration-500 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
            <Icon className="w-5 h-5 text-indigo-500 drop-shadow-sm" />
          </div>
          <div className="flex items-center gap-2">
            {card.badge && (
              <span className="text-[8px] font-mono font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 text-white shadow-sm">
                {card.badge}
              </span>
            )}
            <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r ${tabConfig.color} text-white`}>
              {card.id}
            </span>
          </div>
        </div>

        {/* Question */}
        <h4 className="text-base md:text-lg font-bold text-foreground/85 leading-snug tracking-tight mb-3 group-hover:text-foreground transition-colors">
          {card.question}
        </h4>

        {/* Answer */}
        <p className="text-sm text-foreground/55 leading-relaxed font-medium flex-1 group-hover:text-foreground/70 transition-colors">
          {card.answer}
        </p>

        {/* Learn more link */}
        <div className="mt-4 pt-3 border-t border-indigo-300/15">
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-500/70 group-hover:text-indigo-600 transition-colors"
          >
            Learn more
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Challenges Section ─── */

export default function Challenges() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [activeTab, setActiveTab] = useState<'website' | 'ai' | 'cost'>('website');
  const [autoPlay, setAutoPlay] = useState(true);

  // Auto-cycle tabs like Kore.ai
  useEffect(() => {
    if (!autoPlay || !isInView) return;
    const timer = setInterval(() => {
      setActiveTab((prev) => {
        const tabKeys = tabs.map((t) => t.key);
        const nextIdx = (tabKeys.indexOf(prev) + 1) % tabKeys.length;
        return tabKeys[nextIdx];
      });
    }, 8000);
    return () => clearInterval(timer);
  }, [autoPlay, isInView]);

  const filteredCards = challenges.filter((c) => c.category === activeTab);
  const activeTabConfig = tabs.find((t) => t.key === activeTab)!;

  return (
    <section ref={ref} className="section-anchor bg-transparent py-6 md:py-12 lg:py-16" id="challenges">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <SectionTag text="THE CHALLENGE" variant="light" className="justify-center" />

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mt-6 leading-tight tracking-tight"
          >
            Use tabs to{' '}
            <span className="bg-indigo-500/10 border border-indigo-300/40 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-2 py-0.5 rounded-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
              explore more
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="text-foreground/60 text-base md:text-lg font-medium max-w-2xl mx-auto mt-4"
          >
            Every business faces hurdles. We solve the most common challenges across web, AI, and operations with battle-tested solutions.
          </motion.p>
        </div>

        {/* ─── Tab Bar ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.25, duration: 0.7 }}
          className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-8 md:mb-10"
        >
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setAutoPlay(false);
                }}
                className={`relative flex-1 flex items-center gap-3 px-5 py-4 rounded-2xl border transition-all duration-500 text-left group/tab overflow-hidden ${
                  isActive
                    ? 'bg-gradient-to-br from-white/60 via-white/40 to-white/20 border-indigo-400/50 shadow-[0_12px_36px_rgba(99,102,241,0.08),inset_0_1px_0_rgba(255,255,255,0.6)] scale-[1.02]'
                    : 'bg-gradient-to-br from-blue-600/[0.04] via-indigo-500/[0.015] to-transparent border-indigo-300/30 hover:border-indigo-300/50 hover:bg-white/30'
                }`}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-gradient-to-b ${tab.color}`}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}

                {/* Auto-play progress bar */}
                {isActive && autoPlay && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-100/30">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full progress-bar-fill"
                      style={{ '--duration': '8s' } as React.CSSProperties}
                    />
                  </div>
                )}

                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500 ${
                    isActive
                      ? 'bg-gradient-to-br from-indigo-500/15 to-violet-500/10 border border-indigo-300/30 scale-110'
                      : 'bg-foreground/5 border border-foreground/10 group-hover/tab:bg-indigo-500/10'
                  }`}
                >
                  <TabIcon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-indigo-600' : 'text-foreground/40 group-hover/tab:text-indigo-500'
                    }`}
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-bold transition-colors truncate ${
                        isActive ? 'text-foreground' : 'text-foreground/60'
                      }`}
                    >
                      {tab.label}
                    </span>
                    {tab.badge && (
                      <span className="text-[8px] font-mono font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white shrink-0">
                        {tab.badge}
                      </span>
                    )}
                  </div>
                  {isActive && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-[11px] text-foreground/50 mt-0.5 font-medium leading-snug"
                    >
                      {tab.description}
                    </motion.p>
                  )}
                </div>
              </button>
            );
          })}
        </motion.div>

        {/* ─── Cards Grid ─── */}
        <div className="min-h-[250px] md:min-h-[280px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5"
            >
              {filteredCards.map((card, i) => (
                <ChallengeCardItem
                  key={card.id}
                  card={card}
                  index={i}
                  activeTab={activeTab}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ─── Explore More CTA ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="text-center mt-5 md:mt-10"
        >
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-br from-blue-600/[0.08] via-indigo-500/[0.04] to-transparent border border-indigo-300/40 rounded-full font-semibold text-foreground hover:from-blue-600/[0.15] hover:via-indigo-500/[0.08] transition-all shadow-[0_4px_12px_rgba(59,130,246,0.08),inset_0_1px_0_rgba(255,255,255,1)]"
          >
            Explore All Solutions
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
