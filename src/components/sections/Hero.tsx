'use client';

import { useRef, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import Logo from '@/components/shared/Logo';
import Link from 'next/link';

/* ═══════════════════════════════════════════════
   NEURAL CONSTELLATION 2D — Mobile background canvas
   ═══════════════════════════════════════════════ */

interface Node2D {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  radius: number;
  hue: number;
  phase: number;
  speed: number;
  layer: number; // 0=core, 1=mid, 2=outer
}

interface Branch2D {
  from: number;
  to: number;
  thickness: number;
  opacity: number;
}

function NeuralConstellation2D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const nodesRef = useRef<Node2D[]>([]);
  const branchesRef = useRef<Branch2D[]>([]);

  const initNetwork = useCallback((w: number, h: number) => {
    const nodes: Node2D[] = [];
    const branches: Branch2D[] = [];

    // Center of the constellation — offset right like the mockup
    const cx = w * 0.62;
    const cy = h * 0.42;

    // Core nodes — the central "synapse" cluster
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + Math.random() * 0.3;
      const dist = 15 + Math.random() * 35;
      nodes.push({
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        baseX: cx + Math.cos(angle) * dist,
        baseY: cy + Math.sin(angle) * dist,
        vx: 0, vy: 0,
        radius: 4 + Math.random() * 3,
        hue: 220 + Math.random() * 15, // bright blue core
        phase: Math.random() * Math.PI * 2,
        speed: 0.25 + Math.random() * 0.35,
        layer: 0,
      });
    }

    // Mid-layer nodes — branching dendrites
    for (let i = 0; i < 22; i++) {
      const angle = (i / 22) * Math.PI * 2 + Math.random() * 0.4;
      const dist = 70 + Math.random() * 140;
      const px = cx + Math.cos(angle) * dist;
      const py = cy + Math.sin(angle) * dist;
      nodes.push({
        x: px, y: py, baseX: px, baseY: py,
        vx: 0, vy: 0,
        radius: 2.5 + Math.random() * 2.5,
        hue: 235 + Math.random() * 35, // indigo-violet
        phase: Math.random() * Math.PI * 2,
        speed: 0.18 + Math.random() * 0.28,
        layer: 1,
      });
    }

    // Outer nodes — terminal synaptic endpoints (like the logo's dots)
    for (let i = 0; i < 35; i++) {
      const angle = (i / 35) * Math.PI * 2 + Math.random() * 0.5;
      const dist = 160 + Math.random() * 250;
      const bias = (angle > -Math.PI * 0.4 && angle < Math.PI * 0.9) ? 1.35 : 0.75;
      const px = cx + Math.cos(angle) * dist * bias;
      const py = cy + Math.sin(angle) * dist * bias;
      nodes.push({
        x: px, y: py, baseX: px, baseY: py,
        vx: 0, vy: 0,
        radius: 2 + Math.random() * 3.5,
        hue: 255 + Math.random() * 50, // violet-purple-pink
        phase: Math.random() * Math.PI * 2,
        speed: 0.12 + Math.random() * 0.18,
        layer: 2,
      });
    }

    // Build organic branches — connect layers like dendrites
    const coreCount = 6;
    const midStart = coreCount;
    const midEnd = midStart + 22;
    const outerStart = midEnd;

    // Core-to-core connections
    for (let i = 0; i < coreCount; i++) {
      for (let j = i + 1; j < coreCount; j++) {
        if (Math.random() > 0.25) {
          branches.push({ from: i, to: j, thickness: 1.5, opacity: 0.3 });
        }
      }
    }

    // Core-to-mid connections (main dendrite branches)
    for (let i = midStart; i < midEnd; i++) {
      const closest = findClosest2D(nodes[i], nodes.slice(0, coreCount));
      branches.push({ from: closest, to: i, thickness: 1.0, opacity: 0.22 });
      if (Math.random() > 0.55) {
        const other = midStart + Math.floor(Math.random() * 22);
        if (other !== i) {
          branches.push({ from: i, to: other, thickness: 0.6, opacity: 0.1 });
        }
      }
    }

    // Mid-to-outer connections (terminal dendrites)
    for (let i = outerStart; i < nodes.length; i++) {
      const closest = findClosest2D(nodes[i], nodes.slice(midStart, midEnd)) + midStart;
      branches.push({ from: closest, to: i, thickness: 0.5, opacity: 0.15 });
    }

    nodesRef.current = nodes;
    branchesRef.current = branches;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let isIntersecting = true;
    const dpr = Math.min(window.devicePixelRatio, 2);

    const resize = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initNetwork(w, h);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const draw = (time: number) => {
      if (!isIntersecting) return;

      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      // OPTIMIZATION: If screen width is desktop-sized (>= 1024px), skip calculations & drawing
      if (window.innerWidth >= 1024) {
        animId = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, w, h);

      const nodes = nodesRef.current;
      const branches = branchesRef.current;
      const t = time * 0.001;

      // Animate nodes — gentle organic drift
      nodes.forEach((node) => {
        const drift = Math.sin(t * node.speed + node.phase);
        const driftY = Math.cos(t * node.speed * 0.7 + node.phase + 1);
        const amplitude = node.layer === 0 ? 3 : node.layer === 1 ? 6 : 10;

        node.x = node.baseX + drift * amplitude;
        node.y = node.baseY + driftY * amplitude * 0.8;

        // Mouse interaction — nodes are attracted toward cursor
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - node.x;
          const dy = mouseRef.current.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 280) {
            const force = (1 - dist / 280) * 0.2;
            node.x += dx * force * (node.layer === 0 ? 0.2 : 1);
            node.y += dy * force * (node.layer === 0 ? 0.2 : 1);
          }
        }
      });

      // Draw branches — curved organic lines like dendrites
      branches.forEach((branch) => {
        const from = nodes[branch.from];
        const to = nodes[branch.to];
        if (!from || !to) return;

        const pulse = 0.5 + 0.5 * Math.sin(t * 1.5 + branch.from * 0.5);
        const alpha = branch.opacity * (0.6 + 0.4 * pulse);

        const mx = (from.x + to.x) / 2 + Math.sin(t + branch.from) * 8;
        const my = (from.y + to.y) / 2 + Math.cos(t + branch.to) * 8;

        const grad = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
        grad.addColorStop(0, `hsla(${from.hue}, 70%, 65%, ${alpha})`);
        grad.addColorStop(1, `hsla(${to.hue}, 70%, 65%, ${alpha})`);

        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.quadraticCurveTo(mx, my, to.x, to.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = branch.thickness;
        ctx.stroke();
      });

      // Draw nodes — glowing synaptic dots
      nodes.forEach((node) => {
        const pulse = 0.7 + 0.3 * Math.sin(t * 2 + node.phase);
        const r = node.radius * pulse;

        const glowRadius = r * 5;
        const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowRadius);
        glow.addColorStop(0, `hsla(${node.hue}, 85%, 72%, ${0.25 * pulse})`);
        glow.addColorStop(0.5, `hsla(${node.hue}, 80%, 70%, ${0.08 * pulse})`);
        glow.addColorStop(1, `hsla(${node.hue}, 80%, 70%, 0)`);
        ctx.beginPath();
        ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        const sat = node.layer === 0 ? 90 : 75;
        const light = node.layer === 0 ? 62 : 68;
        ctx.fillStyle = `hsla(${node.hue}, ${sat}%, ${light}%, ${0.7 + 0.3 * pulse})`;
        ctx.fill();

        if (node.layer === 0) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, r * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${node.hue}, 100%, 85%, ${0.8 * pulse})`;
          ctx.fill();
        }
      });

      animId = requestAnimationFrame(draw);
    };

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      isIntersecting = entry.isIntersecting;
      if (isIntersecting) {
        cancelAnimationFrame(animId);
        animId = requestAnimationFrame(draw);
      }
    }, { threshold: 0 });

    resize();
    observer.observe(canvas);
    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [initNetwork]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto z-[1]"
    />
  );
}

function findClosest2D(target: { x: number; y: number }, candidates: Node2D[]): number {
  let minDist = Infinity;
  let minIdx = 0;
  candidates.forEach((c, i) => {
    const d = Math.hypot(target.x - c.x, target.y - c.y);
    if (d < minDist) { minDist = d; minIdx = i; }
  });
  return minIdx;
}

/* ═══════════════════════════════════════════════
   NEURAL CONSTELLATION 3D — Desktop background canvas
   ═══════════════════════════════════════════════ */

interface Node3D {
  x3d: number;
  y3d: number;
  z3d: number;
  baseX3d: number;
  baseY3d: number;
  baseZ3d: number;
  radius: number;
  hue: number;
  phase: number;
  speed: number;
  layer: number; // 0=core, 1=shell, 2=ambient
  
  // Running coordinates
  x: number;
  y: number;
  z: number;
}

interface Branch3D {
  from: number;
  to: number;
  thickness: number;
  opacity: number;
}

interface Signal3D {
  branchIndex: number;
  progress: number; // 0 to 1
  speed: number;
  forward: boolean;
}

interface Ripple3D {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  speed: number;
  opacity: number;
  hue: number;
}

interface SignalParticle3D {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  hue: number;
}

function NeuralConstellation3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const nodesRef = useRef<Node3D[]>([]);
  const branchesRef = useRef<Branch3D[]>([]);
  const signalsRef = useRef<Signal3D[]>([]);
  const ripplesRef = useRef<Ripple3D[]>([]);
  const signalParticlesRef = useRef<SignalParticle3D[]>([]);
  const cameraAngleRef = useRef(0);
  const isMobileRef = useRef(false);
  const centerRef = useRef<{ x: number; y: number } | null>(null);
  const cameraRotationRef = useRef<{ x: number; y: number } | null>(null);

  const initNetwork = useCallback((w: number, h: number) => {
    isMobileRef.current = w < 768;
    const isMobile = isMobileRef.current;

    const nodes: Node3D[] = [];
    const branches: Branch3D[] = [];
    const signals: Signal3D[] = [];

    // Center of constellation - full bleed layout
    const cx = w * (isMobile ? 0.5 : 0.74);
    const cy = h * (isMobile ? 0.45 : 0.48);
    centerRef.current = { x: cx, y: cy };

    // Generate 3D Geodesic Brain Sphere
    const coreCount = isMobile ? 8 : 16;
    const coreRadius = isMobile ? 35 : 50;
    for (let i = 0; i < coreCount; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / coreCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      
      const x3d = coreRadius * Math.sin(phi) * Math.cos(theta);
      const y3d = coreRadius * Math.sin(phi) * Math.sin(theta);
      const z3d = coreRadius * Math.cos(phi);
      
      const hue = 190 + (i % 3) * 40; 
      
      nodes.push({
        x3d, y3d, z3d,
        baseX3d: x3d, baseY3d: y3d, baseZ3d: z3d,
        radius: isMobile ? 3.5 : 5.0,
        hue,
        phase: Math.random() * Math.PI * 2,
        speed: 0.18 + Math.random() * 0.12,
        layer: 0,
        x: 0, y: 0, z: 0
      });
    }

    const shellCount = isMobile ? 32 : 80;
    const shellRadius = isMobile ? 130 : 220;
    for (let i = 0; i < shellCount; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / shellCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      
      const x3d = shellRadius * Math.sin(phi) * Math.cos(theta);
      const y3d = shellRadius * Math.sin(phi) * Math.sin(theta);
      const z3d = shellRadius * Math.cos(phi);
      
      const hue = 210 + (phi / Math.PI) * 70;
      
      nodes.push({
        x3d, y3d, z3d,
        baseX3d: x3d, baseY3d: y3d, baseZ3d: z3d,
        radius: 1.8 + Math.random() * 1.5,
        hue,
        phase: Math.random() * Math.PI * 2,
        speed: 0.08 + Math.random() * 0.08,
        layer: 1,
        x: 0, y: 0, z: 0
      });
    }

    const ambientCount = isMobile ? 15 : 45;
    for (let i = 0; i < ambientCount; i++) {
      const x3d = (Math.random() - 0.5) * w * 1.6;
      const y3d = (Math.random() - 0.5) * h * 1.6;
      const z3d = (Math.random() - 0.5) * 400 - 200;
      
      nodes.push({
        x3d, y3d, z3d,
        baseX3d: x3d, baseY3d: y3d, baseZ3d: z3d,
        radius: 0.6 + Math.random() * 0.8,
        hue: 195 + Math.random() * 60,
        phase: Math.random() * Math.PI * 2,
        speed: 0.03 + Math.random() * 0.04,
        layer: 2,
        x: 0, y: 0, z: 0
      });
    }

    for (let i = 0; i < nodes.length; i++) {
      const n1 = nodes[i];
      if (n1.layer === 2) continue;
      
      const distances: { idx: number; dist: number }[] = [];
      for (let j = 0; j < nodes.length; j++) {
        if (i === j) continue;
        const n2 = nodes[j];
        if (n2.layer === 2) continue;
        
        const dist = Math.hypot(n1.x3d - n2.x3d, n1.y3d - n2.y3d, n1.z3d - n2.z3d);
        distances.push({ idx: j, dist });
      }
      
      distances.sort((a, b) => a.dist - b.dist);
      
      const connectionsCount = n1.layer === 0 ? 3 : 2;
      let connected = 0;
      
      for (let c = 0; c < distances.length && connected < connectionsCount; c++) {
        const neighborIdx = distances[c].idx;
        const neighbor = nodes[neighborIdx];
        
        const exists = branches.some(b => (b.from === i && b.to === neighborIdx) || (b.from === neighborIdx && b.to === i));
        if (!exists) {
          const isCoreToCore = n1.layer === 0 && neighbor.layer === 0;
          const isCoreToShell = (n1.layer === 0 && neighbor.layer === 1) || (n1.layer === 1 && neighbor.layer === 0);
          
          branches.push({
            from: i,
            to: neighborIdx,
            thickness: isCoreToCore ? 1.8 : isCoreToShell ? 0.7 : 0.9,
            opacity: isCoreToCore ? 0.65 : isCoreToShell ? 0.34 : 0.42
          });
          connected++;
        }
      }
    }

    const signalCount = isMobile ? 4 : 12;
    for (let i = 0; i < signalCount; i++) {
      if (branches.length > 0) {
        signals.push({
          branchIndex: Math.floor(Math.random() * branches.length),
          progress: Math.random(),
          speed: 0.004 + Math.random() * 0.006,
          forward: Math.random() > 0.5
        });
      }
    }

    nodesRef.current = nodes;
    branchesRef.current = branches;
    signalsRef.current = signals;
    ripplesRef.current = [];
    signalParticlesRef.current = [];
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let isIntersecting = true;
    const dpr = Math.min(window.devicePixelRatio, 2);

    const resize = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initNetwork(w, h);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      ripplesRef.current.push({
        x: clickX,
        y: clickY,
        radius: 0,
        maxRadius: isMobileRef.current ? 160 : 280,
        speed: isMobileRef.current ? 4 : 6,
        opacity: 0.8,
        hue: 200 + Math.random() * 80,
      });

      const nodes = nodesRef.current;
      const branches = branchesRef.current;
      const cx = centerRef.current ? centerRef.current.x : (canvas.offsetWidth * (isMobileRef.current ? 0.5 : 0.74));
      const cy = centerRef.current ? centerRef.current.y : (canvas.offsetHeight * (isMobileRef.current ? 0.45 : 0.48));

      nodes.forEach((node, nodeIdx) => {
        const dist = Math.hypot(node.x - (clickX - cx), node.y - (clickY - cy));
        if (dist < 140 && Math.random() > 0.35) {
          const connected = branches
            .map((b, idx) => ({ ...b, idx }))
            .filter(b => b.from === nodeIdx || b.to === nodeIdx);
          
          if (connected.length > 0) {
            const randomBranch = connected[Math.floor(Math.random() * connected.length)];
            signalsRef.current.push({
              branchIndex: randomBranch.idx,
              progress: 0,
              speed: 0.005 + Math.random() * 0.008,
              forward: randomBranch.from === nodeIdx,
            });
          }
        }
      });
    };

    const draw = (time: number) => {
      if (!isIntersecting) return;

      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      // OPTIMIZATION: If screen width is mobile, don't animate or draw
      if (window.innerWidth < 1024) {
        animId = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, w, h);

      const nodes = nodesRef.current;
      const branches = branchesRef.current;
      const signals = signalsRef.current;
      const ripples = ripplesRef.current;
      const particles = signalParticlesRef.current;
      const isMobile = isMobileRef.current;
      const t = time * 0.001;

      cameraAngleRef.current += isMobile ? 0.0001 : 0.0002;
      
      const baseCx = w * (isMobile ? 0.5 : 0.74);
      const baseCy = h * (isMobile ? 0.45 : 0.48);

      if (!centerRef.current) {
        centerRef.current = { x: baseCx, y: baseCy };
      }

      const distToCenter = Math.hypot(mouseRef.current.x - centerRef.current.x, mouseRef.current.y - centerRef.current.y);
      const maxInteractRadius = isMobile ? 180 : 320;
      const hoverActive = mouseRef.current.active && distToCenter < maxInteractRadius;

      let targetCx = baseCx;
      let targetCy = baseCy;

      if (hoverActive) {
        const maxOffsetLeft = isMobile ? w * 0.5 : w * 0.22;
        const maxOffsetRight = isMobile ? w * 0.5 : w * 0.22;
        const rawOffset = mouseRef.current.x - baseCx;
        const clampedOffsetX = Math.max(-maxOffsetLeft, Math.min(maxOffsetRight, rawOffset));
        
        targetCx = baseCx + clampedOffsetX;
        targetCy = Math.max(h * 0.2, Math.min(h * 0.8, mouseRef.current.y));
      }

      centerRef.current.x += (targetCx - centerRef.current.x) * 0.022;
      centerRef.current.y += (targetCy - centerRef.current.y) * 0.022;

      const cx = centerRef.current.x;
      const cy = centerRef.current.y;

      canvas.style.setProperty('--mask-x', `${(cx / w) * 100}%`);
      canvas.style.setProperty('--mask-y', `${(cy / h) * 100}%`);

      const targetRotY = hoverActive ? (mouseRef.current.x - w / 2) * 0.0006 : 0;
      const targetRotX = hoverActive ? (mouseRef.current.y - h / 2) * 0.0006 : 0;

      if (!cameraRotationRef.current) {
        cameraRotationRef.current = { x: targetRotX, y: targetRotY };
      }

      cameraRotationRef.current.x += (targetRotX - cameraRotationRef.current.x) * 0.035;
      cameraRotationRef.current.y += (targetRotY - cameraRotationRef.current.y) * 0.035;

      const angleY = t * 0.12 + cameraRotationRef.current.y;
      const angleX = t * 0.06 + cameraRotationRef.current.x;
      
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      
      const fov = 350;

      let mainParallaxX = 0;
      let mainParallaxY = 0;
      if (hoverActive) {
        const mdx = mouseRef.current.x - w / 2;
        const mdy = mouseRef.current.y - h / 2;
        mainParallaxX = -mdx * 0.04;
        mainParallaxY = -mdy * 0.04;
      }

      nodes.forEach((node) => {
        const drift = Math.sin(t * node.speed + node.phase);
        const driftY = Math.cos(t * node.speed * 0.8 + node.phase + 1);
        const amplitude = (node.layer === 0 ? 1.5 : node.layer === 1 ? 6.0 : 24.0);

        let curX = node.baseX3d + drift * amplitude;
        let curY = node.baseY3d + driftY * amplitude * 0.8;
        let curZ = node.baseZ3d;

        if (hoverActive) {
          if (node.layer === 2) {
            const mdx = mouseRef.current.x - w / 2;
            const mdy = mouseRef.current.y - h / 2;
            curX += -mdx * 0.12;
            curY += -mdy * 0.12;
          } else {
            curX += mainParallaxX;
            curY += mainParallaxY;
          }
        }

        let x1 = curX * cosY - curZ * sinY;
        let z1 = curZ * cosY + curX * sinY;
        
        let y2 = curY * cosX - z1 * sinX;
        let z2 = z1 * cosX + curY * sinX;

        ripples.forEach((r) => {
          const dx = x1 - (r.x - cx);
          const dy = y2 - (r.y - cy);
          const dz = z2;
          const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
          const diff = Math.abs(dist - r.radius);
          if (diff < 40) {
            const force = (1 - diff / 40) * 12 * r.opacity;
            x1 += (dx / dist) * force;
            y2 += (dy / dist) * force;
            z2 += (dz / dist) * force;
          }
        });

        node.x = x1;
        node.y = y2;
        node.z = z2;
      });

      const rotatedCoords = nodes.map((node) => {
        const zDepth = node.z + 280;
        const scale = fov / Math.max(1, zDepth);
        return {
          x: cx + node.x * scale,
          y: cy + node.y * scale,
          scale,
          zDepth
        };
      });

      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += r.speed;
        r.opacity = 1 - r.radius / r.maxRadius;
        if (r.opacity <= 0) {
          ripples.splice(i, 1);
          continue;
        }

        const grad = ctx.createRadialGradient(r.x, r.y, Math.max(0, r.radius - 12), r.x, r.y, r.radius + 4);
        grad.addColorStop(0, `hsla(${r.hue}, 90%, 70%, 0)`);
        grad.addColorStop(0.5, `hsla(${r.hue}, 90%, 75%, ${r.opacity * 0.25})`);
        grad.addColorStop(1, `hsla(${r.hue}, 90%, 70%, 0)`);

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 10;
        ctx.stroke();
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.018;
        p.size *= 0.965;
        if (p.alpha <= 0 || p.size <= 0.2) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 75%, ${p.alpha})`;
        ctx.fill();
      }

      ctx.save();
      ctx.setLineDash([4, 6]);
      const shellRadius = isMobile ? 130 : 220;

      const longCount = 3;
      for (let r = 0; r < longCount; r++) {
        const phi = (r * Math.PI) / longCount;
        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2 + 0.1; a += 0.1) {
          let x3d = shellRadius * Math.cos(a) * Math.cos(phi);
          let y3d = shellRadius * Math.sin(a);
          let z3d = shellRadius * Math.cos(a) * Math.sin(phi);

          if (hoverActive) {
            x3d += mainParallaxX;
            y3d += mainParallaxY;
          }

          const rx1 = x3d * cosY - z3d * sinY;
          const rz1 = z3d * cosY + x3d * sinY;
          const ry2 = y3d * cosX - rz1 * sinX;
          const rz2 = rz1 * cosX + y3d * sinX;

          const zDepth = rz2 + 280;
          const scale = fov / Math.max(1, zDepth);
          const sx = cx + rx1 * scale;
          const sy = cy + ry2 * scale;

          if (a === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.strokeStyle = `hsla(210, 80%, 70%, 0.23)`; 
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      const latSlices = [-0.5, 0, 0.5];
      latSlices.forEach((hScale) => {
        const H = shellRadius * hScale;
        const r = Math.sqrt(Math.max(0, shellRadius * shellRadius - H * H));
        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2 + 0.1; a += 0.1) {
          let x3d = r * Math.cos(a);
          let y3d = H;
          let z3d = r * Math.sin(a);

          if (hoverActive) {
            x3d += mainParallaxX;
            y3d += mainParallaxY;
          }

          const rx1 = x3d * cosY - z3d * sinY;
          const rz1 = z3d * cosY + x3d * sinY;
          const ry2 = y3d * cosX - rz1 * sinX;
          const rz2 = rz1 * cosX + y3d * sinX;

          const zDepth = rz2 + 280;
          const scale = fov / Math.max(1, zDepth);
          const sx = cx + rx1 * scale;
          const sy = cy + ry2 * scale;

          if (a === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.strokeStyle = `hsla(210, 80%, 70%, 0.23)`; 
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      ctx.beginPath();
      let tx = 0, ty = -shellRadius, tz = 0;
      if (hoverActive) {
        tx += mainParallaxX;
        ty += mainParallaxY;
      }
      let rx1 = tx * cosY - tz * sinY;
      let rz1 = tz * cosY + tx * sinY;
      let ry2 = ty * cosX - rz1 * sinX;
      let rz2 = rz1 * cosX + ty * sinX;
      let axisScale = fov / Math.max(1, rz2 + 280);
      ctx.moveTo(cx + rx1 * axisScale, cy + ry2 * axisScale);

      tx = 0; ty = shellRadius; tz = 0;
      if (hoverActive) {
        tx += mainParallaxX;
        ty += mainParallaxY;
      }
      rx1 = tx * cosY - tz * sinY;
      rz1 = tz * cosY + tx * sinY;
      ry2 = ty * cosX - rz1 * sinX;
      rz2 = rz1 * cosX + ty * sinX;
      axisScale = fov / Math.max(1, rz2 + 280);
      ctx.lineTo(cx + rx1 * axisScale, cy + ry2 * axisScale);

      ctx.strokeStyle = `hsla(210, 80%, 70%, 0.22)`; 
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.restore();

      ctx.save();
      const coreRadius = isMobile ? 35 : 50;
      const dialRadius = coreRadius * 1.8;
      
      ctx.beginPath();
      for (let a = 0; a <= Math.PI * 2 + 0.1; a += 0.1) {
        let x3d = dialRadius * Math.cos(a);
        let y3d = 0;
        let z3d = dialRadius * Math.sin(a);

        if (hoverActive) {
          x3d += mainParallaxX;
          y3d += mainParallaxY;
        }

        const rx1 = x3d * cosY - z3d * sinY;
        const rz1 = z3d * cosY + x3d * sinY;
        const ry2 = y3d * cosX - rz1 * sinX;
        const rz2 = rz1 * cosX + y3d * sinX;

        const zDepth = rz2 + 280;
        const scale = fov / Math.max(1, zDepth);
        const sx = cx + rx1 * scale;
        const sy = cy + ry2 * scale;

        if (a === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.strokeStyle = `hsla(260, 95%, 75%, 0.34)`; 
      ctx.lineWidth = 1.0;
      ctx.stroke();

      ctx.beginPath();
      const tickCount = 16;
      for (let i = 0; i < tickCount; i++) {
        const a = (i * Math.PI * 2) / tickCount + t * 0.05; 
        
        let x3d_in = dialRadius * Math.cos(a);
        let y3d_in = 0;
        let z3d_in = dialRadius * Math.sin(a);

        let x3d_out = (dialRadius + 4) * Math.cos(a);
        let y3d_out = 0;
        let z3d_out = (dialRadius + 4) * Math.sin(a);

        if (hoverActive) {
          x3d_in += mainParallaxX;
          y3d_in += mainParallaxY;
          x3d_out += mainParallaxX;
          y3d_out += mainParallaxY;
        }

        let rx1 = x3d_in * cosY - z3d_in * sinY;
        let rz1 = z3d_in * cosY + x3d_in * sinY;
        let ry2 = y3d_in * cosX - rz1 * sinX;
        let rz2 = rz1 * cosX + y3d_in * sinX;
        let scale = fov / Math.max(1, rz2 + 280);
        ctx.moveTo(cx + rx1 * scale, cy + ry2 * scale);

        rx1 = x3d_out * cosY - z3d_out * sinY;
        rz1 = z3d_out * cosY + x3d_out * sinY;
        ry2 = y3d_out * cosX - rz1 * sinX;
        rz2 = rz1 * cosX + y3d_out * sinX;
        scale = fov / Math.max(1, rz2 + 280);
        ctx.lineTo(cx + rx1 * scale, cy + ry2 * scale);
      }
      ctx.strokeStyle = `hsla(260, 95%, 75%, 0.38)`; 
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.restore();

      ctx.save();
      const axisLength = 32;
      const axes = [
        { x1: -axisLength, y1: 0, z1: 0, x2: axisLength, y2: 0, z2: 0, hue: 190 }, 
        { x1: 0, y1: -axisLength, z1: 0, x2: 0, y2: axisLength, z2: 0, hue: 260 }, 
        { x1: 0, y1: 0, z1: -axisLength, x2: 0, y2: 0, z2: axisLength, hue: 325 }  
      ];

      axes.forEach((axis) => {
        let ax1 = axis.x1;
        let ay1 = axis.y1;
        let az1 = axis.z1;
        let ax2 = axis.x2;
        let ay2 = axis.y2;
        let az2 = axis.z2;

        if (hoverActive) {
          ax1 += mainParallaxX;
          ay1 += mainParallaxY;
          ax2 += mainParallaxX;
          ay2 += mainParallaxY;
        }

        const rx1_1 = ax1 * cosY - az1 * sinY;
        const rz1_1 = az1 * cosY + ax1 * sinY;
        const ry2_1 = ay1 * cosX - rz1_1 * sinX;
        const rz2_1 = rz1_1 * cosX + ay1 * sinX;

        const rx1_2 = ax2 * cosY - az2 * sinY;
        const rz1_2 = az2 * cosY + ax2 * sinY;
        const ry2_2 = ay2 * cosX - rz1_2 * sinX;
        const rz2_2 = rz1_2 * cosX + ay2 * sinX;

        const scale1 = fov / Math.max(1, rz2_1 + 280);
        const sx1 = cx + rx1_1 * scale1;
        const sy1 = cy + ry2_1 * scale1;

        const scale2 = fov / Math.max(1, rz2_2 + 280);
        const sx2 = cx + rx1_2 * scale2;
        const sy2 = cy + ry2_2 * scale2;

        ctx.beginPath();
        ctx.moveTo(sx1, sy1);
        ctx.lineTo(sx2, sy2);
        ctx.strokeStyle = `hsla(${axis.hue}, 90%, 75%, 0.35)`; 
        ctx.lineWidth = 0.8;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(sx1, sy1, 1.2, 0, Math.PI * 2);
        ctx.arc(sx2, sy2, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${axis.hue}, 100%, 80%, 0.55)`;
        ctx.fill();
      });
      ctx.restore();

      branches.forEach((branch) => {
        const fromNode = nodes[branch.from];
        const toNode = nodes[branch.to];
        if (!fromNode || !toNode) return;

        const from = rotatedCoords[branch.from];
        const to = rotatedCoords[branch.to];

        const avgDepth = (from.zDepth + to.zDepth) / 2;
        const depthFactor = Math.max(0.12, 1 - (avgDepth - 100) / 380);

        const pulse = 0.5 + 0.5 * Math.sin(t * 1.5 + branch.from * 0.5);
        const alpha = branch.opacity * depthFactor * (0.6 + 0.4 * pulse);

        const mx3d = (fromNode.x + toNode.x) / 2 + Math.sin(t + branch.from) * 10;
        const my3d = (fromNode.y + toNode.y) / 2 + Math.cos(t + branch.from) * 10;
        const mz3d = (fromNode.z + toNode.z) / 2;

        const grad = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
        grad.addColorStop(0, `hsla(${fromNode.hue}, 75%, 65%, ${alpha})`);
        grad.addColorStop(1, `hsla(${toNode.hue}, 75%, 65%, ${alpha})`);

        ctx.beginPath();
        const segments = 5;
        for (let s = 0; s <= segments; s++) {
          const factor = s / segments;
          const px3d = (1 - factor) * (1 - factor) * fromNode.x + 2 * (1 - factor) * factor * mx3d + factor * factor * toNode.x;
          const py3d = (1 - factor) * (1 - factor) * fromNode.y + 2 * (1 - factor) * factor * my3d + factor * factor * toNode.y;
          const pz3d = (1 - factor) * (1 - factor) * fromNode.z + 2 * (1 - factor) * factor * mz3d + factor * factor * toNode.z;

          const zDepth = pz3d + 280;
          const scale = fov / Math.max(1, zDepth);
          const sx = cx + px3d * scale;
          const sy = cy + py3d * scale;

          if (s === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.strokeStyle = grad;
        ctx.lineWidth = branch.thickness * Math.max(0.35, depthFactor);
        ctx.stroke();
      });

      for (let rIdx = 0; rIdx < 3; rIdx++) {
        const orbitRadius = isMobile ? 55 : 85;
        const tiltX = (rIdx === 0 ? 0.4 : rIdx === 1 ? -0.4 : 0) + Math.sin(t * 0.2) * 0.1;
        const tiltY = (rIdx === 0 ? Math.PI / 6 : rIdx === 1 ? -Math.PI / 4 : Math.PI / 2) + t * 0.15;
        const orbitSpeed = 1.3 + rIdx * 0.4;
        const orbitPhase = t * orbitSpeed;
        
        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2 + 0.15; a += 0.15) {
          const rx3d = Math.cos(a) * orbitRadius;
          const ry3d = Math.sin(a) * orbitRadius * 0.3;
          const rz3d = Math.sin(a) * orbitRadius * 0.95;

          let ox = rx3d * Math.cos(tiltY) - rz3d * Math.sin(tiltY);
          let oz = rz3d * Math.cos(tiltY) + rx3d * Math.sin(tiltY);
          let oy = ry3d * Math.cos(tiltX) - oz * Math.sin(tiltX);
          let ozFinal = oz * Math.cos(tiltX) + ry3d * Math.sin(tiltX);

          if (hoverActive) {
            ox += mainParallaxX;
            oy += mainParallaxY;
          }

          const cx1 = ox * cosY - ozFinal * sinY;
          const cz1 = ozFinal * cosY + ox * sinY;
          const cy2 = oy * cosX - cz1 * sinX;
          const cz2 = cz1 * cosX + oy * sinX;

          const zDepth = cz2 + 280;
          const scale = fov / Math.max(1, zDepth);
          const sx = cx + cx1 * scale;
          const sy = cy + cy2 * scale;

          if (a === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.strokeStyle = `hsla(${190 + rIdx * 45}, 90%, 75%, 0.32)`; 
        ctx.lineWidth = 0.8;
        ctx.stroke();

        const satX3d = Math.cos(orbitPhase) * orbitRadius;
        const satY3d = Math.sin(orbitPhase) * orbitRadius * 0.3;
        const satZ3d = Math.sin(orbitPhase) * orbitRadius * 0.95;

        let sX1 = satX3d * Math.cos(tiltY) - satZ3d * Math.sin(tiltY);
        let sZ1 = satZ3d * Math.cos(tiltY) + satX3d * Math.sin(tiltY);
        let sY2 = satY3d * Math.cos(tiltX) - sZ1 * Math.sin(tiltX);
        let sZ2 = sZ1 * Math.cos(tiltX) + satY3d * Math.sin(tiltX);

        if (hoverActive) {
          sX1 += mainParallaxX;
          sY2 += mainParallaxY;
        }

        const scx1 = sX1 * cosY - sZ2 * sinY;
        const scz1 = sZ2 * cosY + sX1 * sinY;
        const scy2 = sY2 * cosX - scz1 * sinX;
        const scz2 = scz1 * cosX + sY2 * sinX;

        const satDepth = scz2 + 280;
        const satScale = fov / Math.max(1, satDepth);
        const satX = cx + scx1 * satScale;
        const satY = cy + scy2 * satScale;

        const depthFactor = Math.max(0.1, 1 - (satDepth - 100) / 380);

        const glow = ctx.createRadialGradient(satX, satY, 0, satX, satY, 6 * depthFactor);
        glow.addColorStop(0, '#ffffff');
        glow.addColorStop(0.4, `hsla(${190 + rIdx * 45}, 100%, 75%, 0.75)`);
        glow.addColorStop(1, `hsla(${190 + rIdx * 45}, 100%, 75%, 0)`);

        ctx.beginPath();
        ctx.arc(satX, satY, 6 * depthFactor, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(satX, satY, 1.3, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      }

      signals.forEach((signal) => {
        signal.progress += signal.speed;
        if (signal.progress >= 1) {
          const branch = branches[signal.branchIndex];
          const targetNodeIdx = signal.forward ? branch.to : branch.from;

          signal.progress = 0;
          signal.branchIndex = Math.floor(Math.random() * branches.length);
          signal.speed = 0.003 + Math.random() * 0.005;
          signal.forward = Math.random() > 0.5;

          if (nodes[targetNodeIdx].layer === 0 && Math.random() > 0.6) {
            const connected = branches
              .map((b, idx) => ({ ...b, idx }))
              .filter(b => b.from === targetNodeIdx || b.to === targetNodeIdx);
            
            const burstCount = Math.min(3, connected.length);
            for (let bIdx = 0; bIdx < burstCount; bIdx++) {
              if (signals.length < 24) {
                const b = connected[bIdx];
                signals.push({
                  branchIndex: b.idx,
                  progress: 0,
                  speed: 0.005 + Math.random() * 0.007,
                  forward: b.from === targetNodeIdx,
                });
              }
            }
            if (signals.length > 18) {
              signals.splice(8, signals.length - 18);
            }
          }
        }

        const branch = branches[signal.branchIndex];
        if (!branch) return;

        const fromNode = nodes[branch.from];
        const toNode = nodes[branch.to];
        if (!fromNode || !toNode) return;

        const tProgress = signal.forward ? signal.progress : 1 - signal.progress;

        const mx3d = (fromNode.x + toNode.x) / 2 + Math.sin(t + branch.from) * 10;
        const my3d = (fromNode.y + toNode.y) / 2 + Math.cos(t + branch.from) * 10;
        const mz3d = (fromNode.z + toNode.z) / 2;

        const sigX3d = (1 - tProgress) * (1 - tProgress) * fromNode.x + 2 * (1 - tProgress) * tProgress * mx3d + tProgress * tProgress * toNode.x;
        const sigY3d = (1 - tProgress) * (1 - tProgress) * fromNode.y + 2 * (1 - tProgress) * tProgress * my3d + tProgress * tProgress * toNode.y;
        const sigZ3d = (1 - tProgress) * (1 - tProgress) * fromNode.z + 2 * (1 - tProgress) * tProgress * mz3d + tProgress * tProgress * toNode.z;

        const zDepth = sigZ3d + 280;
        const scale = fov / Math.max(1, zDepth);
        const sigX = cx + sigX3d * scale;
        const sigY = cy + sigY3d * scale;

        const depthFactor = Math.max(0.1, 1 - (zDepth - 100) / 380);
        const pulseSize = (4 + Math.sin(t * 10) * 1.5) * depthFactor;

        const nextProgress = tProgress + 0.01;
        const nextX3d = (1 - nextProgress) * (1 - nextProgress) * fromNode.x + 2 * (1 - nextProgress) * nextProgress * mx3d + nextProgress * nextProgress * toNode.x;
        const nextY3d = (1 - nextProgress) * (1 - nextProgress) * fromNode.y + 2 * (1 - nextProgress) * nextProgress * my3d + nextProgress * nextProgress * toNode.y;
        const nextZ3d = (1 - nextProgress) * (1 - nextProgress) * fromNode.z + 2 * (1 - nextProgress) * nextProgress * mz3d + nextProgress * nextProgress * toNode.z;

        const scaleNext = fov / Math.max(1, nextZ3d + 280);
        const sigXNext = cx + nextX3d * scaleNext;
        const sigYNext = cy + nextY3d * scaleNext;
        const vx2d = sigXNext - sigX;
        const vy2d = sigYNext - sigY;

        const sparkHue = Math.random() > 0.5 ? 325 : 185;

        if (Math.random() > 0.4) {
          particles.push({
            x: sigX,
            y: sigY,
            vx: -vx2d * 0.35 + (Math.random() - 0.5) * 0.15,
            vy: -vy2d * 0.35 + (Math.random() - 0.5) * 0.15,
            alpha: 0.65 * depthFactor,
            size: pulseSize * 1.2,
            hue: sparkHue,
          });
        }

        const glow = ctx.createRadialGradient(sigX, sigY, 0, sigX, sigY, pulseSize * 5.0);
        glow.addColorStop(0, 'rgba(255, 255, 255, 1)');
        glow.addColorStop(0.25, `hsla(325, 100%, 72%, ${0.85 * depthFactor})`); 
        glow.addColorStop(0.65, `hsla(185, 100%, 70%, ${0.5 * depthFactor})`);  
        glow.addColorStop(1, 'rgba(99, 102, 241, 0)');
        
        ctx.beginPath();
        ctx.arc(sigX, sigY, pulseSize * 5.0, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(sigX, sigY, pulseSize * 0.95, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      });

      if (hoverActive && !isMobile) {
        const mousePos = { x: mouseRef.current.x, y: mouseRef.current.y };
        const closeNodes: { idx: number; dist: number }[] = [];
        
        rotatedCoords.forEach((coord, idx) => {
          const d = Math.hypot(coord.x - mousePos.x, coord.y - mousePos.y);
          if (d < 180) {
            closeNodes.push({ idx, dist: d });
          }
        });

        closeNodes.sort((a, b) => a.dist - b.dist);
        const connections = closeNodes.slice(0, 5);

        connections.forEach(({ idx, dist }) => {
          const coord = rotatedCoords[idx];
          const node = nodes[idx];
          const alpha = (1 - dist / 180) * 0.15 * Math.max(0.2, (1 - (coord.zDepth - 100) / 380));

          const grad = ctx.createLinearGradient(coord.x, coord.y, mousePos.x, mousePos.y);
          grad.addColorStop(0, `hsla(${node.hue}, 90%, 70%, ${alpha})`);
          grad.addColorStop(1, `rgba(99, 102, 241, 0.01)`);

          ctx.beginPath();
          ctx.moveTo(coord.x, coord.y);
          ctx.lineTo(mousePos.x, mousePos.y);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 0.8;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(coord.x, coord.y, node.radius * 1.3, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${node.hue}, 100%, 80%, ${alpha * 2})`;
          ctx.fill();
        });
      }

      const sortedNodeIndices = nodes
        .map((node, idx) => ({ node, idx, zDepth: rotatedCoords[idx].zDepth }))
        .sort((a, b) => b.zDepth - a.zDepth);

      sortedNodeIndices.forEach(({ node, idx, zDepth }) => {
        const pos = rotatedCoords[idx];
        if (node.layer === 2) {
          const r = node.radius;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${node.hue}, 80%, 75%, 0.18)`;
          ctx.fill();
          return;
        }

        const pulse = 0.85 + 0.15 * Math.sin(t * 2.2 + node.phase);
        const depthFactor = Math.max(0.12, 1 - (zDepth - 100) / 380);

        let rippleGlow = 0;
        ripples.forEach((r) => {
          const dx = node.x - (r.x - cx);
          const dy = node.y - (r.y - cy);
          const dz = node.z;
          const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
          const diff = Math.abs(dist - r.radius);
          if (diff < 40) {
            rippleGlow += (1 - diff / 40) * r.opacity * 1.8;
          }
        });

        const r = node.radius * pulse * (1 + rippleGlow * 0.3) * Math.max(0.5, depthFactor);
        const baseOpacity = (0.22 * pulse * (1 + rippleGlow * 0.85)) * depthFactor;

        const glowRadius = r * (4.5 + rippleGlow * 2);
        const glow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, glowRadius);
        glow.addColorStop(0, `hsla(${node.hue}, 90%, 70%, ${baseOpacity})`);
        glow.addColorStop(0.5, `hsla(${node.hue}, 80%, 65%, ${baseOpacity * 0.3})`);
        glow.addColorStop(1, `hsla(${node.hue}, 80%, 65%, 0)`);
        
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
        const sat = node.layer === 0 ? 95 : 80;
        const light = node.layer === 0 ? 65 : 70;
        ctx.fillStyle = `hsla(${node.hue}, ${sat}%, ${light}%, ${(0.62 + 0.21 * pulse) * depthFactor})`;
        ctx.fill();

        if (node.layer === 0) {
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, r * 0.45, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${node.hue}, 100%, 88%, ${0.76 * pulse * depthFactor})`;
          ctx.fill();
        }
      });

      animId = requestAnimationFrame(draw);
    };

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      isIntersecting = entry.isIntersecting;
      if (isIntersecting) {
        cancelAnimationFrame(animId);
        animId = requestAnimationFrame(draw);
      }
    }, { threshold: 0 });

    resize();
    observer.observe(canvas);
    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('mousedown', handleMouseDown);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('mousedown', handleMouseDown);
    };
  }, [initNetwork]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto z-[1]"
      style={{
        maskImage: 'radial-gradient(circle at var(--mask-x, 74%) var(--mask-y, 48%), white 30%, transparent 75%)',
        WebkitMaskImage: 'radial-gradient(circle at var(--mask-x, 74%) var(--mask-y, 48%), white 30%, transparent 75%)'
      }}
    />
  );
}

