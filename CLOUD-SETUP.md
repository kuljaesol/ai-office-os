# รันบน GitHub Codespaces (แล็ปท็อปแค่เปิดเบราว์เซอร์)

แล็ปท็อปเครื่องนี้ไม่เสถียร (BSOD 0x50) — เราจึงรันทุกอย่างบน cloud และใช้แล็ปท็อปแค่เปิดเบราว์เซอร์

## เตรียมพร้อมแล้ว (ผมทำให้)
- `.devcontainer/devcontainer.json` — Codespace จะ `npm install && npm run build` ให้อัตโนมัติ + forward port 3000, 5173
- `vite.config.ts` ตั้ง `host: true` แล้ว (รองรับ port forwarding)
- ตัวละคร 10 ตัว (`public/assets/characters/char_0..9.png`) + โค้ดใช้รูปจริงแล้ว

## ขั้นที่ 1 — push ขึ้น GitHub (รันใน PowerShell ปกติ — เบา)
> ใช้ PowerShell ไม่ใช่ git-bash (เพราะไฟล์รูปบางตัวสร้างนอก sandbox)

```powershell
cd "C:\Users\tinnakrit\Desktop\ai-office-os\_src"
git add -A
git commit -m "ai-office-os: ตัวละครจริง + devcontainer สำหรับ Codespaces"
# สร้าง repo ใหม่บน github.com ก่อน (เช่นชื่อ ai-office-os) แล้ว:
git remote remove origin
git remote add origin https://github.com/<ชื่อคุณ>/ai-office-os.git
git branch -M main
git push -u origin main
```

## ขั้นที่ 2 — เปิด Codespace
1. ไปที่ repo บน github.com → ปุ่ม **Code** (เขียว) → แท็บ **Codespaces** → **Create codespace on main**
2. รอ ~2-3 นาที (มันรัน `npm install && npm run build` ให้เอง)

## ขั้นที่ 3 — รันในเทอร์มินัลของ Codespace (เปิด 2 เทอร์มินัล)
```bash
# เทอร์มินัล 1 — server
npm run start --workspace=@agent-office/server
# เทอร์มินัล 2 — UI
npm run dev --workspace=@agent-office/ui
```
แท็บ **PORTS** จะเด้ง 5173 ขึ้นมา → กดเปิด (เปิดในเบราว์เซอร์แล็ปท็อปคุณ)

## ขั้นที่ 4 — ต่อ WebSocket ให้ถูก (ทำครั้งเดียว)
ใน Codespaces หน้าเว็บจะต่อ server ไม่ติดเอง ให้ไปที่แท็บ PORTS ก๊อปปี้ URL ของ **port 3000**
(เช่น `https://abc-3000.app.github.dev`) แล้วเปิด DevTools Console บนหน้าเว็บ พิมพ์:
```js
localStorage.setItem('agent-office:ws-url', 'wss://abc-3000.app.github.dev');
location.reload();
```
(เปลี่ยน `https://` เป็น `wss://` และตัด `/` ท้ายออก) — จากนั้นตัวละครจะโหลด + เดินได้

## เรื่อง LLM (ทำทีหลัง)
ตอนนี้ agent จะเดินแต่ยังไม่ "คิด" (ไม่มี LLM) เมื่อพร้อม ต่อ LLM ผ่าน OpenRouter:
แก้ `packages/server/src/rooms/OfficeRoom.ts` บรรทัด ~43 จาก `http://127.0.0.1:1234`
เป็น base URL + API key ของ OpenRouter (OpenAI-compatible)
