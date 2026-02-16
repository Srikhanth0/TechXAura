"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from "react";

// Event types from shared data
import { Event } from "@/data/events";
export type { Event };

export interface TeamMember {
    name: string;
    email: string;
    phone: string;
    college: string;
}

export interface CartItem {
    event: Event;
    teamMembers: TeamMember[];
    abstractFile?: File;
    abstractUrl?: string; // URL returned from GAS
    teamName?: string;
}

export interface ValidationResult {
    valid: boolean;
    uniqueCount: number;
    acceptedEmails: string[];
    rejectedEmails: string[];
}

interface CartContextType {
    items: CartItem[];
    addToCart: (event: Event) => void;
    removeFromCart: (eventId: string) => void;
    updateTeamMembers: (eventId: string, members: TeamMember[], file?: File, url?: string, teamName?: string) => void;
    clearCart: () => void;
    getConflicts: (event: Event) => Event[];
    hasConflict: (event: Event) => boolean;
    totalAmount: number;
    isInCart: (eventId: string) => boolean;
    validateGlobalTeamLimit: () => ValidationResult;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Maximum number of unique individuals allowed across all events
const MAX_GLOBAL_UNIQUE_MEMBERS = 5;

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    // Check for time slot conflicts
    const getConflicts = useCallback((event: Event): Event[] => {
        if (event.timeSlot === "flexible") return [];

        return items
            .filter(item => {
                if (item.event.id === event.id) return false;
                const otherSlot = item.event.timeSlot;
                if (otherSlot === "flexible") return false;

                // Conflicts:
                // 1. Same slot (morning-morning, afternoon-afternoon, fullday-fullday)
                // 2. FullDay conflicts with anything except flexible
                if (event.timeSlot === otherSlot) return true;
                if (event.timeSlot === "fullday" || otherSlot === "fullday") return true;

                return false;
            })
            .map(item => item.event);
    }, [items]);

    const hasConflict = useCallback((event: Event): boolean => {
        if (event.timeSlot === "flexible") return false;

        return items.some(item => {
            if (item.event.id === event.id) return false;
            const otherSlot = item.event.timeSlot;
            if (otherSlot === "flexible") return false;

            if (event.timeSlot === otherSlot) return true;
            if (event.timeSlot === "fullday" || otherSlot === "fullday") return true;

            return false;
        });
    }, [items]);

    const addToCart = useCallback((event: Event) => {
        setItems(prev => {
            // Check if already in cart
            if (prev.some(item => item.event.id === event.id)) {
                return prev;
            }
            return [...prev, { event, teamMembers: [] }];
        });
    }, []);

    const removeFromCart = useCallback((eventId: string) => {
        setItems(prev => prev.filter(item => item.event.id !== eventId));
    }, []);

    const updateTeamMembers = useCallback((eventId: string, members: TeamMember[], file?: File, url?: string, teamName?: string) => {
        setItems(prev => prev.map(item =>
            item.event.id === eventId
                ? {
                    ...item,
                    teamMembers: members,
                    ...(file !== undefined && { abstractFile: file }),
                    ...(url !== undefined && { abstractUrl: url }),
                    ...(teamName !== undefined && { teamName })
                }
                : item
        ));
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    const isInCart = useCallback((eventId: string): boolean => {
        return items.some(item => item.event.id === eventId);
    }, [items]);

    // Validation: Check "Unique 5" Rule
    // Returns detailed result for UI to display Accepted vs Rejected members
    const validateGlobalTeamLimit = useCallback((): ValidationResult => {
        const uniqueEmails = new Set<string>();
        const acceptedEmails: string[] = [];
        const rejectedEmails: string[] = [];

        // 1. Flatten all members from all events
        // 2. Add to Set. 
        // 3. If Set size <= 5, all good.
        // 4. If Set size > 5, track which specific emails caused overflow.

        // We need iteration order to be deterministic to always accept the "first 5" found.
        // The order is: Events in Cart order -> Members in Team order.

        for (const item of items) {
            for (const member of item.teamMembers) {
                const email = member.email.trim().toLowerCase();
                if (!email) continue; // Skip empty emails (though UI should prevent saving them)

                if (uniqueEmails.has(email)) {
                    // Already counted and accepted, do nothing (same person in multiple events)
                    continue;
                }

                // New unique member found
                if (uniqueEmails.size < MAX_GLOBAL_UNIQUE_MEMBERS) {
                    uniqueEmails.add(email);
                    acceptedEmails.push(email);
                } else {
                    // Overflow!
                    if (!rejectedEmails.includes(email)) {
                        rejectedEmails.push(email);
                    }
                }
            }
        }

        return {
            valid: rejectedEmails.length === 0,
            uniqueCount: uniqueEmails.size + rejectedEmails.length, // Total unique attempts
            acceptedEmails,
            rejectedEmails
        };
    }, [items]);

    // Fixed entry fee as per specs
    const totalAmount = 100;

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            updateTeamMembers,
            clearCart,
            getConflicts,
            hasConflict,
            totalAmount,
            isInCart,
            validateGlobalTeamLimit,
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
