"use client";

import { useState, useEffect } from "react";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { BackgroundMusic } from "@/components/ui/BackgroundMusic";
import { AuthProvider } from "@/context/AuthContext";
import { EventsProvider } from "@/context/EventsContext";
import { CartProvider } from "@/context/CartContext";


export function Providers({ children }: { children: React.ReactNode }) {
    const [loadingComplete, setLoadingComplete] = useState(false);

    // Effect to check session storage on mount
    useEffect(() => {
        const hasLoaded = sessionStorage.getItem("techxaura_loaded");
        if (hasLoaded) {
            setLoadingComplete(true);
        }
    }, []);

    const handleLoadingComplete = () => {
        console.log("Loading complete, setting session flag.");
        sessionStorage.setItem("techxaura_loaded", "true");
        setLoadingComplete(true);
    };

    return (
        <AuthProvider>
            <EventsProvider>
                <CartProvider>
                    {!loadingComplete && (
                        <LoadingScreen
                            onComplete={handleLoadingComplete}
                            duration={4000}
                        />
                    )}

                    {/* BackgroundMusic handles its own internal logic, but we pass valid loading state */}
                    <BackgroundMusic isLoading={!loadingComplete} />

                    {loadingComplete && (
                        <>
                            {children}
                        </>
                    )}
                </CartProvider>
            </EventsProvider>
        </AuthProvider>
    );
}

