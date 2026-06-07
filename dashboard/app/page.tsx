"use client";

import { useState } from "react";
import Sidebar, { TABS } from "@/components/Sidebar";
import OfficeView from "@/components/OfficeView";
import { AGENTS } from "@/lib/agents";

export default function Page() {
  const [active, setActive] = useState("office");
  const tab = TABS.find((t) => t.id === active);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar active={active} onSelect={setActive} />

      <main className="flex min-w-0 flex-1 flex-col">
        {/* top command bar */}
        <header className="flex items-center gap-4 border-b border-white/5 px-6 py-3">
          <input
            placeholder="พิมพ์คำสั่งหรือค้นหา…  ( / )"
            className="w-full max-w-xl rounded-lg bg-white/5 px-4 py-2 text-sm outline-none ring-1 ring-white/10 placeholder:text-slate-500 focus:ring-indigo-400/40"
          />
          <div className="ml-auto flex items-center gap-3">
            <span className="rounded-md bg-white/5 px-2 py-1 text-xs text-slate-400">TH</span>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-pink-500 to-indigo-500" />
              <div className="leading-tight">
                <div className="text-xs font-semibold">Admin</div>
                <div className="text-[10px] text-slate-500">Super Admin</div>
              </div>
            </div>
          </div>
        </header>

        {/* content */}
        <section className="flex-1 overflow-auto p-6">
          {active === "office" ? (
            <div className="flex h-full flex-col gap-4">
              <div className="rounded-xl bg-gradient-to-r from-indigo-600/40 to-fuchsia-600/30 px-6 py-4 ring-1 ring-white/10">
                <h1 className="text-xl font-bold">SANOOK AI Office — พนักงาน AI 100%</h1>
                <p className="text-sm text-slate-300">ภาพรวมออฟฟิศแบบเรียลไทม์</p>
              </div>
              <div className="min-h-0 flex-1">
                <OfficeView />
              </div>
            </div>
          ) : active === "agents" ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {AGENTS.map((a) => (
                <div key={a.id} className="flex items-center gap-3 rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
                  <img src={a.avatar} alt={a.name} className="h-14 w-11 object-contain" />
                  <div>
                    <div className="font-semibold">{a.name}</div>
                    <div className="text-xs text-slate-400">{a.role}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-center">
              <div>
                <div className="text-5xl">{tab?.icon}</div>
                <h2 className="mt-3 text-2xl font-bold">{tab?.label}</h2>
                <p className="mt-1 text-slate-400">หน้านี้กำลังพัฒนา — เพิ่มได้ทีหลัง ({tab?.sub})</p>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
