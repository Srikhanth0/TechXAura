"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth, db } from "@/lib/firebase";
import {
    onAuthStateChanged,
    User,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut as firebaseSignOut
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

interface UserProfile {
    id: string;
    email: string;
    name: string;
    phone: string;
    college: string;
    department: string;
    rulesAccepted: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createdAt: any; // Firestore Timestamp
}

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    signUp: (email: string, password: string, metadata: Omit<UserProfile, "id" | "email" | "rulesAccepted" | "createdAt">) => Promise<{ error: Error | null }>;
    signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
    signInWithGoogle: () => Promise<{ error: Error | null }>;
    signOut: () => Promise<void>;
    acceptRules: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    async function fetchProfile(userId: string) {
        try {
            const docRef = doc(db, "users", userId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setProfile(docSnap.data() as UserProfile);
            } else {
                console.log("No profile found for user:", userId);
                setProfile(null);
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                await fetchProfile(currentUser.uid);
            } else {
                setProfile(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);



    async function signUp(
        email: string,
        password: string,
        metadata: Omit<UserProfile, "id" | "email" | "rulesAccepted" | "createdAt">
    ) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Create user profile in Firestore
            const newProfile = {
                id: user.uid,
                email: user.email!,
                name: metadata.name,
                phone: metadata.phone,
                college: metadata.college,
                department: metadata.department,
                rulesAccepted: false,
                createdAt: serverTimestamp(),
            };

            await setDoc(doc(db, "users", user.uid), newProfile);
            setProfile(newProfile as unknown as UserProfile); // optimistic update or refetch

            return { error: null };
        } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            return { error };
        }
    }

    async function signIn(email: string, password: string) {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return { error: null };
        } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            return { error };
        }
    }

    async function signInWithGoogle() {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Check if profile exists, if not create it
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                const newProfile = {
                    id: user.uid,
                    email: user.email!,
                    name: user.displayName || "Unknown",
                    phone: "",
                    college: "",
                    department: "",
                    rulesAccepted: false,
                    createdAt: serverTimestamp(),
                };
                await setDoc(docRef, newProfile);
                setProfile(newProfile as unknown as UserProfile);
            } else {
                setProfile(docSnap.data() as UserProfile);
            }

            return { error: null };
        } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            return { error };
        }
    }

    async function signOut() {
        await firebaseSignOut(auth);
        setUser(null);
        setProfile(null);
    }

    async function acceptRules() {
        if (!user) return;

        try {
            const docRef = doc(db, "users", user.uid);
            await setDoc(docRef, { rulesAccepted: true }, { merge: true });
            setProfile(prev => prev ? { ...prev, rulesAccepted: true } : null);
        } catch (error) {
            console.error("Error accepting rules:", error);
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            profile,
            loading,
            signUp,
            signIn,
            signInWithGoogle,
            signOut,
            acceptRules,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
