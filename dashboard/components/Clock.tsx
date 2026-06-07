"use client";

import { useEffect, useState } from "react";

export default function Clock() {
  // render time only after mount to avoid SSR hydration mismatch
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = now
    ? now.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : "--:--:--";
  const date = now
    ? now.toLocaleDateString("th-TH", { weekday: "long", day: "numeric", month: "short" })
    : "";

  return (
    <div className="absolute bottom-0 right-0 z-20 rounded-tl-xl bg-[#0f0e1d]/95 px-4 py-2 text-right text-white/85 backdrop-blur-sm">
      <div className="font-mono text-lg font-semibold leading-none tabular-nums">{time}</div>
      <div className="mt-1 text-[10px] text-white/55">{date}</div>
    </div>
  );
}
