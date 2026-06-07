"use client";

import { AGENTS, ZONES } from "@/lib/agents";
import AgentCard from "./AgentCard";

export default function OfficeView() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a1830] via-[#16142a] to-[#0f0e1d] shadow-2xl">
      {/* floor texture */}
      <div className="office-grid absolute inset-0 opacity-60" />

      {/* zones */}
      {ZONES.map((z) => (
        <div
          key={z.id}
          className="absolute rounded-xl border border-white/10"
          style={{
            left: `${z.x}%`,
            top: `${z.y}%`,
            width: `${z.w}%`,
            height: `${z.h}%`,
            background: z.tint,
          }}
        >
          <span className="absolute left-2 top-1.5 text-[10px] font-semibold tracking-wider text-white/40">
            {z.label}
          </span>
        </div>
      ))}

      {/* live ops badge */}
      <div className="absolute right-4 top-4 rounded-lg bg-black/40 px-3 py-1.5 text-right ring-1 ring-white/10">
        <div className="text-[11px] font-semibold text-emerald-300">● LIVE OPS</div>
        <div className="text-[9px] text-slate-400">office floor · {AGENTS.length} agents</div>
      </div>

      {/* agents */}
      {AGENTS.map((a) => (
        <AgentCard key={a.id} agent={a} />
      ))}
    </div>
  );
}
