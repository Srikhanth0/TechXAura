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
import { ArrowLeft, Users, Trash2, Upload, Check, AlertCircle, XCircle } from "lucide-react";
import Link from "next/link";
// import Image from "next/image";
import toast from "react-hot-toast";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toBase64 } from "@/lib/utils";
import dynamic from "next/dynamic";

const IdCardScene = dynamic(() => import("@/components/IdCardScene"), { ssr: false });

type CheckoutStep = "review" | "payment" | "thankyou";

export default function CheckoutPage() {
    const { user, profile, loading: authLoading } = useAuth();
    const { items, removeFromCart, updateTeamMembers, clearCart, totalAmount, validateGlobalTeamLimit } = useCart();
    const router = useRouter();

    const [step, setStep] = React.useState<CheckoutStep>("review");
    const [teamModalOpen, setTeamModalOpen] = React.useState(false);
    const [selectedEventId, setSelectedEventId] = React.useState<string | null>(null);
    const [uploading, setUploading] = React.useState(false);
    const [paymentScreenshot, setPaymentScreenshot] = React.useState<string | null>(null);
    const [conflictError, setConflictError] = React.useState<string | null>(null);
    const [validationError, setValidationError] = React.useState<ValidationResult | null>(null);
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    React.useEffect(() => {
        if (isMounted && !authLoading && !user) {
            router.push("/auth");
        }
    }, [isMounted, authLoading, user, router]);

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

            console.log("Setting payment screenshot URL:", link);
            setPaymentScreenshot(link);
            toast.success("Screenshot uploaded successfully!");

        } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            console.error("Payment upload error:", error);
            toast.error(error.message || "Failed to upload screenshot. Please try again.");
        } finally {
            console.log("Upload process finished, resetting state.");
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
        if (!paymentScreenshot) {
            toast.error("Please upload payment screenshot");
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
                paymentScreenshot,
                paymentStatus: "pending",
                createdAt: serverTimestamp(),
            };

            await addDoc(collection(db, "registrations"), registrationData);

            clearCart();
            setStep("thankyou");
        } catch (error) {
            console.error("Registration error:", error);
            toast.error("Failed to submit registration");
        }
    };

    if (!user) return null;

    if (items.length === 0 && step !== "thankyou") {
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
                    ].map((s, i) => (
                        <React.Fragment key={s.key}>
                            <div className={`flex items-center gap-2 ${step === s.key ? "text-cyan-400" : s.key === "thankyou" && step === "thankyou" ? "text-green-400" : "text-white/40"}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === s.key ? "bg-cyan-500/20 border border-cyan-500" :
                                    (s.key === "review" && step !== "review") || (s.key === "payment" && step === "thankyou")
                                        ? "bg-green-500/20 border border-green-500 text-green-400"
                                        : "bg-white/5 border border-white/10"
                                    }`}>
                                    {((s.key === "review" && step !== "review") || (s.key === "payment" && step === "thankyou")) ? (
                                        <Check className="w-4 h-4" />
                                    ) : (
                                        i + 1
                                    )}
                                </div>
                                <span className="text-sm font-medium hidden sm:block">{s.label}</span>
                            </div>
                            {i < 2 && <div className="w-12 h-px bg-white/10 mx-2" />}
                        </React.Fragment>
                    ))}
                </div>

                {/* Step Content */}
                {step === "review" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <h2 className="text-2xl font-bold text-white mb-6">Review Your Cart</h2>

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
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                        <h2 className="text-2xl font-bold text-white mb-2">Complete Payment</h2>
                        <p className="text-white/60 mb-8">Scan the QR code or use UPI ID to pay</p>

                        {/* QR Code */}
                        <div className="inline-block p-6 bg-white rounded-2xl mb-6">
                            {/* Ensure QR code image is correct path */}
                            <img src="/payment_qr/Payment_Image.jpeg" alt="Payment QR Code" width={200} height={200} className="rounded-lg" />
                        </div>

                        <p className="text-white/60 text-sm mb-2">UPI ID</p>
                        <p className="text-cyan-400 font-mono text-lg mb-8">{upiId}</p>

                        {/* Upload Section */}
                        <div className="max-w-md mx-auto">
                            <p className="text-white/80 font-medium mb-4">Upload Payment Screenshot</p>

                            {paymentScreenshot ? (
                                <div className="relative mb-4">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={paymentScreenshot} alt="Payment" className="rounded-xl max-h-48 mx-auto" />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPaymentScreenshot(null)}
                                        className="mt-2 border-white/10 text-white/70"
                                    >
                                        Change Screenshot
                                    </Button>
                                </div>
                            ) : (
                                <label className="block cursor-pointer mb-6">
                                    <div className="p-8 border-2 border-dashed border-white/10 rounded-xl hover:border-cyan-500/50 transition-colors">
                                        <Upload className="w-8 h-8 text-white/40 mx-auto mb-2" />
                                        <p className="text-white/60 text-sm">Click to upload</p>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        disabled={uploading}
                                    />
                                </label>
                            )}

                            <Button
                                onClick={handleCompletePayment}
                                disabled={!paymentScreenshot || uploading}
                                className="w-full bg-[#4c1d95] text-white hover:bg-[#5b21b6] disabled:opacity-50"
                            >
                                {uploading ? "Uploading..." : "Complete Registration"}
                            </Button>
                        </div>
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
                        <Link href="/">
                            <Button className="bg-[#4c1d95] text-white hover:bg-[#5b21b6]">
                                Back to Home
                            </Button>
                        </Link>
                    </motion.div>
                )}
            </main>

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

