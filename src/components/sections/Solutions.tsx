'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CinematicContainer, CinematicFragment } from '@/components/shared/animations/CinematicReveal';
import SectionTag from '@/components/shared/SectionTag';
import { Terminal, ArrowRight, Play, Pause, RotateCcw, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import ProcessPlaybackConsole from '@/components/shared/ProcessPlaybackConsole';

const PHASES = [
  {
    id: '01',
    title: 'Discovery & Strategy',
    desc: 'Requirements gathering & roadmap scoping',
    focus: 'Translating business goals into a structured technical plan, defining API scopes, database design, and key milestones.',
    deliverable: '5-Milestone Roadmap & Cost Blueprint',
    tools: ['Figma Layouts', 'User Persona Surveys', 'API Contracts'],
  },
  {
    id: '02',
    title: 'Architecture & Design',
    desc: 'System blueprints & database schemas',
    focus: 'Designing schemas, relationship maps, container orchestrations, and configuring third-party integration contracts.',
    deliverable: 'ERD Database Blueprints & OpenAPI Specs',
    tools: ['Prisma Schema', 'Docker Blueprints', 'AWS VPC Maps'],
  },
  {
    id: '03',
    title: 'Engineering & Development',
    desc: 'Blazing-fast production code development',
    focus: 'Structuring high-performance frontend interfaces, writing server-side APIs, and building automated background pipelines.',
    deliverable: 'Production-ready Next.js & Node.js codebases',
    tools: ['Next.js App Router', 'TypeScript Core', 'Redis Caches'],
  },
  {
    id: '04',
    title: 'Testing & QA',
    desc: 'Automated test suite & security audit',
    focus: 'Deploying isolated testing runners, conducting compliance assessments, and verifying conversion paths via Playwright.',
    deliverable: '100% Passed Tests & Lighthouse Audits',
    tools: ['Jest Units', 'Playwright E2E', 'Lighthouse Audits'],
  },
  {
    id: '05',
    title: 'Launch & Support',
    desc: 'Global CDN distribution & live release',
    focus: 'Publishing production builds, configuring real-time error tracking software, and guaranteeing SLA uptime monitors.',
    deliverable: 'Live Production URL & Edge CDN Caching',
    tools: ['Vercel Edge CDN', 'Sentry Trackers', 'Datadog Monitors'],
  },
];

export default function Solutions() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return;
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    // Moderate tilt for the wide console card
    setRotateX((y - 0.5) * -4);
    setRotateY((x - 0.5) * 4);
    setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  const handlePhaseSelect = (idx: number) => {
    setIsPlaying(false);
    setActivePhaseIndex(idx);
  };

  return (
    <section id="solutions" ref={containerRef} className="relative py-6 md:py-12 lg:py-16 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/3 left-[-10%] w-[450px] h-[450px] bg-indigo-200/30 rounded-full blur-[120px] pointer-events-none animate-orb-1" />
      <div className="absolute bottom-1/3 right-[-10%] w-[400px] h-[400px] bg-violet-200/20 rounded-full blur-[120px] pointer-events-none animate-orb-2" />

      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 lg:px-8 xl:px-12 relative z-10">
        {/* Section Header */}
        <CinematicContainer className="text-center mb-5 md:mb-12">
          <CinematicFragment direction="top">
            <SectionTag text="INTERACTIVE PIPELINE" variant="light" className="justify-center" />
          </CinematicFragment>
          <CinematicFragment direction="bottom" delay={0.1}>
            <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mt-2 md:mt-4 tracking-tight leading-tight">
              Process Simulation{' '}
              <span className="bg-indigo-500/10 border border-indigo-300/40 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-650 to-violet-600 px-3 py-1 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
                Console
              </span>
            </h2>
          </CinematicFragment>
          <CinematicFragment direction="bottom" delay={0.2}>
            <p className="text-foreground/60 text-base md:text-lg font-medium max-w-xl mx-auto mt-4">
              Bypass the standard black-box agency workflow. Real-time logging of how your projects move from strategy to launch.
            </p>
          </CinematicFragment>
        </CinematicContainer>

        {/* Console Container Card (Same style as Service Bento Cards) */}
        <CinematicContainer className="w-full">
          <CinematicFragment direction="deep-space" className="w-full" delay={0.3}>
            <motion.div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={handleMouseLeave}
              animate={{ rotateX, rotateY }}
              transition={{ type: 'spring', stiffness: 220, damping: 25 }}
              className="relative overflow-hidden rounded-[2.5rem] backdrop-blur-2xl border border-indigo-300/30 ring-1 ring-indigo-400/10 bg-gradient-to-br from-blue-600/[0.03] via-indigo-500/[0.015] to-transparent shadow-[0_12px_40px_rgba(99,102,241,0.06),inset_0_1px_0_rgba(255,255,255,0.45)] hover:border-indigo-300/50 hover:shadow-[0_24px_60px_rgba(99,102,241,0.1),inset_0_1px_0_rgba(255,255,255,0.6)] transition-all duration-500 p-4 sm:p-6 md:p-8 lg:p-8 xl:p-10"
              style={{ transformStyle: 'preserve-3d', perspective: 1500 }}
            >
          {/* Spotlight background overlay */}
          {isHovered && (
            <div
              className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-300"
              style={{
                background: `radial-gradient(700px circle at ${coords.x}px ${coords.y}px, rgba(99, 102, 241, 0.12), transparent 80%)`,
              }}
            />
          )}

          {/* Light Sweep Effect */}
          <div className="absolute top-0 left-[-100%] w-[50%] h-[200%] bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-[35deg] opacity-0 group-hover:opacity-100 group-hover:left-[200%] transition-all duration-1000 pointer-events-none z-0" />

          {/* Ambient color gradient orb */}
          <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full blur-[60px] bg-indigo-500/15 pointer-events-none z-0" />

          {/* Bento grid inside the card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 xl:gap-12 relative z-10 items-stretch">
            
            {/* Left Column: Interactive Subcards of Process */}
            <div className="lg:col-span-5 flex flex-col justify-between lg:min-h-[580px]" style={{ transform: 'translateZ(30px)' }}>
              <div>
                <div className="flex items-center gap-2.5 mb-6">
                  <Terminal className="w-5 h-5 text-indigo-600" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.15em] bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-full text-indigo-650 font-bold">
                    bash - pipeline-simulator
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-foreground mb-6 tracking-tight">
                  ACTIVE: {activePhaseIndex === 4 ? 'Launch & Support' : PHASES[activePhaseIndex].title}
                </h3>

                {/* Subcards list */}
                <div className="flex flex-col gap-3 mb-8">
                  {PHASES.map((phase, idx) => {
                    const isActive = idx === activePhaseIndex;
                    return (
                      <button
                        key={phase.id}
                        onClick={() => handlePhaseSelect(idx)}
                        className={`text-left p-3.5 rounded-2xl border transition-all duration-300 flex items-start gap-4 relative group/item ${
                          isActive
                            ? 'bg-white border-indigo-200 shadow-[0_4px_16px_rgba(99,102,241,0.06),inset_0_1px_0_rgba(255,255,255,0.8)] scale-[1.02]'
                            : 'bg-white/40 border-indigo-100/50 hover:bg-white/70 hover:border-indigo-200'
                        }`}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-3.5 bottom-3.5 w-1 bg-indigo-600 rounded-r-md" />
                        )}
                        <span
                          className={`text-xs font-mono font-bold px-2 py-0.5 rounded-lg border ${
                            isActive
                              ? 'bg-indigo-50 border-indigo-250 text-indigo-650'
                              : 'bg-foreground/5 border-foreground/10 text-foreground/55 group-hover/item:text-foreground/85'
                          }`}
                        >
                          PHASE {phase.id}
                        </span>
                        <div>
                          <h4
                            className={`text-xs font-extrabold tracking-tight ${
                              isActive ? 'text-indigo-950' : 'text-slate-700'
                            }`}
                          >
                            {phase.title}
                          </h4>
                          {isActive && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="text-[10px] text-foreground/75 mt-2 pt-2 border-t border-indigo-100 flex flex-col gap-2 font-medium"
                            >
                              <p className="leading-normal text-[10.5px] text-slate-600">
                                {phase.focus}
                              </p>
                              <div className="flex flex-col gap-1">
                                <div className="text-[9px] uppercase tracking-wider font-extrabold text-indigo-650 flex items-center gap-1.5">
                                  <span>Outcome:</span>
                                  <span className="bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded text-[8.5px] text-indigo-700 font-bold lowercase first-letter:uppercase">
                                    {phase.deliverable}
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {phase.tools.map((tool) => (
                                    <span
                                      key={tool}
                                      className="text-[8px] font-mono px-1.5 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 rounded"
                                    >
                                      {tool}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </div>
                        <ChevronRight
                          className={`w-3.5 h-3.5 ml-auto self-center transition-all ${
                            isActive ? 'text-indigo-600 translate-x-0.5' : 'text-slate-400 opacity-0 group-hover/item:opacity-100'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Button */}
              <Link
                href="/process"
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 rounded-full font-bold text-sm hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white hover:border-transparent transition-all w-fit shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]"
              >
                Learn More About Process <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Right Column: Console Simulator */}
            <div className="lg:col-span-7 flex flex-col relative" style={{ transform: 'translateZ(20px)' }}>
              <ProcessPlaybackConsole
                activePhaseIndex={activePhaseIndex}
                setActivePhaseIndex={setActivePhaseIndex}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
              />
            </div>

          </div>
            </motion.div>
          </CinematicFragment>
        </CinematicContainer>
      </div>
    </section>
  );
}
