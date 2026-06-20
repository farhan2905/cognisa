'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, ArrowUpRight } from 'lucide-react';
import SubPageShell from '@/components/shared/SubPageShell';
import PageHero from '@/components/shared/PageHero';
import GlassContentBlock from '@/components/shared/GlassContentBlock';
import ContactForm from '@/components/shared/ContactForm';
import IridescentBlobBackground from '@/components/shared/fragments/IridescentBlobBackground';

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'farhansiddiqui0156@gmail.com', href: 'mailto:farhansiddiqui0156@gmail.com', color: '#6366f1' },
  { icon: Phone, label: 'Phone', value: '+91 80000 40485', href: 'tel:+918000040485', color: '#8b5cf6' },
  { icon: MapPin, label: 'Location', value: 'RTC 810, Opp. Star Bazar, Adajan, Surat, Gujarat 395009', href: null, color: '#3b82f6' },
  { icon: Clock, label: 'Working Hours', value: 'Mon — Fri, 9am — 6pm IST', href: null, color: '#06b6d4' },
];

const faqs = [
  { question: 'What happens after I submit?', answer: 'We review every inquiry within 24 hours. You\'ll receive a response with a preliminary assessment and next steps for a discovery call.' },
  { question: 'Do you offer free consultations?', answer: 'Yes. Our initial discovery call is completely free. We use it to understand your needs and determine if we\'re the right fit.' },
  { question: 'What is the typical project timeline?', answer: 'Most projects range from 4–12 weeks depending on complexity. We provide a detailed timeline during the proposal phase.' },
];

export default function ContactPage() {
  return (
    <SubPageShell>
      {/* Hero */}
      <div className="relative overflow-hidden">
        <IridescentBlobBackground size="xl" opacity={0.4} className="top-0 right-[-20%]" />
        <IridescentBlobBackground size="lg" opacity={0.25} className="bottom-0 left-[-10%]" />
        <PageHero
          tagText="GET IN TOUCH"
          title="Let's build something"
          titleAccent="exceptional."
          description="Every great project starts with a conversation. Tell us about your vision, and we'll map out a clear path forward."
          orbColor="#6366f1"
          orbColor2="#a78bfa"
        />
      </div>

      {/* ── Contact Form + Info ── */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Form - 2/3 */}
            <div className="lg:col-span-2">
              <GlassContentBlock className="p-8 md:p-10 lg:p-12">
                <ContactForm />
              </GlassContentBlock>
            </div>

            {/* Info Cards - 1/3 */}
            <div className="flex flex-col gap-6">
              {contactInfo.map((info, i) => {
                const Icon = info.icon;
                return (
                  <motion.div
                    key={info.label}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="relative overflow-hidden bg-gradient-to-br from-blue-600/[0.06] via-indigo-500/[0.025] to-transparent backdrop-blur-2xl p-6 rounded-[2rem] border border-indigo-300/40 ring-1 ring-indigo-400/15 shadow-[0_10px_30px_rgba(59,130,246,0.16),inset_0_1px_0_rgba(255,255,255,1)] transition-all duration-500 group hover:-translate-y-1 hover:border-indigo-300/60"
                  >
                    <div className="flex items-start gap-4">
                      <motion.div
                        whileHover={{ rotate: 15, scale: 1.1 }}
                        className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${info.color}15` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: info.color }} />
                      </motion.div>
                      <div>
                        <p className="text-[10px] font-mono text-foreground/40 uppercase tracking-wider mb-1">
                          {info.label}
                        </p>
                        {info.href ? (
                          <a
                            href={info.href}
                            className="text-sm font-medium text-foreground/70 hover:text-indigo-500 transition-colors inline-flex items-center gap-1 group/item"
                          >
                            {info.value}
                            <ArrowUpRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                          </a>
                        ) : (
                          <p className="text-sm font-medium text-foreground/70">{info.value}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Social Links */}
              <GlassContentBlock className="p-6">
                <p className="text-[10px] font-mono text-foreground/40 uppercase tracking-wider mb-4">
                  Follow us
                </p>
                <div className="flex items-center gap-3">
                  {['X', 'LinkedIn', 'Instagram', 'Dribbble'].map((social) => (
                    <a
                      key={social}
                      href="#"
                      className="px-3 py-1.5 rounded-lg bg-foreground/5 border border-foreground/10 text-xs font-medium text-foreground/50 hover:text-indigo-500 hover:border-indigo-300/40 hover:bg-indigo-500/5 transition-all"
                    >
                      {social}
                    </a>
                  ))}
                </div>
              </GlassContentBlock>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-4 px-6 py-3 rounded-2xl border backdrop-blur-[100px] bg-gradient-to-r from-white/8 via-white/4 to-white/2 border-indigo-300/40 shadow-[inset_0_2px_2px_rgba(255,255,255,0.3),0_8px_24px_rgba(31,38,135,0.1)] mb-6">
              <span className="w-4 h-4 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-md" />
              <span className="text-sm font-mono uppercase tracking-[0.2em] font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400">
                FAQ
              </span>
              <span className="h-1 w-12 rounded-full bg-gradient-to-r from-indigo-400/60 to-transparent" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Quick answers to common questions</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
              <GlassContentBlock key={i} className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">{faq.question}</h3>
                <p className="text-foreground/70 leading-relaxed">{faq.answer}</p>
              </GlassContentBlock>
            ))}
          </div>
        </div>
      </section>
    </SubPageShell>
  );
}
