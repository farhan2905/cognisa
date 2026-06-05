'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ChevronDown, ThumbsUp, ThumbsDown } from 'lucide-react';
import SectionTag from '@/components/shared/SectionTag';
import TerminalTyping from '@/components/shared/TerminalTyping';

interface FAQItem {
  question: string;
  answer: string;
  category: 'services' | 'process' | 'pricing';
}

const faqs: FAQItem[] = [
  {
    question: "What makes your approach different from other agencies?",
    answer: "We don't believe in cookie-cutter solutions or endless jargon. Our approach is entirely data-driven and tailored specifically to your goals. We act as an extension of your team, providing complete transparency and measurable results from day one.",
    category: 'services',
  },
  {
    question: "How long does it take to see tangible results?",
    answer: "While every business is unique, our agile methodologies typically deliver initial quick wins within the first 30-45 days. Long-term, sustainable growth strategies usually mature around the 3-6 month mark, depending on market conditions and your industry.",
    category: 'process',
  },
  {
    question: "Do you work with startups or established enterprises?",
    answer: "Both. We have scaled startups from zero to seven figures and have helped established enterprises optimize their operations and revitalize their digital presence. Our strategies scale and adapt to your current stage of growth.",
    category: 'services',
  },
  {
    question: "What is your pricing structure?",
    answer: "We offer flexible, value-based pricing rather than strict hourly billing. Depending on the project scope, we provide clear milestone-based pricing or monthly retainers for ongoing growth partnerships. Everything is transparent before we start.",
    category: 'pricing',
  },
  {
    question: "Can you help integrate AI into our existing workflows?",
    answer: "Absolutely. We specialize in identifying bottlenecks and implementing custom AI solutions that automate repetitive tasks, enhance data analysis, and improve overall operational efficiency without disrupting your core business.",
    category: 'services',
  },
  {
    question: "What is your communication protocol during a project?",
    answer: "We establish a dedicated Slack/Discord channel for real-time collaboration. We hold structured weekly sprint reviews with interactive build demonstrations. Detailed sprint reports are shared via our client dashboard so you are never left guessing.",
    category: 'process',
  },
  {
    question: "Do we own the source code and intellectual property?",
    answer: "Yes, 100%. Upon completion and final payment, full ownership of the source code, design assets, and intellectual property is transferred directly to your organization. Everything is cleanly cataloged on GitHub repositories.",
    category: 'services',
  },
  {
    question: "Are there any hidden fees or extra maintenance costs?",
    answer: "No. All license requirements, hosting costs, or third-party API limits are modeled and agreed upon during our discovery phase. We structure clear post-launch support retainers so you know exactly what to budget.",
    category: 'pricing',
  }
];

const categories = [
  { key: 'all' as const, label: 'All Questions' },
  { key: 'services' as const, label: 'Services' },
  { key: 'process' as const, label: 'Process' },
  { key: 'pricing' as const, label: 'Pricing' },
];

