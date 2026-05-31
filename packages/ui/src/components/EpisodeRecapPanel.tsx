import React, { useState } from 'react';
import { FloatingPanel } from './FloatingPanel';

type RecapPayload = {
    scenario: string;
    topHighlights: Array<{ type: string; title: string; body: string; time: string }>;
    leaderboard: Array<{ name: string; impact: number }>;
    outcomeCard: { title: string; summary: string; activeRelationships: number };
};

export function EpisodeRecapPanel() {
    const [recap, setRecap] = useState<RecapPayload | null>(null);
    const [status, setStatus] = useState('');

    const loadRecap = async () => {
        setStatus('กำลังโหลดสรุป...');
        try {
            const response = await fetch('/api/episode-recap');
            const data = await response.json();
            if (!data?.ok) {
                setStatus('ยังไม่มีสรุป');
                return;
            }
            setRecap(data.recap);
            setStatus('สรุปพร้อมแล้ว');
        } catch {
            setStatus('โหลดสรุปไม่สำเร็จ');
        }
    };

    const exportRecap = () => {
        if (!recap) return;
        const blob = new Blob([JSON.stringify(recap, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `episode-recap-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <FloatingPanel
            id="episode-recap"
            title="สรุปอีพ"
            subtitle="สรุปพร้อมส่งออก"
            width={340}
            defaultDock="left"
            defaultY={220}
            zIndex={15}
        >
            <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                <button onClick={loadRecap} style={{
                    border: 'none', borderRadius: 8, padding: '7px 10px', cursor: 'pointer',
                    background: '#b388ff', color: '#1e1130', fontWeight: 700, fontSize: 11
                }}>โหลด</button>
                <button onClick={exportRecap} disabled={!recap} style={{
                    border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, padding: '7px 10px', cursor: 'pointer',
                    background: recap ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)', color: '#f2e9ff', fontSize: 11
                }}>ส่งออก JSON</button>
            </div>
            <div style={{ fontSize: 11, color: '#d9c8f2', marginBottom: 8 }}>{status}</div>

            {recap && (
                <>
                    <div style={{ fontSize: 11, color: '#f7d794', marginBottom: 6 }}>
                        {recap.outcomeCard.title}: {recap.outcomeCard.summary}
                    </div>
                    <div style={{ fontSize: 11, marginBottom: 6 }}>
                        พันธมิตร/คู่แข่งที่ active: <strong>{recap.outcomeCard.activeRelationships}</strong>
                    </div>
                    <div style={{ fontSize: 11, marginBottom: 4, color: '#cdb4db' }}>ไฮไลต์เด่น</div>
                    {recap.topHighlights.slice(0, 3).map((h, i) => (
                        <div key={i} style={{ fontSize: 10, marginBottom: 5, color: '#efe1ff' }}>
                            • {h.title}
                        </div>
                    ))}
                    <div style={{ fontSize: 11, marginTop: 6, marginBottom: 4, color: '#cdb4db' }}>อันดับ</div>
                    {recap.leaderboard.slice(0, 3).map((a, i) => (
                        <div key={i} style={{ fontSize: 10, marginBottom: 4, color: '#efe1ff' }}>
                            {i + 1}. {a.name} ({Math.round(a.impact * 100)} อิมแพกต์)
                        </div>
                    ))}
                </>
            )}
        </FloatingPanel>
    );
}
