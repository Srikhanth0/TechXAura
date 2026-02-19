"use client";

import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Check, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface RulesDialogProps {
    open: boolean;
    onClose: () => void;
    onAccept: () => void;
    rules: string[];
    eventName: string;
}

export function RulesDialog({ open, onClose, onAccept, rules = [], eventName }: RulesDialogProps) {
    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent
                className="p-0 border-none bg-transparent shadow-none max-w-6xl w-full flex items-center justify-center overflow-visible"
                // Prevent auto-focus on content to avoid jarring jumps, focus will naturally go to the dialog
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black/80 backdrop-blur-2xl shadow-[0_0_50px_rgba(168,85,247,0.15)] flex flex-col max-h-[85vh]"
                        >
                            {/* Decorative Background Elements */}
                            <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-full -translate-x-1/2 bg-purple-500/20 blur-[100px]" />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent" />

                            {/* Main Container - Padding 8 (32px), Gap 6 (24px) */}
                            <div className="p-8 flex flex-col gap-6 flex-1 min-h-0 relative z-10">

                                {/* ZONE 1: IDENTIFICATION (Top) */}
                                <div className="flex flex-col items-center text-center space-y-2 shrink-0">
                                    {/* Title */}
                                    <DialogTitle className="text-lg md:text-xl font-orbitron font-bold tracking-widest text-white uppercase drop-shadow-sm">
                                        Rules & <span className="text-purple-400">Regulations</span>
                                    </DialogTitle>
                                </div>

                                {/* ZONE 2: CONTEXTUAL (Sub-header) - REMOVED as requested */}

                                {/* ZONE 3: CONTENT (Body) - Maximized Space */}
                                <div className="flex-1 min-h-0 bg-white/[0.02] border border-white/5 rounded-xl p-1 overflow-hidden flex flex-col mt-2">
                                    <div className="overflow-y-auto custom-scrollbar p-4 h-full space-y-3">
                                        {rules && rules.length > 0 ? (
                                            <ul className="space-y-3">
                                                {rules.map((rule, index) => (
                                                    <motion.li
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: index * 0.05 }}
                                                        key={index}
                                                        className="flex gap-3 items-start group"
                                                    >
                                                        <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)] group-hover:scale-150 transition-transform" />
                                                        <span className="text-white/80 text-xs sm:text-sm leading-relaxed group-hover:text-white transition-colors">
                                                            {rule}
                                                        </span>
                                                    </motion.li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="h-full flex flex-col items-center justify-center text-center opacity-50 py-10">
                                                <FileText className="w-12 h-12 text-white/20 mb-3" />
                                                <p className="text-white/40 text-xs font-orb tracking-wider">STANDARD PARTICIPATION RULES APPLY</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* ZONE 4: DECISION (Footer) */}
                                <div className="flex flex-col sm:flex-row gap-4 shrink-0 pt-2">
                                    <Button
                                        variant="ghost"
                                        onClick={onClose}
                                        className="w-full sm:flex-1 h-12 rounded-lg border border-white/10 text-white/50 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all font-medium tracking-wide uppercase text-xs sm:text-sm"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={onAccept}
                                        className="w-full sm:flex-[2] h-12 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-[0_4px_20px_rgba(168,85,247,0.4)] border border-purple-400/20 font-bold tracking-widest uppercase text-xs sm:text-sm flex items-center justify-center gap-2 group transition-all"
                                    >
                                        <span>Accept & Continue</span>
                                        <Check className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    </Button>
                                </div>

                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
}
