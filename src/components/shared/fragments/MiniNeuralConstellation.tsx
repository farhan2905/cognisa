'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface Node {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  radius: number;
  hue: number;
  phase: number;
  speed: number;
}

interface Branch {
  from: number;
  to: number;
  opacity: number;
}

export default function MiniNeuralConstellation({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const branchesRef = useRef<Branch[]>([]);

  const initNetwork = useCallback((w: number, h: number) => {
    const nodes: Node[] = [];
    const cx = w * 0.5;
    const cy = h * 0.45;

    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2 + Math.random() * 0.2;
      const dist = 10 + Math.random() * 20;
      nodes.push({
        x: cx + Math.cos(angle) * dist, y: cy + Math.sin(angle) * dist,
        baseX: cx + Math.cos(angle) * dist, baseY: cy + Math.sin(angle) * dist,
        radius: 3 + Math.random() * 2, hue: 220 + Math.random() * 15,
        phase: Math.random() * Math.PI * 2, speed: 0.2 + Math.random() * 0.3,
      });
    }

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + Math.random() * 0.3;
      const dist = 40 + Math.random() * 80;
      const px = cx + Math.cos(angle) * dist;
      const py = cy + Math.sin(angle) * dist;
      nodes.push({
        x: px, y: py, baseX: px, baseY: py,
        radius: 2 + Math.random() * 2, hue: 235 + Math.random() * 30,
        phase: Math.random() * Math.PI * 2, speed: 0.15 + Math.random() * 0.2,
      });
    }

    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 + Math.random() * 0.4;
      const dist = 90 + Math.random() * 100;
      const px = cx + Math.cos(angle) * dist;
      const py = cy + Math.sin(angle) * dist;
      nodes.push({
        x: px, y: py, baseX: px, baseY: py,
        radius: 1.5 + Math.random() * 2, hue: 250 + Math.random() * 40,
        phase: Math.random() * Math.PI * 2, speed: 0.1 + Math.random() * 0.15,
      });
    }

    const branches: Branch[] = [];
    const coreEnd = 3;
    const midEnd = 11;
    const totalNodes = nodes.length;

    for (let i = 0; i < coreEnd; i++) {
      for (let j = i + 1; j < coreEnd; j++) {
        if (Math.random() > 0.3) {
          branches.push({ from: i, to: j, opacity: 0.25 });
        }
      }
    }

    for (let i = coreEnd; i < midEnd; i++) {
      const closest = findClosest(nodes[i], nodes.slice(0, coreEnd));
      branches.push({ from: closest, to: i, opacity: 0.18 });
      if (Math.random() > 0.6) {
        const other = coreEnd + Math.floor(Math.random() * (midEnd - coreEnd));
        if (other !== i) {
          branches.push({ from: i, to: other, opacity: 0.08 });
        }
      }
    }

    for (let i = midEnd; i < totalNodes; i++) {
      const closest = findClosest(nodes[i], nodes.slice(coreEnd, midEnd)) + coreEnd;
      branches.push({ from: closest, to: i, opacity: 0.12 });
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

    const draw = (time: number) => {
      if (!isIntersecting) return;

      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const nodes = nodesRef.current;
      const branches = branchesRef.current;
      const t = time * 0.001;

      nodes.forEach((node) => {
        const drift = Math.sin(t * node.speed + node.phase);
        const driftY = Math.cos(t * node.speed * 0.7 + node.phase + 1);
        const amplitude = node.radius < 2 ? 8 : node.radius < 3 ? 5 : 2;
        node.x = node.baseX + drift * amplitude;
        node.y = node.baseY + driftY * amplitude * 0.7;
      });

      branches.forEach((branch) => {
        const from = nodes[branch.from];
        const to = nodes[branch.to];
        if (!from || !to) return;
        const pulse = 0.5 + 0.5 * Math.sin(t * 1.5 + branch.from * 0.5);
        const alpha = branch.opacity * (0.5 + 0.5 * pulse);
        const mx = (from.x + to.x) / 2 + Math.sin(t + branch.from) * 5;
        const my = (from.y + to.y) / 2 + Math.cos(t + branch.to) * 5;

        const grad = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
        grad.addColorStop(0, `hsla(${from.hue}, 70%, 65%, ${alpha})`);
        grad.addColorStop(1, `hsla(${to.hue}, 70%, 65%, ${alpha})`);

        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.quadraticCurveTo(mx, my, to.x, to.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });

      nodes.forEach((node) => {
        const pulse = 0.7 + 0.3 * Math.sin(t * 2 + node.phase);
        const r = node.radius * pulse;
        const glowRadius = r * 4;

        const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowRadius);
        glow.addColorStop(0, `hsla(${node.hue}, 85%, 72%, ${0.2 * pulse})`);
        glow.addColorStop(1, `hsla(${node.hue}, 80%, 70%, 0)`);
        ctx.beginPath();
        ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${node.hue}, 85%, 68%, ${0.6 + 0.3 * pulse})`;
        ctx.fill();
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

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, [initNetwork]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
}

function findClosest(target: { x: number; y: number }, candidates: Node[]): number {
  let minDist = Infinity;
  let minIdx = 0;
  candidates.forEach((c, i) => {
    const d = Math.hypot(target.x - c.x, target.y - c.y);
    if (d < minDist) { minDist = d; minIdx = i; }
  });
  return minIdx;
}
