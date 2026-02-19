"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
            <div className="bg-zinc-900/50 p-8 rounded-2xl border border-white/10 backdrop-blur-xl max-w-md text-center">
                <h2 className="text-2xl font-bold text-red-500 mb-4 font-audiowide">System Malfunction</h2>
                <p className="text-zinc-400 mb-6">
                    An unexpected error has occurred. Our tech support protocols have been notified.
                </p>
                <p className="text-zinc-400 mb-6">
                    Please Contact the TechXAURA Team for assistance.
                </p>
                <p className="text-zinc-400 mb-6">
                    Mobile No: +91 7200012857
                </p>
                <Button
                    onClick={reset}
                    variant="outline"
                    className="bg-white/5 hover:bg-white/10 border-white/20 text-white font-mono tracking-wider"
                >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    RETRY SEQUENCE
                </Button>
            </div>
        </div>
    );
}
