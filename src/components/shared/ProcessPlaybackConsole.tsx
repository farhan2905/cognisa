'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Play, Pause, RotateCcw, FastForward, Terminal, CheckCircle2, ChevronRight } from 'lucide-react';

const PHASE_LOGS = [
  {
    phase: '01',
    title: 'Discovery & Strategy',
    color: '#6366f1',
    commands: [
      { text: 'stakeholder-interview --client=cognisa --scope=enterprise', type: 'command' },
      { text: 'fetching competitor positioning data...', type: 'info' },
      { text: 'mapping target user personas & journey maps...', type: 'info' },
      { text: '✔ roadmap generated: 5 milestones, 12 weeks duration', type: 'success' }
    ]
  },
  {
    phase: '02',
    title: 'Architecture & Design',
    color: '#8b5cf6',
    commands: [
      { text: 'generate-erd --db=postgresql --cache=redis', type: 'command' },
      { text: 'building system architecture design diagram...', type: 'info' },
      { text: 'exporting figma style variables & layout tokens...', type: 'info' },
      { text: '✔ api contract schema built in openapi v3 format', type: 'success' }
    ]
  },
  {
    phase: '03',
    title: 'Engineering & Development',
    color: '#3b82f6',
    commands: [
      { text: 'sprint-deploy --branch=main --verbose', type: 'command' },
      { text: 'compiling 48 tailwind-styled next.js component layers...', type: 'info' },
      { text: 'initializing prisma query engines & schema models...', type: 'info' },
      { text: '✔ sprint 1-4 deployment build compiled (0 errors)', type: 'success' }
    ]
  },
  {
    phase: '04',
    title: 'Testing & QA',
    color: '#06b6d4',
    commands: [
      { text: 'npm test -- --coverage --passWithNoTests', type: 'command' },
      { text: 'running 142 isolated unit + integration tests...', type: 'info' },
      { text: 'executing playwright end-to-end user flows...', type: 'info' },
      { text: '✔ lighthouse audit: performance 99%, accessibility 100%', type: 'success' }
    ]
  },
  {
    phase: '05',
    title: 'Launch & Support',
    color: '#10b981',
    commands: [
      { text: 'prod-release --env=production --region=global', type: 'command' },
      { text: 'streaming client edge assets to vlc endpoints...', type: 'info' },
      { text: 'configuring real-time sentry & datadog monitoring...', type: 'info' },
      { text: '✔ deployment live at https://cognisa.io/ (100% operational)', type: 'success' }
    ]
  }
];

interface ProcessPlaybackConsoleProps {
  activePhaseIndex?: number;
  setActivePhaseIndex?: (idx: number | ((prev: number) => number)) => void;
  isPlaying?: boolean;
  setIsPlaying?: (playing: boolean) => void;
}

