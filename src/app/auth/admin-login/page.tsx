"use client";

import React, { useState } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Log in with Password (NOT OAuth)
            await signInWithEmailAndPassword(auth, email, password);

            // 2. Force Redirect to Admin Dashboard
            toast.success("Login Successful");
            router.push("/admin");
            router.refresh();
        } catch (err) {
            console.error(err);
            toast.error("Invalid Credentials");
            setLoading(false);
        }
    };

    return (
        <div className="immersive-scroll-container bg-black flex items-center justify-center p-4 relative">
            {/* Light Rays Background Removed */}

            <Link href="/" className="fixed top-8 left-8 z-50 p-2 rounded-full hover:bg-white/10 transition-colors">
                <ArrowLeft className="w-6 h-6 text-white/50 hover:text-white" />
            </Link>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-[#4c1d95] border border-purple-500/30 flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(124,58,237,0.3)]">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white font-orbitron tracking-wide">ORGANIZER</h1>
                    <p className="text-purple-300/60 text-sm tracking-widest uppercase mt-1">Restricted Access</p>
                </div>

                <form onSubmit={handleAdminLogin} className="p-8 rounded-3xl border border-white/5 bg-black/40 backdrop-blur-xl shadow-2xl space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="admin-email" className="text-white/60 text-xs font-mono ml-1">ADMIN EMAIL</Label>
                        <Input
                            id="admin-email"
                            type="email"
                            placeholder="admin@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-white/5 border-white/10 text-white rounded-xl h-12 focus:border-purple-500/50 focus:bg-white/10 transition-all"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="admin-pass" className="text-white/60 text-xs font-mono ml-1">PASSWORD</Label>
                        <Input
                            id="admin-pass"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-white/5 border-white/10 text-white rounded-xl h-12 focus:border-purple-500/50 focus:bg-white/10 transition-all"
                            required
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 rounded-xl bg-[#4c1d95] hover:bg-[#5b21b6] text-white font-bold tracking-wide shadow-[0_0_20px_rgba(76,29,149,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98] border border-purple-500/20"
                    >
                        {loading ? "VERIFYING..." : "UNLOCK DASHBOARD"}
                    </Button>
                </form>

                <div className="mt-8 text-center">
                    <Link href="/" className="text-white/30 hover:text-white text-sm transition-colors flex items-center justify-center gap-2 group">
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Return to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
