
import React, { useEffect } from 'react';
import { Event } from '@/data/events';

interface EventDetailsDialogProps {
    open: boolean;
    onClose: () => void;
    event: Event | null;
}

export function EventDetailsDialog({ open, onClose, event }: EventDetailsDialogProps) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (open) {
            window.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            window.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [open, onClose]);

    if (!open || !event) return null;

    return (
        <div className="overlay" onClick={onClose}>
            <div className="dialog-container" onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className="dialog-header">
                    <div className="dialog-title-group">
                        <span className="dialog-icon">◎</span>
                        <h2 className="dialog-title">{event.name}</h2>
                    </div>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                {/* Content */}
                <div className="dialog-content">

                    {/* Main Title & Time */}
                    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <h3 style={{
                            fontFamily: 'var(--font-header)',
                            fontSize: '1.8rem',
                            color: '#fff',
                            letterSpacing: '2px',
                            marginBottom: '0.5rem',
                            textTransform: 'uppercase'
                        }}>
                            {event.subtitle || event.name}
                        </h3>
                        <p style={{ color: 'var(--accent-purple)', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
                            {event.date || "FEBRUARY 27, 2026"} &bull; {event.time || event.timing}
                        </p>

                    </div>

                    <div className="section-title">EVENT ROUNDS</div>

                    <div className="rounds-container">
                        {(event.rounds && event.rounds.length > 0) ? (
                            event.rounds.map((round) => (
                                <div key={round.id} className="round-card">
                                    <div className="round-header">
                                        <span className="round-title">{round.title}</span>
                                        <span className="round-time">⏱ {round.duration}</span>
                                    </div>
                                    <p className="round-desc">{round.description}</p>
                                </div>
                            ))
                        ) : (
                            // Fallback if no rounds defined yet
                            <div className="round-card" style={{ gridColumn: "1 / -1" }}>
                                <div className="round-header">
                                    <span className="round-title">STANDARD PROTOCOL</span>
                                    <span className="round-time">⏱ {event.timing}</span>
                                </div>
                                <p className="round-desc">{event.description}</p>
                            </div>
                        )}
                    </div>

                    <div className="section-title">PROTOCOL & RULES</div>

                    {(() => {
                        const generalRules = event.rules.filter(r => !r.startsWith("ROUND"));
                        const roundRules = event.rules.filter(r => r.startsWith("ROUND"));

                        // Map round index to Unicode icon for visual identity
                        const roundIcons = ['🧠', '📐', '⚡', '🎯', '🏆'];

                        return (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

                                {/* General Protocol Rules */}
                                {generalRules.length > 0 && (
                                    <div style={{
                                        background: 'rgba(255,255,255,0.02)',
                                        border: '1px solid rgba(255,255,255,0.06)',
                                        borderRadius: '10px',
                                        padding: '1rem 1.2rem'
                                    }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                                            {generalRules.map((rule, idx) => (
                                                <div key={idx} style={{
                                                    display: 'flex',
                                                    alignItems: 'flex-start',
                                                    gap: '0.6rem',
                                                    fontSize: '0.88rem',
                                                    color: 'rgba(255,255,255,0.7)',
                                                    lineHeight: 1.5
                                                }}>
                                                    <span style={{
                                                        color: 'var(--accent-cyan)',
                                                        fontWeight: 700,
                                                        fontSize: '0.8rem',
                                                        flexShrink: 0,
                                                        marginTop: '1px'
                                                    }}>&gt;</span>
                                                    <span>{rule}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Round Mission Briefings */}
                                {roundRules.length > 0 && (
                                    <div>
                                        <div style={{
                                            fontSize: '0.72rem',
                                            color: 'var(--accent-cyan)',
                                            letterSpacing: '2.5px',
                                            fontWeight: 700,
                                            marginBottom: '0.75rem',
                                            textTransform: 'uppercase',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}>
                                            <span style={{
                                                width: '6px',
                                                height: '6px',
                                                borderRadius: '50%',
                                                background: 'var(--accent-cyan)',
                                                boxShadow: '0 0 6px var(--accent-cyan)',
                                                flexShrink: 0
                                            }} />
                                            ROUND BRIEFINGS
                                        </div>

                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '0.75rem'
                                        }}>
                                            {roundRules.map((rule, idx) => {
                                                const roundMatch = rule.match(/^(ROUND \d+)\s*—\s*([^:]+):\s*Arena\s*—\s*(.+?)\.\s*Mission\s*—\s*(.+)$/i);
                                                if (roundMatch) {
                                                    const [, roundNum, roundName, arena, mission] = roundMatch;
                                                    const icon = roundIcons[idx] || '◆';
                                                    return (
                                                        <div key={idx} style={{
                                                            background: 'rgba(168,85,247,0.04)',
                                                            border: '1px solid rgba(168,85,247,0.18)',
                                                            borderLeft: '3px solid rgba(168,85,247,0.5)',
                                                            borderRadius: '8px',
                                                            padding: '0.9rem 1rem',
                                                            transition: 'border-color 0.3s ease, background 0.3s ease'
                                                        }}>
                                                            {/* Round Header */}
                                                            <div style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '0.5rem',
                                                                marginBottom: '0.5rem'
                                                            }}>
                                                                <span style={{ fontSize: '1rem' }}>{icon}</span>
                                                                <span style={{
                                                                    fontSize: '0.8rem',
                                                                    fontWeight: 700,
                                                                    color: 'var(--accent-purple)',
                                                                    letterSpacing: '1.2px',
                                                                    textTransform: 'uppercase'
                                                                }}>
                                                                    {roundNum} — {roundName.trim()}
                                                                </span>
                                                            </div>

                                                            {/* Arena */}
                                                            <div style={{
                                                                display: 'flex',
                                                                alignItems: 'flex-start',
                                                                gap: '0.5rem',
                                                                fontSize: '0.82rem',
                                                                color: 'rgba(255,255,255,0.65)',
                                                                lineHeight: 1.55,
                                                                marginBottom: '0.3rem'
                                                            }}>
                                                                <span style={{
                                                                    color: 'var(--accent-cyan)',
                                                                    fontWeight: 700,
                                                                    fontSize: '0.68rem',
                                                                    letterSpacing: '1.5px',
                                                                    flexShrink: 0,
                                                                    marginTop: '2px'
                                                                }}>ARENA</span>
                                                                <span>{arena.trim()}.</span>
                                                            </div>

                                                            {/* Mission */}
                                                            <div style={{
                                                                display: 'flex',
                                                                alignItems: 'flex-start',
                                                                gap: '0.5rem',
                                                                fontSize: '0.82rem',
                                                                color: 'rgba(255,255,255,0.65)',
                                                                lineHeight: 1.55
                                                            }}>
                                                                <span style={{
                                                                    color: 'var(--accent-cyan)',
                                                                    fontWeight: 700,
                                                                    fontSize: '0.68rem',
                                                                    letterSpacing: '1.5px',
                                                                    flexShrink: 0,
                                                                    marginTop: '2px'
                                                                }}>MISSION</span>
                                                                <span>{mission.trim().endsWith('.') ? mission.trim() : mission.trim() + '.'}</span>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                // Fallback
                                                return (
                                                    <div key={idx} style={{
                                                        background: 'rgba(255,255,255,0.03)',
                                                        border: '1px solid rgba(255,255,255,0.08)',
                                                        borderRadius: '8px',
                                                        padding: '0.75rem 1rem',
                                                        fontSize: '0.85rem',
                                                        color: 'rgba(255,255,255,0.6)'
                                                    }}>
                                                        {rule}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })()}



                </div>
            </div>
        </div>
    );
}
