"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BackgroundMusic({ isLoading }: { isLoading: boolean }) {
    const pathname = usePathname();
    const bgAudioRef = useRef<HTMLAudioElement | null>(null);
    const loadingAudioRef = useRef<HTMLAudioElement | null>(null);

    // User preference state: default is NOT muted (i.e., ON)
    const [isMuted, setIsMuted] = useState(false);
    // Track if audio is actually playing (to sync UI if autoplay blocked)
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);

    // Filter out pages where music should NOT play
    const isCheckout = pathname?.startsWith("/checkout");

    useEffect(() => {
        const bgAudio = bgAudioRef.current;
        const loadingAudio = loadingAudioRef.current;

        if (!bgAudio || !loadingAudio) return;

        bgAudio.volume = isMuted ? 0 : 0.5; // Background slightly lower
        loadingAudio.volume = isMuted ? 0 : 1.0;

        // Helper to safely play
        const playSafe = async (audio: HTMLAudioElement) => {
            try {
                if (audio.paused) {
                    await audio.play();
                    setIsAudioPlaying(true);
                }
            } catch (err) {
                console.warn("Autoplay prevented:", err);
                setIsAudioPlaying(false);
            }
        };

        const manageAudio = async () => {
            try {
                // If muted, pause everything
                if (isMuted) {
                    bgAudio.pause();
                    loadingAudio.pause();
                    setIsAudioPlaying(false);
                    return;
                }

                if (isLoading) {
                    // Scenario: Loading
                    if (!bgAudio.paused) {
                        bgAudio.pause();
                        bgAudio.currentTime = 0;
                    }

                    if (loadingAudio.paused) {
                        await playSafe(loadingAudio);
                    }
                } else {
                    // Scenario: App Loaded
                    if (!loadingAudio.paused) {
                        loadingAudio.pause();
                        loadingAudio.currentTime = 0;
                    }

                    if (isCheckout) {
                        bgAudio.pause();
                        setIsAudioPlaying(false);
                    } else {
                        if (bgAudio.paused) {
                            await playSafe(bgAudio);
                        }
                    }
                }
            } catch (error) {
                console.error("Audio management error:", error);
            }
        };

        manageAudio();

    }, [isLoading, isCheckout, isMuted]);

    // Global unlocker: The first time the user interacts with the page,
    // we make sure audio is playing if it should be.
    useEffect(() => {
        const unlockAudio = () => {
            const bgAudio = bgAudioRef.current;
            const loadingAudio = loadingAudioRef.current;

            // Only try to play if NOT muted and supposed to be playing
            if (!isMuted) {
                if (isLoading && loadingAudio?.paused) {
                    loadingAudio.play().then(() => setIsAudioPlaying(true)).catch(console.warn);
                } else if (!isLoading && !isCheckout && bgAudio?.paused) {
                    bgAudio?.play().then(() => setIsAudioPlaying(true)).catch(console.warn);
                }
            }
        };

        window.addEventListener('click', unlockAudio);
        window.addEventListener('touchstart', unlockAudio);

        return () => {
            window.removeEventListener('click', unlockAudio);
            window.removeEventListener('touchstart', unlockAudio);
        };
    }, [isLoading, isCheckout, isMuted]);

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    return (
        <>
            <div className="hidden">
                <audio ref={bgAudioRef} src="/sfx/Background_sfx.mp3" loop preload="auto" />
                <audio ref={loadingAudioRef} src="/sfx/Loading_SFX.wav" loop preload="auto" />
            </div>

            {/* Floating Audio Toggle Button */}
            {!isCheckout && (
                <div className="fixed bottom-4 right-4 z-[100] md:bottom-8 md:right-8">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleMute}
                        className="rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-white/10 text-white w-10 h-10 md:w-12 md:h-12 shadow-lg transition-all"
                        aria-label={isMuted ? "Unmute background music" : "Mute background music"}
                    >
                        {isMuted ? (
                            <VolumeX className="w-5 h-5 md:w-6 md:h-6" />
                        ) : (
                            <Volume2 className={`w-5 h-5 md:w-6 md:h-6 ${isAudioPlaying ? 'text-green-400' : 'text-white'}`} />
                        )}
                    </Button>
                </div>
            )}
        </>
    );
}
