"use client";

export interface Tab {
  id: string;
  label: string;
  sub: string;
  icon: string;
}

export const TABS: Tab[] = [
  { id: "home", label: "หน้าหลัก", sub: "Home", icon: "🏠" },
  { id: "office", label: "ออฟฟิศ", sub: "Office Floor", icon: "🏢" },
  { id: "agents", label: "พนักงาน AI", sub: "Agents", icon: "🤖" },
  { id: "teams", label: "ทีม", sub: "Teams", icon: "👥" },
  { id: "tasks", label: "งาน", sub: "Tasks", icon: "✅" },
  { id: "workflows", label: "เวิร์กโฟลว์", sub: "Workflows", icon: "🔀" },
  { id: "connectors", label: "การเชื่อมต่อ", sub: "Connectors", icon: "🔌" },
  { id: "knowledge", label: "ฐานความรู้", sub: "Knowledge Base", icon: "📚" },
];

export default function Sidebar({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (id: string) => void;
}) {
  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-white/5 bg-panel">
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500 font-black">
          A
        </div>
        <div className="leading-tight">
          <div className="text-sm font-bold">SANOOK AI OS</div>
          <div className="text-[10px] text-slate-400">AI WORKFORCE COMMAND CENTER</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {TABS.map((t) => {
          const isActive = t.id === active;
          return (
            <button
              key={t.id}
              onClick={() => onSelect(t.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition ${
                isActive
                  ? "bg-indigo-500/20 text-white ring-1 ring-indigo-400/30"
                  : "text-slate-300 hover:bg-white/5"
              }`}
            >
              <span className="text-base">{t.icon}</span>
              <span className="leading-tight">
                <span className="block text-sm font-medium">{t.label}</span>
                <span className="block text-[10px] text-slate-500">{t.sub}</span>
              </span>
            </button>
          );
        })}
      </nav>

      <div className="px-5 py-4 text-[10px] text-slate-600">v0.1 · dev preview</div>
    </aside>
  );
}
