"use client";

import { useEffect, useRef } from "react";

/**
 * useScrollOptimization Hook
 * 
 * Optimizes scroll performance by:
 * 1. Syncing with requestAnimationFrame (rAF).
 * 2. Using passive event listeners to unblock the main thread.
 * 
 * @param containerId - Optional ID of the scroll container. If not provided, defaults to window.
 * @param callback - Optional function to run on every optimized scroll frame.
 */
export function useScrollOptimization(containerId?: string, callback?: (scrollTop: number) => void) {
    const ticking = useRef(false);

    useEffect(() => {
        const target = containerId ? document.getElementById(containerId) : window;
        if ((!target) && containerId) return; // If container element not found, abort
        const element = target || window;

        const onScroll = () => {
            // Only request frame if not already ticking
            if (!ticking.current) {
                window.requestAnimationFrame(() => {
                    if (callback) {
                        const scrollTop = containerId && target instanceof HTMLElement
                            ? target.scrollTop
                            : window.scrollY;
                        callback(scrollTop);
                    }
                    ticking.current = false;
                });
                ticking.current = true; // Mark as ticking
            }
        };

        // Passive listener for performance
        element.addEventListener("scroll", onScroll as EventListener, { passive: true });

        return () => {
            element.removeEventListener("scroll", onScroll as EventListener);
        };
    }, [containerId, callback]);
}
