"use client";

import React from 'react';
import dynamic from 'next/dynamic';

const LaserFlow = dynamic(() => import("@/components/ui/energy-beam"), {
    ssr: false,
    loading: () => null
});

interface TechxauraLayoutProps {
    children: React.ReactNode;
}

export default function TechxauraLayout({ children }: TechxauraLayoutProps) {
    return (
        <div className="relative min-h-screen w-full bg-black text-white font-sans overflow-x-hidden">

            {/* 1. THE ENERGY BEAM (The "Laser Flow" Layer) */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <LaserFlow />
            </div>

            {/* 2. THE OVERLAY GRADIENT (For depth and contrast) */}
            <div className="fixed inset-0 z-[1] bg-gradient-to-b from-transparent via-black/20 to-black pointer-events-none" />

            {/* 3. THE CONTENT LAYER (Z-index higher than the beam) */}
            <div className="relative z-10 flex flex-col min-h-screen">
                {/* Main Content */}
                <main className="flex-grow flex flex-col items-center justify-center">
                    {children}
                </main>
            </div>
        </div>
    );
}
