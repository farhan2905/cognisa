'use client';

import { motion } from 'framer-motion';
import {
  Code2,
  Brain,
  Server,
  Database,
  Cloud,
  Figma,
  Container,
  Workflow,
  Layers,
  Cpu,
  GitBranch,
  Flame,
} from 'lucide-react';

const row1Items = [
  { label: 'React & Next.js', icon: Code2 },
  { label: 'Python & Django', icon: Brain },
  { label: 'Node.js Architecture', icon: Server },
  { label: 'AI Agents', icon: Cpu },
  { label: 'LLM Integration', icon: Brain },
  { label: 'Cloud Infrastructure', icon: Cloud },
  { label: 'PostgreSQL & Redis', icon: Database },
  { label: 'API Development', icon: Layers },
  { label: 'Docker & CI/CD', icon: Container },
  { label: 'Figma to Code', icon: Figma },
  { label: 'Tailwind & Framer', icon: Flame },
  { label: 'Serverless Scaling', icon: Workflow },
];

const row2Items = [
  'Frontend Engineering',
  'Backend Systems',
  'AI / ML',
  'DevOps',
  'Data Architecture',
  'UI/UX Design',
  'Automation',
  'Cloud Native',
];

const row3Snippets = [
  'const ai = new Agent({ model: "gpt-4" })',
  'docker build -t cognisa/api:latest .',
  'git push origin main --force-with-lease',
  'await db.migrate({ direction: "up" })',
  'export const config = { region: "global" }',
  'useEffect(() => { track("page_view") }, [])',
  'kubectl apply -f k8s/production.yaml',
  'SELECT * FROM insights WHERE published = true',
];

function MarqueeRow({
  items,
  speed = 30,
  reverse = false,
  children,
}: {
  items?: { label: string; icon: React.ElementType }[];
  speed?: number;
  reverse?: boolean;
  children?: React.ReactNode;
}) {
  const repeated = items ? [...items, ...items, ...items, ...items] : null;

  return (
    <div className="relative overflow-hidden py-2">
      <motion.div
        className="flex items-center whitespace-nowrap"
        animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {repeated
          ? repeated.map((item, i) => {
              const Icon = item.icon;
              return (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 md:gap-3 mx-4 md:mx-8 text-indigo-500 text-sm md:text-base lg:text-lg font-bold tracking-tight hover:text-indigo-600 transition-colors duration-300 whitespace-nowrap"
                >
                  <Icon className="w-4 h-4 md:w-5 md:h-5 opacity-70" />
                  {item.label}
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400/40 inline-block" />
                </span>
              );
            })
          : children}
      </motion.div>
    </div>
  );
}

export default function Marquee() {
  return (
    <section id="marquee" className="relative bg-transparent py-4 md:py-6 overflow-hidden">
      <div className="glass-surface rounded-none border-y border-indigo-300/40">
        {/* Row 1: Tech names + icons (fast, foreground) */}
        <MarqueeRow items={row1Items} speed={35} />

        {/* Row 2: Categories (medium, middle, smaller, reversed) */}
        <div className="border-t border-indigo-300/15">
          <MarqueeRow speed={45} reverse>
            {[...row2Items, ...row2Items, ...row2Items, ...row2Items].map(
              (item, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 mx-6 md:mx-10 text-violet-400/60 text-xs md:text-sm font-semibold tracking-wide uppercase whitespace-nowrap"
                >
                  {item}
                  <span className="w-1 h-1 rounded-full bg-violet-400/30 inline-block" />
                </span>
              )
            )}
          </MarqueeRow>
        </div>

        {/* Row 3: Code snippets (slow, background, mono, faint) */}
        <div className="border-t border-indigo-300/10">
          <MarqueeRow speed={55}>
            {[...row3Snippets, ...row3Snippets, ...row3Snippets, ...row3Snippets].map(
              (item, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 mx-8 md:mx-12 font-mono text-[11px] md:text-xs text-indigo-300/25 tracking-wide whitespace-nowrap"
                >
                  <GitBranch className="w-3 h-3 opacity-40" />
                  {item}
                  <span className="w-1 h-1 rounded-full bg-indigo-300/15 inline-block" />
                </span>
              )
            )}
          </MarqueeRow>
        </div>
      </div>
    </section>
  );
}
