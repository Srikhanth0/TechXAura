"use client";

import React, { useState, useEffect } from "react";
import {
    motion,
    useMotionValue,
    useTransform,
    useSpring,
    useMotionValueEvent,
    MotionValue,
} from "framer-motion";

export default function LoadingScreen({
    onComplete,
    duration = 4000,
}: {
    onComplete?: () => void;
    duration?: number;
}) {
    const [isVisible, setIsVisible] = useState(true);
    const [progress, setProgress] = useState(0);

    // --- CONFIGURATION ---
    const MIN_DEG = -135;
    const MAX_DEG = 135;
    const TOTAL_TICKS = 40;
    const DEGREES_PER_TICK = (MAX_DEG - MIN_DEG) / TOTAL_TICKS;

    // --- STATE & PHYSICS ---
    const rawRotation = useMotionValue(-135);
    const snappedRotation = useMotionValue(-135);

    const smoothRotation = useSpring(snappedRotation, {
        stiffness: 400,
        damping: 35,
        mass: 0.8,
    });

    // --- TRANSFORMATIONS ---
    const displayValue = useTransform(smoothRotation, [MIN_DEG, MAX_DEG], [0, 100]);
    const lightOpacity = useTransform(rawRotation, [MIN_DEG, MAX_DEG], [0.05, 0.5]);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                const next = prev + 100 / (duration / 50);
                if (next >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return next;
            });
        }, 50);

        const timeout = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => {
                onComplete?.();
            }, 500); // Wait for fade out
        }, duration);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [duration, onComplete]);

    useEffect(() => {
        const targetDeg = MIN_DEG + (progress / 100) * (MAX_DEG - MIN_DEG);
        rawRotation.set(targetDeg);
        const snap = Math.round(targetDeg / DEGREES_PER_TICK) * DEGREES_PER_TICK;
        snappedRotation.set(snap);
    }, [progress, rawRotation, snappedRotation, MIN_DEG, MAX_DEG, DEGREES_PER_TICK]);

    const ticks = Array.from({ length: TOTAL_TICKS + 1 });

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            className={`fixed inset-0 w-full h-full bg-neutral-950 flex flex-col items-center justify-center overflow-hidden z-50 transition-opacity duration-500 ${!isVisible ? 'pointer-events-none' : ''}`}
        >
            {/* BACKGROUND TEXTURE */}
            <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />

            {/* COMPONENT WRAPPER */}
            <div className="relative z-10 scale-100 sm:scale-125 md:scale-150">
                <div className="relative w-48 h-48 sm:w-64 sm:h-64 select-none">
                    {/* PURPLE GLOW */}
                    <motion.div
                        className="absolute inset-0 bg-violet-600 rounded-full blur-3xl transition-opacity duration-75"
                        style={{ opacity: lightOpacity }}
                    />

                    {/* --- TICK MARKS RING --- */}
                    <div className="absolute inset-0 pointer-events-none">
                        {ticks.map((_, i) => {
                            const angle = (i / TOTAL_TICKS) * (MAX_DEG - MIN_DEG) + MIN_DEG;
                            return (
                                <div
                                    key={i}
                                    className="absolute top-0 left-1/2 w-1 h-full -translate-x-1/2"
                                    style={{ transform: `rotate(${angle}deg)` }}
                                >
                                    <TickMark currentRotation={smoothRotation} angle={angle} />
                                </div>
                            );
                        })}
                    </div>

                    {/* --- THE KNOB --- */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-40 sm:h-40">
                        <motion.div
                            className="relative w-full h-full rounded-full z-20"
                            style={{ rotate: smoothRotation }}
                        >
                            {/* Knob Body */}
                            <div className="w-full h-full rounded-full bg-neutral-900 shadow-[0_10px_30px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] border border-neutral-800 flex items-center justify-center relative overflow-hidden">
                                {/* Brushed Metal Texture */}
                                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent_50%),conic-gradient(from_0deg,transparent_0deg,#000_360deg)]" />

                                {/* Top Cap */}
                                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-neutral-950 shadow-[inset_0_2px_5px_rgba(0,0,0,1)] border border-neutral-800/50 flex items-center justify-center">
                                    {/* Purple Indicator Line */}
                                    <motion.div
                                        className="absolute top-2 sm:top-3 w-1.5 h-4 sm:h-5 bg-violet-500 rounded-full"
                                        style={{
                                            boxShadow: useTransform(
                                                rawRotation,
                                                (r) => `0 0 ${Math.max(5, (r + 135) / 10)}px #8b5cf6`
                                            ),
                                        }}
                                    />

                                    <div className="flex flex-col items-center mt-3 sm:mt-4 opacity-50">
                                        <span className="font-mono text-[8px] sm:text-[10px] text-neutral-500 tracking-widest">
                                            LOADING
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Digital Readout */}
                    <div className="absolute -bottom-12 sm:-bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
                        <span className="text-[8px] sm:text-[10px] text-neutral-600 font-mono tracking-[0.2em] mb-1">
                            INITIALIZING
                        </span>
                        <DisplayValue value={displayValue} />
                    </div>
                </div>
            </div>

            {/* Loading text */}
            <motion.div
                className="absolute bottom-8 sm:bottom-12 text-center px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <p className="text-violet-400 font-mono text-xs sm:text-sm tracking-wider">
                    TECHXAURA 2K26
                </p>
            </motion.div>
        </motion.div>
    );
}

function TickMark({ currentRotation, angle }: { currentRotation: MotionValue<number>; angle: number }) {
    const opacity = useTransform(currentRotation, (r: number) => {
        return r >= angle ? 1 : 0.2;
    });
    const color = useTransform(currentRotation, (r: number) => {
        return r >= angle ? "#8b5cf6" : "#404040";
    });
    const boxShadow = useTransform(currentRotation, (r: number) => {
        return r >= angle ? "0 0 8px rgba(139, 92, 246, 0.6)" : "none";
    });

    return (
        <motion.div
            style={{ backgroundColor: color, opacity, boxShadow }}
            className="w-1 h-2.5 rounded-full transition-colors duration-75"
        />
    );
}

function DisplayValue({ value }: { value: MotionValue<number> }) {
    const [display, setDisplay] = useState(0);
    useMotionValueEvent(value, "change", (latest) =>
        setDisplay(Math.round(latest as number))
    );

    return (
        <div className="relative">
            <span className="absolute inset-0 blur-sm text-violet-500/50 font-mono text-2xl sm:text-3xl font-black tabular-nums tracking-widest">
                {display.toString().padStart(3, "0")}
            </span>
            <span className="relative font-mono text-2xl sm:text-3xl text-violet-500 font-black tabular-nums tracking-widest">
                {display.toString().padStart(3, "0")}
                <span className="text-xs sm:text-sm text-neutral-600 ml-1">%</span>
            </span>
        </div>
    );
}
