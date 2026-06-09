'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { CINEMATIC_EASE, CINEMATIC_DURATION_DEFAULT, CINEMATIC_VIEWPORT } from '@/lib/animations';

interface CinematicContainerProps {
  children: React.ReactNode;
  delayChildren?: number;
  staggerChildren?: number;
  className?: string;
}

export function CinematicContainer({
  children,
  delayChildren = 0.1,
  staggerChildren = 0.15,
  className = '',
}: CinematicContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={CINEMATIC_VIEWPORT}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren,
            staggerChildren,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface CinematicFragmentProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'top' | 'bottom' | 'deep-space' | 'assemble';
  delay?: number;
  duration?: number;
  className?: string;
  intensity?: 'high' | 'medium' | 'low';
}

export function CinematicFragment({
  children,
  direction = 'bottom',
  delay,
  duration = CINEMATIC_DURATION_DEFAULT,
  className = '',
  intensity = 'high',
}: CinematicFragmentProps) {
  const isMobile = useIsMobile();

  // Safely scale offsets based on device to prevent layout thrashing and scrollbar issues
  const getOffset = () => {
    if (isMobile || intensity === 'low') return 30;
    if (intensity === 'medium') return 80;
    return 200; // high intensity for desktops
  };

  const getBlur = () => {
    if (isMobile) return '4px'; // Lower blur max to prevent iOS Safari stutter
    return '16px';
  };

  const offset = getOffset();
  const blur = getBlur();

  const variants = {
    hidden: {
      opacity: 0,
      filter: `blur(${blur})`,
      ...(direction === 'left' && { x: -offset }),
      ...(direction === 'right' && { x: offset }),
      ...(direction === 'top' && { y: -offset }),
      ...(direction === 'bottom' && { y: offset }),
      ...(direction === 'deep-space' && { scale: 0.8, y: offset * 0.5, rotateX: 5 }),
      ...(direction === 'assemble' && { scale: 1.1, y: offset * 0.2 }),
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      x: 0,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration,
        ease: CINEMATIC_EASE,
        ...(delay !== undefined && { delay }),
      },
    },
  };

  return (
    <motion.div
      variants={variants}
      className={className}
      // Use will-change to hint to the browser's compositor to pre-calculate these heavy layers
      style={{ willChange: 'transform, opacity, filter' }} 
    >
      {children}
    </motion.div>
  );
}