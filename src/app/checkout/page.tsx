"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useCart, TeamMember, ValidationResult } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";
import { ArrowLeft, Users, Trash2, Upload, Check, AlertCircle, XCircle, Link2, ExternalLink, MessageCircle, Eye } from "lucide-react";
import Link from "next/link";
// import Image from "next/image";
import toast from "react-hot-toast";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toBase64 } from "@/lib/utils";
import dynamic from "next/dynamic";

const IdCardScene = dynamic(() => import("@/components/IdCardScene"), { ssr: false });

type CheckoutStep = "review" | "payment" | "thankyou" | "communities";

export default function CheckoutPage() {
    const { user, profile, loading: authLoading } = useAuth();
    const { items, removeFromCart, updateTeamMembers, clearCart, totalAmount, validateGlobalTeamLimit } = useCart();
    const router = useRouter();

    const [step, setStep] = React.useState<CheckoutStep>("review");
    const [teamModalOpen, setTeamModalOpen] = React.useState(false);
    const [selectedEventId, setSelectedEventId] = React.useState<string | null>(null);
    const [uploading, setUploading] = React.useState(false);
    const [paymentScreenshot, setPaymentScreenshot] = React.useState<string | null>(null);
    const [driveUrl, setDriveUrl] = React.useState("");
    const [driveUrlError, setDriveUrlError] = React.useState<string | null>(null);
    const [registeredItems, setRegisteredItems] = React.useState<typeof items>([]);
    const [conflictError, setConflictError] = React.useState<string | null>(null);
    const [validationError, setValidationError] = React.useState<ValidationResult | null>(null);
    const [imagePreviewOpen, setImagePreviewOpen] = React.useState(false);
    const [previewObjectUrl, setPreviewObjectUrl] = React.useState<string | null>(null);
    const [isMounted, setIsMounted] = React.useState(false);

    // Clean up object URL
    React.useEffect(() => {
        return () => {
            if (previewObjectUrl) {
                URL.revokeObjectURL(previewObjectUrl);
            }
        };
    }, [previewObjectUrl]);

    // WhatsApp community links per event
    const whatsappLinks: Record<string, { url: string; name: string; category?: string }> = {
        paperpresentation: { url: "https://chat.whatsapp.com/E2EHiFHT1rM7Wl0TJqKeeX", name: "Paper Presentation", category: "Technical" },
        fixtheglitch: { url: "https://chat.whatsapp.com/BftcP9CAkm61rd8xZ2sNnV", name: "Fix The Glitch", category: "Technical" },
        mindsparkx: { url: "https://chat.whatsapp.com/JqKm2pF5JfFA9Tw6uYIUXh", name: "MindSpark X", category: "Technical" },
        designomania: { url: "https://chat.whatsapp.com/FrZ93P6CaY052n1mYHFODY", name: "Design O Mania", category: "Creative" },
        businessbattle: { url: "https://chat.whatsapp.com/D8RTRvuZ05k0VjCoSPA16f", name: "Business Battle", category: "Management" },
        startmusic: { url: "https://chat.whatsapp.com/HPFcmAdrT84JcsnqHgIKcM", name: "Start Music", category: "Non-Technical" },
        vaangapazhagalam: { url: "https://chat.whatsapp.com/CtkvA3VjsegLGlWZJBCFrA", name: "Vaanga Pazhagalam", category: "Non-Technical" },
        lubberpandhu: { url: "https://chat.whatsapp.com/Dkz1vW0n7XpHExSjK40CMi?mode=gi_t", name: "Lubber Pandhu", category: "Sports" },
        editomania: { url: "#", name: "Editomania", category: "Creative" },
        iplauction: { url: "https://chat.whatsapp.com/DWodIsa2ay58HsWw6xNSOR?mode=gi_t", name: "IPL Auction", category: "Gaming" },
        esports: { url: "https://chat.whatsapp.com/JuqyXl1LMhzGjDgbFN6fj4?mode=gi_t", name: "E-Sports", category: "Gaming" },
        clashoftalents: { url: "https://chat.whatsapp.com/HXkjXNKi5jgDegZf3JBSET?mode=gi_t", name: "Clash of Talents", category: "Cultural" },
        carrom: { url: "https://chat.whatsapp.com/DGSLYQdq6Rr5OjkXrIpSfe?mode=gi_t", name: "Carrom", category: "Sports" },
    };

    // Drive URL validation
    const isValidDriveUrl = (url: string): boolean => {
        if (!url.trim()) return false;
        const patterns = [
            /^https:\/\/drive\.google\.com\/file\/d\/[a-zA-Z0-9_-]+/,
            /^https:\/\/drive\.google\.com\/open\?id=[a-zA-Z0-9_-]+/,
            /^https:\/\/drive\.google\.com\/uc\?.*id=[a-zA-Z0-9_-]+/,
            /^https:\/\/drive\.google\.com\/drive\/folders\/[a-zA-Z0-9_-]+/,
        ];
        return patterns.some(p => p.test(url.trim()));
    };

    const handleDriveUrlChange = (value: string) => {
        setDriveUrl(value);
        if (value.trim() && !isValidDriveUrl(value)) {
            setDriveUrlError("Please enter a valid Google Drive URL");
        } else {
            setDriveUrlError(null);
        }
    };

    // Helper to get displayable image URL from Drive link
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

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    React.useEffect(() => {
        if (isMounted && !authLoading && !user) {
            router.push("/auth");
        }
    }, [isMounted, authLoading, user, router]);

    // ... (rest of useEffects) ... 




    // Play success SFX when step changes to "thankyou"
    React.useEffect(() => {
        if (step === "thankyou") {
            const audio = new Audio("/sfx/3rd_checkout_registration_sfx.wav");
            audio.volume = 0.6;
            audio.play().catch((err: unknown) => console.error(err));
        }
    }, [step]);

    if (!isMounted || authLoading) return null;

    // UPI payment details
    const upiId = "pravinads25-6@okhdfcbank";
    // const upiLink = `upi://pay?pa=${upiId}&pn=TECHXAURA&am=100&mam=100&cu=INR&tn=TECHXAURA2K26Registration`;

    // Team member form handling
    const openTeamModal = (eventId: string) => {
        setSelectedEventId(eventId);
        setTeamModalOpen(true);
    };

    const handleTeamSubmit = (members: TeamMember[], file?: File, url?: string, teamName?: string) => {
        if (selectedEventId) {
            updateTeamMembers(selectedEventId, members, file, url, teamName);
            setTeamModalOpen(false);
            toast.success("Team members saved!");
        }
    };

    // Payment handling
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please upload an image file");
            return;
        }

        if (!user) {
            toast.error("You must be logged in to upload");
            return;
        }

        // Create immediate preview
        const objectUrl = URL.createObjectURL(file);
        setPreviewObjectUrl(objectUrl);
        setPaymentScreenshot(null); // Clear previous server URL if any

        setUploading(true);
        try {
            console.log("Processing payment upload...");
            const base64 = await toBase64(file);
            console.log("Base64 conversion complete.");

            // Use API proxy
            const response = await fetch('/api/upload', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    base64: base64.split(',')[1],
                    fileType: 'payment', // Signal type to API
                    type: file.type,
                    name: `${user.uid}_${Date.now()}_payment.jpg`,
                })
            });

            console.log("Upload API Status:", response.status);

            const data = await response.json().catch(() => ({}));
            console.log("Upload API Response:", data);

            if (!response.ok) {
                console.error("Upload API Error:", data);
                throw new Error(data.error || data.message || "Upload failed");
            }

            // Extract URL — GAS may return fileUrl, url, directLink, or data.fileId
            let link = data.fileUrl || data.url || data.secure_url || data.directLink;
            if (!link && data.data?.fileId) {
                link = `https://drive.google.com/file/d/${data.data.fileId}/view`;
            }
            if (!link && data.data && typeof data.data === 'string') {
                link = data.data;
            }

            if (!link) {
                console.error("Missing URL in response:", data);
                throw new Error("No URL returned from upload service");
            }

            setPaymentScreenshot(link);
            toast.success("Screenshot uploaded successfully!");

        } catch (error) {
            console.error("Upload Error:", error);
            toast.error(error instanceof Error ? error.message : "Failed to upload screenshot");
            setPreviewObjectUrl(null); // Clear preview on failure
        } finally {
            setUploading(false);
        }
    };







    const handleProceedToPayment = () => {
        // 1. Validation: Check for minimum team size
        for (const item of items) {
            if (item.teamMembers.length < item.event.teamSizeMin) {
                toast.error(`Event "${item.event.name}" requires at least ${item.event.teamSizeMin} team member(s).`);
                return;
            }
            // Validate Abstract File presence if required
            if (item.event.id === "paperpresentation" && !item.abstractUrl) { // Check for URL, not just File object
                toast.error(`Event "${item.event.name}" requires an abstract file to be uploaded.`);
                return;
            }
        }

        // 2. Global Validation: "Unique 5" Rule
        const result = validateGlobalTeamLimit();
        if (!result.valid) {
            setValidationError(result);
            return;
        }

        setStep("payment");
    };

    const handleCompletePayment = async () => {
        const validDrive = isValidDriveUrl(driveUrl);
        if (!paymentScreenshot && !validDrive) {
            toast.error("Please upload payment screenshot or upload your img to drive and paste a valid Google Drive URL");
            return;
        }

        if (!user) return;

        try {
            // Create registration in Firestore
            const registrationData = {
                userId: user.uid,
                userEmail: user.email || "No Email",
                userName: profile?.name || user.displayName || "Unknown User",
                userPhone: profile?.phone || "N/A",
                userCollege: profile?.college || "N/A",
                events: items.map(item => ({
                    eventId: item.event.id,
                    eventName: item.event.name,
                    teamMembers: item.teamMembers,
                    teamName: item.teamName || null,
                    abstractUrl: item.abstractUrl || null,
                })),
                amount: totalAmount,
                paymentScreenshot: paymentScreenshot || driveUrl.trim(),
                paymentStatus: "pending",
                createdAt: serverTimestamp(),
            };

            await addDoc(collection(db, "registrations"), registrationData);

            setRegisteredItems(items);
            clearCart();
            setStep("thankyou");
        } catch (error) {
            console.error("Registration error:", error);
            toast.error("Failed to submit registration");
        }
    };

    if (!user) return null;

    if (items.length === 0 && step !== "thankyou" && step !== "communities") {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <p className="text-white/60 mb-4">Your cart is empty</p>
                    <Link href="/dashboard">
                        <Button className="bg-[#4c1d95] text-white hover:bg-[#5b21b6] shadow-lg shadow-purple-900/20">
                            Explore Events
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="immersive-scroll-container bg-black">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-lg border-b border-white/5">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="sm" className="text-white/60">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <h1 className="text-xl font-bold text-white">Checkout</h1>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-12">
                    {[
                        { key: "review", label: "Review" },
                        { key: "payment", label: "Payment" },
                        { key: "thankyou", label: "Complete" },
                        { key: "communities", label: "Join" },
                    ].map((s, i) => (
                        <React.Fragment key={s.key}>
                            <div className={`flex items-center gap-2 ${step === s.key ? "text-cyan-400" : (s.key === "thankyou" && step === "thankyou") || (s.key === "communities" && step === "communities") ? "text-green-400" : "text-white/40"}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === s.key ? "bg-cyan-500/20 border border-cyan-500" :
                                    (s.key === "review" && step !== "review") || (s.key === "payment" && (step === "thankyou" || step === "communities")) || (s.key === "thankyou" && step === "communities")
                                        ? "bg-green-500/20 border border-green-500 text-green-400"
                                        : "bg-white/5 border border-white/10"
                                    }`}>
                                    {((s.key === "review" && step !== "review") || (s.key === "payment" && (step === "thankyou" || step === "communities")) || (s.key === "thankyou" && step === "communities")) ? (
                                        <Check className="w-4 h-4" />
                                    ) : (
                                        i + 1
                                    )}
                                </div>
                                <span className="text-sm font-medium hidden sm:block">{s.label}</span>
                            </div>
                            {i < 3 && <div className="w-12 h-px bg-white/10 mx-2" />}
                        </React.Fragment>
                    ))}
                </div>

                {/* Step Content */}
                {step === "review" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <h2 className="text-2xl font-bold text-white mb-2">Review Your Cart</h2>
                        <div className="mb-6 inline-block">
                            <p className="text-amber-400 font-semibold text-sm bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg flex items-center gap-2 animate-pulse">
                                <AlertCircle className="w-4 h-4" />
                                Please add your complete team members list
                            </p>
                        </div>

                        {/* Cart Items */}
                        <div className="space-y-4 mb-8">
                            {items.map((item) => (
                                <div key={item.event.id} className="p-4 rounded-xl border border-white/5 bg-gradient-to-r from-purple-900/20 via-transparent to-transparent backdrop-blur-sm relative overflow-hidden">
                                    <div className="absolute inset-0 bg-white/[0.02] pointer-events-none" />
                                    <div className="relative z-10">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-white font-semibold">{item.event.name}</h3>
                                                {item.teamName && (
                                                    <p className="text-cyan-400 text-sm font-medium mt-0.5">Team: {item.teamName}</p>
                                                )}
                                                <p className="text-white/50 text-sm">{item.event.category} • {item.event.timing}</p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeFromCart(item.event.id)}
                                                className="text-red-400 hover:text-red-300"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>

                                        {/* Team Members */}
                                        <div className="mt-4 pt-4 border-t border-white/5">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-white/60 text-sm">
                                                    <Users className="w-4 h-4" />
                                                    <span>
                                                        {item.teamMembers.length > 0
                                                            ? `${item.teamMembers.length} member${item.teamMembers.length > 1 ? "s" : ""} added`
                                                            : "No team members added"}
                                                    </span>
                                                    {item.abstractUrl && (
                                                        <span className="ml-2 text-cyan-400 flex items-center gap-1">
                                                            <Check className="w-3 h-3" /> Abstract Uploaded
                                                        </span>
                                                    )}
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => openTeamModal(item.event.id)}
                                                    className="border-white/10 text-white/70"
                                                >
                                                    {item.teamMembers.length > 0 ? "Edit Team" : "Add Team"}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="p-6 rounded-xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/5 to-purple-500/5">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-white/60">Total Events</span>
                                <span className="text-white font-semibold">{items.length}</span>
                            </div>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-white/60">Entry Fee</span>
                                <span className="text-2xl font-bold text-cyan-400">₹{totalAmount}</span>
                            </div>
                            <p className="text-white/40 text-xs mb-4">* One payment covers your entire team (up to 5 members)</p>
                            <Button
                                onClick={handleProceedToPayment}
                                className="w-full bg-[#4c1d95] text-white hover:bg-[#5b21b6] shadow-lg shadow-purple-900/20 font-medium tracking-wide h-12 text-lg"
                            >
                                Continue to Payment
                            </Button>
                        </div>
                    </motion.div>
                )}

                {step === "payment" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                            <h2 className="text-2xl font-bold text-white mb-6 font-orbitron">Payment</h2>

                            <div className="space-y-6">
                                <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                                    <p className="text-purple-200 text-sm mb-2 font-mono">UPI ID</p>
                                    <div className="flex items-center justify-between">
                                        <code className="text-white font-bold text-lg">{upiId}</code>
                                        <Button size="sm" variant="ghost" className="text-white/60 hover:text-white" onClick={() => {
                                            navigator.clipboard.writeText(upiId);
                                            toast.success("UPI ID copied!");
                                        }}>
                                            Copy
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex justify-center">
                                    <div className="bg-white p-4 rounded-xl">
                                        <QRCodeSVG value={`upi://pay?pa=${upiId}&pn=TECHXAURA&am=${totalAmount}&mam=${totalAmount}&cu=INR`} size={200} />
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-white mb-2 block">Upload Payment Screenshot</Label>

                                    {previewObjectUrl || paymentScreenshot ? (
                                        <div className="flex items-center gap-4 mb-4 bg-white/5 p-3 rounded-xl border border-white/10">
                                            <div
                                                className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden border border-white/20 cursor-zoom-in group"
                                                onClick={() => setImagePreviewOpen(true)}
                                            >
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={previewObjectUrl || getPreviewUrl(paymentScreenshot)} alt="Payment Preview" className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Eye className="w-4 h-4 text-white" />
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white text-sm font-medium truncate">Screenshot Uploaded</p>
                                                <p className="text-white/40 text-xs">Ready to submit</p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setPaymentScreenshot(null);
                                                    setPreviewObjectUrl(null);
                                                }}
                                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileUpload}
                                                className="hidden"
                                                id="payment-upload"
                                                disabled={uploading}
                                            />
                                            <label
                                                htmlFor="payment-upload"
                                                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all group ${uploading
                                                    ? "border-white/10 bg-white/5 cursor-wait"
                                                    : "border-white/20 hover:border-purple-500/50 hover:bg-white/5"
                                                    }`}
                                            >
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    {uploading ? (
                                                        <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mb-2" />
                                                    ) : (
                                                        <>
                                                            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                                <Upload className="w-5 h-5 text-purple-400" />
                                                            </div>
                                                            <p className="text-sm text-white/60 mb-1">Click to upload screenshot</p>
                                                            <p className="text-xs text-white/40">SVG, PNG, JPG or GIF (MAX. 5MB)</p>
                                                        </>
                                                    )}
                                                </div>
                                            </label>
                                        </div>
                                    )}

                                    <div className="mt-4 flex items-center gap-2">
                                        <div className="h-px flex-1 bg-white/10" />
                                        <span className="text-xs text-white/30 uppercase">Or via Drive</span>
                                        <div className="h-px flex-1 bg-white/10" />
                                    </div>

                                    <div className="mt-4">
                                        <Label htmlFor="drive-url" className="text-white text-xs mb-1.5 block">Google Drive URL (Optional)</Label>
                                        <div className="relative">
                                            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                            <Input
                                                id="drive-url"
                                                value={driveUrl}
                                                onChange={(e) => handleDriveUrlChange(e.target.value)}
                                                placeholder="Paste Google Drive link..."
                                                className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-purple-500/50"
                                            />
                                        </div>
                                        {driveUrlError && (
                                            <p className="text-red-400 text-xs mt-1">{driveUrlError}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Button
                            className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-500 hover:to-purple-700 text-white font-bold tracking-wide rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.4)] disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                            disabled={(!paymentScreenshot && !driveUrl) || !!driveUrlError || uploading}
                            onClick={handleCompletePayment}
                        >
                            Complete Registration
                        </Button>
                    </motion.div>
                )}

                {step === "thankyou" && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-8"
                    >
                        {/* 3D ID Card */}
                        <div className="w-full h-[300px] sm:h-[350px] mb-6 rounded-2xl overflow-hidden border border-white/10">
                            <IdCardScene />
                        </div>

                        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                            <Check className="w-8 h-8 text-green-400" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Registration Submitted!</h2>
                        <p className="text-white/60 max-w-md mx-auto mb-6 text-sm sm:text-base">
                            Your registration has been submitted successfully. Our team will verify your payment and send a confirmation email shortly.
                        </p>
                        <p className="text-white/40 text-xs mb-6">Drag the ID card above to interact with it!</p>

                        <Button
                            onClick={() => setStep("communities")}
                            className="bg-[#4c1d95] text-white hover:bg-[#5b21b6]"
                        >
                            Join WhatsApp Communities
                        </Button>
                    </motion.div>
                )}

                {step === "communities" && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-center py-8"
                    >
                        {/* WhatsApp Community Section */}
                        <div className="max-w-2xl mx-auto w-full">
                            <div className="flex items-center justify-center gap-2 mb-6">
                                <MessageCircle className="w-5 h-5 text-green-400" />
                                <h3 className="text-lg sm:text-xl font-semibold text-white">Join WhatsApp Communities</h3>
                            </div>
                            <p className="text-white/50 text-sm mb-6">Click on an event to join its WhatsApp community group</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                                {Object.values(whatsappLinks).filter(link => link.url !== "#").map((link, index) => (
                                    <a
                                        key={index}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group p-4 rounded-xl border border-white/10 bg-gradient-to-r from-green-900/10 via-transparent to-transparent hover:border-green-500/40 hover:bg-green-900/15 transition-all cursor-pointer"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="text-left">
                                                <h4 className="text-white font-medium text-sm">{link.name}</h4>
                                                {link.category && <span className="text-white/40 text-xs">{link.category}</span>}
                                            </div>
                                            <ExternalLink className="w-4 h-4 text-green-400/60 group-hover:text-green-400 transition-colors" />
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>

                        <Link href="/">
                            <Button className="bg-white/10 text-white hover:bg-white/20 border border-white/10">
                                Return to Homepage
                            </Button>
                        </Link>
                    </motion.div>
                )}
            </main>

            {/* Image Preview Dialog */}
            <Dialog open={imagePreviewOpen} onOpenChange={setImagePreviewOpen}>
                <DialogContent className="bg-black/95 border-white/10 max-w-4xl p-0 overflow-hidden">
                    <DialogHeader className="sr-only">
                        <DialogTitle>Payment Preview</DialogTitle>
                        <DialogDescription>Full size preview of the payment screenshot</DialogDescription>
                    </DialogHeader>
                    <div className="relative w-full h-[80vh] flex items-center justify-center p-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {(previewObjectUrl || paymentScreenshot) && (
                            <img
                                src={previewObjectUrl || getPreviewUrl(paymentScreenshot)}
                                alt="Full Payment Preview"
                                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Team Modal */}
            <TeamMemberModal
                open={teamModalOpen}
                onClose={() => setTeamModalOpen(false)}
                event={items.find(i => i.event.id === selectedEventId)?.event}
                existingMembers={items.find(i => i.event.id === selectedEventId)?.teamMembers || []}
                existingFile={items.find(i => i.event.id === selectedEventId)?.abstractFile}
                existingUrl={items.find(i => i.event.id === selectedEventId)?.abstractUrl}
                existingTeamName={items.find(i => i.event.id === selectedEventId)?.teamName}
                onSubmit={handleTeamSubmit}
            />

            {/* Conflict Alert Dialog */}
            <Dialog open={!!conflictError} onOpenChange={() => setConflictError(null)}>
                <DialogContent className="bg-black/90 border-red-500/50">
                    <DialogHeader>
                        <DialogTitle className="text-red-400 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" />
                            Scheduling Conflict
                        </DialogTitle>
                        <DialogDescription className="text-white/80 mt-2">
                            {conflictError}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => setConflictError(null)} className="bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30">
                            Understood
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Validation Error Dialog (Unique 5 Rule) */}
            <ValidationErrorDialog
                error={validationError}
                onClose={() => setValidationError(null)}
            />

            {/* Image Preview Dialog */}
            <Dialog open={imagePreviewOpen} onOpenChange={setImagePreviewOpen}>
                <DialogContent className="bg-black/95 border-white/10 max-w-4xl p-0 overflow-hidden">
                    <DialogHeader className="sr-only">
                        <DialogTitle>Payment Preview</DialogTitle>
                        <DialogDescription>Full size preview of the payment screenshot</DialogDescription>
                    </DialogHeader>
                    <div className="relative w-full h-[80vh] flex items-center justify-center p-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {(previewObjectUrl || paymentScreenshot) && (
                            <img
                                src={previewObjectUrl || getPreviewUrl(paymentScreenshot)}
                                alt="Full Payment Preview"
                                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>

        </div >
    );
}

// Team Member Modal Component
function TeamMemberModal({
    open,
    onClose,
    event,
    existingMembers,
    existingFile,
    existingUrl,
    existingTeamName,
    onSubmit
}: {
    open: boolean;
    onClose: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    event?: any;
    existingMembers: TeamMember[];
    existingFile?: File;
    existingUrl?: string;
    existingTeamName?: string;
    onSubmit: (members: TeamMember[], file?: File, url?: string, teamName?: string) => void;
}) {
    const [members, setMembers] = React.useState<TeamMember[]>(existingMembers);
    const [abstractFile, setAbstractFile] = React.useState<File | undefined>(existingFile);
    const [abstractUrl, setAbstractUrl] = React.useState<string | undefined>(existingUrl);
    const [teamName, setTeamName] = React.useState<string>(existingTeamName || "");
    const [uploading, setUploading] = React.useState(false);

    // Events that require a team name
    const eventsWithTeamName = ["paperpresentation", "lubberpandhu", "clashoftalents", "esports", "businessbattle"];
    const needsTeamName = event && eventsWithTeamName.includes(event.id);

    React.useEffect(() => {
        setMembers(existingMembers);
        setAbstractFile(existingFile);
        setAbstractUrl(existingUrl);
        setTeamName(existingTeamName || "");
    }, [existingMembers, existingFile, existingUrl, existingTeamName, open]);

    if (!event) return null;

    const addMember = () => {
        if (members.length < event.teamSizeMax) {
            setMembers([...members, { name: "", email: "", phone: "", college: "" }]);
        }
    };

    const updateMember = (index: number, field: keyof TeamMember, value: string) => {
        const updated = [...members];
        updated[index] = { ...updated[index], [field]: value };
        setMembers(updated);
    };

    const removeMember = (index: number) => {
        setMembers(members.filter((_, i) => i !== index));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!validTypes.includes(file.type)) {
                toast.error("Invalid file type. Please upload a PDF or DOCX file.");
                return;
            }
            setAbstractFile(file);
        }
    };

    const handleSubmit = async () => {
        if (members.length < event.teamSizeMin) {
            toast.error(`Minimum ${event.teamSizeMin} team members required`);
            return;
        }

        const hasIncompleteMember = members.some((member) => (
            !member.name.trim() ||
            !member.email.trim() ||
            !member.phone.trim() ||
            !member.college.trim()
        ));

        if (hasIncompleteMember) {
            toast.error("Please fill all details for each team member before saving.");
            return;
        }

        if (event.id === "paperpresentation" && !abstractFile && !abstractUrl) {
            toast.error("Please upload your abstract file.");
            return;
        }

        let finalUrl = abstractUrl;

        if (event.id === "paperpresentation" && abstractFile && !finalUrl) {
            setUploading(true);
            try {
                const base64 = await toBase64(abstractFile);

                // Use API proxy
                const response = await fetch('/api/upload', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        base64: base64.split(',')[1],
                        fileType: 'abstract',
                        type: abstractFile.type,
                        name: `${event.id}_Abstract_${Date.now()}_${abstractFile.name}`,
                    })
                });

                const data = await response.json().catch(() => ({}));

                if (!response.ok) {
                    throw new Error(data.error || data.message || "Upload failed");
                }
                finalUrl = data.url || data.fileUrl; // Adjusted based on API response structure

                if (!finalUrl) {
                    throw new Error("No URL returned from upload service");
                }

                setAbstractUrl(finalUrl);
                toast.success("Abstract uploaded successfully!");

            } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
                console.error("Abstract upload error:", error);
                toast.error(error.message || "Failed to upload abstract. Please try again.");
                setUploading(false);
                return; // Stop submission on upload failure
            }
            setUploading(false);
        }

        if (needsTeamName && !teamName.trim()) {
            toast.error("Please enter a Team Name.");
            return;
        }

        onSubmit(members, abstractFile, finalUrl, teamName);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-black/90 border-white/10 max-w-lg max-h-[90vh] overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="text-white">Team Members - {event.name}</DialogTitle>
                    <DialogDescription className="text-white/60">
                        Add {event.teamSizeMin}-{event.teamSizeMax} team members
                    </DialogDescription>
                </DialogHeader>

                <DialogBody className="overflow-y-auto max-h-[50vh]">
                    <div className="space-y-4">
                        {needsTeamName && (
                            <div className="p-4 rounded-lg bg-white/5 border border-white/5">
                                <Label className="text-white/60 text-xs mb-2 block">Team Name</Label>
                                <Input
                                    value={teamName}
                                    onChange={(e) => setTeamName(e.target.value)}
                                    className="bg-white/5 border-white/10 text-white text-sm"
                                    placeholder="Enter your team name"
                                />
                            </div>
                        )}
                        {members.map((member, index) => (
                            <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/5">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-white/80 text-sm font-medium">Member {index + 1}</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeMember(index)}
                                        className="text-red-400 hover:text-red-300 h-6 w-6 p-0"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label className="text-white/60 text-xs">Name</Label>
                                        <Input
                                            value={member.name}
                                            onChange={(e) => updateMember(index, "name", e.target.value)}
                                            className="bg-white/5 border-white/10 text-white text-sm h-8"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-white/60 text-xs">Email</Label>
                                        <Input
                                            type="email"
                                            value={member.email}
                                            onChange={(e) => updateMember(index, "email", e.target.value)}
                                            className="bg-white/5 border-white/10 text-white text-sm h-8"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-white/60 text-xs">Phone</Label>
                                        <Input
                                            value={member.phone}
                                            onChange={(e) => updateMember(index, "phone", e.target.value)}
                                            className="bg-white/5 border-white/10 text-white text-sm h-8"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-white/60 text-xs">College</Label>
                                        <Input
                                            value={member.college}
                                            onChange={(e) => updateMember(index, "college", e.target.value)}
                                            className="bg-white/5 border-white/10 text-white text-sm h-8"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {members.length < event.teamSizeMax && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={addMember}
                            className="mt-4 w-full border-dashed border-white/10 text-white/60"
                        >
                            + Add Member
                        </Button>
                    )}

                    {event.id === "paperpresentation" && (
                        <div className="mt-6 p-4 rounded-lg bg-white/5 border border-white/10">
                            <Label className="text-white/80 text-sm font-medium block mb-2">Upload Abstract (PDF/DOCX)</Label>
                            {abstractFile ? (
                                <div className="flex items-center justify-between p-2 bg-white/10 rounded border border-white/20">
                                    <span className="text-white text-sm truncate max-w-[200px]">{abstractFile.name}</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setAbstractFile(undefined)}
                                        className="text-red-400 hover:text-red-300 h-6 w-6 p-0"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ) : (
                                <Input
                                    type="file"
                                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                    onChange={handleFileChange}
                                    className="bg-white/5 border-white/10 text-white text-sm file:bg-white/10 file:text-white file:border-0 file:rounded-md file:px-2 file:py-1 file:mr-3 file:text-xs hover:file:bg-white/20"
                                />
                            )}
                        </div>
                    )}
                </DialogBody>

                <DialogFooter className="bg-white/5">
                    <Button variant="outline" onClick={onClose} className="border-white/10 text-white/70">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={uploading}
                        className="bg-[#4c1d95] text-white hover:bg-[#5b21b6]"
                    >
                        {uploading ? "Uploading..." : "Save Team"}
                    </Button>

                </DialogFooter>
            </DialogContent>
        </Dialog >
    );
}

// Validation Error Dialog
function ValidationErrorDialog({ error, onClose }: { error: ValidationResult | null, onClose: () => void }) {
    if (!error) return null;

    return (
        <Dialog open={!!error} onOpenChange={onClose}>
            <DialogContent className="bg-black/90 border-red-500/50 max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-red-400 flex items-center gap-2">
                        <XCircle className="w-5 h-5" />
                        Registration Limit Exceeded
                    </DialogTitle>
                    <DialogDescription className="text-white/80 mt-2">
                        Only 5 unique team members can register at a time. You have {error.uniqueCount} unique members.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 my-4">
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <h4 className="text-green-400 text-sm font-medium mb-2">Accepted Members (First 5)</h4>
                        <ul className="list-disc list-inside text-white/70 text-sm space-y-1">
                            {error.acceptedEmails.map(email => (
                                <li key={email}>{email}</li>
                            ))}
                        </ul>
                    </div>

                    {error.rejectedEmails.length > 0 && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <h4 className="text-red-400 text-sm font-medium mb-2">Rejected Members (Exceeds Limit)</h4>
                            <ul className="list-disc list-inside text-white/70 text-sm space-y-1">
                                {error.rejectedEmails.map(email => (
                                    <li key={email}>{email}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button onClick={onClose} variant="secondary" className="bg-white/10 hover:bg-white/20 text-white">
                        Review & Edit Team
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

