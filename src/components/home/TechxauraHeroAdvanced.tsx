"use client";

import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePerformanceMode } from "@/hooks/use-performance-mode";

const LaserFlow = dynamic(() => import("@/components/ui/energy-beam"), {
    ssr: false,
    loading: () => null
});



export default function TechxauraHeroAdvanced() {
    const isLowEnd = usePerformanceMode();

    const [particles, setParticles] = React.useState<Array<{ left: string; width: string; height: string; animationDuration: string; animationDelay: string }>>([]);

    React.useEffect(() => {
        setParticles(Array.from({ length: 15 }).map(() => ({
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 4 + 1}px`,
            height: `${Math.random() * 4 + 1}px`,
            animationDuration: `${Math.random() * 5 + 5}s`,
            animationDelay: `${Math.random() * 5}s`
        })));
    }, []);

    return (
        <section className="relative w-full h-screen overflow-hidden bg-black text-white">
            <style jsx>{`
                @keyframes beamPulse {
                    0%, 100% { opacity: 0.8; transform: translateX(-50%) scaleX(1); }
                    50% { opacity: 1; transform: translateX(-50%) scaleX(1.1); }
                }
                @keyframes particleFloat {
                    0% { transform: translateY(100vh) scale(0); opacity: 0; }
                    50% { opacity: 1; }
                    100% { transform: translateY(-10vh) scale(1); opacity: 0; }
                }
                @keyframes flarePulse {
                    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
                    50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.8; }
                }
                .beam-container {
                    position: absolute;
                    left: 50%;
                    top: 0;
                    height: 100%;
                    width: 100%;
                    max-width: 600px;
                    transform: translateX(-50%);
                    pointer-events: none;
                    z-index: 0;
                }
                
                /* Custom Particle Generation */
                .particle {
                    position: absolute;
                    background: white;
                    border-radius: 50%;
                    pointer-events: none;
                }
            `}</style>

            {/* 1. BACKGROUND GRADIENT (Deep Depth) */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black z-0" />

            {/* 2. CENTERED ENERGY BEAM */}
            <div className="beam-container">
                <div className="relative w-full h-full">
                    <LaserFlow
                        className="w-full h-full filter hue-rotate-[270deg] saturate-200 brightness-110"
                        verticalSizing={1.5}
                        wispDensity={1.5}
                        verticalBeamOffset={0.55}
                        horizontalBeamOffset={-0.1}
                    />
                    {/* Overlay Glow for extra pop */}
                    <div className="absolute inset-0 bg-purple-500/10 mix-blend-overlay" />
                </div>
            </div>

            {/* 3. ANIMATED FLUID PARTICLES (CSS only) */}
            {!isLowEnd && particles.map((p, i) => (
                <div
                    key={i}
                    className="particle bg-cyan-400/30 blur-sm"
                    style={{
                        left: p.left,
                        width: p.width,
                        height: p.height,
                        animation: `particleFloat ${p.animationDuration} infinite linear`,
                        animationDelay: p.animationDelay
                    }}
                />
            ))}

            {/* 4. HORIZONTAL FLARE (Centered Power Source) */}
            <div
                className="absolute top-1/2 left-1/2 w-[80vw] h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent blur-sm z-10"
                style={{
                    transform: 'translate(-50%, -50%)',
                    animation: 'flarePulse 4s infinite ease-in-out'
                }}
            />

            {/* 5. MAIN CONTENT LAYER (Perfectly Centered) */}
            <div className="relative z-20 flex flex-col items-center justify-center h-full w-full px-4 text-center">

                {/* Decorative Elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />

                {/* Main Heading */}
                <div className="relative mb-6">
                    <h1 className="font-audiowide text-transparent bg-clip-text bg-gradient-to-b from-white via-purple-200 to-purple-400 drop-shadow-[0_0_30px_rgba(186,104,255,0.75)] text-5xl sm:text-6xl md:text-8xl tracking-[0.1em] leading-tight">
                        TECH
                        <span className="text-purple-300 mx-2 inline-block animate-pulse">X</span>
                        AURA
                    </h1>
                    <div className="absolute -inset-4 bg-purple-500/10 blur-xl rounded-full -z-10" />
                </div>

                {/* Subheading */}
                <p className="font-nova text-purple-200/80 tracking-[0.3em] sm:tracking-[0.6em] text-sm sm:text-lg md:text-xl uppercase mb-12">
                    2K26 Symposium
                </p>

                {/* CTA Button */}
                <Link href="/auth">
                    <Button
                        variant="outline"
                        className="rounded-full h-12 sm:h-14 px-8 sm:px-10 py-4 border-purple-500/50 bg-black/40 backdrop-blur-md text-purple-200 hover:bg-purple-500/20 hover:text-white hover:border-purple-400 font-audiowide tracking-widest text-sm sm:text-lg transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)]"
                    >
                        GET STARTED
                    </Button>
                </Link>

            </div>
        </section>
    );
}
