"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NavItem {
    label: string;
    href: string;
}

interface PillNavProps {
    items: NavItem[];
    logo?: string;
    logoAlt?: string;
    activeHref?: string;
    className?: string;
}

export default function PillNav({
    items,
    logo,
    logoAlt,
    activeHref,
    className,
}: PillNavProps) {
    const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
    const pathname = usePathname();

    return (
        <nav
            className={cn(
                "fixed left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 sm:gap-2 p-2 rounded-full bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl max-w-[95vw] md:max-w-none overflow-x-auto no-scrollbar",
                className
            )}
        >
            {logo && (
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logo} alt={logoAlt || "Logo"} className="w-6 h-6" />
                </div>
            )}

            {items.map((item, index) => (
                <Link
                    key={item.href}
                    href={item.href}
                    onClick={(e) => {
                        // Smooth scroll logic only if on the same page
                        if (item.href === '/' && pathname === '/') {
                            e.preventDefault();
                            const container = document.getElementById('main-scroll-container');
                            if (container) {
                                container.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                            window.history.pushState(null, '', '/');
                        } else if (item.href.startsWith('#')) {
                            e.preventDefault();
                            const element = document.querySelector(item.href);
                            if (element) {
                                element.scrollIntoView({ behavior: 'smooth' });
                                window.history.pushState(null, '', item.href);
                            }
                        }
                    }}
                    className="relative px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                >
                    {hoveredIndex === index && (
                        <motion.div
                            layoutId="pill-nav-hover"
                            className="absolute inset-0 bg-white/10 rounded-full"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    <span
                        className={cn(
                            "relative z-10 transition-colors duration-200",
                            activeHref === item.href ? "text-white" : "text-white/60 hover:text-white"
                        )}
                    >
                        {item.label}
                    </span>

                </Link>
            ))}
        </nav>
    );
}
