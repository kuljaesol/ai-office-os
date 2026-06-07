"use client";

import { Agent, STATUS_STYLE } from "@/lib/agents";

export default function AgentCard({
  agent,
  x,
  y,
  flip,
  bubble,
  carrying,
}: {
  agent: Agent;
  x: number;
  y: number;
  flip: boolean;
  bubble?: string;
  carrying?: boolean;
}) {
  const s = STATUS_STYLE[agent.status];
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${x}%`, top: `${y}%`, zIndex: carrying ? 30 : 10 }}
    >
      {/* speech bubble */}
      {bubble && (
        <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900/95 px-2.5 py-1 text-[11px] text-slate-100 shadow-lg ring-1 ring-white/10">
          {bubble}
          <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-900/95" />
        </div>
      )}

      <div
        className={`flex w-[128px] items-center gap-2 rounded-xl bg-white/95 p-2 text-slate-800 shadow-xl ring-1 backdrop-blur ${
          carrying ? "ring-indigo-400" : "ring-black/5"
        }`}
      >
        <div className="relative shrink-0">
          <img
            src={agent.avatar}
            alt={agent.name}
            className="h-11 w-9 object-contain"
            style={{ transform: flip ? "scaleX(-1)" : "none" }}
            draggable={false}
          />
          {carrying && (
            <span className="absolute -right-1 -top-1 rounded bg-indigo-500 px-1 text-[9px] leading-tight text-white shadow">
              📄
            </span>
          )}
        </div>
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
