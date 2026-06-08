'use client';

import { useRef, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import Logo from '@/components/shared/Logo';
import Link from 'next/link';

/* ═══════════════════════════════════════════════
   NEURAL CONSTELLATION — Canvas visualization
   Mirrors the Cognisa logo's dendrite / synapse 
   visual language in blue→purple gradient.
   ═══════════════════════════════════════════════ */

interface Node {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  radius: number;
  hue: number;
  phase: number;
  speed: number;
  layer: number; // 0=core, 1=mid, 2=outer
}

interface Branch {
  from: number;
  to: number;
  thickness: number;
  opacity: number;
}

function NeuralConstellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const nodesRef = useRef<Node[]>([]);
  const branchesRef = useRef<Branch[]>([]);
  const frameRef = useRef(0);

  const initNetwork = useCallback((w: number, h: number) => {
    const nodes: Node[] = [];
    const branches: Branch[] = [];

    // Center of the constellation — offset right like the mockup
    const cx = w * 0.62;
    const cy = h * 0.42;

    // Core nodes — the central "synapse" cluster
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + Math.random() * 0.3;
      const dist = 15 + Math.random() * 35;
      nodes.push({
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        baseX: cx + Math.cos(angle) * dist,
        baseY: cy + Math.sin(angle) * dist,
        vx: 0, vy: 0,
        radius: 4 + Math.random() * 3,
        hue: 220 + Math.random() * 15, // bright blue core
        phase: Math.random() * Math.PI * 2,
        speed: 0.25 + Math.random() * 0.35,
        layer: 0,
      });
    }

    // Mid-layer nodes — branching dendrites
    for (let i = 0; i < 22; i++) {
      const angle = (i / 22) * Math.PI * 2 + Math.random() * 0.4;
      const dist = 70 + Math.random() * 140;
      const px = cx + Math.cos(angle) * dist;
      const py = cy + Math.sin(angle) * dist;
      nodes.push({
        x: px, y: py, baseX: px, baseY: py,
        vx: 0, vy: 0,
        radius: 2.5 + Math.random() * 2.5,
        hue: 235 + Math.random() * 35, // indigo-violet
        phase: Math.random() * Math.PI * 2,
        speed: 0.18 + Math.random() * 0.28,
        layer: 1,
      });
    }

    // Outer nodes — terminal synaptic endpoints (like the logo's dots)
    for (let i = 0; i < 35; i++) {
      const angle = (i / 35) * Math.PI * 2 + Math.random() * 0.5;
      const dist = 160 + Math.random() * 250;
      // Bias toward top-right quadrant like the mockup's dendrite spread
      const bias = (angle > -Math.PI * 0.4 && angle < Math.PI * 0.9) ? 1.35 : 0.75;
      const px = cx + Math.cos(angle) * dist * bias;
      const py = cy + Math.sin(angle) * dist * bias;
      nodes.push({
        x: px, y: py, baseX: px, baseY: py,
        vx: 0, vy: 0,
        radius: 2 + Math.random() * 3.5,
        hue: 255 + Math.random() * 50, // violet-purple-pink
        phase: Math.random() * Math.PI * 2,
        speed: 0.12 + Math.random() * 0.18,
        layer: 2,
      });
    }

    // Build organic branches — connect layers like dendrites
    const coreCount = 6;
    const midStart = coreCount;
    const midEnd = midStart + 22;
    const outerStart = midEnd;

    // Core-to-core connections
    for (let i = 0; i < coreCount; i++) {
      for (let j = i + 1; j < coreCount; j++) {
        if (Math.random() > 0.25) {
          branches.push({ from: i, to: j, thickness: 1.5, opacity: 0.3 });
        }
      }
    }

    // Core-to-mid connections (main dendrite branches)
    for (let i = midStart; i < midEnd; i++) {
      const closest = findClosest(nodes[i], nodes.slice(0, coreCount));
      branches.push({ from: closest, to: i, thickness: 1.0, opacity: 0.22 });
      // Cross-connections between mid-layer nodes
      if (Math.random() > 0.55) {
        const other = midStart + Math.floor(Math.random() * 22);
        if (other !== i) {
          branches.push({ from: i, to: other, thickness: 0.6, opacity: 0.1 });
        }
      }
    }

    // Mid-to-outer connections (terminal dendrites)
    for (let i = outerStart; i < nodes.length; i++) {
      const closest = findClosest(nodes[i], nodes.slice(midStart, midEnd)) + midStart;
      branches.push({ from: closest, to: i, thickness: 0.5, opacity: 0.15 });
    }

    nodesRef.current = nodes;
    branchesRef.current = branches;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const dpr = Math.min(window.devicePixelRatio, 2);

    const resize = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initNetwork(w, h);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const draw = (time: number) => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const nodes = nodesRef.current;
      const branches = branchesRef.current;
      const t = time * 0.001;

      // Animate nodes — gentle organic drift
      nodes.forEach((node) => {
        const drift = Math.sin(t * node.speed + node.phase);
        const driftY = Math.cos(t * node.speed * 0.7 + node.phase + 1);
        const amplitude = node.layer === 0 ? 3 : node.layer === 1 ? 6 : 10;

        node.x = node.baseX + drift * amplitude;
        node.y = node.baseY + driftY * amplitude * 0.8;

        // Mouse interaction — nodes are attracted toward cursor
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - node.x;
          const dy = mouseRef.current.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 280) {
            const force = (1 - dist / 280) * 0.2;
            node.x += dx * force * (node.layer === 0 ? 0.2 : 1);
            node.y += dy * force * (node.layer === 0 ? 0.2 : 1);
          }
        }
      });

      // Draw branches — curved organic lines like dendrites
      branches.forEach((branch) => {
        const from = nodes[branch.from];
        const to = nodes[branch.to];
        if (!from || !to) return;

        // Pulsing opacity
        const pulse = 0.5 + 0.5 * Math.sin(t * 1.5 + branch.from * 0.5);
        const alpha = branch.opacity * (0.6 + 0.4 * pulse);

        // Curved line (quadratic bezier with organic midpoint)
        const mx = (from.x + to.x) / 2 + Math.sin(t + branch.from) * 8;
        const my = (from.y + to.y) / 2 + Math.cos(t + branch.to) * 8;

        // Gradient along the branch: blue→purple
        const grad = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
        grad.addColorStop(0, `hsla(${from.hue}, 70%, 65%, ${alpha})`);
        grad.addColorStop(1, `hsla(${to.hue}, 70%, 65%, ${alpha})`);

        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.quadraticCurveTo(mx, my, to.x, to.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = branch.thickness;
        ctx.stroke();
      });

      // Draw nodes — glowing synaptic dots (like the logo's luminous endpoints)
      nodes.forEach((node) => {
        const pulse = 0.7 + 0.3 * Math.sin(t * 2 + node.phase);
        const r = node.radius * pulse;

        // Outer glow halo
        const glowRadius = r * 5;
        const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowRadius);
        glow.addColorStop(0, `hsla(${node.hue}, 85%, 72%, ${0.25 * pulse})`);
        glow.addColorStop(0.5, `hsla(${node.hue}, 80%, 70%, ${0.08 * pulse})`);
        glow.addColorStop(1, `hsla(${node.hue}, 80%, 70%, 0)`);
        ctx.beginPath();
        ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Core dot — brighter, more saturated
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        const sat = node.layer === 0 ? 90 : 75;
        const light = node.layer === 0 ? 62 : 68;
        ctx.fillStyle = `hsla(${node.hue}, ${sat}%, ${light}%, ${0.7 + 0.3 * pulse})`;
        ctx.fill();

        // Bright center highlight (for core nodes)
        if (node.layer === 0) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, r * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${node.hue}, 100%, 85%, ${0.8 * pulse})`;
          ctx.fill();
        }
      });

      animId = requestAnimationFrame(draw);
    };

    resize();
    animId = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [initNetwork]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto z-[1]"
    />
  );
}

/** Find the index of the closest node in a subset */
function findClosest(target: { x: number; y: number }, candidates: Node[]): number {
  let minDist = Infinity;
  let minIdx = 0;
  candidates.forEach((c, i) => {
    const d = Math.hypot(target.x - c.x, target.y - c.y);
    if (d < minDist) { minDist = d; minIdx = i; }
  });
  return minIdx;
}

/* ═══════════════════════════════════════════════
   ANIMATED COUNTER
   ═══════════════════════════════════════════════ */

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const counted = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          const start = Date.now();
          const duration = 1800;
          const tick = () => {
            const progress = Math.min((Date.now() - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            el.textContent = `${Math.floor(eased * value)}${suffix}`;
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

/* ═══════════════════════════════════════════════
   ANIMATION VARIANTS
   ═══════════════════════════════════════════════ */

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
};

const wordReveal = {
  hidden: { opacity: 0, y: 50, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ═══════════════════════════════════════════════
   HERO COMPONENT
   ═══════════════════════════════════════════════ */

const STATS = [
  { value: 150, suffix: '+', label: 'Projects Delivered' },
  { value: 99, suffix: '%', label: 'Client Satisfaction' },
  { value: 24, suffix: '/7', label: 'Support & Monitoring' },
];

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const contentY = useTransform(scrollYProgress, [0, 0.4], [0, -80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const networkOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const networkScale = useTransform(scrollYProgress, [0, 0.35], [1, 1.15]);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="section-anchor relative min-h-0 lg:min-h-screen pt-28 pb-2 sm:pt-32 md:pt-36 lg:py-0 flex items-center bg-transparent overflow-hidden"
    >
      {/* ── Logo (desktop & mobile landing) ── */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-6 left-6 md:top-8 md:left-8 lg:hidden z-30"
      >
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-36 md:h-36">
          {/* Static iridescent gradient clipped to circle */}
          <div
            className="absolute inset-0 rounded-full overflow-hidden"
            style={{
              background: 'conic-gradient(from 180deg at 50% 50%, rgba(99,102,241,0.9) 0deg, rgba(167,139,250,0.9) 72deg, rgba(236,72,153,0.8) 144deg, rgba(139,92,246,0.9) 216deg, rgba(56,189,248,0.8) 288deg, rgba(99,102,241,0.9) 360deg)',
              boxShadow: 'inset 20px 20px 60px rgba(255,255,255,0.4), inset -20px -20px 60px rgba(0,0,0,0.2), 0 0 60px rgba(99,102,241,0.3)',
              opacity: 0.5,
              filter: 'blur(4px)',
            }}
          />
          <a href="#hero" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <div className="absolute inset-0 rounded-full glass-surface-strong border border-indigo-300/40 flex items-center justify-center shadow-[0_16px_48px_rgba(99,102,241,0.15)]">
              <Logo className="h-10 sm:h-12 md:h-20 w-auto scale-125 drop-shadow-[0_0_30px_rgba(99,102,241,0.3)]" />
            </div>
          </a>
        </div>
      </motion.div>

      {/* ── Neural Constellation Canvas ── */}
      <motion.div
        style={{ opacity: networkOpacity, scale: networkScale }}
        className="absolute inset-0 z-[1] lg:left-[25%] lg:origin-left"
      >
        <NeuralConstellation />
      </motion.div>

      {/* ── Subtle dot-grid texture ── */}
      <div
        className="absolute inset-0 z-[0] opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #6366f1 0.8px, transparent 0.8px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* ── Ambient gradient wash (very subtle) ── */}
      <div className="absolute inset-0 z-[0] pointer-events-none">
        <div className="absolute top-0 right-0 w-[60%] h-[70%] bg-gradient-to-bl from-indigo-100/40 via-violet-50/20 to-transparent rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[50%] bg-gradient-to-tr from-blue-50/30 via-transparent to-transparent rounded-full blur-[100px]" />
      </div>

      {/* ── Main Content ── */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-20 w-full max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 min-h-0 lg:min-h-screen flex items-center"
      >
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 items-center">
          <div className="w-full max-w-4xl mx-auto lg:mx-0 lg:max-w-xl flex flex-col items-center text-center lg:items-start lg:text-left">

          {/* Status Pill */}
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 md:mb-12"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-indigo-300/40 bg-gradient-to-r from-white/8 via-white/4 to-white/2 shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,0.35),0_8px_24px_rgba(31,38,135,0.05)] backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-foreground/50 font-mono text-[10px] sm:text-[11px] tracking-[0.18em] uppercase font-semibold">
                Software · Development · Automation · AI
              </span>
            </div>
          </motion.div>

          {/* ── Headline ── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="mb-4 md:mb-6"
          >
            {/* Line 1: We think, */}
            <motion.h1 className="flex items-baseline justify-center lg:justify-start gap-[0.3em] text-[clamp(3rem,8vw,7rem)] font-extrabold leading-[1.05] tracking-[-0.04em]">
              <motion.span variants={wordReveal} className="text-foreground">
                We
              </motion.span>
              <motion.span variants={wordReveal}>
                <span className="bg-gradient-to-r from-[#4f8bfa] via-[#6366f1] to-[#a78bfa] bg-clip-text text-transparent">
                  think,
                </span>
              </motion.span>
            </motion.h1>
 
            {/* Line 2: you grow */}
            <motion.h1 className="flex items-baseline justify-center lg:justify-start gap-[0.3em] text-[clamp(3rem,8vw,7rem)] font-extrabold leading-[1.05] tracking-[-0.04em] -mt-2 md:-mt-3">
              <motion.span variants={wordReveal} className="text-foreground">
                you
              </motion.span>
              <motion.span variants={wordReveal}>
                <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#c084fc] bg-clip-text text-transparent">
                  grow
                </span>
              </motion.span>
            </motion.h1>
 
            {/* Line 3: — that's the deal. */}
            <motion.p
              variants={wordReveal}
              className="text-[clamp(1.1rem,2.2vw,1.75rem)] font-medium text-foreground/35 mt-2 tracking-[-0.01em]"
            >
              — that&apos;s the deal.
            </motion.p>
          </motion.div>
 
          {/* ── Subheadline ── */}
          <motion.p
            custom={1.0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-base md:text-lg text-foreground/60 mb-6 md:mb-12 max-w-xl leading-[1.7] font-medium"
          >
            End-to-end{' '}
            <span className="text-foreground/80 font-semibold">AI automation</span> and{' '}
            <span className="text-foreground/80 font-semibold">software development</span>{' '}
            that transforms your business.
          </motion.p>
 
          {/* ── CTAs ── */}
          <motion.div
            custom={1.3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 mb-6 md:mb-16"
          >
            {/* Primary */}
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/contact"
                className="group relative inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full font-semibold text-white text-[15px] bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 shadow-[0_6px_30px_rgba(99,102,241,0.25)] hover:opacity-95 transition-all duration-300 overflow-hidden"
              >
                {/* Shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.12] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                <span className="relative z-10">Get Started</span>
                <ArrowRight className="relative z-10 w-[18px] h-[18px] transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
 
            {/* Secondary */}
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/work"
                className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-medium text-foreground/70 text-[15px] border border-indigo-300/40 bg-gradient-to-br from-blue-600/[0.04] via-indigo-500/[0.015] to-transparent backdrop-blur-sm hover:border-indigo-300/60 hover:text-foreground transition-all duration-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]"
              >
                View Our Work
                <ChevronRight className="w-4 h-4 opacity-40 group-hover:opacity-80 group-hover:translate-x-0.5 transition-all" />
              </Link>
            </motion.div>
          </motion.div>
 
          {/* ── Stats ── */}
          <motion.div
            custom={1.6}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 lg:gap-8"
          >
            {STATS.map((stat, i) => (
              <div key={i} className={`relative overflow-hidden bg-gradient-to-br from-blue-600/[0.04] via-indigo-500/[0.02] to-transparent backdrop-blur-xl rounded-2xl p-3 md:p-4 border border-indigo-300/30 ring-1 ring-indigo-400/10 shadow-[0_4px_16px_rgba(59,130,246,0.08),inset_0_1px_0_rgba(255,255,255,0.45)] group hover:border-indigo-300/50 transition-all duration-500 ${i === 2 ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
                {/* Micro chart background */}
                <div className="absolute inset-0 opacity-30 pointer-events-none">
                  <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                    <motion.path
                      d={`M0,${35 - i * 5} Q20,${20 - i * 3} 40,${25 - i * 4} T60,${15 - i * 2} T80,${10 - i} T100,${5}`}
                      fill="none"
                      stroke="url(#statGrad)"
                      strokeWidth="1.5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, delay: 1.8 + i * 0.2 }}
                    />
                    <defs>
                      <linearGradient id="statGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.1" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="relative z-10 flex flex-col items-center lg:items-start gap-1">
                  <span className="text-xl md:text-2xl font-bold text-foreground/80 tracking-tight">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </span>
                  <span className="text-[9px] md:text-[10px] font-medium text-foreground/45 tracking-wider uppercase flex items-center gap-1.5">
                    {i === 2 && (
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      </span>
                    )}
                    {stat.label}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
          </div>
 
        </div>
      </motion.div>
 
      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        style={{ opacity: contentOpacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 hidden md:flex"
      >
        <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-foreground/35 hidden md:block">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-[18px] h-7 border border-foreground/[0.12] rounded-full flex justify-center pt-1"
        >
          <motion.div
            animate={{ opacity: [0.2, 0.8, 0.2], scaleY: [0.5, 1, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-[2px] h-[6px] bg-indigo-400/60 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
