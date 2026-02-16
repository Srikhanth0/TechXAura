"use client";

import { useEffect, useRef, useState } from "react";

const VIDEOS = [
    "/laser flow.mp4",
    "/laserflow purple.mp4"
];

const TRANSITION_DURATION = 1.5; // Seconds of overlap

export default function BackgroundVideo() {
    const [isMounted, setIsMounted] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const videoRefs = [useRef<HTMLVideoElement>(null), useRef<HTMLVideoElement>(null)];

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Handle seamless transition
    const handleTimeUpdate = (index: number) => {
        const currentVideo = videoRefs[index].current;
        const nextIndex = (index + 1) % VIDEOS.length;
        const nextVideo = videoRefs[nextIndex].current;

        if (!currentVideo || !nextVideo) return;

        // Start next video before current ends
        const timeLeft = currentVideo.duration - currentVideo.currentTime;

        if (timeLeft <= TRANSITION_DURATION && nextVideo.paused) {
            nextVideo.currentTime = 0;
            nextVideo.play().catch(() => { }); // Ignore play errors
            setActiveIndex(nextIndex);
        }
    };

    if (!isMounted) return null;

    return (
        <div className="fixed inset-0 w-full h-full -z-10 pointer-events-none bg-black">
            {VIDEOS.map((src, index) => (
                <video
                    key={src}
                    ref={videoRefs[index]}
                    autoPlay={index === 0} // Only first video auto-starts initially
                    muted
                    playsInline
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] ease-linear ${index === activeIndex ? "opacity-100" : "opacity-0"
                        }`}
                    src={src.replace(/ /g, "%20")}
                    onTimeUpdate={() => {
                        // Only track time for the active video to trigger transition
                        if (index === activeIndex) handleTimeUpdate(index);
                    }}
                    onEnded={() => {
                        // Fallback: ensure loop continues if time update misses
                        const nextIndex = (index + 1) % VIDEOS.length;
                        if (activeIndex !== nextIndex) {
                            setActiveIndex(nextIndex);
                            videoRefs[nextIndex].current?.play().catch(() => { });
                        }
                    }}
                />
            ))}
        </div>
    );
}
