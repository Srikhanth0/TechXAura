"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { db } from "@/lib/firebase";
import { collection, getDocs, updateDoc, doc, orderBy, query } from "firebase/firestore";
import toast from "react-hot-toast";
import { Users, Calendar, Download, Check, X, Eye, ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { generateRegistrationExcel, Registration } from "@/utils/excel-utils";
import { useAuth } from "@/context/AuthContext";




export default function AdminPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [registrations, setRegistrations] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [stats, setStats] = React.useState<any>({
        total: 0,
        verified: 0,
        pending: 0,
        filesUploaded: 0
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [selectedReg, setSelectedReg] = React.useState<any>(null);
    const [previewImage, setPreviewImage] = React.useState<string | null>(null);

    const getPreviewUrl = (url: string | null) => {
        if (!url) return "";
        if (url.includes("drive.google.com")) {
            const idMatch = url.match(/[-\w]{25,}/);
            if (idMatch) {
                return `https://lh3.googleusercontent.com/d/${idMatch[0]}`;
            }
        }
        return url;
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "registrations"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate().toISOString() : new Date().toISOString()
            }));

            setRegistrations(data);

            // Calculate stats
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const verified = data.filter((r: any) => r.paymentStatus === "verified").length;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const pending = data.filter((r: any) => r.paymentStatus === "pending").length;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const filesUploaded = data.filter((r: any) => r.paymentScreenshot).length;

            setStats({
                total: data.length,
                verified,
                pending,
                filesUploaded,
            });
        } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            console.error("Failed to fetch data:", error);
            toast.error("Failed to fetch data. Check console for details.");
        }
        setLoading(false);
    };

    const updatePaymentStatus = async (id: string, status: "verified" | "rejected") => {
        try {
            const docRef = doc(db, "registrations", id);
            await updateDoc(docRef, { paymentStatus: status });

            toast.success(`Payment ${status}`);
            fetchData();
            setSelectedReg(null);
        } catch (error) {
            console.error("Update error:", error);
            toast.error("Failed to update status");
        }
    };

    const exportToExcel = async () => {
        try {
            // Map registrations to match interface precisely if needed
            const safeRegistrations: Registration[] = registrations.map(r => ({
                id: r.id,
                userName: r.userName || "",
                userEmail: r.userEmail || "",
                userPhone: r.userPhone || "",
                userCollege: r.userCollege || "",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                events: (r.events || []).map((e: any) => ({
                    ...e,
                    teamName: e.teamName || ""
                })),
                amount: r.amount || 0,
                paymentStatus: r.paymentStatus || "pending",
                paymentScreenshot: r.paymentScreenshot || "",
                createdAt: r.createdAt
            }));

            const blob = await generateRegistrationExcel(safeRegistrations);

            // Trigger download
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `TECHXAURA_Registrations_${new Date().toISOString().split("T")[0]}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success("Excel exported!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to export Excel");
        }
    };

    React.useEffect(() => {
        if (authLoading) return; // Wait for auth check

        if (!user) {
            router.push("/auth/admin-login");
            return;
        }

        const ALLOWED_EMAILS = ["1126srec2k25@gmail.com"];
        const ALLOWED_UIDS = ["azxRBOi0aRPrxpoYzMLNAZ8QbbQ2"];

        if (ALLOWED_EMAILS.includes(user.email || "") || ALLOWED_UIDS.includes(user.uid)) {
            setIsLoggedIn(true);
            fetchData();
        } else {
            toast.error("Access Denied: You are not an admin.");
            router.push("/");
        }
    }, [user, authLoading, router]);

    if (authLoading || !isLoggedIn) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050009] relative overflow-hidden">
            {/* Background Gradient */}
            <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black" />
            <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[70%] -translate-x-1/2 rounded-full bg-purple-500/20 blur-3xl" />
            <div className="pointer-events-none absolute top-40 right-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

            {/* Scrollable container */}
            <div className="relative z-10 h-screen overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
                {/* Header */}
                <header className="sticky top-0 z-40 bg-black/60 backdrop-blur-2xl border-b border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.35)] relative">
                    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
                    <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-4">
                            <Link href="/">
                                <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Home
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-lg sm:text-xl font-bold text-white font-orbitron tracking-[0.2em] drop-shadow-[0_0_15px_rgba(168,85,247,0.45)]">
                                    ORGANIZER DASHBOARD
                                </h1>
                                <p className="text-white/40 text-xs font-mono tracking-[0.3em] mt-1">TECHXAURA CONTROL</p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            onClick={exportToExcel}
                            className="bg-white/5 border-white/10 text-white gap-2 hover:bg-white/10 transition-all rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.25)] w-full sm:w-auto"
                        >
                            <Download className="w-4 h-4" />
                            Export Data
                        </Button>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        {[
                            { label: "Total Registrations", value: stats.total, icon: Users, color: "cyan" },
                            { label: "Files Uploaded", value: stats.filesUploaded, icon: Download, color: "purple" },
                            { label: "Verified Payments", value: stats.verified, icon: Check, color: "green" },
                            { label: "Pending Verification", value: stats.pending, icon: Calendar, color: "yellow" },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="group relative p-6 rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-md hover:border-purple-500/30 hover:shadow-[0_0_35px_rgba(168,85,247,0.18)] transition-all"
                            >
                                <div className="pointer-events-none absolute -top-10 right-0 h-20 w-20 rounded-full bg-purple-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={`w-10 h-10 rounded-xl bg-${stat.color}-500/20 flex items-center justify-center border border-${stat.color}-500/30 shadow-[0_0_20px_rgba(168,85,247,0.25)]`}>
                                        <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-white/40 text-xs uppercase tracking-wider">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Registrations */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden shadow-[0_0_45px_rgba(168,85,247,0.08)]">
                        <div className="p-4 sm:p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-gradient-to-r from-purple-500/10 via-transparent to-cyan-500/10">
                            <h2 className="text-base sm:text-lg font-bold text-white font-orbitron tracking-[0.2em]">RECENT REGISTRATIONS</h2>
                            <div className="text-xs text-white/40 font-mono">LIVE FEED</div>
                        </div>

                        {loading ? (
                            <div className="p-16 text-center">
                                <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto" />
                                <p className="text-white/30 text-xs mt-4 animate-pulse">SYNCING DATA...</p>
                            </div>
                        ) : registrations.length === 0 ? (
                            <div className="p-16 text-center text-white/30 font-mono">
                                NO DATA AVAILABLE
                            </div>
                        ) : (
                            <>
                                {/* Mobile Card View */}
                                <div className="md:hidden divide-y divide-white/5">
                                    {registrations.map((reg) => (
                                        <div key={reg.id} className="p-4 hover:bg-white/[0.04] transition-colors">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <p className="text-white font-medium text-sm">{reg.userName}</p>
                                                    <p className="text-white/50 text-xs truncate max-w-[200px]">{reg.userEmail}</p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setSelectedReg(reg)}
                                                    className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-lg h-8 w-8 p-0"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            <div className="flex items-center gap-2 flex-wrap mb-2">
                                                {reg.paymentScreenshot && !reg.paymentScreenshot.includes("drive.google.com") && (
                                                    <div
                                                        className="h-12 w-12 rounded bg-white/5 border border-white/10 overflow-hidden cursor-pointer hover:border-purple-500 transition-colors relative mr-2"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setPreviewImage(reg.paymentScreenshot);
                                                        }}
                                                    >
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img src={reg.paymentScreenshot} alt="Pay" className="h-full w-full object-cover" />
                                                    </div>
                                                )}
                                                <span className="text-white/50 text-xs">{reg.events?.length || 0} event(s)</span>
                                                <span className="text-white/20">•</span>
                                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono ${reg.paymentStatus === "verified"
                                                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                                    : reg.paymentStatus === "rejected"
                                                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                                        : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                                                    }`}>
                                                    {reg.paymentStatus.toUpperCase()}
                                                </span>
                                                <span className="text-white/20">•</span>
                                                <span className="text-white/40 text-xs font-mono">{new Date(reg.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Desktop Table View */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-white/5 text-left bg-white/[0.03]">
                                                <th className="p-4 text-white/40 text-xs font-mono uppercase tracking-wider">Name</th>
                                                <th className="p-4 text-white/40 text-xs font-mono uppercase tracking-wider">Email</th>
                                                <th className="p-4 text-white/40 text-xs font-mono uppercase tracking-wider">Events</th>
                                                <th className="p-4 text-white/40 text-xs font-mono uppercase tracking-wider">Payment</th>
                                                <th className="p-4 text-white/40 text-xs font-mono uppercase tracking-wider">Status</th>
                                                <th className="p-4 text-white/40 text-xs font-mono uppercase tracking-wider">Date</th>
                                                <th className="p-4 text-white/40 text-xs font-mono uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {registrations.map((reg) => (
                                                <tr key={reg.id} className="border-b border-white/5 hover:bg-white/[0.06] transition-colors">
                                                    <td className="p-4 text-white font-medium">{reg.userName}</td>
                                                    <td className="p-4 text-white/60 text-sm">{reg.userEmail}</td>
                                                    <td className="p-4 text-white/60 text-sm">
                                                        {reg.events?.length || 0} event(s)
                                                    </td>
                                                    <td className="p-4">
                                                        {reg.paymentScreenshot ? (
                                                            reg.paymentScreenshot.includes("drive.google.com") ? (
                                                                <a
                                                                    href={reg.paymentScreenshot}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center gap-1 text-cyan-400 hover:underline text-xs"
                                                                >
                                                                    <ExternalLink className="w-3 h-3" /> Drive
                                                                </a>
                                                            ) : (
                                                                <div
                                                                    className="h-10 w-10 rounded bg-white/5 border border-white/10 overflow-hidden cursor-pointer hover:border-purple-500 transition-colors relative group"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setPreviewImage(reg.paymentScreenshot);
                                                                    }}
                                                                >
                                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                    <img src={getPreviewUrl(reg.paymentScreenshot)} alt="Pay" className="h-full w-full object-cover" />
                                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                        <Eye className="w-3 h-3 text-white" />
                                                                    </div>
                                                                </div>
                                                            )
                                                        ) : (
                                                            <span className="text-white/20 text-xs">-</span>
                                                        )}
                                                    </td>
                                                    <td className="p-4">
                                                        <span className={`px-2 py-1 rounded-md text-xs font-bold font-mono ${reg.paymentStatus === "verified"
                                                            ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                                            : reg.paymentStatus === "rejected"
                                                                ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                                                : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                                                            }`}>
                                                            {reg.paymentStatus.toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-white/40 text-sm font-mono">
                                                        {new Date(reg.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="p-4">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => setSelectedReg(reg)}
                                                            className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-lg"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </div>
                </main>
            </div>{/* end scroll container */}

            {/* Detail Modal */}
            <Dialog open={!!selectedReg} onOpenChange={() => setSelectedReg(null)}>
                <DialogContent className="bg-[#0a0a0a] border-purple-500/20 max-w-lg max-w-[95vw] shadow-[0_0_35px_rgba(168,85,247,0.25)]">
                    <DialogHeader>
                        <DialogTitle className="text-white font-orbitron tracking-wide">REGISTRATION DETAILS</DialogTitle>
                    </DialogHeader>

                    {selectedReg && (
                        <DialogBody>
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-6 bg-white/5 p-4 rounded-xl border border-white/5">
                                    <div>
                                        <p className="text-white/40 text-xs font-mono uppercase mb-1">Name</p>
                                        <p className="text-white font-medium">{selectedReg.userName}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/40 text-xs font-mono uppercase mb-1">Phone</p>
                                        <p className="text-white font-medium">{selectedReg.userPhone}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/40 text-xs font-mono uppercase mb-1">Email</p>
                                        <p className="text-white text-sm break-all">{selectedReg.userEmail}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/40 text-xs font-mono uppercase mb-1">College</p>
                                        <p className="text-white text-sm">{selectedReg.userCollege}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-white/40 text-xs font-mono uppercase mb-2">Registered Events</p>
                                    <div className="flex flex-wrap gap-2">
                                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                        {selectedReg.events?.map((e: any, i: number) => (
                                            <span key={i} className="px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs">
                                                {e.eventName}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-white/40 text-xs font-mono uppercase mb-2">Payment Screenshot</p>
                                    {selectedReg.paymentScreenshot ? (
                                        <div className="rounded-xl overflow-hidden border border-white/10 bg-black">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={getPreviewUrl(selectedReg.paymentScreenshot)}
                                                alt="Payment"
                                                className="w-full object-contain max-h-64"
                                            />
                                        </div>
                                    ) : (
                                        <div className="p-4 rounded-xl border border-white/10 bg-white/5 text-center text-white/40 text-sm">
                                            No screenshot uploaded
                                        </div>
                                    )}
                                </div>
                            </div>
                        </DialogBody>
                    )}

                    <DialogFooter className="bg-white/5 border-t border-white/5 p-4">
                        {selectedReg?.paymentStatus === "pending" && (
                            <div className="flex w-full gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => updatePaymentStatus(selectedReg.id, "rejected")}
                                    className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Reject
                                </Button>
                                <Button
                                    onClick={() => updatePaymentStatus(selectedReg.id, "verified")}
                                    className="flex-1 bg-green-600 hover:bg-green-500 text-white transition-colors border-none"
                                >
                                    <Check className="w-4 h-4 mr-2" />
                                    Verify Payment
                                </Button>
                            </div>
                        )}
                        {selectedReg?.paymentStatus !== "pending" && (
                            <Button
                                onClick={() => setSelectedReg(null)}
                                className="w-full bg-white/10 hover:bg-white/20 text-white"
                            >
                                Close
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Image Preview Modal */}
            <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
                <DialogContent className="bg-black/95 border-white/10 max-w-4xl p-0 overflow-hidden">
                    <DialogHeader className="sr-only">
                        <DialogTitle>Payment Preview</DialogTitle>
                        <DialogDescription>Full size preview of the payment screenshot</DialogDescription>
                    </DialogHeader>
                    <div className="relative w-full h-[90vh] flex items-center justify-center p-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {previewImage && (
                            <img
                                src={previewImage}
                                alt="Full Payment Preview"
                                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
