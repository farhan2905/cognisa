'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { CinematicContainer, CinematicFragment } from '@/components/shared/animations/CinematicReveal';
import SectionTag from '@/components/shared/SectionTag';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const works = [
  { slug: 'desh-yatraa', number: '01', title: 'Desh Yatraa', description: 'We engineered a comprehensive travel booking and exploration portal for Desh Yatraa. The platform features an intuitive search architecture, seamless booking workflows, and an optimized mobile experience.', detail: 'Travel & Tourism Portal', icon: '✈️', color: '#6366f1', color2: '#a855f7', link: 'https://deshyatraa.com' },
  { slug: 'proxyui', number: '02', title: 'ProxyUI', description: 'A modern UI component showcase with reusable sections and patterns to help teams ship clean interfaces faster.', detail: 'UI Component Library', icon: '🧩', color: '#3b82f6', color2: '#06b6d4', link: 'https://proxyui.vercel.app' },
  { slug: 'voyage-horizon', number: '03', title: 'Voyage Horizon', description: 'Developed a modern digital storefront for Voyage Horizon to showcase their premium travel packages. We focused on high-performance media delivery, lead generation forms, and a custom CMS.', detail: 'Travel Agency Platform', icon: '🌊', color: '#f97316', color2: '#f43f5e', link: 'https://voyagehorizon.co.in' },
  { slug: 'kuch-nahi', number: '04', title: 'Kuch Nahi', description: 'Built a blazing-fast, custom e-commerce solution for Kuch Nahi. The architecture was designed from the ground up to minimize cart abandonment, featuring a hyper-optimized checkout flow and secure payment gateways.', detail: 'E-Commerce Experience', icon: '🛒', color: '#ec4899', color2: '#d946ef', link: 'https://kuchnahi.co.in' },
  { slug: 'bhairav-steel', number: '05', title: 'Bhairav Steel', description: 'Transformed Bhairav Steel\'s traditional business into a powerful digital catalog. We developed a robust B2B platform that handles complex product specifications and quote request automation.', detail: 'B2B Industrial Catalog', icon: '🏗️', color: '#10b981', color2: '#14b8a6', link: 'https://bhairavsteel.in' },
];

