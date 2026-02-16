"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export function AuthTabs() {
    const [mode, setMode] = useState<"signup" | "login">("signup");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const router = useRouter();
    const { signIn, signUp, signInWithGoogle } = useAuth();

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            const { error } = await signInWithGoogle();
            if (error) throw error;
            router.push("/dashboard");
        } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            toast.error(error.message || "Failed to login with Google");
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (mode === "signup") {
                const { error } = await signUp(email, password, {
                    name: fullName,
                    phone: "", // Will be filled in profile later or optional
                    college: "",
                    department: ""
                });
                if (error) throw error;
                toast.success("Account created successfully!");
                router.push("/dashboard");
            } else {
                const { error } = await signIn(email, password);
                if (error) throw error;
                toast.success("Logged in successfully!");
                router.push("/dashboard");
            }
        } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            toast.error(error.message || `Failed to ${mode}`);
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            {/* Tabs Header */}
            <div className="flex w-full mb-8 border-b border-white/10 relative">
                <button
                    onClick={() => setMode("signup")}
                    className={cn(
                        "flex-1 pb-4 text-center font-orbitron tracking-wider transition-all duration-300 relative",
                        mode === "signup" ? "text-white" : "text-white/40 hover:text-white/70"
                    )}
                >
                    REGISTER
                    {mode === "signup" && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                    )}
                </button>
                <button
                    onClick={() => setMode("login")}
                    className={cn(
                        "flex-1 pb-4 text-center font-orbitron tracking-wider transition-all duration-300 relative",
                        mode === "login" ? "text-white" : "text-white/40 hover:text-white/70"
                    )}
                >
                    LOGIN
                    {mode === "login" && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                    )}
                </button>
            </div>

            {/* Google Button - Best UI Style */}
            <Button
                variant="outline"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full h-12 mb-6 rounded-xl bg-white text-black hover:bg-zinc-200 hover:text-black border-none font-medium transition-transform active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
                {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                    </svg>
                )}
                Continue with Google
            </Button>

            <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5"></span></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-transparent px-2 text-zinc-600 font-mono">Or continue with email</span></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="space-y-2">
                            <Label className="text-xs font-mono text-zinc-500 ml-1">FULL NAME</Label>
                            <Input
                                className="bg-white/5 border-white/10 text-white rounded-xl h-11 focus:border-purple-500/50 focus:bg-white/10 transition-all"
                                placeholder="John Doe"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    <Label className="text-xs font-mono text-zinc-500 ml-1">EMAIL</Label>
                    <Input
                        className="bg-white/5 border-white/10 text-white rounded-xl h-11 focus:border-purple-500/50 focus:bg-white/10 transition-all"
                        placeholder="name@example.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-xs font-mono text-zinc-500 ml-1">PASSWORD</Label>
                    <div className="relative">
                        <Input
                            className="bg-white/5 border-white/10 text-white rounded-xl h-11 pr-10 focus:border-purple-500/50 focus:bg-white/10 transition-all"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-zinc-500 hover:text-zinc-300"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 mt-6 rounded-xl bg-[#4c1d95] hover:bg-[#5b21b6] text-white font-bold tracking-wide shadow-[0_0_20px_rgba(76,29,149,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98] border border-purple-500/20"
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : (mode === "login" ? "LOGIN" : "CREATE ACCOUNT")}
                </Button>
            </form>
        </div>
    );
}
