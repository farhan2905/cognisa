'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import LiveMetric from '@/components/shared/LiveMetric';

export default function CTA() {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleRipple = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  };

  return (
    <section id="cta" className="section-anchor relative bg-transparent py-8 md:py-12 lg:py-16 overflow-hidden">
      <div className="noise-overlay absolute inset-0 z-[1]" />
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-indigo-200 rounded-full blur-[150px] opacity-[0.10] animate-orb-1" />
      <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] bg-violet-200 rounded-full blur-[150px] opacity-[0.08] animate-orb-2" />

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
        <div className="glass-surface-strong rounded-[2.5rem] p-6 md:p-12 lg:p-16 border border-indigo-300/40 ring-1 ring-indigo-400/15 shadow-[0_16px_48px_rgba(59,130,246,0.12),inset_0_1px_0_rgba(255,255,255,0.45)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="inline-flex items-center gap-4 px-6 py-3 rounded-2xl border backdrop-blur-[100px] bg-gradient-to-r from-white/8 via-white/4 to-white/2 border-indigo-300/40 hover:border-white/35 shadow-[inset_0_2px_2px_rgba(255,255,255,0.3),0_8px_24px_rgba(31,38,135,0.1)] mb-8 group">
                <span className="w-4 h-4 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-md group-hover:scale-110 transition-transform" />
                <span className="text-sm md:text-base font-mono uppercase tracking-[0.2em] font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400">
                  Let&apos;s Talk
                </span>
                <span className="h-1 w-12 md:w-16 rounded-full bg-gradient-to-r from-indigo-400/60 to-transparent" />
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight tracking-tight mb-6">
                Ready to Transform Your{' '}
                <span className="text-indigo-500">Digital Presence?</span>
              </h2>
              <p className="text-foreground/60 text-lg max-w-xl mb-10 leading-relaxed">
                Let&apos;s start a conversation about your goals. Our team is ready to craft a custom strategy that drives real, measurable results for your business.
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/contact"
                    onClick={handleRipple}
                    className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white px-6 py-3.5 sm:px-10 sm:py-4 rounded-full text-base font-semibold hover:opacity-95 transition-all duration-300 hover:gap-3 shadow-[0_4px_16px_rgba(99,102,241,0.25)] overflow-hidden"
                  >
                    {ripples.map((ripple) => (
                      <span
                        key={ripple.id}
                        className="absolute rounded-full bg-white/30 animate-ping"
                        style={{
                          left: ripple.x - 10,
                          top: ripple.y - 10,
                          width: 20,
                          height: 20,
                        }}
                      />
                    ))}
                    <span className="relative z-10">Get a Free Consultation</span>
                    <ArrowRight className="relative z-10 w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </motion.div>
                <a
                  href="mailto:hello@cognisa.in"
                  className="inline-flex items-center gap-2 border border-foreground/20 text-foreground px-6 py-3.5 sm:px-10 sm:py-4 rounded-full text-base font-medium hover:bg-foreground/5 hover:border-foreground/30 transition-all duration-300"
                >
                  hello@cognisa.in
                </a>
              </div>
            </motion.div>

            {/* Right: Live Metrics + Iridescent Blob */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex items-center justify-center"
            >
              {/* Metrics Panel */}
              <div className="relative glass-panel rounded-[2rem] p-6 md:p-8 w-full max-w-sm lg:max-w-md shadow-[0_16px_48px_rgba(99,102,241,0.15)]">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-indigo-300/20">
                  <div className="relative">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-60" />
                  </div>
                  <span className="text-[10px] font-mono text-foreground/40 uppercase tracking-wider">
                    System Status: Online
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-br from-blue-600/[0.04] via-indigo-500/[0.02] to-transparent border border-indigo-300/20">
                    <span className="text-sm font-medium text-foreground/70">Active Projects</span>
                    <LiveMetric label="" baseValue={7} variance={1} suffix="" interval={4000} />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-br from-blue-600/[0.04] via-indigo-500/[0.02] to-transparent border border-indigo-300/20">
                    <span className="text-sm font-medium text-foreground/70">Deploys Today</span>
                    <LiveMetric label="" baseValue={12} variance={3} suffix="" interval={3500} />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-br from-blue-600/[0.04] via-indigo-500/[0.02] to-transparent border border-indigo-300/20">
                    <span className="text-sm font-medium text-foreground/70">AI Agents Online</span>
                    <LiveMetric label="" baseValue={4} variance={1} suffix="" interval={5000} />
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-indigo-300/15 flex items-center justify-between">
                  <span className="text-[9px] font-mono text-foreground/30 uppercase tracking-wider">
                    Last deploy: 2m ago
                  </span>
                  <span className="text-[9px] font-mono text-emerald-500/70">
                    ● All systems green
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
