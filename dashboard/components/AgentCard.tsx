"use client";

import { Agent, STATUS_STYLE } from "@/lib/agents";

export default function AgentCard({ agent }: { agent: Agent }) {
  const s = STATUS_STYLE[agent.status];
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${agent.x}%`, top: `${agent.y}%` }}
    >
      {/* speech bubble */}
      {agent.bubble && (
        <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900/90 px-2.5 py-1 text-[11px] text-slate-100 shadow-lg ring-1 ring-white/10">
          {agent.bubble}
          <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-900/90" />
        </div>
      )}

      <div className="flex w-[130px] items-center gap-2 rounded-xl bg-white/95 p-2 text-slate-800 shadow-xl ring-1 ring-black/5 backdrop-blur transition hover:scale-105">
        <img
          src={agent.avatar}
          alt={agent.name}
          className="h-11 w-9 shrink-0 object-contain"
          draggable={false}
        />
        <div className="min-w-0 leading-tight">
          <div className="truncate text-[12px] font-bold">{agent.name}</div>
          <div className="truncate text-[10px] text-slate-500">{agent.role}</div>
          <div className="mt-0.5 flex items-center gap-1">
            <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
            <span className={`text-[9px] font-semibold ${s.text}`}>{s.label}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
