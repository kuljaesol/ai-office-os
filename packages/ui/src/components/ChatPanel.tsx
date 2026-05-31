import React, { useState, useEffect, useRef } from 'react';
import { eventBus } from '../events';
import { getColyseusRoom } from '../game/Game';
import { FloatingPanel } from './FloatingPanel';

export function ChatPanel() {
    const [messages, setMessages] = useState<{ sender: string, text: string }[]>([
        { sender: 'ระบบ', text: 'เริ่มต้นออฟฟิศเรียบร้อย' }
    ]);
    const [input, setInput] = useState('');
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleChat = (e: any) => {
            setMessages(prev => [...prev, e.detail]);
        };
        eventBus.addEventListener('chat-message', handleChat);
        return () => eventBus.removeEventListener('chat-message', handleChat);
    }, []);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const send = () => {
        if (!input.trim()) return;
        const room = getColyseusRoom();
        if (room) {
            room.send('chat', { text: input });
            setInput('');
        } else {
            setMessages(prev => [...prev, { sender: 'ระบบ', text: 'ผิดพลาด: ส่งข้อความไม่ได้ ยังไม่ได้เชื่อมต่อ Colyseus' }]);
        }
    };

    const isSystem = (s: string) => s === 'ระบบ' || s === 'System';

    return (
        <FloatingPanel id="chat" title="💬 แชตออฟฟิศ" width={320} defaultDock="right" defaultY={430} zIndex={17}>
            <div style={{ display: 'flex', flexDirection: 'column', height: 320 }}>
                <div style={{ flex: 1, overflowY: 'auto', fontSize: '13px', marginBottom: 10, paddingRight: 4 }}>
                    {messages.map((m, i) => (
                        <p key={i} style={{ margin: '6px 0', lineHeight: '1.4' }}>
                            <strong style={{ color: isSystem(m.sender) ? '#00eeff' : '#aaffaa' }}>{m.sender}:</strong> {m.text}
                        </p>
                    ))}
                    <div ref={endRef} />
                </div>
                <input
                    type="text"
                    placeholder="พิมพ์ข้อความ..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && send()}
                    style={{ width: '100%', padding: '10px', boxSizing: 'border-box', background: '#333', color: 'white', border: '1px solid #444', borderRadius: 4, outline: 'none' }}
                />
            </div>
        </FloatingPanel>
    );
}
