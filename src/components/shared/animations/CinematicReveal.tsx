'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  CINEMATIC_EASE, 
  CINEMATIC_VIEWPORT,
  DESKTOP_DURATION,
  MOBILE_DURATION,
  DESKTOP_OFFSET_HIGH,
  DESKTOP_OFFSET_MEDIUM,
  DESKTOP_OFFSET_LOW,
  MOBILE_OFFSET,
  DESKTOP_BLUR,
  MOBILE_BLUR
} from '@/lib/animations';

interface CinematicContainerProps {
  children: React.ReactNode;
  delayChildren?: number;
  staggerChildren?: number;
  className?: string;
  triggerMargin?: string;
}

export function CinematicContainer({
  children,
  delayChildren = 0.1,
  staggerChildren = 0.15,
  className = '',
  triggerMargin,
}: CinematicContainerProps) {
  const viewportConfig = triggerMargin 
    ? { ...CINEMATIC_VIEWPORT, margin: triggerMargin }
    : CINEMATIC_VIEWPORT;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
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
  direction?: 'left' | 'right' | 'top' | 'bottom' | 'deep-space' | 'assemble' | 'scale-up';
  delay?: number;
  duration?: number;
  className?: string;
  intensity?: 'high' | 'medium' | 'low';
}

export function CinematicFragment({
  children,
  direction = 'bottom',
  delay,
  duration,
  className = '',
  intensity = 'high',
}: CinematicFragmentProps) {
  const isMobile = useIsMobile();

  // Safely scale offsets based on device to prevent layout thrashing and scrollbar issues
  const getOffset = () => {
    if (isMobile) return MOBILE_OFFSET;
    if (intensity === 'low') return DESKTOP_OFFSET_LOW;
    if (intensity === 'medium') return DESKTOP_OFFSET_MEDIUM;
    return DESKTOP_OFFSET_HIGH;
  };

  const getBlur = () => {
    if (isMobile) return MOBILE_BLUR;
    if (intensity === 'low') return '4px';
    if (intensity === 'medium') return '10px';
    return DESKTOP_BLUR;
  };

  const getDuration = () => {
    if (duration !== undefined) return duration;
    return isMobile ? MOBILE_DURATION : DESKTOP_DURATION;
  };

  const offset = getOffset();
  const blur = getBlur();
  const animDuration = getDuration();

  const variants = {
    hidden: {
      opacity: 0,
      ...(blur !== '0px' && { filter: `blur(${blur})` }),
      ...(direction === 'left' && { x: -offset }),
      ...(direction === 'right' && { x: offset }),
      ...(direction === 'top' && { y: -offset }),
      ...(direction === 'bottom' && { y: offset }),
      ...(direction === 'deep-space' && { scale: 0.8, y: offset * 0.5, rotateX: 5 }),
      ...(direction === 'assemble' && { scale: 1.1, y: offset * 0.2 }),
      ...(direction === 'scale-up' && { scale: 0.85 }),
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      x: 0,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: animDuration,
        ease: CINEMATIC_EASE,
        ...(delay !== undefined && { delay }),
      },
    },
  };

  // Only apply will-change on desktop to avoid memory overhead on mobile browsers
  const style = isMobile ? {} : { willChange: 'transform, opacity, filter' };

  return (
    <motion.div
      variants={variants}
      className={className}
      style={style} 
    >
      {children}
    </motion.div>
  );
}