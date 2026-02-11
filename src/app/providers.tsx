"use client";

import { useState } from "react";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { AuthProvider } from "@/context/AuthContext";
import { EventsProvider } from "@/context/EventsContext";
import { CartProvider } from "@/context/CartContext";

export function Providers({ children }: { children: React.ReactNode }) {
    const [loadingComplete, setLoadingComplete] = useState(false);

    return (
        <AuthProvider>
            <EventsProvider>
                <CartProvider>
                    <LoadingScreen
                        onComplete={() => setLoadingComplete(true)}
                        duration={4000}
                    />
                    {loadingComplete && children}
                </CartProvider>
            </EventsProvider>
        </AuthProvider>
    );
}
