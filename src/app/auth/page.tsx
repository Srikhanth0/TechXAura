"use client";

import React from "react";
import dynamic from "next/dynamic";
import { AuthTabs } from "@/components/auth/AuthTabs"; // Reusing existing AuthTabs
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
// import { usePerformanceMode } from "@/hooks/use-performance-mode";

// Dynamic imports
const LaserFlow = dynamic(() => import("@/components/ui/laser-flow"), {
    ssr: false,
    loading: () => null
});

export default function AuthPage() {
    // const isLowEnd = usePerformanceMode();
    const [beamReady, setBeamReady] = React.useState(false);

    React.useEffect(() => {
        // Simple timeout since we reverted onCreated
        const timer = setTimeout(() => setBeamReady(true), 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex w-full h-screen bg-black text-white font-sans overflow-hidden">

            {/* LEFT: Static Visual (Laser Flow) */}
            <div className="hidden lg:flex w-1/2 relative bg-[#0a0a0a] items-center justify-center border-r border-white/5 overflow-hidden">

                {/* 1. Instant Placeholder (Shows while WebGL loads) */}
                <div
                    className={`absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/40 via-blue-900/20 to-black transition-opacity duration-1000 ${beamReady ? 'opacity-0' : 'opacity-100'}`}
                />

                {/* 2. WebGL Beam (Fades in when ready) */}
                <div className={`absolute inset-0 transition-opacity duration-1000 ${beamReady ? 'opacity-100' : 'opacity-0'}`}>
                    <LaserFlow
                        className="h-full w-full filter brightness-125"
                        horizontalSizing={1.5}
                        verticalSizing={2}
                        color="#3B82F6"
                        dpr={1}
                        wispDensity={1.5}
                        mouseSmoothTime={0}
                        verticalBeamOffset={-0.55}
                        horizontalBeamOffset={-0.012}
                        wispIntensity={50}
                    />
                </div>

                {/* 3. Title (Moved to Top) */}
                <div className="absolute top-48 left-1 w-full z-10 text-center px-6">
                    <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-48 w-[60%] rounded-full bg-purple-500/25 blur-3xl pointer-events-none" />
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 h-32 w-[40%] rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />
                    <h1 className="font-audiowide text-transparent bg-clip-text bg-gradient-to-b from-white via-purple-200 to-purple-400 drop-shadow-[0_0_30px_rgba(186,104,255,0.75)] text-4xl sm:text-5xl md:text-7xl tracking-[0.2em] flex flex-wrap items-center justify-center">
                        TECH
                        <span className="text-purple-200 mx-1 sm:mx-2">X</span>
                        AURA
                    </h1>
                    <p className="mt-4 text-base sm:text-lg md:text-2xl text-purple-200/80 tracking-[0.2rem] sm:tracking-[0.4rem] md:tracking-[0.8rem] uppercase font-light font-nova">
                        2K26 Symposium
                    </p>
                </div>
            </div>

            {/* RIGHT: Auth Forms */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-16 relative bg-black/90 backdrop-blur-sm">

                <Link href="/" className="absolute top-6 left-6 p-3 rounded-full bg-white/5 hover:bg-white/20 transition-all z-20 hover:scale-110 group border border-white/10">
                    <ArrowLeft className="w-6 h-6 text-white group-hover:text-purple-400 transition-colors" />
                </Link>

                <div className="w-full max-w-md space-y-8">


                    <div className="bg-zinc-900/30 p-1 rounded-2xl border border-white/5 backdrop-blur-xl">
                        <AuthTabs />
                    </div>

                    <p className="text-center text-xs text-zinc-600 mt-8">
                        By processing, you agree to our <span className="text-purple-500/50 cursor-pointer hover:text-purple-500 underline">Terms</span> and <span className="text-purple-500/50 cursor-pointer hover:text-purple-500 underline">Privacy Policy</span>.
                    </p>
                </div>
            </div>

        </div>
    );
}
