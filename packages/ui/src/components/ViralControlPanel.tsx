import React, { useEffect, useState } from 'react';
import { getColyseusRoom } from '../game/Game';
import { eventBus } from '../events';
import { FloatingPanel } from './FloatingPanel';

const SCENARIOS = [
    { id: 'Startup Crunch', label: 'ภาวะเร่งด่วนสตาร์ทอัพ' },
    { id: 'Hackathon Night', label: 'คืนแฮกกาธอน' },
    { id: 'Incident War Room', label: 'วอร์รูมเหตุฉุกเฉิน' },
    { id: 'Product Launch', label: 'เปิดตัวสินค้า' },
] as const;
const CHAOS_EVENTS = [
    { id: 'server_outage', label: 'เซิร์ฟเวอร์ล่ม' },
    { id: 'funding_cut', label: 'ตัดงบ' },
    { id: 'client_escalation', label: 'ลูกค้าร้องเรียน' },
    { id: 'surprise_launch', label: 'เปิดตัวกะทันหัน' },
    { id: 'viral_tweet', label: 'ทวีตไวรัล' },
] as const;

export function ViralControlPanel() {
    const [scenario, setScenario] = useState<string>(SCENARIOS[0].id);
    const [cinematicMode, setCinematicMode] = useState(true);
    const [lastEvent, setLastEvent] = useState('ว่าง');
    const [voteStatus, setVoteStatus] = useState('');
    const [paused, setPaused] = useState(false);
    const [autoChat, setAutoChat] = useState(true);

    useEffect(() => {
        eventBus.dispatchEvent(new CustomEvent('cinematic-toggle', { detail: { enabled: cinematicMode } }));
    }, [cinematicMode]);

    useEffect(() => {
        const handler = (e: Event) => {
            const detail = (e as CustomEvent).detail;
            if (detail?.label) {
                setLastEvent(detail.label);
            } else if (detail?.scenario) {
                setLastEvent(`สถานการณ์: ${detail.scenario}`);
            }
        };
        eventBus.addEventListener('scenario-event', handler);
        return () => eventBus.removeEventListener('scenario-event', handler);
    }, []);

    const startScenario = () => {
        const room = getColyseusRoom();
        if (!room) return;
        room.send('start-scenario', { scenario });
    };

    const triggerChaos = (eventId: string) => {
        const room = getColyseusRoom();
        if (!room) return;
        room.send('trigger-chaos', { event: eventId });
    };

    const togglePause = () => {
        const room = getColyseusRoom();
        if (!room) return;
        const next = !paused;
        setPaused(next);
        room.send('set-paused', { paused: next });
    };

    const toggleAutoChat = () => {
        const room = getColyseusRoom();
        if (!room) return;
        const next = !autoChat;
        setAutoChat(next);
        room.send('set-autochat', { enabled: next });
    };

    const castVote = async (eventId: string) => {
        try {
            const response = await fetch('/api/vote-chaos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event: eventId,
                    voterId: `local-${Math.random().toString(36).slice(2, 8)}`
                })
            });
            const data = await response.json();
            if (data?.ok) {
                setVoteStatus(`${eventId}: ${data.tally} โหวต${data.triggered ? ' (เริ่มแล้ว)' : ''}`);
            } else {
                setVoteStatus('โหวตไม่สำเร็จ');
            }
        } catch {
            setVoteStatus('โหวตไม่สำเร็จ');
        }
    };

    return (
        <FloatingPanel
            id="viral-control"
            title="แผงควบคุมโชว์"
            subtitle="คอนโซลโหมดไวรัล"
            width={330}
            defaultDock="right"
            defaultY={20}
            zIndex={18}
        >
            {/* ── ควบคุมการจำลอง ── */}
            <div style={{ display: 'flex', gap: 6, marginTop: 8, marginBottom: 10 }}>
                <button
                    onClick={togglePause}
                    style={{
                        flex: 1, border: 'none', borderRadius: 8, padding: '8px 10px', cursor: 'pointer',
                        fontWeight: 700, fontSize: 12, color: '#fff',
                        background: paused ? '#00b894' : '#e17055'
                    }}
                >
                    {paused ? '▶ เล่นต่อ' : '⏸ หยุดทั้งหมด'}
                </button>
                <button
                    onClick={toggleAutoChat}
                    style={{
                        flex: 1, border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, padding: '8px 10px',
                        cursor: 'pointer', fontWeight: 700, fontSize: 12,
                        color: autoChat ? '#0c1024' : '#ffd6a5',
                        background: autoChat ? '#a0e7c0' : 'rgba(255,255,255,0.08)'
                    }}
                    title="ปิด = agent หยุดคุยกันเอง แต่ยังตอบ user"
                >
                    {autoChat ? '💬 คุยออโต้: เปิด' : '🤫 คุยออโต้: ปิด'}
                </button>
            </div>

            <div style={{ fontSize: 11, color: '#babedc', marginBottom: 10 }}>
                เหตุการณ์ล่าสุด: <strong style={{ color: '#ffd6a5' }}>{lastEvent}</strong>
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <select
                    value={scenario}
                    onChange={(e) => setScenario(e.target.value)}
                    style={{
                        flex: 1,
                        background: '#181f45',
                        color: '#fff',
                        borderRadius: 8,
                        border: '1px solid rgba(255,255,255,0.2)',
                        padding: '8px 10px',
                        fontSize: 12
                    }}
                >
                    {SCENARIOS.map((item) => (
                        <option key={item.id} value={item.id}>{item.label}</option>
                    ))}
                </select>
                <button
                    onClick={startScenario}
                    style={{
                        border: 'none',
                        borderRadius: 8,
                        padding: '8px 12px',
                        cursor: 'pointer',
                        fontWeight: 700,
                        color: '#150f21',
                        background: 'linear-gradient(135deg, #ffadad, #ffd6a5)'
                    }}
                >
                    เริ่ม
                </button>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, marginBottom: 10 }}>
                <input
                    type="checkbox"
                    checked={cinematicMode}
                    onChange={(e) => setCinematicMode(e.target.checked)}
                />
                กล้องโฟกัสอัตโนมัติ
            </label>

            <div style={{ fontSize: 12, marginBottom: 6, color: '#ffcad4' }}>ปุ่มสร้างความวุ่นวาย</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {CHAOS_EVENTS.map((event) => (
                    <div key={event.id} style={{ display: 'flex', gap: 4 }}>
                        <button
                            onClick={() => triggerChaos(event.id)}
                            style={{
                                flex: 1,
                                border: '1px solid rgba(255,255,255,0.12)',
                                background: 'rgba(255,255,255,0.06)',
                                color: '#f0f3ff',
                                borderRadius: 8,
                                padding: '7px 8px',
                                cursor: 'pointer',
                                fontSize: 11
                            }}
                        >
                            {event.label}
                        </button>
                        <button
                            onClick={() => castVote(event.id)}
                            title="โหวตจากผู้ชม"
                            style={{
                                border: '1px solid rgba(255,255,255,0.12)',
                                background: 'rgba(255, 214, 165, 0.2)',
                                color: '#ffe5c2',
                                borderRadius: 8,
                                padding: '7px 8px',
                                cursor: 'pointer',
                                fontSize: 11
                            }}
                        >
                            โหวต
                        </button>
                    </div>
                ))}
            </div>
            <div style={{ marginTop: 8, fontSize: 11, color: '#ffd6a5', minHeight: 16 }}>
                {voteStatus}
            </div>
        </FloatingPanel>
    );
}
