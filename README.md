# AgentOffice — ฉบับภาษาไทย (LM Studio Edition)

ออฟฟิศจำลองแบบ pixel art ที่มี **AI agent หลายตัวเดิน ทำงาน และคุยกันเอง** แบบเรียลไทม์
รันบนเครื่องตัวเอง 100% ผ่าน **LM Studio** (โมเดล local เช่น gemma) — ไม่ต้องต่อ cloud

> 🪪 **โปรเจกต์นี้เป็น fork/ดัดแปลง** จาก [harishkotra/agent-office](https://github.com/harishkotra/agent-office) (MIT License)
> ส่วนแนวคิด pixel-art office สืบสายมาจาก [pablodelucca/pixel-agents](https://github.com/pablodelucca/pixel-agents) (MIT License)

---

## ⚠️ นี่คือ demo / simulation

Agent ในนี้ **"สวมบทบาท" คุยกันด้วย LLM** เพื่อสาธิตพฤติกรรมหลาย agent ในพื้นที่เดียวกัน
**ยังไม่ได้ต่อกับ tool/ระบบจริง** — บทบาทอย่าง Dev (GitHub), FarmConnect (MQTT/ESP32), DevDonate (Omise)
เป็นแค่ **persona/บทสนทนา** ไม่ได้เชื่อมต่อ API จริงเหล่านั้น (มี tool พื้นฐาน เช่น web search/โน้ต ที่ทำงานได้จริงเท่านั้น)

ใช้เพื่อ: ทดลองเล่น multi-agent, ดูการสวมบทบาทภาษาไทย, ต่อยอดเป็นระบบจริงภายหลัง

---

## สิ่งที่เพิ่ม/แก้จากต้นฉบับ

- 🇹🇭 **UI ภาษาไทยทั้งหมด** (กระดานงาน, ชีพจร Agent, ไทม์ไลน์, แชต, ผังออฟฟิศ ฯลฯ) + รองรับฟอนต์ไทยในจอเกม
- 👥 **5 agent บทบาทไทย**: ทั่วไป · นักพัฒนา · ฟรีแลนซ์ · ฟาร์มคอนเนกต์ · เดฟโดเนต (แต่ละตัวมี system prompt + โต๊ะประจำ)
- 🔌 **ต่อ LM Studio (OpenAI-compatible) แทน Ollama** — ยิงไป `http://127.0.0.1:1234` (แก้ปัญหา IPv6 `::1` ด้วย 127.0.0.1)
- 🧱 **ทนทานขึ้นกับโมเดลเล็ก (gemma 4B)**: กู้ JSON output, parse ล้มแล้วพูด reply ดิบแทนค้าง, กัน tool ที่ไม่มีจริง
- 🎚️ **คุมจังหวะได้**: หน่วงรอบคิด, จำกัดการคุยกันเอง (cooldown + probability), ปุ่ม **หยุด/เล่นต่อ** และ **เปิด/ปิดคุยอัตโนมัติ**
- 🪟 **ทุก panel ลากย้าย/ย่อ/ปิดได้** + ปุ่มเรียก panel กลับ

---

## ความต้องการระบบ

- **Node.js** 18+ (แนะนำ 20+)
- **LM Studio** ([lmstudio.ai](https://lmstudio.ai)) + โหลดโมเดล **gemma** (หรือโมเดล chat อื่น)
- Windows: การติดตั้งจะ build `better-sqlite3` (native) — ถ้าพลาดให้ลง **"Desktop development with C++"** จาก Visual Studio Build Tools

---

## ติดตั้ง & รัน

```bash
# 1) clone
git clone https://github.com/devpanitan/<ชื่อ-repo>.git
cd <ชื่อ-repo>

# 2) ติดตั้ง dependencies (npm workspaces — ติดตั้งทุก package)
npm install
```

**3) เปิด LM Studio**
- โหลดโมเดล gemma แล้วไปแท็บ **Developer / Local Server** → **Start Server** (พอร์ต `1234`)
- เช็คว่าใช้งานได้: `http://127.0.0.1:1234/v1/models` ต้องเห็นรายชื่อโมเดล
- ชื่อโมเดลในโค้ดตั้งไว้ที่ `google/gemma-4-e4b` (ดู `packages/server/src/rooms/OfficeRoom.ts`) — ถ้าโมเดลคุณชื่ออื่น แก้ให้ตรง

**4) รัน 2 terminal**

Terminal 1 — เซิร์ฟเวอร์ (Colyseus, พอร์ต 3000):
```bash
npm run build --workspace=@agent-office/core
npm run build --workspace=@agent-office/adapters
npm run build --workspace=@agent-office/server
npm run start --workspace=@agent-office/server
```

Terminal 2 — UI (Vite, พอร์ต 5173):
```bash
npm run dev --workspace=@agent-office/ui
```

เปิด **http://localhost:5173** → ควรเห็นออฟฟิศ + agent เดิน/คุยกันเป็นไทย

> เลื่อนแมพ: ลูกศร/WASD (คลิกบนแมพก่อน) · ซูม: ล้อเมาส์ · คลิก agent = กล้องตาม

---

## 🎨 Asset Setup (สำคัญ — sprite ไม่ได้รวมมาให้)

repo นี้ **ไม่ได้แนบ sprite ตัวละคร** เพราะ license ของตัวอาร์ตจาก upstream **ไม่ชัดเจน** จึงไม่ redistribute เพื่อความถูกต้อง
**แอปยังรันได้ทันที** — ถ้าไม่มี sprite ตัวละครจะแสดงเป็น **สี่เหลี่ยมสี** (placeholder) อัตโนมัติ

อยากได้ตัวละคร pixel ให้โหลด asset ที่ **license ชัด (CC0/ฟรี)** มาใส่เอง เช่น:
- **Kenney** — [kenney.nl/assets](https://kenney.nl/assets) (CC0) เช่นชุด "Tiny Town" / "Roguelike Characters"
- **Ninja Adventure Pack** — [pixel-boy.itch.io/ninja-adventure-asset-pack](https://pixel-boy.itch.io/ninja-adventure-asset-pack) (CC0)
- **OpenGameArt** — [opengameart.org](https://opengameart.org) (เช็ค license แต่ละชิ้น)

**วิธีวาง** — โค้ดคาดหวัง spritesheet **16×32 px/เฟรม** (เดิน 3 เฟรม: ลง/ขึ้น/ขวา) ที่:
```
packages/ui/public/assets/characters/char_0.png   ← ใช้กับ agent ทุกตัวเป็นค่าเริ่มต้น
packages/ui/public/assets/characters/char_1.png   ← (ออปชัน) ตัวที่สอง
```
จากนั้น hard refresh หน้าเว็บ (Ctrl+Shift+R)

> sprite path ถูกใส่ไว้ใน `.gitignore` แล้ว (กันเผลอ commit อาร์ตที่ license ไม่ชัด) — ถ้าคุณใช้ asset CC0 ที่ตั้งใจแชร์ต่อ ใช้ `git add -f` เพื่อ commit และ **ใส่เครดิต/license ของ asset นั้นในหัวข้อ Credits**

---

## โครงสร้าง (monorepo)

```
packages/
├── core/       # Agent engine, think-loop, InferenceAdapter (LLM abstraction)
├── adapters/   # OpenAICompatibleAdapter (LM Studio), OllamaAdapter
├── server/     # Colyseus room (OfficeRoom) — agent loop, ปรับจังหวะที่ const ด้านบนไฟล์
└── ui/         # React + Phaser (เกม pixel office) + panel ภาษาไทย
```

จูนพฤติกรรม agent ได้ที่ต้นไฟล์ `packages/server/src/rooms/OfficeRoom.ts`:
`thinkCooldownMs` (ความถี่คิด), `conversationCooldownMs` + `talkChance` (ความถี่คุยกันเอง), `maxConcurrentThinks` (request พร้อมกันไป LM Studio)

---

## Credits

- **[harishkotra/agent-office](https://github.com/harishkotra/agent-office)** — โค้ดต้นฉบับ multi-agent office (MIT © Harish Kotra)
- **[pablodelucca/pixel-agents](https://github.com/pablodelucca/pixel-agents)** — แนวคิด pixel-art agent office (MIT © Pablo De Lucca)
- **[Colyseus](https://colyseus.io)** (multiplayer), **[Phaser](https://phaser.io)** (เกมเอนจิน)
- Sprite/tileset: **ผู้ใช้จัดหาเอง** (ดู Asset Setup) — เครดิตศิลปินตามแหล่งที่เลือกใช้

---

## License

MIT — ดูไฟล์ [LICENSE](./LICENSE)
คงลิขสิทธิ์เดิมของ Harish Kotra ไว้ + ส่วนที่ดัดแปลง (UI ไทย, 5 agent, LM Studio) โดย Panitan (devpanitan)