function FAQCard({ 
  faq, 
  globalIndex, 
  openIndex, 
  setOpenIndex, 
  vote, 
  handleVote 
}: { 
  faq: FAQItem; 
  globalIndex: number; 
  openIndex: number | null; 
  setOpenIndex: (idx: number | null) => void;
  vote: 'up' | 'down' | null;
  handleVote: (idx: number, vote: 'up' | 'down') => void;
}) {
  const isOpen = openIndex === globalIndex;
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-2xl transition-all duration-500 backdrop-blur-2xl border ring-1 shadow-[0_10px_30px_rgba(99,102,241,0.03),inset_0_1px_0_rgba(255,255,255,0.45)] ${
        isOpen
          ? 'bg-gradient-to-br from-blue-600/[0.08] via-indigo-500/[0.04] to-transparent border-indigo-300/50 ring-indigo-400/20 border-l-4 border-l-indigo-500 shadow-[0_16px_40px_rgba(99,102,241,0.06),inset_0_1px_0_rgba(255,255,255,0.55)]'
          : 'bg-gradient-to-br from-blue-600/[0.04] via-indigo-500/[0.015] to-transparent border-indigo-300/30 ring-indigo-400/10 hover:border-indigo-300/50 hover:shadow-[0_16px_40px_rgba(99,102,241,0.05),inset_0_1px_0_rgba(255,255,255,0.55)]'
      }`}
    >
      {/* Spotlight overlay */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-0"
          style={{
            background: `radial-gradient(280px circle at ${coords.x}px ${coords.y}px, rgba(99, 102, 241, 0.12), transparent 80%)`,
          }}
        />
      )}

      {/* Subtle light sweep */}
      <div className="absolute top-0 left-[-100%] w-[50%] h-[200%] bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-[30deg] opacity-0 group-hover:opacity-100 group-hover:left-[200%] transition-all duration-1000 pointer-events-none z-0" />

      <button
        onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
        className="w-full flex items-start justify-between p-5 text-left focus:outline-none relative z-10"
      >
        <div className="flex items-start gap-3 pt-0.5">
          <span className="font-mono text-[10px] font-bold text-indigo-500/60 bg-indigo-500/10 px-2 py-1 rounded-md">
            &gt; Q{String(globalIndex + 1).padStart(2, '0')}
          </span>
          <span className={`font-bold text-base md:text-lg transition-colors ${isOpen ? 'text-indigo-500' : 'text-foreground/80'}`}>
            {faq.question}
          </span>
        </div>
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300 shrink-0 ml-4 ${
            isOpen ? 'bg-indigo-500/20 rotate-180 border border-indigo-500/30' : 'bg-foreground/5 border border-foreground/10'
          }`}
        >
          <ChevronDown className={`w-5 h-5 ${isOpen ? 'text-indigo-500' : 'text-foreground/50'}`} />
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden relative z-10"
          >
            <div className="px-5 pb-5 pt-0">
              <div className="pl-12">
                <p className="text-foreground/70 text-base leading-relaxed font-medium pl-1 border-l-2 border-indigo-500/30">
                  {faq.answer}
                </p>
                {/* Helpful vote */}
                <div className="flex items-center gap-3 mt-4 pt-3 border-t border-indigo-300/15">
                  <span className="text-[11px] font-mono text-foreground/45 uppercase tracking-wider font-bold">
                    Was this helpful?
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVote(globalIndex, 'up');
                    }}
                    className={`p-1.5 rounded-md transition-all ${
                      vote === 'up'
                        ? 'bg-emerald-500/15 text-emerald-500'
                        : 'text-foreground/30 hover:text-foreground/60 hover:bg-foreground/5'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVote(globalIndex, 'down');
                    }}
                    className={`p-1.5 rounded-md transition-all ${
                      vote === 'down'
                        ? 'bg-red-500/15 text-red-500'
                        : 'text-foreground/30 hover:text-foreground/60 hover:bg-foreground/5'
                    }`}
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<'all' | 'services' | 'process' | 'pricing'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [helpfulVotes, setHelpfulVotes] = useState<Record<number, 'up' | 'down' | null>>({});
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleVote = (index: number, vote: 'up' | 'down') => {
    setHelpfulVotes((prev) => ({
      ...prev,
      [index]: prev[index] === vote ? null : vote,
    }));
  };

  return (
    <section ref={ref} className="section-anchor bg-transparent py-8 md:py-12 lg:py-16" id="faq">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
        <div className="text-center mb-8 md:mb-12">
          <SectionTag text="FAQ" variant="light" className="justify-center" />
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-2xl md:text-4xl font-bold text-foreground mt-6 leading-tight"
          >
            Got questions? <br />We&apos;ve got <span className="bg-indigo-500/10 border border-indigo-300/40 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-2 py-0.5 rounded-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">answers.</span>
          </motion.h2>

          {/* Terminal intro */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-4 h-5 flex justify-center"
          >
            <TerminalTyping
              commands={[
                '> cognisa help --topic faq',
                '> cat ./faq/services.md',
                '> cat ./faq/process.md',
              ]}
              typingSpeed={40}
              deleteSpeed={20}
              pauseDuration={2500}
            />
          </motion.div>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-4xl mx-auto mb-8 relative z-20">
          {/* Category Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="flex flex-wrap gap-2 order-2 md:order-1"
          >
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => {
                  setActiveCategory(cat.key);
                  setOpenIndex(null);
                }}
                className={`px-4.5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${
                  activeCategory === cat.key
                    ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-[0_4px_16px_rgba(99,102,241,0.25)]'
                    : 'bg-gradient-to-br from-blue-600/[0.04] via-indigo-500/[0.02] to-transparent text-foreground/60 border border-indigo-300/30 hover:border-indigo-300/50 hover:text-foreground/80'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </motion.div>

          {/* Real-time Search Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="relative w-full md:w-80 order-1 md:order-2"
          >
            <input
              type="text"
              placeholder="Search questions or answers..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setOpenIndex(null);
              }}
              className="w-full pl-10 pr-10 py-2.5 rounded-full border border-indigo-300/30 bg-white/40 text-foreground text-sm font-medium focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 placeholder:text-foreground/35 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.45)]"
            />
            <span className="absolute left-3.5 top-3 flex items-center justify-center text-foreground/35 pointer-events-none">
              🔍
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-2.5 p-1 rounded-full hover:bg-foreground/5 text-foreground/45 hover:text-foreground transition-all text-[10px] font-bold"
              >
                ✕
              </button>
            )}
          </motion.div>
        </div>

        {filteredFaqs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 p-8 border border-dashed border-indigo-300/30 rounded-2xl bg-indigo-950/[0.02]"
          >
            <div className="text-3xl mb-3">🔍</div>
            <h4 className="text-lg font-bold text-foreground mb-1">No matching questions found</h4>
            <p className="text-foreground/50 text-sm mb-4">Try checking another keyword or reset the search filters.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="px-4 py-2 text-xs font-semibold text-indigo-600 border border-indigo-500/20 hover:border-indigo-500/40 rounded-full hover:bg-indigo-500/5 transition-all"
            >
              Reset all filters
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="flex flex-col gap-4"
          >
            {filteredFaqs.map((faq) => {
              const globalIndex = faqs.indexOf(faq);
              const vote = helpfulVotes[globalIndex];

              return (
                <FAQCard 
                  key={globalIndex}
                  faq={faq} 
                  globalIndex={globalIndex} 
                  openIndex={openIndex} 
                  setOpenIndex={setOpenIndex} 
                  vote={vote} 
                  handleVote={handleVote} 
                />
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
