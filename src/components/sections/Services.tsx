'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { CinematicContainer, CinematicFragment } from '@/components/shared/animations/CinematicReveal';
import { Code2, BrainCircuit, TrendingUp, Server, ArrowRight, Globe } from 'lucide-react';
import Link from 'next/link';
import WebPreviewFrame from '@/components/shared/fragments/WebPreviewFrame';
import TaskFlowSimulation from '@/components/shared/fragments/TaskFlowSimulation';
import ServerTopologyMap from '@/components/shared/fragments/ServerTopologyMap';
import CICDPipelineSimulator from '@/components/shared/fragments/CICDPipelineSimulator';

const services = [
  {
    icon: Globe,
    number: '01',
    category: 'Engineering',
    slug: 'web-development',
    title: 'Website & Web Apps',
    description:
      'Build fast, scalable, and custom web applications that solve your precise business bottlenecks. We deliver clean, maintainable code engineered for high performance.',
    subservices: ['Custom Web Applications', 'API Integration', 'Legacy System Modernization', 'E-Commerce & Portals'],
    color: '#4f46e5', // indigo-600
  },
  {
    icon: BrainCircuit,
    number: '02',
    category: 'Intelligence',
    slug: 'ai-automation',
    title: 'AI & Automation',
    description:
      'Replace manual data entry and repetitive workflows with intelligent AI agents. We build custom software solutions that operate 24/7 without fatiguing.',
    subservices: ['Workflow Automation', 'Custom AI Agents', 'Data Processing Pipelines', 'Automated Support'],
    color: '#7c3aed', // violet-600
  },
  {
    icon: TrendingUp,
    number: '03',
    category: 'Infrastructure',
    slug: 'system-architecture',
    title: 'System Architecture',
    description:
      'Robust system design ensuring zero downtime and infinite scalability. We design and deploy robust architectures that can handle millions of requests.',
    subservices: ['Scalable Databases', 'Microservices', 'API Development', 'Load Balancing'],
    color: '#6366f1', // indigo-500
  },
  {
    icon: Server,
    number: '04',
    category: 'DevOps',
    slug: 'cloud-infrastructure',
    title: 'Cloud Infrastructure',
    description:
      'Secure, managed cloud deployments optimized for cost and speed. Keep your custom infrastructure secure and running smoothly with zero downtime.',
    subservices: ['Managed Hosting', 'CI/CD Pipelines', 'Security & Compliance', 'Edge Networks'],
    color: '#818cf8', // indigo-400
  },
];

