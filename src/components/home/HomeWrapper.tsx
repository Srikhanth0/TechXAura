"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { usePerformanceMode } from "@/hooks/use-performance-mode";

import AuroraBackground from "@/components/ui/AuroraBackground";
import LaserFlow from "@/components/ui/laser-flow";

export function HomeWrapper({ children }: { children: React.ReactNode }) {
    const isLowEnd = usePerformanceMode();

    useEffect(() => {
        const html = document.documentElement;
        const body = document.body;
        const prev = {
            htmlOverflow: html.style.overflow,
            htmlHeight: html.style.height,
            bodyOverflow: body.style.overflow,
            bodyHeight: body.style.height,
        };

        html.style.overflow = "hidden";
        html.style.height = "100%";
        body.style.overflow = "hidden";
        body.style.height = "100%";

        return () => {
            html.style.overflow = prev.htmlOverflow;
            html.style.height = prev.htmlHeight;
            body.style.overflow = prev.bodyOverflow;
            body.style.height = prev.bodyHeight;
        };
    }, []);

    return (
        <main className="relative w-full bg-black text-white overflow-hidden">
            {/* Fixed Background Energy Beam */}
            <AuroraBackground />
            {!isLowEnd && (
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <LaserFlow
                        className="h-full w-full"
                        horizontalSizing={0.6}
                        verticalSizing={2.0}
                        color="#3B82F6"
                        dpr={1}
                        wispDensity={1.2}
                        mouseSmoothTime={0}
                        verticalBeamOffset={-0.50}
                        horizontalBeamOffset={-0.012}
                    />
                </div>
            )}

            <div id="main-scroll-container" className="relative z-10 h-[100dvh] min-h-[100svh] overflow-y-auto overflow-x-hidden">
                {children}
            </div>
        </main>
    );
}
