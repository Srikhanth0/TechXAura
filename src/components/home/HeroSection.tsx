"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
// import { usePerformanceMode } from "@/hooks/use-performance-mode";

export function HeroSection() {

    return (
        <section className="relative w-full h-[70svh] sm:h-[75svh] md:h-[80vh] overflow-hidden bg-transparent">
            {/* Fallback gradient removed to show Energy Beam */}

            <div className="absolute top-[60%] left-[51%] -translate-x-1/2 -translate-y-1/2 z-20 text-center w-full px-4">
                {/* Blur elements removed */}
                <h1 className="font-audiowide text-transparent bg-clip-text bg-gradient-to-b from-white via-purple-200 to-purple-400 drop-shadow-[0_0_30px_rgba(186,104,255,0.75)] text-4xl sm:text-5xl md:text-7xl tracking-[0.2em] flex flex-wrap items-center justify-center">
                    TECH
                    <span className="text-purple-200 mx-1 sm:mx-2 text-5xl sm:text-6xl md:text-8xl drop-shadow-[0_0_25px_rgba(168,85,247,0.8)]">X</span>
                    AURA
                </h1>
                <p className="mt-4 text-base sm:text-lg md:text-2xl text-purple-200/80 tracking-[0.2rem] sm:tracking-[0.4rem] md:tracking-[0.8rem] uppercase font-light font-nova">
                    2K26 Symposium
                </p>
                <div className="mt-2 text-sm sm:text-base md:text-xl text-purple-300/90 tracking-[0.15rem] sm:tracking-[0.3rem] md:tracking-[0.5rem] uppercase font-light font-nova animate-pulse translate-x-0 flex justify-center gap-20 pointer-events-none">
                    <span>On Spot</span>
                    <span>Available</span>
                </div>

                <div className="mt-32 flex justify-center">
                    <Link href="/auth">
                        <Button
                            variant="outline"
                            className="rounded-full h-11 sm:h-12 px-6 sm:px-8 py-3 border-purple-500/50 text-purple-200 hover:bg-purple-900/20 hover:text-white font-audiowide tracking-widest text-sm sm:text-base md:text-lg transition-all hover:scale-105 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                        >
                            GET STARTED
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