export default function Process() {
  const targetRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [xRange, setXRange] = useState<[number | string, number | string]>(["5%", "-75%"]);
  
  const { scrollYProgress } = useScroll({ 
    target: targetRef,
    offset: ["start start", "end end"]
  });

  useEffect(() => {
    const calculateRange = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.scrollWidth;
      const viewportWidth = window.innerWidth;
      
      const startValue = 0;
      const gap = viewportWidth < 768 ? 60 : 120;
      const endValue = viewportWidth - containerWidth - gap;
      
      setXRange([startValue, endValue]);
    };
    
    calculateRange();
    const timer = setTimeout(calculateRange, 500);
    
    window.addEventListener('resize', calculateRange);
    return () => {
      window.removeEventListener('resize', calculateRange);
      clearTimeout(timer);
    };
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    let index = Math.floor(latest * 5);
    if (index >= 5) index = 4;
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  });

  const activeColor1 = works[activeIndex].color;
  const activeColor2 = works[activeIndex].color2;
  const x = useTransform(scrollYProgress, [0, 0.88], xRange);

  return (
    <section id="work" ref={targetRef} className="section-anchor relative h-[340vh] md:h-[400vh] bg-transparent">
      
      <div className="sticky top-0 h-[100vh] flex flex-col justify-start items-center overflow-hidden z-10 pt-6 md:pt-20 lg:pt-6 xl:pt-8">
        
        {/* Dynamic color-changing background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="noise-overlay absolute inset-0 opacity-30 z-[1]" />
          <motion.div 
            animate={{ backgroundColor: activeColor1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute top-[10%] left-[10%] -translate-x-1/4 -translate-y-1/4 w-[70vw] h-[70vw] md:w-[45vw] md:h-[45vw] rounded-full blur-[140px] opacity-[0.22] pointer-events-none" 
          />
          <motion.div 
            animate={{ backgroundColor: activeColor2 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute bottom-[10%] right-[10%] translate-x-1/4 translate-y-1/4 w-[70vw] h-[70vw] md:w-[55vw] md:h-[55vw] rounded-full blur-[140px] opacity-[0.20] pointer-events-none" 
          />
        </div>
        <CinematicContainer className="process-header-container w-full max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 mb-2 mt-1 md:mb-4 md:mt-4 lg:mt-6 flex-shrink-0 flex flex-row items-center md:items-end justify-between gap-3 md:gap-6" staggerChildren={0.12}>
          <div>
            <CinematicFragment direction="left">
              <SectionTag text="OUR WORK" variant="light" />
            </CinematicFragment>
            <CinematicFragment direction="bottom" delay={0.1}>
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/70 leading-tight tracking-tight drop-shadow-sm mt-2 md:mt-4">
                Digital <span className="text-gradient-accent drop-shadow-sm">systems</span> built for real businesses.
              </h2>
            </CinematicFragment>
          </div>
          <CinematicFragment direction="right" delay={0.2}>
            <Link 
              href="/work" 
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-blue-600/[0.08] via-indigo-500/[0.04] to-transparent border border-indigo-300/40 rounded-full font-semibold text-foreground hover:from-blue-600/[0.15] hover:via-indigo-500/[0.08] transition-all shadow-[0_4px_12px_rgba(59,130,246,0.08),inset_0_1px_0_rgba(255,255,255,1)] group text-xs md:text-sm"
            >
              View All Work
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </CinematicFragment>
        </CinematicContainer>

        <CinematicContainer className="self-start w-fit pb-4" delayChildren={0.25} staggerChildren={0.1}>
          <motion.div ref={containerRef} style={{ x }} className="flex gap-6 md:gap-12 lg:gap-16 xl:gap-20 px-4 md:px-12 lg:px-20 items-center">
            {works.map((work, idx) => (
              <CinematicFragment 
                key={work.number} 
                direction={idx === 0 ? 'left' : idx === works.length - 1 ? 'right' : 'bottom'}
                className="flex-shrink-0"
              >
                <WorkCard work={work} index={idx} total={works.length} />
              </CinematicFragment>
            ))}
          </motion.div>
        </CinematicContainer>
      </div>
    </section>
  );
}

function WorkCard({ work, index, total }: { work: typeof works[0], index: number, total: number }) {
  const [isInteractive, setIsInteractive] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div className="process-card-wrapper flex flex-col gap-3 md:gap-4 w-[76vw] md:w-[70vw] lg:w-[31vw] xl:w-[25vw] 2xl:w-[21vw] flex-shrink-0 relative group items-center">
      {/* Website Information Card (Above the browser) — now a clickable link */}
      <a 
        href={work.link}
        target="_blank"
        rel="noopener noreferrer"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="process-info-card w-full relative overflow-hidden bg-gradient-to-br from-blue-600/[0.04] via-indigo-500/[0.015] to-transparent backdrop-blur-2xl p-4 sm:p-5 md:p-6 rounded-2xl md:rounded-3xl border border-indigo-300/30 ring-1 ring-indigo-400/10 shadow-[0_10px_30px_rgba(99,102,241,0.05),inset_0_1px_0_rgba(255,255,255,0.45)] transition-all duration-500 hover:border-indigo-300/50 hover:shadow-[0_16px_40px_rgba(99,102,241,0.08),inset_0_1px_0_rgba(255,255,255,0.55)] cursor-pointer block"
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

        {/* Decorative ambient color blur matching the project */}
        <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full blur-[50px] opacity-20 pointer-events-none z-0" style={{ backgroundColor: work.color }} />
        <div className="absolute inset-0 rounded-2xl md:rounded-3xl bg-gradient-to-br from-white/6 via-white/3 to-transparent opacity-70 pointer-events-none z-0" />
        
        <div className="flex flex-col relative z-10 w-full">
          <div className="hidden md:flex items-center justify-between mb-2 w-full">
            <div className="flex items-center gap-2">
              <span className="text-xl">{work.icon}</span>
              <span className="text-[10px] md:text-xs font-mono uppercase tracking-widest bg-foreground/10 px-3 py-1 rounded-full text-foreground/80">{work.detail}</span>
            </div>
            <span className="text-3xl md:text-4xl font-bold opacity-10">{work.number}</span>
          </div>
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <span className="text-lg md:hidden">{work.icon}</span>
            <h3 className="text-base md:text-xl font-bold tracking-tight text-foreground md:mb-2">{work.title}</h3>
            <ArrowUpRight className="w-4 h-4 text-indigo-500 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0" />
          </div>
          <p className="hidden md:block text-[13px] md:text-sm text-foreground/75 leading-relaxed">{work.description}</p>
        </div>
      </a>

      {/* Browser Window Card */}
      <div 
        className="process-browser-card w-full h-[50vh] min-h-[308px] max-h-[550px] md:h-[39vh] lg:h-[41vh] xl:h-[44vh] 2xl:h-[46vh] md:max-h-none rounded-[1.5rem] md:rounded-[2rem] border border-indigo-300/30 shadow-[0_20px_60px_rgba(0,0,0,0.15)] relative overflow-hidden bg-zinc-950 transition-all duration-500 group-hover:shadow-[0_25px_70px_rgba(99,102,241,0.15)]"
        onMouseLeave={() => setIsInteractive(false)}
        style={{
          boxShadow: `0 20px 60px rgba(0,0,0,0.15), 0 0 30px ${work.color}10`
        }}
      >
        {/* Browser Header */}
        <div className="absolute top-0 left-0 right-0 h-10 glass-surface border-b border-indigo-300/20 border-x-0 border-t-0 flex items-center px-6 gap-2 z-30">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
          <div className="ml-4 flex-1 flex justify-center">
            <div className="bg-black/30 backdrop-blur-md px-4 py-1 rounded-md text-xs text-white/50 w-1/2 max-w-[200px] truncate text-center border border-white/5 shadow-inner">
              {work.link.replace('https://', '')}
            </div>
          </div>
        </div>

        {/* Browser Body / Iframe */}
        <div className="w-full h-full pt-10 relative z-10 bg-background/50 overflow-hidden">
          <iframe 
            src={work.link} 
            className="w-[200%] h-[200%] border-none origin-top-left scale-50" 
            sandbox="allow-scripts allow-same-origin" 
            title={work.title} 
          />
          
          <div 
            className={`absolute inset-0 z-20 flex items-center justify-center transition-all duration-300 ${isInteractive ? 'opacity-0 pointer-events-none' : 'opacity-100 bg-background/20 cursor-pointer pointer-events-auto backdrop-blur-[2px]'}`} 
            onClick={() => setIsInteractive(true)}
          >
            {!isInteractive && (
              <span className="px-6 py-3 glass-surface text-white shadow-2xl text-sm font-medium rounded-full flex items-center gap-2 transform transition-transform hover:scale-105">
                Tap to interact
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
