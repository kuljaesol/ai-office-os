import React, { useEffect, useMemo, useState } from 'react';
import { eventBus } from '../events';
import { FloatingPanel } from './FloatingPanel';

type Edge = {
    a: string;
    b: string;
    aName: string;
    bName: string;
    score: number;
    status: 'alliance' | 'neutral' | 'rivalry';
};

const STATUS_TH: Record<string, string> = {
    alliance: 'พันธมิตร', rivalry: 'คู่แข่ง', neutral: 'เป็นกลาง'
};

export function RelationshipGraph() {
    const [edges, setEdges] = useState<Edge[]>([]);

    useEffect(() => {
        const handler = (e: Event) => {
            const detail = (e as CustomEvent).detail;
            setEdges((detail?.edges || []) as Edge[]);
        };
        eventBus.addEventListener('relationship-update', handler);
        return () => eventBus.removeEventListener('relationship-update', handler);
    }, []);

    const visible = useMemo(
        () => edges.filter((edge) => edge.status !== 'neutral').sort((a, b) => Math.abs(b.score) - Math.abs(a.score)),
        [edges]
    );

    return (
        <FloatingPanel
            id="relationship-graph"
            title="กราฟความสัมพันธ์"
            subtitle="พันธมิตรและคู่แข่ง"
            width={300}
            defaultDock="right"
            defaultY={220}
            zIndex={16}
        >
            {visible.length === 0 && (
                <div style={{ fontSize: 11, color: '#cdbca4' }}>ยังไม่มีพันธมิตรหรือคู่แข่งชัดเจน</div>
            )}
            {visible.map((edge, idx) => {
                const isAlliance = edge.status === 'alliance';
                return (
                    <div key={idx} style={{
                        marginBottom: 7,
                        paddingBottom: 7,
                        borderBottom: '1px solid rgba(255,255,255,0.08)'
                    }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: isAlliance ? '#b9fbc0' : '#ffadad' }}>
                            {edge.aName} {isAlliance ? '🤝' : '⚔️'} {edge.bName}
                        </div>
                        <div style={{ fontSize: 10, color: '#f9e7d0' }}>
                            {STATUS_TH[edge.status] || edge.status} (ความเข้มข้น {Math.round(Math.abs(edge.score) * 100)})
                        </div>
                    </div>
                );
            })}
        </FloatingPanel>
    );
}
