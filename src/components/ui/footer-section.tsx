"use client";

import React from 'react';
import { Instagram, MapPin, Mail, Phone } from 'lucide-react';


export function Footer() {
    return (
        <footer id="contact" className="pt-16 pb-12 border-t border-white/10 bg-black relative overflow-hidden">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-purple-900/20 blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">

                    {/* All sections wrapped in "Box" styled containers */}

                    {/* About Us */}
                    <div className="md:col-span-2 p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm hover:border-cyan-500/30 transition-all duration-300 group">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                                <span className="text-white font-bold text-xs">TX</span>
                            </div>
                            <h3 className="text-white font-orbitron font-bold text-lg tracking-widest uppercase group-hover:text-cyan-400 transition-colors">TechXaura</h3>
                        </div>
                        <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
                            Sriram Engineering College is dedicated to fostering innovation, technical excellence, and a vibrant academic community. The institution provides a dynamic learning environment where students are empowered to explore, innovate, and excel.
                        </p>
                    </div>

                    {/* Address & Contact */}
                    <div className="md:col-span-1 p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm hover:border-purple-500/30 transition-all duration-300 group flex flex-col gap-4">
                        <h3 className="text-white font-orbitron font-bold text-sm tracking-widest uppercase mb-2 group-hover:text-purple-400 transition-colors">Contact</h3>

                        {/* Address */}
                        <a
                            href="https://maps.app.goo.gl/W1XBfMWKg4xkxNp99?g_st=aw"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-start gap-3 text-zinc-400 hover:text-purple-400 transition-colors group/link"
                        >
                            <MapPin className="w-5 h-5 mt-1 text-purple-500 shrink-0 group-hover/link:scale-110 transition-transform" />
                            <span className="text-sm leading-relaxed">
                                Sriram Engineering College<br />
                                Perumalpattu, Tamil Nadu<br />
                                602024
                            </span>
                        </a>

                        {/* Email */}
                        <a
                            href="mailto:1126srec2k25@gmail.com"
                            className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors group/link"
                        >
                            <Mail className="w-4 h-4 text-purple-400 group-hover/link:text-white transition-colors" />
                            <span className="text-sm">Email Us</span>
                        </a>

                        {/* Phone */}
                        <a
                            href="tel:+918610283706"
                            className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors group/link"
                        >
                            <Phone className="w-4 h-4 text-green-400 group-hover/link:text-white transition-colors" />
                            <span className="text-sm">+91 86102 83706</span>
                        </a>
                    </div>

                    {/* Follow Us */}
                    <div className="md:col-span-1 p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm hover:border-pink-500/30 transition-all duration-300 group flex flex-col gap-4">
                        <h3 className="text-white font-orbitron font-bold text-sm tracking-widest uppercase mb-2 group-hover:text-pink-400 transition-colors">Follow Us</h3>
                        <div className="flex gap-4">
                            <a
                                href="https://www.instagram.com/techxaura_2k26"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 transition-all hover:bg-pink-500 hover:text-white hover:border-pink-500 hover:shadow-[0_0_15px_rgba(236,72,153,0.5)] active:scale-95"
                            >
                                <Instagram className="w-6 h-6" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-6 pt-3 border-t border-white/5 text-center pb-2">
                    <p className="text-zinc-600 text-xs">
                        © 2026 TechXaura. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
