export type AgentStatus = "online" | "busy" | "idle";

export interface Zone {
  id: string;
  label: string;
  /** position + size as % of the office canvas */
  x: number;
  y: number;
  w: number;
  h: number;
  tint: string; // tailwind-ish rgba used inline
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  zoneId: string;
  avatar: string; // path under /characters
  status: AgentStatus;
  /** position as % of the office canvas */
  x: number;
  y: number;
  bubble?: string; // optional speech bubble text
}

export const ZONES: Zone[] = [
  { id: "sales", label: "SALES ZONE", x: 3, y: 8, w: 30, h: 40, tint: "rgba(56,189,248,0.10)" },
  { id: "creative", label: "CREATIVE STUDIO", x: 35, y: 6, w: 30, h: 34, tint: "rgba(236,72,153,0.10)" },
  { id: "automation", label: "AUTOMATION BAY", x: 67, y: 8, w: 30, h: 40, tint: "rgba(168,85,247,0.10)" },
  { id: "data", label: "DATA LAB", x: 20, y: 54, w: 38, h: 40, tint: "rgba(34,197,94,0.10)" },
  { id: "knowledge", label: "KNOWLEDGE + ADMIN", x: 62, y: 54, w: 34, h: 40, tint: "rgba(251,191,36,0.10)" },
];

// x,y are % of the office image. Tweak these to sit each card on a desk.
export const AGENTS: Agent[] = [
  { id: "a0", name: "Sol1", role: "งานขายใหม่", zoneId: "sales", avatar: "/characters/char_0.png", status: "online", x: 19, y: 40 },
  { id: "a1", name: "Sol2", role: "ครีเอทีฟ", zoneId: "creative", avatar: "/characters/char_1.png", status: "online", x: 45, y: 25 },
  { id: "a2", name: "Sol3", role: "มีเดีย", zoneId: "creative", avatar: "/characters/char_2.png", status: "busy", x: 57, y: 33 },
  { id: "a3", name: "Sol4", role: "เวิร์กโฟลว์/API", zoneId: "automation", avatar: "/characters/char_3.png", status: "online", x: 75, y: 27 },
  { id: "a4", name: "Sol5", role: "Cross-dept runner", zoneId: "automation", avatar: "/characters/char_4.png", status: "busy", x: 87, y: 41 },
  { id: "a5", name: "Sol6", role: "Left aisle runner", zoneId: "data", avatar: "/characters/char_5.png", status: "online", x: 22, y: 66 },
  { id: "a6", name: "Sol7", role: "dashboard", zoneId: "data", avatar: "/characters/char_6.png", status: "online", x: 41, y: 72 },
  { id: "a7", name: "Sol8", role: "จัดการ ticket", zoneId: "data", avatar: "/characters/char_7.png", status: "idle", x: 30, y: 86 },
  { id: "a8", name: "Sol9", role: "Right aisle runner", zoneId: "knowledge", avatar: "/characters/char_8.png", status: "online", x: 66, y: 66 },
  { id: "a9", name: "Sol10", role: "ดูแลระบบ", zoneId: "knowledge", avatar: "/characters/char_9.png", status: "online", x: 83, y: 76 },
];

export const STATUS_STYLE: Record<AgentStatus, { label: string; dot: string; text: string }> = {
  online: { label: "ONLINE", dot: "bg-emerald-400", text: "text-emerald-300" },
  busy: { label: "BUSY", dot: "bg-amber-400", text: "text-amber-300" },
  idle: { label: "IDLE", dot: "bg-slate-400", text: "text-slate-300" },
};
