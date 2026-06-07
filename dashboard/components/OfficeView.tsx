"use client";

import { useEffect, useRef, useState } from "react";
import { AGENTS, ZONES } from "@/lib/agents";
import AgentCard from "./AgentCard";

interface Mover {
  id: string;
  x: number;
  y: number;
  hx: number; // home x
  hy: number; // home y
  flip: boolean;
  bubble?: string;
  bubbleUntil: number;
}

interface Token {
  id: string;
  holderId: string;
  targetId: string;
  color: string;
}

const SPEED = 11; // % of canvas per second
const BUBBLE_MS = 2600;
const HANDOFF_DIST = 4.5;

function dist(ax: number, ay: number, bx: number, by: number) {
  return Math.hypot(ax - bx, ay - by);
}
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function OfficeView() {
  const moversRef = useRef<Mover[]>(
    AGENTS.map((a) => ({ id: a.id, x: a.x, y: a.y, hx: a.x, hy: a.y, flip: false, bubbleUntil: 0 }))
  );
  const tokensRef = useRef<Token[]>([
    { id: "t1", holderId: "a0", targetId: "a6", color: "#60a5fa" },
    { id: "t2", holderId: "a3", targetId: "a8", color: "#f472b6" },
  ]);
  const lastRef = useRef<number | null>(null);
  const [, force] = useState(0);

  useEffect(() => {
    const agentsById = Object.fromEntries(AGENTS.map((a) => [a.id, a]));
    let raf = 0;

    const step = (t: number) => {
      const last = lastRef.current ?? t;
      const dt = Math.min(0.05, (t - last) / 1000);
      lastRef.current = t;

      const movers = moversRef.current;
      const byId: Record<string, Mover> = Object.fromEntries(movers.map((m) => [m.id, m]));
      const tokens = tokensRef.current;

      // a holder walks toward the agent it must hand off to; everyone else returns home
      const targetFor: Record<string, { x: number; y: number }> = {};
      tokens.forEach((tok) => {
        const tgt = byId[tok.targetId];
        if (tgt) targetFor[tok.holderId] = { x: tgt.x, y: tgt.y };
      });

      movers.forEach((m) => {
        const goal = targetFor[m.id] ?? { x: m.hx, y: m.hy };
        const d = dist(m.x, m.y, goal.x, goal.y);
        if (d > 0.5) {
          const ux = (goal.x - m.x) / d;
          const uy = (goal.y - m.y) / d;
          m.x += ux * SPEED * dt;
          m.y += uy * SPEED * dt;
          if (Math.abs(ux) > 0.04) m.flip = ux < 0;
        }
        if (t > m.bubbleUntil) m.bubble = undefined;
      });

      // handoff when carrier reaches its recipient
      tokens.forEach((tok) => {
        const holder = byId[tok.holderId];
        const target = byId[tok.targetId];
        if (holder && target && dist(holder.x, holder.y, target.x, target.y) < HANDOFF_DIST) {
          holder.bubble = `📤 ส่งงานให้ ${agentsById[tok.targetId]?.name ?? ""}`;
          holder.bubbleUntil = t + BUBBLE_MS;
          target.bubble = "📥 รับงานต่อ";
          target.bubbleUntil = t + BUBBLE_MS;
          tok.holderId = tok.targetId;
          const others = AGENTS.filter((a) => a.id !== tok.holderId);
          tok.targetId = pick(others).id;
        }
      });

      force((n) => (n + 1) % 1000000);
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const movers = moversRef.current;
  const byId: Record<string, Mover> = Object.fromEntries(movers.map((m) => [m.id, m]));
  const tokens = tokensRef.current;
  const carrying = new Set(tokens.map((t) => t.holderId));

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a1830] via-[#16142a] to-[#0f0e1d] shadow-2xl">
      <div className="office-grid absolute inset-0 opacity-60" />

      {/* zones */}
      {ZONES.map((z) => (
        <div
          key={z.id}
          className="absolute rounded-xl border border-white/10"
          style={{ left: `${z.x}%`, top: `${z.y}%`, width: `${z.w}%`, height: `${z.h}%`, background: z.tint }}
        >
          <span className="absolute left-2 top-1.5 text-[10px] font-semibold tracking-wider text-white/40">
            {z.label}
          </span>
        </div>
      ))}

      {/* work-in-transit beams */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {tokens.map((tok) => {
          const h = byId[tok.holderId];
          const tg = byId[tok.targetId];
          if (!h || !tg) return null;
          return (
            <line
              key={tok.id}
              x1={h.x}
              y1={h.y}
              x2={tg.x}
              y2={tg.y}
              stroke={tok.color}
              strokeWidth={0.25}
              strokeDasharray="1 1.2"
              opacity={0.5}
            />
          );
        })}
      </svg>

      {/* live ops badge */}
      <div className="absolute right-4 top-4 rounded-lg bg-black/40 px-3 py-1.5 text-right ring-1 ring-white/10">
        <div className="text-[11px] font-semibold text-emerald-300">● LIVE OPS</div>
        <div className="text-[9px] text-slate-400">{AGENTS.length} agents · {tokens.length} งานกำลังส่งต่อ</div>
      </div>

      {/* agents */}
      {AGENTS.map((a) => {
        const m = byId[a.id];
        return (
          <AgentCard
            key={a.id}
            agent={a}
            x={m.x}
            y={m.y}
            flip={m.flip}
            bubble={m.bubble}
            carrying={carrying.has(a.id)}
          />
        );
      })}
    </div>
  );
}
