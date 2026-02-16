"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useEvents } from "@/context/EventsContext";
import { useCart } from "@/context/CartContext";
import { EventCard } from "@/components/dashboard/EventCard";
import { RulesDialog } from "@/components/dashboard/RulesDialog";
import { EventDetailsDialog } from "@/components/dashboard/EventDetailsDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Ticket, Search, LogOut, User, Book } from "lucide-react";
import Link from "next/link";

import { Event } from "@/data/events";

// Aurora import removed

const dashboardEventImages: Record<string, string> = {
    startmusic: "/Events_image/start music.webp",
    lubberpandhu: "/Events_image/lubber pandhu.webp",
    esports: "/Events_image/esports.webp",
    clashoftalents: "/Events_image/clash of talents.webp",
    iplauction: "/Events_image/ipl auction.webp",
    carrom: "/Events_image/carrom.20.jpeg",
};

export default function DashboardPage() {
    const { user, profile, loading: authLoading, signOut, acceptRules } = useAuth();
    const { loading: eventsLoading, categories, filterByCategory } = useEvents();
    const { items } = useCart();
    const router = useRouter();

    const [showRules, setShowRules] = React.useState(false);
    const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);
    const [activeCategory, setActiveCategory] = React.useState("All");
    const [searchQuery, setSearchQuery] = React.useState("");

    // OPTIMIZATION: Removed manual style injection to allow global viewport locking

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/auth");
        }
    }, [user, authLoading, router]);

    // Show rules dialog if not accepted
    useEffect(() => {
        if (profile && !profile.rulesAccepted) {
            setTimeout(() => setShowRules(true), 0);
        }
    }, [profile]);

    const handleAcceptRules = async () => {
        await acceptRules();
        setShowRules(false);
    };

    const filteredEvents = React.useMemo(() => {
        let result = filterByCategory(activeCategory);
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(e =>
                e.name.toLowerCase().includes(q) ||
                e.description.toLowerCase().includes(q)
            );
        }
        return result;
    }, [activeCategory, searchQuery, filterByCategory]);

    if (authLoading || eventsLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="h-dvh w-full relative overflow-hidden bg-black">
            {/* Rules Dialog */}
            <RulesDialog
                open={showRules}
                onClose={() => setShowRules(false)}
                onAccept={handleAcceptRules}
                rules={[
                    "Timing: 9:00 AM - 4:00 PM",
                    "Registration: ₹100 per team (max 5 members). This single fee grants access to all technical, non-technical, and breakout events.",
                    "Catering: Complimentary food is provided for all registered participants.",
                    "Scheduling: Review the timetable before registering. Ensure your chosen events do not overlap, as some may run simultaneously.",
                    "How to Join: Select your events, click 'Proceed to Checkout', and use the 'Add Team' option to submit member details and pay."
                ]}
                eventName="General Terms"
            />

            {/* Event Details Dialog */}
            <EventDetailsDialog
                open={!!selectedEvent}
                onClose={() => setSelectedEvent(null)}
                event={selectedEvent}
            />

            {/* Scrollable Content Area */}
            <div className="immersive-scroll-container h-full w-full">
                {/* Header */}
                <header className="sticky top-0 z-40 bg-black/50 backdrop-blur-lg border-b border-white/5">
                    <div className="max-w-7xl mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            {/* Logo Removed as requested */}
                            <div />

                            <div className="flex items-center gap-4">
                                {/* Rule Book Button */}
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setShowRules(true)}
                                    className="w-9 h-9 rounded-full border-white/10 bg-transparent text-white hover:bg-white/5 hover:border-purple-500/50 transition-all"
                                >
                                    <Book className="w-4 h-4 text-purple-400" />
                                </Button>

                                {/* Ticket Button (Replaces Cart) */}
                                <Link href="/checkout">
                                    <Button variant="outline" size="sm" className="relative border-white/10 text-white hover:bg-white/5">
                                        <Ticket className="w-4 h-4 mr-2 text-purple-400" />
                                        <span className="font-mono text-xs">MY PASS</span>
                                        {items.length > 0 && (
                                            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-500" />
                                        )}
                                    </Button>
                                </Link>

                                {/* User Menu */}
                                <div className="flex items-center gap-3">
                                    <div className="hidden sm:block text-right">
                                        <div className="text-white text-sm font-medium">{profile?.name || user.email}</div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-[#1a0b2e] border border-purple-500/30 flex items-center justify-center">
                                        <User className="w-4 h-4 text-purple-200" />
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={signOut}
                                        className="text-white/60 hover:text-white"
                                    >
                                        <LogOut className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 py-8 relative z-10 pb-32">
                    {/* Welcome Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        {/* TECHXAURA Branding */}
                        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1 font-orbitron tracking-[0.15em] flex flex-wrap items-center">
                            TECH<span className="text-purple-400 text-4xl sm:text-5xl mx-0.5 drop-shadow-[0_0_20px_rgba(168,85,247,0.7)]">X</span>AURA
                        </h1>
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                            <span className="text-cyan-400 font-mono text-sm tracking-wider">27th February 2026</span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-semibold animate-pulse">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                                On Spot Available
                            </span>
                        </div>
                        <p className="text-white/70 text-sm sm:text-base">
                            Welcome, <span className="text-purple-400 font-semibold">{profile?.name?.split(" ")[0] || "Participant"}</span> — Build your team. Compete. Win.
                        </p>
                    </motion.div>

                    {/* Filters & Search */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                            <Input
                                placeholder="Search events..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500/50 transition-colors"
                            />
                        </div>

                        {/* Category Filters - Static Colors */}
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 border ${activeCategory === cat
                                        ? "bg-[#1a0b2e] border-purple-500/50 text-white shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                                        : "bg-transparent border-white/10 text-white/50 hover:border-white/20 hover:text-white"
                                        }`}
                                >
                                    {cat === "Technical" ? "Tech Events" : cat === "Non-Technical" ? "Non-Tech Events" : cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Events Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredEvents.map((event, index) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <EventCard
                                    event={{ ...event, image: dashboardEventImages[event.id] ?? event.image }}
                                    onViewDetails={() => setSelectedEvent(event)}
                                />
                            </motion.div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredEvents.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-white/50">No events found matching your criteria</p>
                        </div>
                    )}
                </main>
            </div>

            {/* Cart Summary Footer - Static/Fixed */}
            {items.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-lg border-t border-white/10 p-4"
                >
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div>
                            <span className="text-white font-medium">{items.length} event{items.length > 1 ? "s" : ""} selected</span>
                            <span className="text-white/50 ml-2">•</span>
                            <span className="text-cyan-400 font-bold ml-2">₹100 Total</span>
                        </div>
                        <Link href="/checkout">
                            <Button className="bg-[#4c1d95] text-white hover:bg-[#5b21b6] border border-purple-500/30">
                                Proceed to Checkout
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
