"use client";

import { Suspense } from "react";

// Simplified 3D Badge - No physics, just a visual card
interface BadgeProps {
    name: string;
    event: string;
}

function SimpleBadge({ name, event }: BadgeProps) {
    return (
        <div className="w-full h-full flex items-center justify-center p-4">
            <div className="relative">
                {/* Lanyard/Rope */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-16 bg-gradient-to-b from-violet-400 to-violet-600 rounded-full shadow-lg shadow-violet-500/50" />

                {/* Badge Card */}
                <div className="mt-16 bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl shadow-2xl border-2 border-violet-400 p-6 w-72 max-w-[90vw] transform hover:scale-105 transition-transform duration-300">
                    <div className="text-center space-y-4">
                        <div className="text-sm font-semibold text-violet-200 uppercase tracking-wider">
                            {event}
                        </div>
                        <div className="text-3xl font-bold text-white break-words">{name}</div>
                        <div className="pt-4 border-t border-violet-400/30">
                            <div className="text-xs text-violet-200">Event Badge</div>
                            <div className="text-xs text-violet-300 mt-1 flex items-center justify-center gap-1">
                                <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                Registration Complete
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function EventBadge3D({
    name = "Your Name",
    event = "TECHXAURA 2K26",
}: Partial<BadgeProps>) {
    return (
        <div className="w-full h-[50vh] sm:h-[60vh] flex items-center justify-center">
            <Suspense fallback={
                <div className="flex items-center justify-center w-full h-full">
                    <div className="animate-pulse text-violet-400">Loading badge...</div>
                </div>
            }>
                <SimpleBadge name={name} event={event} />
            </Suspense>
        </div>
    );
}