export default function Services() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobileScreen, setIsMobileScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Spotlight coordinates states
  const [leftCoords, setLeftCoords] = useState({ x: 0, y: 0 });
  const [leftHovered, setLeftHovered] = useState(false);
  const [rightCoords, setRightCoords] = useState({ x: 0, y: 0 });
  const [rightHovered, setRightHovered] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    let index = Math.floor(latest * 4);
    if (index >= 4) index = 3;
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  });

  const activeService = services[activeIndex];

  const handleLeftMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setLeftCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleRightMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setRightCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <section id="services" ref={containerRef} className="section-anchor relative h-[360vh] md:h-[400vh] bg-transparent z-[20]">
      {/* Sticky visible area */}
      <div className="services-sticky-container sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-start lg:justify-start xl:justify-center items-center pt-6 pb-6 md:pt-20 md:pb-10 lg:pt-6 xl:pt-0 z-10">
        
        {/* Background ambient glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="noise-overlay absolute inset-0 opacity-30" />
          <motion.div 
            animate={{ 
              background: `radial-gradient(circle at 50% 50%, ${activeService.color}10 0%, transparent 60%)`
            }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 w-full h-full"
          />
        </div>

        {/* Content Wrapper */}
        <div className="relative z-10 w-full max-w-[1200px] mx-auto flex flex-col items-center">
          
          {/* Header Area */}
          <CinematicContainer className="services-header-container text-center max-w-3xl mx-auto px-4 mb-2 sm:mb-4 md:mb-6 lg:mb-4 xl:mb-12 w-full z-20">
            <CinematicFragment direction="top">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 sm:px-6 sm:py-2 rounded-2xl border backdrop-blur-[100px] bg-gradient-to-r from-white/8 via-white/4 to-white/2 border-indigo-300/40 hover:border-white/35 shadow-[inset_0_2px_2px_rgba(255,255,255,0.3),0_8px_24px_rgba(31,38,135,0.1)] mb-1.5 sm:mb-4 group">
                <span className="relative w-4 h-4 group-hover:scale-110 transition-transform">
                  <span className="absolute inset-0 rounded-md bg-gradient-to-br from-indigo-400 to-indigo-600 animate-ping opacity-40" />
                  <span className="relative block w-4 h-4 rounded-md bg-gradient-to-br from-indigo-400 to-indigo-600" />
                </span>
                <span className="text-sm md:text-base font-mono uppercase tracking-[0.2em] font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400">
                  OUR SERVICES
                </span>
                <span className="h-1 w-12 md:w-16 rounded-full bg-gradient-to-r from-indigo-400/60 to-transparent" />
              </div>
            </CinematicFragment>

            <CinematicFragment direction="bottom">
              <h2 className="services-header-title text-lg sm:text-3xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] via-[#818cf8] to-[#c084fc] drop-shadow-sm mb-1 sm:mb-3 leading-tight tracking-tight whitespace-nowrap">
                Services that drive growth.
              </h2>
            </CinematicFragment>

            <CinematicFragment direction="bottom" delay={0.1}>
              <p className="services-header-desc text-foreground/70 text-base md:text-lg leading-relaxed mb-4 font-medium hidden xl:block">
                No running around for different experts. We handle it all. From custom software to AI automation, we build the systems that scale your business.
              </p>
            </CinematicFragment>
            
            <CinematicFragment direction="bottom" delay={0.2}>
              <Link 
                href="/services" 
                className="services-header-btn inline-flex items-center gap-2 px-5 py-2 md:px-6 md:py-3 bg-gradient-to-br from-blue-600/[0.08] via-indigo-500/[0.04] to-transparent border border-indigo-300/40 rounded-full font-semibold text-foreground hover:from-blue-600/[0.15] hover:via-indigo-500/[0.08] transition-all shadow-[0_4px_12px_rgba(59,130,246,0.08),inset_0_1px_0_rgba(255,255,255,1)] group mx-auto text-xs md:text-sm"
              >
                View All Services
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </CinematicFragment>
          </CinematicContainer>

          {/* Cards Area */}
          <CinematicContainer className="services-card-container w-full relative h-[19rem] sm:h-[24rem] md:h-[36rem] lg:h-[38rem] xl:h-[37rem] mb-3 md:mb-8 px-4" delayChildren={0.3}>
            <CinematicFragment direction="deep-space" className="w-full h-full relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute inset-0 w-[calc(100%-2rem)] left-4 glass-surface-strong rounded-[1.5rem] md:rounded-[2rem] flex flex-col overflow-hidden border border-indigo-300/40 shadow-[0_20px_50px_rgba(99,102,241,0.06)]"
                  style={{
                    boxShadow: `0 24px 60px rgba(99,102,241,0.05), 0 0 25px ${activeService.color}15, inset 0 1px 0 rgba(255, 255, 255, 0.45)`
                  }}
                >
                  {/* Decorative ambient color blur inside card */}
                  <div 
                    className="absolute -top-32 -left-32 w-64 h-64 rounded-full blur-[90px] opacity-25 pointer-events-none" 
                    style={{ backgroundColor: activeService.color }} 
                  />
                  
                  {/* Browser Top Bar */}
                  <div className="w-full flex items-center gap-2 px-6 py-3 md:py-4 glass-surface border-b border-indigo-300/30 border-x-0 border-t-0">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                    </div>
                    <div className="text-[10px] sm:text-[10px] font-mono text-foreground/40 ml-4 truncate max-w-[50%]">cognisa.io/services/{activeService.slug}</div>
                  </div>

                  {/* Card Content Row */}
                  <div className="services-card-content flex flex-col-reverse md:flex-row gap-3 md:gap-12 items-stretch p-3.5 sm:p-5 md:p-8 lg:p-8 pb-3.5 md:pb-8 h-full flex-grow relative">
                    
                    {/* Left Content with spotlight */}
                    <div 
                      onMouseMove={handleLeftMouseMove}
                      onMouseEnter={() => setLeftHovered(true)}
                      onMouseLeave={() => setLeftHovered(false)}
                      className="hidden md:flex w-full md:w-[50%] text-left relative z-10 flex-col justify-start md:justify-center flex-grow md:h-full p-1 sm:p-2 pb-0 md:p-6 rounded-2xl transition-all duration-500 overflow-hidden"
                    >
                      {leftHovered && (
                        <div 
                          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-0"
                          style={{
                            background: `radial-gradient(280px circle at ${leftCoords.x}px ${leftCoords.y}px, rgba(99, 102, 241, 0.07), transparent 80%)`,
                          }}
                        />
                      )}

                      <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-br from-blue-600/[0.05] via-indigo-500/[0.02] to-transparent border border-indigo-300/30 text-[10px] md:text-[10px] font-bold uppercase tracking-[0.15em] text-foreground/60 mb-1.5 md:mb-6 w-fit shadow-sm relative z-10">
                        {activeService.category}
                      </div>
                      
                      <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-foreground mb-1.5 md:mb-3 tracking-tight leading-tight relative z-10">
                        {activeService.title}
                      </h3>
                      
                      <p className="text-[13px] sm:text-sm md:text-base text-slate-700 mb-2 md:mb-6 leading-relaxed font-medium relative z-10 line-clamp-3 md:line-clamp-none">
                        {activeService.description}
                      </p>
                      
                      <div className="mt-4 md:mt-6 block relative z-10">
                        <Link href={`/services/${activeService.slug}`} className="group inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 bg-gradient-to-br from-blue-600/[0.05] via-indigo-500/[0.02] to-transparent hover:bg-gradient-to-br from-blue-600/[0.08] via-indigo-500/[0.04] to-transparent border border-indigo-300/30 rounded-[1.25rem] text-sm md:text-sm font-semibold transition-all text-foreground/80 hover:text-foreground">
                          Explore {activeService.title}
                          <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                        </Link>
                      </div>
                    </div>

                    {/* Right Graphic Area (Bento Visual Simulator) with spotlight */}
                    <div 
                      onMouseMove={handleRightMouseMove}
                      onMouseEnter={() => setRightHovered(true)}
                      onMouseLeave={() => setRightHovered(false)}
                      className="w-full md:w-[50%] h-full rounded-[1rem] md:rounded-[1.5rem] flex flex-col relative overflow-hidden p-0 md:p-6 bg-gradient-to-br from-blue-600/[0.04] via-indigo-500/[0.015] to-transparent border border-indigo-300/30 ring-1 ring-indigo-400/10 shadow-[0_10px_30px_rgba(99,102,241,0.04),inset_0_1px_0_rgba(255,255,255,0.45)] transition-all duration-500 hover:border-indigo-300/50 hover:shadow-[0_16px_40px_rgba(99,102,241,0.08)] group/right"
                    >
                      {rightHovered && (
                        <div 
                          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-0"
                          style={{
                            background: `radial-gradient(350px circle at ${rightCoords.x}px ${rightCoords.y}px, rgba(99, 102, 241, 0.12), transparent 80%)`,
                          }}
                        />
                      )}
                      
                      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] to-transparent pointer-events-none z-0" />
                      
                      <div className="relative z-10 flex flex-col h-full opacity-[0.95] w-full justify-between">
                        {/* Subservices as flex chips (hidden on mobile, visible on desktop) */}
                        <div className="hidden md:flex flex-wrap gap-1.5 mb-3">
                          {activeService.subservices.map((sub, idx) => (
                            <span 
                              key={idx} 
                              className="px-2.5 py-1 text-[9px] md:text-[10px] font-semibold bg-white/40 border border-indigo-200/50 text-slate-700 rounded-lg shadow-sm backdrop-blur-sm"
                            >
                              {sub}
                            </span>
                          ))}
                        </div>

                        {/* Interactive Simulation Block */}
                        <div className="w-full mt-auto flex-grow flex items-center">
                          {activeIndex === 0 && <WebPreviewFrame />}
                          {activeIndex === 1 && <TaskFlowSimulation />}
                          {activeIndex === 2 && <ServerTopologyMap />}
                          {activeIndex === 3 && <CICDPipelineSimulator />}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </CinematicFragment>
          </CinematicContainer>

          {/* Mobile Description Block (rendered below the card to prevent vertical cropping on small screens) */}
          <CinematicContainer className="w-full flex flex-col items-center text-center px-6 mt-6 md:hidden">
            <CinematicFragment direction="bottom" delay={0.3}>
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-br from-blue-600/[0.05] via-indigo-500/[0.02] to-transparent border border-indigo-300/30 text-[10px] font-bold uppercase tracking-[0.15em] text-foreground/60 mb-3 shadow-sm">
                {activeService.category}
              </div>
            </CinematicFragment>
            
            <CinematicFragment direction="bottom" delay={0.4}>
              <h3 className="text-xl sm:text-2xl font-extrabold text-foreground mb-2 tracking-tight leading-tight">
                {activeService.title}
              </h3>
            </CinematicFragment>
            
            <CinematicFragment direction="bottom" delay={0.5}>
              <p className="text-[13px] sm:text-sm text-slate-700 mb-4 leading-relaxed font-medium">
                {activeService.description}
              </p>
            </CinematicFragment>
            
            <CinematicFragment direction="bottom" delay={0.6}>
              <Link 
                href={`/services/${activeService.slug}`} 
                className="group inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-blue-600/[0.05] via-indigo-500/[0.02] to-transparent hover:bg-gradient-to-br from-blue-600/[0.08] via-indigo-500/[0.04] to-transparent border border-indigo-300/30 rounded-[1.25rem] text-sm font-semibold transition-all text-foreground/80 hover:text-foreground"
              >
                Explore {activeService.title}
                <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </Link>
            </CinematicFragment>
          </CinematicContainer>

          {/* Pagination Text Indicator */}
          <CinematicContainer className="services-pagination-container flex flex-col items-center justify-center relative w-full h-[30px] pointer-events-none mt-4">
            <CinematicFragment direction="bottom" intensity="low">
              <div className="text-foreground/30 text-[10px] md:text-xs font-mono tracking-[0.2em] font-bold uppercase">
                Service {activeIndex + 1} of 4
              </div>
            </CinematicFragment>
          </CinematicContainer>
          
        </div>
      </div>
    </section>
  );
}
