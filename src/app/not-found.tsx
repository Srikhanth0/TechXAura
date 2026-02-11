"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black" />

            <div className="relative z-10 text-center px-4">
                <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-purple-600 font-audiowide mb-4">
                    404
                </h1>
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-6 font-orbitron">
                    Page Not Found
                </h2>
                <p className="text-zinc-400 max-w-md mx-auto mb-8 font-nova tracking-wide">
                    The page you are looking for does not exist or has been moved.
                    Return to the event base.
                </p>

                <Link href="/">
                    <Button
                        className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 rounded-full text-lg font-audiowide tracking-wider transition-all hover:scale-105 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                    >
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        RETURN HOME
                    </Button>
                </Link>
            </div>

            {/* Decorative Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        </div>
    );
}
