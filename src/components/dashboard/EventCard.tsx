"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Event, useCart } from "@/context/CartContext";
import { Ticket, AlertTriangle, Check } from "lucide-react";
import Image from "next/image";

import { RulesDialog } from "./RulesDialog";

interface EventCardProps {
    event: Event;
    onViewDetails?: () => void;
}

export function EventCard({ event, onViewDetails }: EventCardProps) {
    const [showRules, setShowRules] = React.useState(false);
    const { addToCart, removeFromCart, isInCart, hasConflict } = useCart();
    const inCart = isInCart(event.id);
    const hasTimeConflict = hasConflict(event);



    const handleCartAction = () => {
        if (inCart) {
            removeFromCart(event.id);
        } else {
            setShowRules(true);
        }
    };

    const handleAcceptRules = () => {
        addToCart(event);
        setShowRules(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="group relative"
        >
            <div className="relative h-full p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-xl hover:border-white/10 transition-all duration-300 flex flex-col overflow-hidden">
                {/* Category Badge */}
                <div className="flex justify-between items-start mb-4">
                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-[#1a0b2e] border border-purple-500/20 text-purple-200">
                        {event.category}
                    </div>

                    {hasTimeConflict && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-bold tracking-tight animate-pulse underline-offset-2">
                            <AlertTriangle className="w-3 h-3" />
                            <span>EVENT OVERLAPPING</span>
                        </div>
                    )}
                </div>

                {/* Image or Content Header - With Blur Glow */}
                {event.image ? (
                    <div className="w-full h-32 rounded-xl mb-4 relative flex-shrink-0 group-hover:scale-[1.02] transition-transform duration-500">
                        {/* Blur Glow Behind */}
                        <div className="absolute inset-0 translate-y-2 scale-95 blur-xl opacity-40 rounded-xl" style={{ backgroundImage: `url(${event.image})`, backgroundSize: 'cover' }} />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 rounded-xl" />
                        <Image
                            src={event.image || ""}
                            alt={event.name}
                            fill
                            className={`rounded-xl relative z-0 ${(event.id === "fixtheglitch" || event.id === "paperpresentation" || event.id === "businessbattle" || event.id === "designomania" || event.id === "mindsparkx" || event.id === "carrom") ? "object-contain" : "object-cover"}`}
                        />
                    </div>
                ) : null}

                {/* Content */}
                <h3 className="text-lg font-bold text-white mb-2 font-orbitron tracking-wide">{event.name}</h3>
                <p className="text-white/60 text-sm mb-4 flex-grow line-clamp-2">{event.description}</p>

                {/* Meta Info */}
                <div className="space-y-2 mb-4">
                    <div className="text-xs text-white/50 font-medium">
                        {
                            event.id === "mindsparkx" || event.id === "designomania" || event.id === "fixtheglitch" ? "Solo Participation" :
                                event.id === "carrom" ? "2 Members Per Team" :
                                    `${event.teamSizeMin === event.teamSizeMax ? event.teamSizeMin : `${event.teamSizeMin}-${event.teamSizeMax}`} Members Team`
                        }
                    </div>
                    <div className="text-xs text-white/50 font-medium">
                        {event.timing}
                    </div>
                </div>



                {/* Actions */}
                <div className="flex gap-2 mt-auto pt-4 border-t border-white/5">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onViewDetails}
                        className="flex-1 border-white/10 text-white/70 hover:text-white hover:bg-white/5"
                    >
                        Details
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleCartAction}
                        className={`flex-1 transition-all ${inCart
                            ? "bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/20"
                            : "bg-[#1a0b2e] border border-purple-500/30 text-purple-100 hover:bg-[#2d1b4e] hover:border-purple-500/50"
                            }`}
                    >
                        {inCart ? (
                            <>
                                <Check className="w-4 h-4 mr-1" />
                                Added
                            </>
                        ) : (
                            <>
                                <Ticket className="w-4 h-4 mr-1" />
                                Add
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <RulesDialog
                open={showRules}
                onClose={() => setShowRules(false)}
                onAccept={handleAcceptRules}
                rules={event.rules}
                eventName={event.name}
            />
        </motion.div>
    );
}
