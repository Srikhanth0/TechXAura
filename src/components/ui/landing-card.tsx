
"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface LandingCardProps {
    children?: React.ReactNode;
    className?: string;
    category?: string;
    icon?: React.ReactNode;
    image?: string; // Added image prop
    title: string;
    description: string;
    timing: string;
    teamSize: string;
}

export function LandingCard({
    className,
    category = "Technical",
    icon,
    image,
    title,
    description,
    timing,
    teamSize
}: LandingCardProps) {

    // Determine color theme based on category or random if preferred
    const getThemeColor = (cat: string) => {
        switch (cat) {
            case "Technical": return "border-cyan-500/30 text-cyan-400 bg-cyan-950/40"; // Darker bg
            case "Non-Technical": return "border-purple-500/30 text-purple-400 bg-purple-950/40";
            case "Breakout": return "border-red-500/30 text-red-400 bg-red-950/40";
            default: return "border-gray-500/30 text-gray-400 bg-gray-950/40";
        }
    };

    const themeClass = getThemeColor(category);

    return (
        <div className={cn(
            "relative min-h-[360px] md:h-[400px] p-5 sm:p-6 rounded-2xl backdrop-blur-xl border transition-all duration-300 flex flex-col items-center text-center group hover:-translate-y-2 hover:shadow-2xl overflow-hidden",
            "bg-black/40 hover:bg-black/60", // Less transparent, darker background
            themeClass.split(" ")[0], // Only border color here
            className
        )}>

            {/* Background Gradient Blob */}
            <div className={cn(
                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-[80px] opacity-30 group-hover:opacity-40 transition-opacity", // Increased opacity
                themeClass.split(" ")[2].replace("bg-", "bg-") // Hacky way to get bg color from string
            )} />

            {/* Top Category Badge */}
            <div className={cn(
                "px-3 py-1 rounded-full text-xs font-mono mb-6 sm:mb-8 border bg-transparent",
                themeClass
            )}>
                {category}
            </div>

            {/* Centered Icon */}
            <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full">
                <div className={cn(
                    "w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 transition-transform duration-500 group-hover:scale-110 overflow-hidden relative",
                    "bg-white/[0.05] border border-white/10 shadow-inner backdrop-blur-md"
                )}>
                    {image ? (
                        <div className="relative w-full h-full">
                            <Image
                                src={image}
                                alt={title}
                                fill
                                className={cn(
                                    "transition-all duration-300",
                                    image.endsWith(".svg")
                                        ? "object-contain filter brightness-0 invert drop-shadow-[0_0_12px_rgba(168,85,247,0.6)] p-2"
                                        : "object-cover"
                                )}
                            />
                        </div>
                    ) : (
                        icon
                    )}
                </div>

                <h3 className="text-xl sm:text-2xl font-bold font-audiowide text-white mb-2 sm:mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70 transition-colors">
                    {title}
                </h3>

                <p className="text-zinc-400 text-sm line-clamp-2 px-1 sm:px-2 font-light">
                    {description}
                </p>
            </div>

            {/* Footer Info */}
            <div className="mt-auto pt-4 sm:pt-6 border-t border-white/5 w-full flex justify-between text-[0.65rem] sm:text-xs text-zinc-500 font-mono">
                <span>{teamSize}</span>
                <span>{timing}</span>
            </div>
        </div>
    );
}
