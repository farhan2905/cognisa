'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Quote } from 'lucide-react';
import VoiceWave from '@/components/shared/VoiceWave';

const testimonials = [
  {
    quote:
      'Cognisa completely transformed our online presence. Their data-driven approach led to a 340% increase in organic traffic within just 6 months. The team is incredibly talented and responsive.',
    name: 'Sarah Chen',
    role: 'CEO, TechFlow Inc.',
    initials: 'SC',
    color: 'bg-blue-500/10 text-blue-600',
    waveColor: '#6366f1',
  },
  {
    quote:
      "Working with Cognisa was a game-changer for our brand. They understood our vision from day one and delivered a website and marketing strategy that truly represents who we are. Revenue up 200%.",
    name: 'Marcus Rodriguez',
    role: 'Founder, GreenLeaf Co.',
    initials: 'MR',
    color: 'bg-indigo-500/10 text-indigo-600',
    waveColor: '#8b5cf6',
  },
  {
    quote:
      "The AI solutions Cognisa implemented in our customer service workflow reduced response times by 80% and increased customer satisfaction scores dramatically. Best investment we've made.",
    name: 'Emily Watson',
    role: 'VP of Operations, DataSphere',
    initials: 'EW',
    color: 'bg-violet-500/10 text-violet-600',
    waveColor: '#818cf8',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

function GenerativeAvatar({ initials, color, index }: { initials: string; color: string; index: number }) {
  return (
    <div className="relative w-11 h-11 flex-shrink-0">
      {/* Generative gradient blob */}
      <div
        className="absolute inset-0 rounded-full iridescent-blob opacity-60 scale-75"
        style={{
          animationDelay: `${index * 3}s`,
          filter: 'blur(2px)',
        }}
      />
      <div
        className={`relative w-full h-full rounded-full ${color} flex items-center justify-center text-sm font-bold z-10 backdrop-blur-sm border border-white/20`}
      >
        {initials}
      </div>
    </div>
  );
}

function TestimonialCard({ 
  testimonial, 
  index, 
  active, 
  setActive, 
  isInView,
  className = ""
}: { 
  testimonial: typeof testimonials[0]; 
  index: number; 
  active: number; 
  setActive: (idx: number) => void;
  isInView: boolean;
  className?: string;
}) {
  const isActive = active === index;
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      onClick={() => setActive(index)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-[2rem] p-5 sm:p-8 border cursor-pointer transition-all duration-500 flex flex-col ${
        isActive
          ? 'bg-gradient-to-br from-blue-600/[0.08] via-indigo-500/[0.04] to-transparent border-indigo-400/60 ring-2 ring-indigo-400/20 shadow-[0_16px_40px_rgba(99,102,241,0.12),inset_0_1px_0_rgba(255,255,255,0.45)] scale-[1.02]'
          : 'bg-gradient-to-br from-blue-600/[0.04] via-indigo-500/[0.015] to-transparent border-indigo-300/40 hover:border-indigo-300/60 hover:shadow-[0_12px_36px_rgba(99,102,241,0.06),inset_0_1px_0_rgba(255,255,255,0.55)] opacity-75 md:opacity-100'
      } ${className}`}
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

      <div className="relative z-10 flex flex-col h-full">
        {/* Voice wave */}
        <VoiceWave color={testimonial.waveColor} className="mb-3 sm:mb-4" />

        {/* Quote icon */}
        <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-400/60 mb-3 sm:mb-4 flex-shrink-0" />

        {/* Quote text */}
        <p className="text-foreground/70 text-base leading-relaxed mb-4 sm:mb-8 flex-grow [text-wrap:balance]">
          <span className="font-serif italic text-lg text-foreground/90">&ldquo;{testimonial.quote}&rdquo;</span>
        </p>

        {/* Author */}
        <div className="flex items-center gap-4 pt-4 sm:pt-6 border-t border-foreground/5">
          <GenerativeAvatar
            initials={testimonial.initials}
            color={testimonial.color}
            index={index}
          />
          <div>
            <p className="text-foreground font-semibold text-sm flex items-center gap-2">
              {testimonial.name}
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
            </p>
            <p className="text-foreground/60 text-xs">{testimonial.role}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isInView]);

  return (
    <section id="testimonials" ref={ref} className="section-anchor relative bg-transparent py-8 md:py-12 lg:py-16 overflow-hidden z-[40]">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-16"
        >
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-2xl border backdrop-blur-[100px] bg-gradient-to-r from-white/8 via-white/4 to-white/2 border-indigo-300/40 hover:border-white/35 shadow-[inset_0_2px_2px_rgba(255,255,255,0.3),0_8px_24px_rgba(31,38,135,0.1)] mb-6 group">
            <span className="w-4 h-4 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-md group-hover:scale-110 transition-transform" />
            <span className="text-sm md:text-base font-mono uppercase tracking-[0.2em] font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400">
              Client Stories
            </span>
            <span className="h-1 w-12 md:w-16 rounded-full bg-gradient-to-r from-indigo-400/60 to-transparent" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            Loved by <span className="bg-indigo-500/10 border border-indigo-300/40 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-2 py-0.5 rounded-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">leaders</span> worldwide
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, i) => (
            <TestimonialCard 
              key={testimonial.name}
              testimonial={testimonial}
              index={i}
              active={active}
              setActive={setActive}
              isInView={isInView}
              className={i === 2 ? 'md:col-span-2 lg:col-span-1' : ''}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
