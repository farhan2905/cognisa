'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Home as HomeIcon, LayoutGrid, Cog, FolderOpen, Mail, Menu, X, Info, BookOpen, Phone } from 'lucide-react';
import Logo from '@/components/shared/Logo';
import Link from 'next/link';

const mobileItems = [
  { icon: HomeIcon, label: 'Home', id: 'hero', href: '/', color: '238,130,238', shadow: 'from-[#6366f1] to-[#a855f7]' },
  { icon: Cog, label: 'Process', id: 'solutions', href: '/process', color: '245,158,11', shadow: 'from-[#f59e0b] to-[#ef4444]' },
  { icon: Info, label: 'About', id: 'about', href: '/about', color: '99,102,241', shadow: 'from-[#6366f1] to-[#818cf8]' },
  { icon: LayoutGrid, label: 'Services', id: 'services', href: '/services', color: '16,185,129', shadow: 'from-[#10b981] to-[#3b82f6]' },
  { icon: FolderOpen, label: 'Work', id: 'work', href: '/work', color: '6,182,212', shadow: 'from-[#06b6d4] to-[#3b82f6]' },
  { icon: BookOpen, label: 'Insights', id: 'insights', href: '/insights', color: '59,130,246', shadow: 'from-[#3b82f6] to-[#6366f1]' },
  { icon: Mail, label: 'Contact', id: 'cta', href: '/contact', color: '236,72,153', shadow: 'from-[#ec4899] to-[#8b5cf6]' },
];

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState('hero');
  const pathname = usePathname();
  const router = useRouter();

  // Determine active based on pathname
  useEffect(() => {
    if (pathname === '/') {
      // scroll-based on homepage handles active section
    } else {
      const match = mobileItems.find((item) => item.href !== '/' && pathname.startsWith(item.href));
      if (match) setActiveId(match.id);
    }
  }, [pathname]);

  // Scroll-based tracking on homepage
  useEffect(() => {
    if (pathname !== '/') return;

    const homeSectionIds = ['hero', 'solutions', 'about', 'services', 'work', 'insights', 'cta'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-30% 0px -70% 0px' }
    );

    setTimeout(() => {
      homeSectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    }, 100);

    return () => observer.disconnect();
  }, [pathname]);

  const handleClick = (item: typeof mobileItems[0]) => {
    setActiveId(item.id);
    setIsOpen(false);

    if (pathname === '/' && item.href === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    router.push(item.href);
  };

  return (
    <div className="lg:hidden">
      {/* Mobile Menu Dropdown (Floats above the bottom trigger) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15, x: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15, x: 15 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-6 w-72 z-40 bg-gradient-to-br from-blue-600/[0.12] via-indigo-500/[0.06] to-transparent backdrop-blur-3xl border border-indigo-300/40 shadow-[0_12px_40px_rgba(59,130,246,0.22)] rounded-2xl p-4 space-y-2 origin-bottom-right"
          >
            {/* Branding Logo in dropdown */}
            <div className="flex items-center justify-center pb-3 border-b border-indigo-300/20 mb-2">
              <Logo className="h-10 w-auto" />
            </div>

            {/* Menu Items */}
            <div className="space-y-1">
              {mobileItems.map(({ icon: Icon, label, id, color, shadow, href }) => {
                const isActive = activeId === id;
                return (
                  <button
                    key={id}
                    onClick={() => handleClick({ icon: Icon, label, id, color, shadow, href })}
                    className={`relative w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? `bg-gradient-to-br from-blue-600/[0.12] via-indigo-500/[0.06] to-transparent border border-indigo-300/70 shadow-[0_0_15px_rgba(${color},0.25)]`
                        : 'bg-gradient-to-br from-blue-600/[0.05] via-indigo-500/[0.02] to-transparent border border-indigo-300/30 hover:border-indigo-300/40'
                    }`}
                  >
                    {isActive && (
                      <div className={`absolute left-0 w-1 h-8 bg-gradient-to-b ${shadow} rounded-r`} />
                    )}
                    <Icon
                      className="w-5 h-5 shrink-0 transition-colors duration-300"
                      strokeWidth={isActive ? 2.5 : 1.5}
                      style={isActive ? { color: `rgb(${color})` } : {}}
                    />
                    <span className={`text-sm font-medium transition-colors duration-300 ${isActive ? 'text-foreground' : 'text-foreground/60'}`}>
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {/* Call FAB */}
        <a
          href="tel:+918000040485"
          className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-[0_8px_24px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all border border-emerald-400/20"
          aria-label="Call Cognisa"
        >
          <Phone className="w-6 h-6 animate-pulse" />
        </a>

        {/* Menu FAB (Toggles open/close state) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-[0_8px_24px_rgba(59,130,246,0.3)] hover:scale-105 active:scale-95 transition-all border border-indigo-500/20"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="w-6 h-6 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
}
