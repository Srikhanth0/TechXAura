import type { Metadata } from "next";
import { Inter, Nova_Square, Orbitron, Audiowide } from "next/font/google"; // Import Audiowide
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const novaSquare = Nova_Square({
  variable: "--font-nova",
  weight: "400",
  subsets: ["latin"],
});

// Configure Orbitron
const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

// Configure Audiowide
const audiowide = Audiowide({
  weight: "400",
  variable: "--font-audiowide",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TECHXAURA 2K26 | Technical Symposium",
  description: "The premier technical symposium - Register now for 12+ events, amazing prizes, and unforgettable experiences.",
  keywords: ["TECHXAURA", "symposium", "technical events", "college fest", "2026"],
  openGraph: {
    title: "TECHXAURA 2K26",
    description: "Ignite Your Tech Spirit - Technical Symposium of the Year",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Added 'h-full' to html to fix potential scroll bounce
    <html lang="en" className="dark overflow-x-hidden" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${novaSquare.variable} ${orbitron.variable} ${audiowide.variable} 
        font-sans antialiased bg-black text-white 
        overflow-x-hidden`}
      >
        <Providers>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "#1a1a1a",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.1)",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
