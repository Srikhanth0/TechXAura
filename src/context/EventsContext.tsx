"use client";

import React, { createContext, useContext, ReactNode } from "react";


import { eventsData, Event } from "@/data/events";

export type { Event }; // Re-export for compatibility


interface EventsContextType {
    events: Event[];
    loading: boolean;
    categories: string[];
    filterByCategory: (category: string) => Event[];
    searchEvents: (query: string) => Event[];
    getEventById: (id: string) => Event | undefined;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export function EventsProvider({ children }: { children: ReactNode }) {
    const events = eventsData;
    const loading = false;

    const categories = ["All", "Technical", "Non-Technical", "Breakout"];

    const filterByCategory = (category: string): Event[] => {
        if (category === "All") return events;
        return events.filter(e => e.category === category);
    };

    const searchEvents = (query: string): Event[] => {
        const q = query.toLowerCase();
        return events.filter(e =>
            e.name.toLowerCase().includes(q) ||
            e.description.toLowerCase().includes(q)
        );
    };

    const getEventById = (id: string): Event | undefined => {
        return events.find(e => e.id === id);
    };

    return (
        <EventsContext.Provider value={{
            events,
            loading,
            categories,
            filterByCategory,
            searchEvents,
            getEventById,
        }}>
            {children}
        </EventsContext.Provider>
    );
}

export function useEvents() {
    const context = useContext(EventsContext);
    if (context === undefined) {
        throw new Error("useEvents must be used within an EventsProvider");
    }
    return context;
}
