import React, { useEffect, useRef, useState } from 'react';
import { eventBus } from '../events';
import { FloatingPanel } from './FloatingPanel';

interface HighlightItem {
    id: number;
    type: string;
    title: string;
    body: string;
    time: string;
}

export function HighlightsFeed() {
    const [items, setItems] = useState<HighlightItem[]>([]);
    const idRef = useRef(1);

    useEffect(() => {
        const onHighlight = (e: Event) => {
            const detail = (e as CustomEvent).detail || {};
            setItems((prev) => {
                const next = [{
                    id: idRef.current++,
                    type: detail.type || 'event',
                    title: detail.title || 'โมเมนต์ในออฟฟิศ',
                    body: detail.body || '',
                    time: new Date().toLocaleTimeString()
                }, ...prev];
                return next.slice(0, 8);
            });
        };

        eventBus.addEventListener('highlight-event', onHighlight);
        return () => eventBus.removeEventListener('highlight-event', onHighlight);
    }, []);

    return (
        <FloatingPanel
            id="highlight-feed"
            title="ไทม์ไลน์ไฮไลต์"
            subtitle="โมเมนต์เด็ดแบบเรียลไทม์"
            width={320}
            defaultDock="right"
            defaultY={430}
            zIndex={15}
        >
            {items.length === 0 && (
                <div style={{ fontSize: 11, color: '#8ca4d6' }}>กำลังรอโมเมนต์เด็ด...</div>
            )}
            {items.map((item) => (
                <div key={item.id} style={{
                    marginBottom: 8,
                    paddingBottom: 8,
                    borderBottom: '1px solid rgba(255,255,255,0.08)'
                }}>
                    <div style={{ fontSize: 10, color: '#9bb3da', textTransform: 'uppercase', letterSpacing: 0.6 }}>
                        {item.type} • {item.time}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, marginTop: 2 }}>{item.title}</div>
                    <div style={{ fontSize: 11, color: '#d4def2', marginTop: 2 }}>{item.body}</div>
                </div>
            ))}
        </FloatingPanel>
    );
}
