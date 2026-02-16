"use client";

import React from 'react';
import { Instagram, Linkedin, Youtube, MapPin, Mail, Phone } from 'lucide-react';


export function Footer() {
    return (
        <footer id="contact" className="pt-2 pb-0 border-t border-white/5 bg-black relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-purple-900/10 blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">

                    {/* Address Only (Brand Text Removed) */}
                    <div className="flex flex-col gap-4 items-center md:items-start">
                        <div className="flex flex-col gap-2 mt-2">
                            <a
                                href="https://maps.app.goo.gl/W1XBfMWKg4xkxNp99?g_st=aw"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-start gap-2 text-zinc-300 hover:text-purple-400 transition-colors group text-left"
                            >
                                <MapPin className="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform mt-0.5 shrink-0" />
                                <div className="flex flex-col">
                                    <span className="text-base font-medium text-white group-hover:text-purple-400 transition-colors">Sriram Engineering College</span>
                                    <span className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors mt-1">
                                        Kottamedu Rd, Veppampattu, <br />
                                        Perumalpattu, Tiruvallur - 602024
                                    </span>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* Contact Links */}
                    <div className="flex flex-col gap-4">
                        <a
                            href="mailto:1126srec2k25@gmail.com"
                            className="flex items-center justify-center md:justify-start gap-3 text-zinc-300 hover:text-white transition-all group p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10"
                        >
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                                <Mail className="w-4 h-4 text-purple-400" />
                            </div>
                            <span className="text-lg font-medium">1126srec2k25@gmail.com</span>
                        </a>

                        <a
                            href="tel:+911234567890"
                            className="flex items-center justify-center md:justify-start gap-3 text-zinc-300 hover:text-white transition-all group p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10"
                        >
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                                <Phone className="w-4 h-4 text-green-400" />
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-lg font-medium leading-tight">+91 72000 12857</span>
                                <span className="text-lg font-medium leading-tight">+91 86102 83706</span>
                                <span className="text-lg font-medium leading-tight">+91 73736 28589</span>
                            </div>
                        </a>
                    </div>

                    {/* Social Links */}
                    <div className="flex gap-4">
                        {[
                            { icon: Instagram, href: "#", color: "hover:text-pink-500", bg: "hover:bg-pink-500/10" },
                            { icon: Linkedin, href: "#", color: "hover:text-blue-500", bg: "hover:bg-blue-500/10" },
                            { icon: Youtube, href: "#", color: "hover:text-red-500", bg: "hover:bg-red-500/10" },
                        ].map((social, i) => (
                            <a
                                key={i}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-zinc-400 transition-all duration-300 hover:scale-110 ${social.color} ${social.bg}`}
                            >
                                <social.icon className="w-5 h-5" />
                            </a>
                        ))}
                    </div>
                </div>

                <div className="mt-2 pt-2 border-t border-white/5 text-center pb-1">
                    <p className="text-zinc-600 text-xs">
                        © 2026. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
