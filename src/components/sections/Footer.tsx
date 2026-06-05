'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ArrowUp, Check, X, Linkedin, Instagram, Dribbble } from 'lucide-react';
import Logo from '@/components/shared/Logo';
import Link from 'next/link';

const footerLinks = {
  services: [
    { label: 'Website & Web Apps', href: '/services/web-development' },
    { label: 'AI & Automation', href: '/services/ai-automation' },
    { label: 'System Architecture', href: '/services/system-architecture' },
    { label: 'Cloud Infrastructure', href: '/services/cloud-infrastructure' },
    { label: 'All Services', href: '/services' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Our Work', href: '/work' },
    { label: 'Our Process', href: '/process' },
    { label: 'Insights', href: '/insights' },
    { label: 'Contact', href: '/contact' },
  ],
};

function StatusBar() {
  const services = [
    { name: 'API', status: 'online', color: 'bg-emerald-400' },
    { name: 'CDN', status: 'online', color: 'bg-emerald-400' },
    { name: 'AI Cluster', status: 'online', color: 'bg-emerald-400' },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-3 bg-gradient-to-r from-emerald-500/[0.03] via-transparent to-transparent border-b border-indigo-300/10">
      <div className="flex items-center gap-4">
        {services.map((service) => (
          <div key={service.name} className="flex items-center gap-2">
            <div className="relative">
              <div className={`w-1.5 h-1.5 rounded-full ${service.color}`} />
              <div className={`absolute inset-0 w-1.5 h-1.5 rounded-full ${service.color} animate-ping opacity-60`} />
            </div>
            <span className="text-[10px] font-mono text-foreground/40 uppercase tracking-wider">
              {service.name}: {service.status}
            </span>
          </div>
        ))}
      </div>
      <span className="text-[10px] font-mono text-emerald-500/70">
        All Systems Operational
      </span>
    </div>
  );
}

function NewsletterInput() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <p className="text-foreground/40 text-xs mb-3 font-medium">Stay updated</p>
      <div className="relative flex items-center">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full bg-gradient-to-br from-blue-600/[0.04] via-indigo-500/[0.02] to-transparent backdrop-blur-xl border border-indigo-300/30 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-indigo-400/50 transition-all pr-12"
        />
        <button
          type="submit"
          className="absolute right-2 w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white hover:shadow-lg hover:shadow-indigo-500/20 transition-all"
        >
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Check className="w-4 h-4" />
              </motion.div>
            ) : (
              <motion.div
                key="arrow"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowUpRight className="w-4 h-4" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </form>
  );
}

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 800);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="hidden lg:flex fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full glass-surface-strong border border-indigo-300/40 items-center justify-center text-foreground/60 hover:text-indigo-500 hover:border-indigo-400/50 transition-all shadow-[0_8px_24px_rgba(99,102,241,0.15)]"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export default function Footer() {
  return (
    <>
      <BackToTop />
      <footer className="bg-transparent border-t border-foreground/10">
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-12 lg:py-16">
          <div className="bg-gradient-to-br from-blue-600/[0.06] via-indigo-500/[0.025] to-transparent backdrop-blur-2xl rounded-[1.5rem] md:rounded-[2.5rem] p-4 sm:p-6 md:p-[3.45rem] border border-indigo-300/40 ring-1 ring-indigo-400/15 shadow-[0_10px_30px_rgba(59,130,246,0.12),inset_0_1px_0_rgba(255,255,255,0.45)] overflow-hidden">
            {/* Status Bar */}
            <StatusBar />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-12 lg:gap-8 mt-8">
              <div className="lg:col-span-1">
                <Link href="/" className="inline-flex items-center">
                  <Logo className="h-9 md:h-10 w-auto" />
                </Link>
                <p className="text-foreground/40 text-sm leading-relaxed mt-4 max-w-xs">
                  We build digital experiences that drive growth. Strategy, design, development, and AI automation — all under one roof.
                </p>
                <NewsletterInput />
                <div className="flex items-center gap-3 mt-6">
                  {[
                    { icon: X, label: 'X', href: '#' },
                    { icon: Linkedin, label: 'LinkedIn', href: '#' },
                    { icon: Instagram, label: 'Instagram', href: '#' },
                    { icon: Dribbble, label: 'Dribbble', href: '#' },
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className="w-9 h-9 rounded-xl border border-indigo-300/30 flex items-center justify-center text-foreground/40 hover:text-indigo-500 hover:border-indigo-400/50 hover:bg-indigo-500/5 transition-all duration-300"
                    >
                      <social.icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-foreground font-semibold text-sm uppercase tracking-wider mb-6">Services</h4>
                <ul className="space-y-3">
                  {footerLinks.services.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-foreground/40 text-sm hover:text-foreground/70 transition-colors inline-flex items-center gap-1 group">
                        {link.label}
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-foreground font-semibold text-sm uppercase tracking-wider mb-6">Company</h4>
                <ul className="space-y-3">
                  {footerLinks.company.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-foreground/40 text-sm hover:text-foreground/70 transition-colors inline-flex items-center gap-1 group">
                        {link.label}
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-foreground font-semibold text-sm uppercase tracking-wider mb-6">Contact</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-foreground/30 text-xs font-mono uppercase tracking-wider mb-1">Email</p>
                    <a href="mailto:hello@cognisa.in" className="text-foreground/60 text-sm hover:text-indigo-500 transition-colors inline-flex items-center gap-1">
                      hello@cognisa.in
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </div>
                  <div>
                    <p className="text-foreground/30 text-xs font-mono uppercase tracking-wider mb-1">Phone</p>
                    <a href="tel:+1234567890" className="text-foreground/60 text-sm hover:text-indigo-500 transition-colors">+1 (234) 567-890</a>
                  </div>
                  <div>
                    <p className="text-foreground/30 text-xs font-mono uppercase tracking-wider mb-1">Location</p>
                    <p className="text-foreground/60 text-sm">New York, NY</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-foreground/10">
          <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 py-6">
            <div className="bg-gradient-to-br from-blue-600/[0.08] via-indigo-500/[0.04] to-transparent backdrop-blur-2xl rounded-2xl px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 border border-indigo-300/40 ring-1 ring-indigo-400/15 shadow-[0_8px_32px_rgba(31,38,135,0.08),inset_0_1px_0_rgba(255,255,255,0.35)]">
              <p className="text-foreground/30 text-xs">&copy; {new Date().getFullYear()} Cognisa. All rights reserved.</p>
              <div className="flex items-center gap-6">
                <Link href="/privacy" className="text-foreground/30 text-xs hover:text-foreground/50 transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="text-foreground/30 text-xs hover:text-foreground/50 transition-colors">Terms of Service</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