/* ═══════════════════════════════════════════════
   ANIMATED COUNTER (USED IN STATS GRID)
   ═══════════════════════════════════════════════ */

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const counted = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          const start = Date.now();
          const duration = 1800;
          const tick = () => {
            const progress = Math.min((Date.now() - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            el.textContent = `${Math.floor(eased * value)}${suffix}`;
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
};

const wordReveal = {
  hidden: { opacity: 0, y: 50, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

const STATS = [
  { value: 150, suffix: '+', label: 'Projects Delivered' },
  { value: 99, suffix: '%', label: 'Client Satisfaction' },
  { value: 24, suffix: '/7', label: 'Support & Monitoring' },
];

/* ═══════════════════════════════════════════════
   MAIN HERO EXPORT WITH RESPONSIVE SPLIT
   ═══════════════════════════════════════════════ */

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Desktop Scroll Transforms
  const contentYDesktop = useTransform(scrollYProgress, [0, 0.4], [0, -80]);
  const contentOpacityDesktop = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const networkOpacityDesktop = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const networkScaleDesktop = useTransform(scrollYProgress, [0, 0.35], [1, 1.15]);

  // Mobile Scroll Transforms
  const contentYMobile = useTransform(scrollYProgress, [0, 0.2], [0, -60]);
  const contentOpacityMobile = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="section-anchor relative min-h-screen lg:min-h-screen pt-28 pb-12 sm:pt-32 md:pt-36 lg:py-0 flex items-center bg-transparent overflow-hidden"
    >
      {/* ── Logo (visible on mobile view only since top sidebar handles desktop) ── */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-6 left-6 md:top-8 md:left-8 lg:hidden z-30 pointer-events-auto"
      >
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-36 md:h-36">
          <div
            className="absolute inset-0 rounded-full overflow-hidden"
            style={{
              background: 'conic-gradient(from 180deg at 50% 50%, rgba(99,102,241,0.9) 0deg, rgba(167,139,250,0.9) 72deg, rgba(236,72,153,0.8) 144deg, rgba(139,92,246,0.9) 216deg, rgba(56,189,248,0.8) 288deg, rgba(99,102,241,0.9) 360deg)',
              boxShadow: 'inset 20px 20px 60px rgba(255,255,255,0.4), inset -20px -20px 60px rgba(0,0,0,0.2), 0 0 60px rgba(99,102,241,0.3)',
              opacity: 0.5,
              filter: 'blur(4px)',
            }}
          />
          <a href="#hero" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <div className="absolute inset-0 rounded-full glass-surface-strong border border-indigo-300/40 flex items-center justify-center shadow-[0_16px_48px_rgba(99,102,241,0.15)]">
              <Logo className="h-10 sm:h-12 md:h-20 w-auto scale-125 drop-shadow-[0_0_30px_rgba(99,102,241,0.3)]" />
            </div>
          </a>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════
         MOBILE SPECIFIC BACKGROUNDS (lg:hidden)
         ═══════════════════════════════════════════════ */}
      <div className="lg:hidden absolute inset-0 pointer-events-none z-0">
        {/* Ambient gradient wash (very subtle) */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[60%] h-[70%] bg-gradient-to-bl from-indigo-100/40 via-violet-50/20 to-transparent rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[40%] h-[50%] bg-gradient-to-tr from-blue-50/30 via-transparent to-transparent rounded-full blur-[100px]" />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djI2SDI0VjM0SDBWMjRoMjRWMGgxMnYyNGgyNHYxMEgzNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-[0.15] pointer-events-none" />

        {/* 2D Neural Constellation Canvas */}
        <div className="absolute inset-0 z-[1]">
          <NeuralConstellation2D />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
         DESKTOP SPECIFIC BACKGROUNDS (hidden lg:block)
         ═══════════════════════════════════════════════ */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none z-0">
        {/* Subtle dot-grid texture */}
        <div
          className="absolute inset-0 z-[0] opacity-[0.025]"
          style={{
            backgroundImage: 'radial-gradient(circle, #6366f1 0.8px, transparent 0.8px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Ambient gradient wash */}
        <div className="absolute inset-0 z-[0]">
          <div className="absolute top-0 right-0 w-[60%] h-[70%] bg-gradient-to-bl from-indigo-100/40 via-violet-50/20 to-transparent rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[40%] h-[50%] bg-gradient-to-tr from-blue-50/30 via-transparent to-transparent rounded-full blur-[100px]" />
        </div>

        {/* 3D Neural Constellation Geodesic Sphere */}
        <motion.div
          style={{ opacity: networkOpacityDesktop, scale: networkScaleDesktop }}
          className="absolute inset-0 z-[1]"
        >
          <NeuralConstellation3D />
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════
         MAIN CONTENT: MOBILE LAYOUT (lg:hidden)
         ═══════════════════════════════════════════════ */}
      <motion.div
        style={{ y: contentYMobile, opacity: contentOpacityMobile }}
        className="lg:hidden relative z-20 w-full max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col items-center text-center justify-center pt-4 pb-6 md:pt-8 md:pb-8 pointer-events-none"
      >
        <div className="w-full max-w-4xl pt-2 flex flex-col items-center pointer-events-auto">
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 md:mb-12"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-indigo-300/40 bg-gradient-to-r from-white/8 via-white/4 to-white/2 shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,0.35),0_8px_24px_rgba(31,38,135,0.05)] backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-foreground/50 font-mono text-[10px] sm:text-[11px] tracking-[0.18em] uppercase font-semibold">
                Software · Development · Automation · AI
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="mb-4 md:mb-6"
          >
            {/* Line 1: We think, */}
            <motion.h1 className="flex items-baseline justify-center gap-[0.3em] text-[clamp(3rem,8vw,7rem)] font-extrabold leading-[1.05] tracking-[-0.04em]">
              <motion.span variants={wordReveal} className="text-foreground">
                We
              </motion.span>
              <motion.span variants={wordReveal}>
                <span className="bg-gradient-to-r from-[#4f8bfa] via-[#6366f1] to-[#a78bfa] bg-clip-text text-transparent">
                  think,
                </span>
              </motion.span>
            </motion.h1>
 
            {/* Line 2: you grow */}
            <motion.h1 className="flex items-baseline justify-center gap-[0.3em] text-[clamp(3rem,8vw,7rem)] font-extrabold leading-[1.05] tracking-[-0.04em] -mt-2 md:-mt-3">
              <motion.span variants={wordReveal} className="text-foreground">
                you
              </motion.span>
              <motion.span variants={wordReveal}>
                <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#c084fc] bg-clip-text text-transparent">
                  grow
                </span>
              </motion.span>
            </motion.h1>
 
            {/* Line 3: — that's the deal. */}
            <motion.p
              variants={wordReveal}
              className="text-[clamp(1.1rem,2.2vw,1.75rem)] font-medium text-foreground/35 mt-2 tracking-[-0.01em]"
            >
              — that&apos;s the deal.
            </motion.p>
          </motion.div>

          {/* Subheadline */}
          <motion.p
            custom={1.0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-base md:text-lg text-foreground/60 mb-6 md:mb-12 max-w-xl leading-[1.7] font-medium"
          >
            End-to-end{' '}
            <span className="text-foreground/80 font-semibold">AI automation</span> and{' '}
            <span className="text-foreground/80 font-semibold">software development</span>{' '}
            that transforms your business.
          </motion.p>

          {/* CTAs */}
          <motion.div
            custom={1.3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 mb-6 md:mb-16 w-full justify-center"
          >
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
              <Link
                href="/contact"
                className="group w-full inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full font-semibold text-white text-[15px] bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 shadow-[0_6px_30px_rgba(99,102,241,0.25)] hover:opacity-95 transition-all duration-300 overflow-hidden w-full sm:w-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.12] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                <span className="relative z-10">Get Started</span>
                <ArrowRight className="relative z-10 w-[18px] h-[18px] transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
              <Link
                href="/work"
                className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-medium text-foreground/70 text-[15px] border border-indigo-300/40 bg-gradient-to-br from-blue-600/[0.04] via-indigo-500/[0.015] to-transparent backdrop-blur-sm hover:border-indigo-300/60 hover:text-foreground transition-all duration-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] w-full sm:w-auto"
              >
                View Our Work
                <ChevronRight className="w-4 h-4 opacity-40 group-hover:opacity-80 group-hover:translate-x-0.5 transition-all" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            custom={1.6}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 lg:gap-8 w-full"
          >
            {STATS.map((stat, i) => (
              <div key={i} className={`relative overflow-hidden bg-gradient-to-br from-blue-600/[0.04] via-indigo-500/[0.02] to-transparent backdrop-blur-xl rounded-2xl p-3 md:p-4 border border-indigo-300/30 ring-1 ring-indigo-400/10 shadow-[0_4px_16px_rgba(59,130,246,0.08),inset_0_1px_0_rgba(255,255,255,0.45)] group hover:border-indigo-300/50 transition-all duration-500 ${i === 2 ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
                {/* Micro chart background */}
                <div className="absolute inset-0 opacity-30 pointer-events-none">
                  <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                    <motion.path
                      d={`M0,${35 - i * 5} Q20,${20 - i * 3} 40,${25 - i * 4} T60,${15 - i * 2} T80,${10 - i} T100,${5}`}
                      fill="none"
                      stroke="url(#statGrad)"
                      strokeWidth="1.5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, delay: 1.8 + i * 0.2 }}
                    />
                    <defs>
                      <linearGradient id="statGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.1" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="relative z-10 flex flex-col items-center gap-1">
                  <span className="text-xl md:text-2xl font-bold text-foreground/80 tracking-tight">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </span>
                  <span className="text-[9px] md:text-[10px] font-medium text-foreground/45 tracking-wider uppercase flex items-center gap-1.5 justify-center">
                    {i === 2 && (
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      </span>
                    )}
                    {stat.label}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════
         MAIN CONTENT: DESKTOP LAYOUT (hidden lg:flex)
         ═══════════════════════════════════════════════ */}
      <motion.div
        style={{ y: contentYDesktop, opacity: contentOpacityDesktop }}
        className="hidden lg:flex relative z-20 w-full max-w-[1400px] mx-auto px-12 min-h-screen items-center pointer-events-none"
      >
        <div className="w-full grid grid-cols-2 items-center">
          <div className="w-full max-w-xl flex flex-col items-start text-left pointer-events-auto">

            {/* Status Pill */}
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mb-12"
            >
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-indigo-300/40 bg-gradient-to-r from-white/8 via-white/4 to-white/2 shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,0.35),0_8px_24px_rgba(31,38,135,0.05)] backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="text-foreground/50 font-mono text-[11px] tracking-[0.18em] uppercase font-semibold">
                  Software · Development · Automation · AI
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="mb-6"
            >
              {/* Line 1: We think, */}
              <h1 className="flex items-baseline justify-start gap-[0.3em] text-[clamp(3rem,8vw,7rem)] font-extrabold leading-[1.05] tracking-[-0.04em] overflow-hidden py-1">
                <motion.span variants={wordReveal} className="inline-block text-foreground">
                  We
                </motion.span>
                <motion.span variants={wordReveal} className="inline-block bg-gradient-to-r from-[#4f8bfa] via-[#6366f1] to-[#a78bfa] bg-clip-text text-transparent">
                  think,
                </motion.span>
              </h1>
   
              {/* Line 2: you grow */}
              <h1 className="flex items-baseline justify-start gap-[0.3em] text-[clamp(3rem,8vw,7rem)] font-extrabold leading-[1.05] tracking-[-0.04em] overflow-hidden -mt-3 py-1">
                <motion.span variants={wordReveal} className="inline-block text-foreground">
                  you
                </motion.span>
                <motion.span variants={wordReveal} className="inline-block bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#c084fc] bg-clip-text text-transparent">
                  grow
                </motion.span>
              </h1>
   
              {/* Line 3: — that's the deal. */}
              <div className="overflow-hidden">
                <motion.p
                  variants={wordReveal}
                  className="text-[clamp(1.1rem,2.2vw,1.75rem)] font-medium text-foreground/35 mt-2 tracking-[-0.01em]"
                >
                  — that&apos;s the deal.
                </motion.p>
              </div>
            </motion.div>
   
            {/* Subheadline */}
            <motion.p
              custom={1.0}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-lg text-foreground/60 mb-12 max-w-xl leading-[1.7] font-medium"
            >
              End-to-end{' '}
              <span className="text-foreground/80 font-semibold">AI automation</span> and{' '}
              <span className="text-foreground/80 font-semibold">software development</span>{' '}
              that transforms your business.
            </motion.p>
   
            {/* CTAs */}
            <motion.div
              custom={1.3}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-row items-center gap-5 mb-16"
            >
              {/* Primary */}
              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/contact"
                  className="group relative inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full font-semibold text-white text-[15px] bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 shadow-[0_6px_30px_rgba(99,102,241,0.25)] hover:opacity-95 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.12] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                  <span className="relative z-10">Get Started</span>
                  <ArrowRight className="relative z-10 w-[18px] h-[18px] transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
   
              {/* Secondary */}
              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/work"
                  className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-medium text-foreground/70 text-[15px] border border-indigo-300/40 bg-gradient-to-br from-blue-600/[0.04] via-indigo-500/[0.015] to-transparent backdrop-blur-sm hover:border-indigo-300/60 hover:text-foreground transition-all duration-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]"
                >
                  View Our Work
                  <ChevronRight className="w-4 h-4 opacity-40 group-hover:opacity-80 group-hover:translate-x-0.5 transition-all" />
                </Link>
              </motion.div>
            </motion.div>
   
            {/* Stats Grid */}
            <motion.div
              custom={1.6}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-3 gap-8 w-full"
            >
              {STATS.map((stat, i) => (
                <div key={i} className="relative overflow-hidden bg-gradient-to-br from-blue-600/[0.04] via-indigo-500/[0.02] to-transparent backdrop-blur-xl rounded-2xl p-4 border border-indigo-300/30 ring-1 ring-indigo-400/10 shadow-[0_4px_16px_rgba(59,130,246,0.08),inset_0_1px_0_rgba(255,255,255,0.45)] group hover:border-indigo-300/50 transition-all duration-500">
                  {/* Micro chart background */}
                  <div className="absolute inset-0 opacity-30 pointer-events-none">
                    <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                      <motion.path
                        d={`M0,${35 - i * 5} Q20,${20 - i * 3} 40,${25 - i * 4} T60,${15 - i * 2} T80,${10 - i} T100,${5}`}
                        fill="none"
                        stroke="url(#statGrad)"
                        strokeWidth="1.5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, delay: 1.8 + i * 0.2 }}
                      />
                      <defs>
                        <linearGradient id="statGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.1" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <div className="relative z-10 flex flex-col items-start gap-1">
                    <span className="text-2xl font-bold text-foreground/80 tracking-tight">
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    </span>
                    <span className="text-[10px] font-medium text-foreground/45 tracking-wider uppercase flex items-center gap-1.5">
                      {i === 2 && (
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        </span>
                      )}
                      {stat.label}
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        style={{ opacity: contentOpacityDesktop }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 hidden md:flex"
      >
        <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-foreground/35 hidden md:block">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-[18px] h-7 border border-foreground/[0.12] rounded-full flex justify-center pt-1"
        >
          <motion.div
            animate={{ opacity: [0.2, 0.8, 0.2], scaleY: [0.5, 1, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-[2px] h-[6px] bg-indigo-400/60 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