export default function ProcessPlaybackConsole({
  activePhaseIndex: externalActivePhaseIndex,
  setActivePhaseIndex: externalSetActivePhaseIndex,
  isPlaying: externalIsPlaying,
  setIsPlaying: externalSetIsPlaying,
}: ProcessPlaybackConsoleProps = {}) {
  const [localActivePhaseIndex, localSetActivePhaseIndex] = useState(0);
  const [localIsPlaying, localSetIsPlaying] = useState(true);

  const activePhaseIndex = externalActivePhaseIndex !== undefined ? externalActivePhaseIndex : localActivePhaseIndex;
  const setActivePhaseIndex = externalSetActivePhaseIndex !== undefined ? externalSetActivePhaseIndex : localSetActivePhaseIndex;
  const isPlaying = externalIsPlaying !== undefined ? externalIsPlaying : localIsPlaying;
  const setIsPlaying = externalSetIsPlaying !== undefined ? externalSetIsPlaying : localSetIsPlaying;
  const [visibleLinesCount, setVisibleLinesCount] = useState(1);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lineTimerRef = useRef<NodeJS.Timeout | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: '-100px' });

  // Auto-play loop logic
  useEffect(() => {
    if (isPlaying && isInView) {
      timerRef.current = setInterval(() => {
        setVisibleLinesCount(1);
        setActivePhaseIndex((prev) => {
          if (prev >= PHASE_LOGS.length - 1) {
            return 0; // wrap around
          }
          return prev + 1;
        });
      }, 9500); // 9.5s per phase to let logs animate
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isInView]);

  // Log line typing simulation
  useEffect(() => {
    setVisibleLinesCount(1);
    if (lineTimerRef.current) clearInterval(lineTimerRef.current);

    const maxLines = PHASE_LOGS[activePhaseIndex].commands.length;
    lineTimerRef.current = setInterval(() => {
      setVisibleLinesCount((prev) => {
        if (prev >= maxLines) {
          if (lineTimerRef.current) clearInterval(lineTimerRef.current);
          return maxLines;
        }
        return prev + 1;
      });
    }, 1500); // print new log line every 1.5s

    return () => {
      if (lineTimerRef.current) clearInterval(lineTimerRef.current);
    };
  }, [activePhaseIndex]);

  const activePhase = PHASE_LOGS[activePhaseIndex];

  const handleRewind = () => {
    setVisibleLinesCount(1);
    setActivePhaseIndex(0);
  };

  const handleForward = () => {
    setVisibleLinesCount(1);
    setActivePhaseIndex((prev) => (prev < PHASE_LOGS.length - 1 ? prev + 1 : 0));
  };

  return (
    <div ref={containerRef} className="w-full max-w-[900px] mx-auto rounded-[2rem] border border-indigo-100 bg-white/45 backdrop-blur-md p-4 sm:p-6 shadow-[0_20px_50px_rgba(99,102,241,0.03),inset_0_1px_0_rgba(255,255,255,0.7)]">
      {/* Console Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-100 pb-4 mb-6">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-indigo-600 font-bold uppercase block mb-1">
            interactive pipeline
          </span>
          <h4 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            Process Simulation Console
          </h4>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleRewind}
            title="Rewind to Phase 1"
            className="w-9 h-9 rounded-xl border border-indigo-100 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 hover:border-indigo-200 transition-all shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? 'Pause auto-play' : 'Play auto-play'}
            className="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-500 transition-all shadow-[0_4px_12px_rgba(99,102,241,0.2)]"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
          </button>
          <button
            onClick={handleForward}
            title="Next Phase"
            className="w-9 h-9 rounded-xl border border-indigo-100 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 hover:border-indigo-200 transition-all shadow-sm"
          >
            <FastForward className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Steps Navigation Bar */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2 mb-6">
        {PHASE_LOGS.map((p, idx) => {
          const isActive = idx === activePhaseIndex;
          return (
            <button
              key={p.phase}
              onClick={() => {
                setIsPlaying(false); // Pause auto-loop on manual select
                setActivePhaseIndex(idx);
              }}
              className={`flex flex-col items-center justify-center p-1.5 sm:p-3 rounded-xl border text-center transition-all ${
                isActive
                  ? 'bg-white border-indigo-200 shadow-[0_8px_20px_rgba(99,102,241,0.04),inset_0_1px_0_rgba(255,255,255,0.85)]'
                  : 'bg-transparent border-indigo-100 text-slate-500 hover:text-slate-850 hover:border-indigo-200'
              }`}
            >
              <span
                className="text-[8.5px] sm:text-[10px] font-mono font-bold"
                style={{ color: isActive ? p.color : 'inherit' }}
              >
                PHASE {p.phase}
              </span>
              <span className="text-[7.5px] font-bold uppercase tracking-wider hidden md:block mt-1 max-w-[80px] truncate">
                {p.title.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Inner Simulator Screen */}
      <div className="relative rounded-2xl border border-indigo-100 overflow-hidden shadow-[inset_0_2px_4px_rgba(99,102,241,0.015)] bg-indigo-50/20 flex flex-col h-60">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-white/80 border-b border-indigo-100">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
            </div>
            <span className="text-[9px] font-mono text-slate-500 font-bold uppercase tracking-wider ml-2 flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5 text-indigo-600" />
              bash - pipeline-simulator
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="text-[8px] font-mono font-bold px-2 py-0.5 rounded-full border bg-white"
              style={{ color: activePhase.color, borderColor: `${activePhase.color}40` }}
            >
              ACTIVE: {activePhase.title}
            </span>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="flex-grow p-5 font-mono text-[9.5px] text-slate-700 flex flex-col justify-start gap-2 overflow-y-auto leading-relaxed select-none text-left">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePhaseIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-2 font-mono"
            >
              {activePhase.commands.slice(0, visibleLinesCount).map((cmd, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex items-start gap-1.5 font-mono tracking-wide ${
                    cmd.type === 'command'
                      ? 'text-indigo-700 font-bold'
                      : cmd.type === 'success'
                      ? 'text-emerald-700 font-bold'
                      : 'text-slate-500'
                  }`}
                >
                  {cmd.type === 'command' ? (
                    <>
                      <ChevronRight className="w-3.5 h-3.5 text-indigo-600 mt-0.5 flex-shrink-0" />
                      <span>{cmd.text}</span>
                    </>
                  ) : cmd.type === 'success' ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>{cmd.text}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-slate-300 flex-shrink-0">⚙</span>
                      <span>{cmd.text}</span>
                    </>
                  )}
                </motion.div>
              ))}

              {/* Simulated blinking terminal cursor */}
              {visibleLinesCount < activePhase.commands.length && (
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.9 }}
                  className="w-1.5 h-3 bg-indigo-600 ml-5 block flex-shrink-0"
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
