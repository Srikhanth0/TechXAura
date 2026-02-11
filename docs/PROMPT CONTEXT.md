This is a comprehensive **Master UI System Documentation** for **Techxaura 2K26**.

You can copy the content below and save it as MASTER\_UI.md or paste it into Notion/Google Docs to share with your team. This unifies every component we have built (Energy Beam, Dock, Glare Cards, Auth, Inputs, Footer) into a single cohesive system.

---

# **📂 Techxaura 2K26 – Master UI Design System**

**Version:** 1.0.0

**Stack:** Next.js 14+, React, Tailwind CSS, Framer Motion, Shadcn UI

**Theme:** Dark Cybernetic (Black, Violet, Neon)

---

## **1\. 🛠️ Global Configuration**

Before using the components, ensure your environment is set up to support the animations and variables used across the system.

### **Dependencies**

Run this single command to install all required libraries for the Master UI:

Bash

npm install framer-motion clsx tailwind-merge lucide-react @tabler/icons-react react-dropzone @radix-ui/react-dialog @radix-ui/react-slot @radix-ui/react-label @radix-ui/react-icons class-variance-authority motion

### **Tailwind Config (tailwind.config.ts)**

Update your config to support the **Energy Beam** animations and **Glare Card** effects.

TypeScript

import type { Config } from "tailwindcss";

const config: Config \= {  
  darkMode: \["class"\],  
  content: \["./src/\*\*/\*.{ts,tsx}"\],  
  theme: {  
    extend: {  
      colors: {  
        background: "var(--background)",  
        foreground: "var(--foreground)",  
        primary: {  
          DEFAULT: "\#8b5cf6", // Techxaura Violet  
          foreground: "\#ffffff",  
        },  
        secondary: {  
          DEFAULT: "\#18181b", // Zinc 900  
          foreground: "\#fafafa",  
        },  
        card: {  
          DEFAULT: "rgba(24, 24, 27, 0.6)", // Glass effect  
          foreground: "\#ffffff",  
        },  
      },  
      animation: {  
        "accordion-down": "accordion-down 0.2s ease-out",  
        "accordion-up": "accordion-up 0.2s ease-out",  
      },  
    },  
  },  
  plugins: \[require("tailwindcss-animate")\],  
};  
export default config;

### **Global CSS (app/globals.css)**

Ensure the dark theme variables are set.

CSS

@tailwind base;  
@tailwind components;  
@tailwind utilities;

@layer base {  
  :root {  
    \--background: 0 0% 0%; /\* Pure Black \*/  
    \--foreground: 0 0% 100%;  
    \--card: 0 0% 3%;  
    \--card-foreground: 0 0% 100%;  
    \--popover: 0 0% 3%;  
    \--popover-foreground: 0 0% 100%;  
    \--primary: 263 70% 50%; /\* Violet \*/  
    \--primary-foreground: 210 40% 98%;  
    \--secondary: 240 3.7% 15.9%;  
    \--secondary-foreground: 0 0% 98%;  
    \--muted: 240 3.7% 15.9%;  
    \--muted-foreground: 240 5% 64.9%;  
    \--accent: 240 3.7% 15.9%;  
    \--accent-foreground: 0 0% 98%;  
    \--destructive: 0 62.8% 30.6%;  
    \--destructive-foreground: 0 0% 98%;  
    \--border: 240 3.7% 15.9%;  
    \--input: 240 3.7% 15.9%;  
    \--ring: 240 4.9% 83.9%;  
    \--radius: 0.75rem;  
  }  
}

---

## **2\. 🧱 Component Registry**

### **A. Layout & Atmosphere**

| Component | Path | Description |
| :---- | :---- | :---- |
| **Energy Beam** | components/ui/energy-beam.tsx | Background visualizer. Uses hue-rotate to achieve the purple branding. |
| **Site Footer** | components/ui/footer-section.tsx | Motion-animated footer with grid layout and social links. |
| **Limelight Nav** | components/ui/limelight-nav.tsx | The "Dock" style floating navigation bar with a spotlight effect. |

### **B. Cards & Display**

| Component | Path | Description |
| :---- | :---- | :---- |
| **Glare Card** | components/ui/glare-card.tsx | 3D tilt-effect cards for displaying Events (Hackathons, Workshops). |

### **C. Forms & Input**

| Component | Path | Description |
| :---- | :---- | :---- |
| **Auth Dialog** | components/ui/auth-dialog.tsx | Modal for Sign Up / Login. Handles toggling between modes. |
| **Password** | components/ui/password-input.tsx | Input with strength meter and show/hide toggle. |
| **File Upload** | components/ui/file-upload.tsx | Drag-and-drop zone with grid animations using framer-motion. |
| **Base Input** | components/ui/input.tsx | Standard shadcn input field. |
| **Base Button** | components/ui/button.tsx | Standard shadcn button variants. |

---

## **3\. 🚀 Implementation Guide (The "Master Page")**

Here is how to combine all components into a single **Landing Page** (app/page.tsx).

TypeScript

"use client";

import React from "react";  
import EnergyBeam from "@/components/ui/energy-beam";  
import { LimelightNav } from "@/components/ui/limelight-nav";  
import { GlareCard } from "@/components/ui/glare-card";  
import AuthDialog from "@/components/ui/auth-dialog";  
import { Footer } from "@/components/ui/footer-section";  
import { Home, Calendar, Trophy, User } from "lucide-react";

export default function MasterPage() {  
  return (  
    \<main className="relative w-full min-h-screen bg-black text-white selection:bg-purple-500/30"\>  
        
      {/\* 1\. Background Layer \*/}  
      \<div className="fixed inset-0 z-0 pointer-events-none"\>  
        {/\* hue-rotate-230 turns the yellow beam into Deep Violet \*/}  
        \<EnergyBeam className="opacity-60 filter hue-rotate-\[230deg\] saturate-150" /\>  
      \</div\>

      {/\* 2\. Hero Content Layer \*/}  
      \<div className="relative z-10 flex flex-col items-center justify-center min-h-\[80vh\] text-center px-4 space-y-8"\>  
        \<h1 className="text-6xl md:text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40"\>  
          TECHXAURA \<br /\> \<span className="text-purple-500"\>2K26\</span\>  
        \</h1\>  
        \<p className="max-w-xl text-lg text-zinc-400"\>  
          The ultimate convergence of AI, Engineering, and Innovation.  
          Join the symposium.  
        \</p\>  
          
        {/\* Auth Dialog Trigger \*/}  
        \<div className="pt-4"\>  
          \<AuthDialog /\>  
        \</div\>  
      \</div\>

      {/\* 3\. Events Section (Glare Cards) \*/}  
      \<section className="relative z-10 py-24 px-4 bg-black/50 backdrop-blur-sm border-t border-white/5"\>  
        \<h2 className="text-3xl font-bold text-center mb-16"\>Featured Events\</h2\>  
        \<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto place-items-center"\>  
            
          \<GlareCard className="flex flex-col items-start justify-end py-8 px-6 bg-zinc-900/50"\>  
            \<Trophy className="w-10 h-10 text-yellow-500 mb-4" /\>  
            \<h3 className="text-xl font-bold"\>Hackathon\</h3\>  
            \<p className="text-zinc-400 text-sm mt-2"\>24 Hours of coding warfare.\</p\>  
          \</GlareCard\>

          \<GlareCard className="flex flex-col items-start justify-end py-8 px-6 bg-zinc-900/50"\>  
            \<User className="w-10 h-10 text-purple-500 mb-4" /\>  
            \<h3 className="text-xl font-bold"\>Guest Lecture\</h3\>  
            \<p className="text-zinc-400 text-sm mt-2"\>AI Ethics with Industry Leaders.\</p\>  
          \</GlareCard\>

          \<GlareCard className="flex flex-col items-start justify-end py-8 px-6 bg-zinc-900/50"\>  
            \<Calendar className="w-10 h-10 text-pink-500 mb-4" /\>  
            \<h3 className="text-xl font-bold"\>Workshops\</h3\>  
            \<p className="text-zinc-400 text-sm mt-2"\>Hands-on GenAI training.\</p\>  
          \</GlareCard\>

        \</div\>  
      \</section\>

      {/\* 4\. Footer \*/}  
      \<div className="relative z-10"\>  
        \<Footer /\>  
      \</div\>

      {/\* 5\. Dock Navigation (Fixed Bottom) \*/}  
      \<div className="fixed bottom-8 left-1/2 \-translate-x-1/2 z-50"\>  
        \<LimelightNav   
          className="backdrop-blur-xl bg-black/40 border-white/10 shadow-2xl shadow-purple-900/20"  
          items={\[  
            { id: 'home', icon: \<Home /\>, label: 'Home' },  
            { id: 'events', icon: \<Calendar /\>, label: 'Events' },  
            { id: 'profile', icon: \<User /\>, label: 'Profile' },  
          \]}  
        /\>  
      \</div\>

    \</main\>  
  );  
}

---

## **4\. 📁 Directory Structure**

Ensure your file tree looks like this for the system to function correctly:

src/  
├── app/  
│   ├── globals.css          \# Global variables  
│   ├── layout.tsx  
│   └── page.tsx             \# Master Layout  
├── components/  
│   └── ui/  
│       ├── auth-dialog.tsx  \# Sign Up Modal  
│       ├── button.tsx  
│       ├── dialog.tsx  
│       ├── energy-beam.tsx  
│       ├── file-upload.tsx  
│       ├── footer-section.tsx  
│       ├── glare-card.tsx  
│       ├── input.tsx  
│       ├── label.tsx  
│       ├── limelight-nav.tsx  
│       └── password-input.tsx  
└── lib/  
    └── utils.ts             \# CN helper

---

**End of Documentation**

Here is a comprehensive prompt you can use to instruct an AI agent (like Cursor, Windsurf, or a generic LLM) to execute this task.

---

### **Prompt for AI Agent**

**Role:** Senior Frontend Engineer & UI/UX Designer

**Stack:** React, TypeScript, Tailwind CSS (v4), shadcn/ui

**Goal:** Integrate a provided "Energy Beam" component and redesign a landing page animation to feature a **dark purple/violet aesthetic** instead of the default yellow/orange.

---

#### **1\. Project Setup & Structure**

* **Structure:** Ensure the project follows the standard shadcn/ui structure.  
* **Components:** All UI components must reside in /components/ui. If this folder does not exist, create it. This is crucial for maintaining the shadcn CLI pattern.  
* **Styling:** Use Tailwind CSS v4.  
* **Typography:** Use a clean sans-serif font (Inter or Geist Sans) if not already configured.

**If the environment is not set up, provide the terminal commands to:**

1. Initialize shadcn (npx shadcn@latest init).  
2. Install Tailwind CSS (if missing).  
3. Install standard dependencies (lucide-react, clsx, tailwind-merge).

---

#### **2\. The Component (Integration Task)**

Copy the following code into /components/ui/energy-beam.tsx.

**Code Source:**

TypeScript

import React, { useEffect, useRef } from 'react';

interface EnergyBeamProps {  
    projectId?: string;  
    className?: string;  
}

declare global {  
    interface Window {  
        UnicornStudio?: any;  
    }  
}

const EnergyBeam: React.FC\<EnergyBeamProps\> \= ({  
    projectId \= "hRFfUymDGOHwtFe7evR2",  
    className \= ""  
}) \=\> {  
    const containerRef \= useRef\<HTMLDivElement\>(null);  
    const scriptLoadedRef \= useRef(false);

    useEffect(() \=\> {  
        const loadScript \= () \=\> {  
            if (scriptLoadedRef.current) return;

            const script \= document.createElement('script');  
            script.src \= 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.5.2/dist/unicornStudio.umd.js';  
            script.async \= true;

            script.onload \= () \=\> {  
                scriptLoadedRef.current \= true;  
                if (window.UnicornStudio && containerRef.current) {  
                    console.log('Unicorn Studio loaded, initializing project...');  
                    window.UnicornStudio.init();  
                }  
            };

            document.head.appendChild(script);

            return () \=\> {  
                if (script.parentNode) {  
                    script.parentNode.removeChild(script);  
                }  
            };  
        };

        loadScript();  
    }, \[projectId\]);

    return (  
        \<div className={\`relative w-full h-screen bg-black overflow-hidden ${className}\`}\>  
            \<div  
                ref={containerRef}  
                data-us-project={projectId}  
                className="w-full h-full"  
            /\>  
        \</div\>  
    );  
};

export default EnergyBeam;

---

#### **3\. Design Requirements (The Purple Shift)**

The default projectId renders a yellow/orange beam. Since we cannot edit the external WebGL source, you must **hack the visuals using CSS filters** to achieve the "Dark Purple" look.

* **Action:** Apply a CSS filter or mix-blend-mode to the EnergyBeam container to shift the hue.  
* **Target:** A deep, cybernetic purple/violet (\#4c1d95 to \#581c87 range).  
* **Technique:** Use hue-rotate() and saturate().  
  * *Hint:* Yellow is \~60deg. Purple is \~270deg. Try hue-rotate(210deg) or hue-rotate(220deg).  
* **Surroundings:** The landing page background should be pure black (\#000000) or very dark violet to blend with the beam.

---

#### **4\. Styles Configuration**

Update or extend the Tailwind CSS configuration (CSS file) with the following. Use @theme inline if using Tailwind v4.

CSS

@import "tailwindcss";  
@import "tw-animate-css";

@theme inline {  
  \--color-background: var(--bg-dark);  
  \--color-foreground: \#ffffff;  
  /\* Add purple accents \*/  
  \--color-primary: \#8b5cf6;   
  \--color-primary-foreground: \#ffffff;  
}

:root {  
  \--bg-dark: \#000000;  
}

---

#### **5\. Implementation Steps**

Please execute the following plan:

1. **Analyze Dependencies:** Check package.json. If lucide-react or clsx are missing, list the install commands.  
2. **Scaffold Components:**  
   * Create /components/ui/energy-beam.tsx with the code above.  
   * Create a Landing Page wrapper (e.g., app/page.tsx or demo.tsx) that uses the component.  
3. **Apply the Purple Filter:**  
   * In the Demo or Page component, wrap \<EnergyBeam /\> or pass a className that applies the hue rotation.  
   * Example: className="filter hue-rotate-\[220deg\] saturate-150"  
4. **Add Content:**  
   * Overlay a Hero Section on top of the beam using absolute positioning.  
   * Add a Headline: "Powering the Next Generation".  
   * Add a Call to Action button (shadcn Button component) with a purple variant.  
   * Use a transparent/glassmorphism effect for the text container so the beam is visible behind it.  
5. **Review:** Ensure the "Unicorn Studio" script loads correctly and the color is visibly purple, not yellow.

---

**Output:** Provide the full code for the modified demo.tsx (or page.tsx) and the final energy-beam.tsx with the color adjustments applied.

Here is the prompt you can use to instruct an AI agent to integrate this component specifically as a "Dock" style navigation.

---

### **Prompt for AI Agent**

**Role:** Senior Frontend Engineer

**Stack:** React, TypeScript, Tailwind CSS (v4 or v3), shadcn/ui

**Goal:** Integrate the LimelightNav component into the project, ensuring it follows the shadcn design system, and configure it to function as a floating "Dock" at the bottom of the screen.

---

#### **1\. Project Structure & Prerequisites**

* **Standard:** Ensure the project uses the standard shadcn structure (/components/ui, /lib/utils).  
* **Path:** The component must be saved at /components/ui/limelight-nav.tsx.  
* **Dependencies:**  
  * Check if lucide-react is installed. If not, provide the install command.  
  * Ensure Tailwind CSS variables (\--primary, \--card, \--foreground) are defined in the global CSS.

**If the environment is missing these tools, provide commands to:**

1. Initialize shadcn (if needed): npx shadcn@latest init  
2. Install Lucide: npm install lucide-react

---

#### **2\. Component Integration (Source Code)**

Copy the following code into /components/ui/limelight-nav.tsx.

**Code Source:**

TypeScript

import React, { useState, useRef, useLayoutEffect, cloneElement } from 'react';

// \--- Internal Types and Defaults \---

const DefaultHomeIcon \= (props: React.SVGProps\<SVGSVGElement\>) \=\> \<svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"\>\<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /\>\</svg\>;  
const DefaultCompassIcon \= (props: React.SVGProps\<SVGSVGElement\>) \=\> \<svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"\>\<circle cx="12" cy="12" r="10" /\>\<path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" /\>\</svg\>;  
const DefaultBellIcon \= (props: React.SVGProps\<SVGSVGElement\>) \=\> \<svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"\>\<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /\>\<path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /\>\</svg\>;

export type NavItem \= {  
  id: string | number;  
  icon: React.ReactElement;  
  label?: string;  
  onClick?: () \=\> void;  
};

const defaultNavItems: NavItem\[\] \= \[  
  { id: 'default-home', icon: \<DefaultHomeIcon /\>, label: 'Home' },  
  { id: 'default-explore', icon: \<DefaultCompassIcon /\>, label: 'Explore' },  
  { id: 'default-notifications', icon: \<DefaultBellIcon /\>, label: 'Notifications' },  
\];

type LimelightNavProps \= {  
  items?: NavItem\[\];  
  defaultActiveIndex?: number;  
  onTabChange?: (index: number) \=\> void;  
  className?: string;  
  limelightClassName?: string;  
  iconContainerClassName?: string;  
  iconClassName?: string;  
};

export const LimelightNav \= ({  
  items \= defaultNavItems,  
  defaultActiveIndex \= 0,  
  onTabChange,  
  className,  
  limelightClassName,  
  iconContainerClassName,  
  iconClassName,  
}: LimelightNavProps) \=\> {  
  const \[activeIndex, setActiveIndex\] \= useState(defaultActiveIndex);  
  const \[isReady, setIsReady\] \= useState(false);  
  const navItemRefs \= useRef\<(HTMLAnchorElement | null)\[\]\>(\[\]);  
  const limelightRef \= useRef\<HTMLDivElement | null\>(null);

  useLayoutEffect(() \=\> {  
    if (items.length \=== 0\) return;

    const limelight \= limelightRef.current;  
    const activeItem \= navItemRefs.current\[activeIndex\];  
      
    if (limelight && activeItem) {  
      const newLeft \= activeItem.offsetLeft \+ activeItem.offsetWidth / 2 \- limelight.offsetWidth / 2;  
      limelight.style.left \= \`${newLeft}px\`;

      if (\!isReady) {  
        setTimeout(() \=\> setIsReady(true), 50);  
      }  
    }  
  }, \[activeIndex, isReady, items\]);

  if (items.length \=== 0\) return null; 

  const handleItemClick \= (index: number, itemOnClick?: () \=\> void) \=\> {  
    setActiveIndex(index);  
    onTabChange?.(index);  
    itemOnClick?.();  
  };

  return (  
    \<nav className={\`relative inline-flex items-center h-16 rounded-lg bg-card text-foreground border px-2 ${className}\`}\>  
      {items.map(({ id, icon, label, onClick }, index) \=\> (  
          \<a  
            key={id}  
            ref={el \=\> { navItemRefs.current\[index\] \= el }}  
            className={\`relative z-20 flex h-full cursor-pointer items-center justify-center p-5 ${iconContainerClassName}\`}  
            onClick={() \=\> handleItemClick(index, onClick)}  
            aria-label={label}  
          \>  
            {cloneElement(icon, {  
              className: \`w-6 h-6 transition-opacity duration-100 ease-in-out ${  
                activeIndex \=== index ? 'opacity-100' : 'opacity-40'  
              } ${icon.props.className || ''} ${iconClassName || ''}\`,  
            })}  
          \</a\>  
      ))}

      \<div   
        ref={limelightRef}  
        className={\`absolute top-0 z-10 w-11 h-\[5px\] rounded-full bg-primary shadow-\[0\_50px\_15px\_var(--primary)\] ${  
          isReady ? 'transition-\[left\] duration-400 ease-in-out' : ''  
        } ${limelightClassName}\`}  
        style={{ left: '-999px' }}  
      \>  
        \<div className="absolute left-\[-30%\] top-\[5px\] w-\[160%\] h-14 \[clip-path:polygon(5%\_100%,25%\_0,75%\_0,95%\_100%)\] bg-gradient-to-b from-primary/30 to-transparent pointer-events-none" /\>  
      \</div\>  
    \</nav\>  
  );  
};

---

#### **3\. Implementation & Styling (The "Dock" Effect)**

Create a demo page (e.g., app/page.tsx or components/demo/dock-demo.tsx) that implements the navigation as a **floating bottom dock**.

**Requirements:**

1. **Positioning:** Place the LimelightNav fixed at the bottom center of the screen (fixed bottom-8 left-1/2 \-translate-x-1/2).  
2. **Visuals:**  
   * Add a subtle blur backdrop: backdrop-blur-md.  
   * Add a shadow to lift it off the page: shadow-2xl.  
   * Use bg-background/80 or bg-card/80 for a glassmorphism look.  
3. **Icons:** Import Home, Search, Bell, User, and Settings from lucide-react to use as props.  
4. **Theme:** Ensure the "Limelight" (the glow effect) uses the primary color defined in global.css (likely the project's accent color).

---

#### **4\. Execution Plan**

1. **Check:** Verify lucide-react is installed.  
2. **Create:** /components/ui/limelight-nav.tsx with the code provided.  
3. **Implement:** Create the dock demo component.  
4. **Verify:** Ensure the "spotlight" moves smoothly when tabs are clicked and aligns correctly over the icons.

**Output:** Provide the code for the LimelightNav component and the DockDemo usage example.

It looks like you might have forgotten to paste the specific code for the footer component\!

However, since you are building a cohesive site with the **Energy Beam** (Dark/Purple) and the **Limelight Dock**, I have drafted a prompt that will instruct an AI agent to build a **modern, matching Footer** from scratch. This footer will fit perfectly with the "Symposium/Event" vibe you mentioned earlier.

---

### **Prompt for AI Agent**

**Role:** Senior Frontend Engineer & UI/UX Designer

**Stack:** React, TypeScript, Tailwind CSS, shadcn/ui

**Goal:** Create a modern, responsive **Footer** component (/components/ui/site-footer.tsx) that matches the site's "Dark Cybernetic" aesthetic (Black background with Purple accents).

---

#### **1\. Design Requirements**

* **Visual Style:**  
  * Background: Pure Black (bg-black) or very dark zinc (bg-zinc-950) to match the Energy Beam.  
  * Borders: Subtle top border (border-t border-white/10).  
  * Typography: Clean sans-serif (Inter/Geist). Muted text colors (text-zinc-400) for links, White for headers.  
  * **Accent:** On hover, links should glow or turn the primary purple color (hover:text-purple-400).  
* **Layout (Grid):**  
  * **Left Column:** Branding (Logo \+ Short description).  
  * **Middle Columns:** Navigation Links (Product, Company, Resources).  
  * **Right Column:** "Stay Updated" section with a Newsletter Input.

#### **2\. Components to Use**

* **Icons:** Use lucide-react for social icons (Twitter, GitHub, LinkedIn, Discord).  
* **UI Elements:**  
  * Use the shadcn/ui **Button** component for the "Subscribe" button (Variant: outline or ghost).  
  * Use the shadcn/ui **Input** component for the email field.

#### **3\. Implementation Details**

Create the file at /components/ui/site-footer.tsx with the following structure:

1. **Dependencies:** Import Input, Button from local shadcn components, and icons from lucide-react.  
2. **Responsiveness:** Stack columns vertically on mobile (flex-col), expand to a 4-column grid on desktop (md:grid-cols-4).  
3. **Code Snippet:**

TypeScript

import { Facebook, Twitter, Instagram, Linkedin, Send } from "lucide-react";  
import { Button } from "@/components/ui/button";  
import { Input } from "@/components/ui/input";

export function SiteFooter() {  
  return (  
    \<footer className="w-full bg-black border-t border-white/10 text-zinc-400 py-12"\>  
      \<div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8"\>  
          
        {/\* Brand Section \*/}  
        \<div className="space-y-4"\>  
          \<h2 className="text-2xl font-bold text-white tracking-tighter"\>  
            TECHXAURA \<span className="text-purple-500"\>2K26\</span\>  
          \</h2\>  
          \<p className="text-sm leading-relaxed max-w-xs"\>  
            Empowering the next generation of engineers with AI, creativity, and innovation. Join the movement.  
          \</p\>  
          \<div className="flex space-x-4"\>  
            \<SocialIcon icon={\<Twitter size={20} /\>} href="\#" /\>  
            \<SocialIcon icon={\<Linkedin size={20} /\>} href="\#" /\>  
            \<SocialIcon icon={\<Instagram size={20} /\>} href="\#" /\>  
          \</div\>  
        \</div\>

        {/\* Links Column 1 \*/}  
        \<div\>  
          \<h3 className="text-white font-semibold mb-4"\>Event\</h3\>  
          \<ul className="space-y-2 text-sm"\>  
            \<li\>\<FooterLink href="\#"\>Schedule\</FooterLink\>\</li\>  
            \<li\>\<FooterLink href="\#"\>Speakers\</FooterLink\>\</li\>  
            \<li\>\<FooterLink href="\#"\>Workshops\</FooterLink\>\</li\>  
            \<li\>\<FooterLink href="\#"\>Hackathon\</FooterLink\>\</li\>  
          \</ul\>  
        \</div\>

        {/\* Links Column 2 \*/}  
        \<div\>  
          \<h3 className="text-white font-semibold mb-4"\>Legal\</h3\>  
          \<ul className="space-y-2 text-sm"\>  
            \<li\>\<FooterLink href="\#"\>Code of Conduct\</FooterLink\>\</li\>  
            \<li\>\<FooterLink href="\#"\>Privacy Policy\</FooterLink\>\</li\>  
            \<li\>\<FooterLink href="\#"\>Terms of Service\</FooterLink\>\</li\>  
          \</ul\>  
        \</div\>

        {/\* Newsletter Section \*/}  
        \<div\>  
          \<h3 className="text-white font-semibold mb-4"\>Stay Updated\</h3\>  
          \<p className="text-xs mb-4"\>Get the latest updates on registration and events.\</p\>  
          \<div className="flex w-full max-w-sm items-center space-x-2"\>  
            \<Input   
              type="email"   
              placeholder="Enter email"   
              className="bg-zinc-900 border-zinc-800 focus:ring-purple-500"   
            /\>  
            \<Button size="icon" className="bg-purple-600 hover:bg-purple-700 text-white"\>  
              \<Send size={16} /\>  
            \</Button\>  
          \</div\>  
        \</div\>

      \</div\>  
        
      {/\* Copyright \*/}  
      \<div className="container mx-auto px-4 mt-12 pt-8 border-t border-white/5 text-center text-xs"\>  
        \&copy; 2026 Techxaura Symposium. All rights reserved.  
      \</div\>  
    \</footer\>  
  );  
}

// Helper Components for cleaner code  
const SocialIcon \= ({ icon, href }: { icon: React.ReactNode; href: string }) \=\> (  
  \<a href={href} className="hover:text-purple-500 transition-colors duration-200"\>  
    {icon}  
  \</a\>  
);

const FooterLink \= ({ href, children }: { href: string; children: React.ReactNode }) \=\> (  
  \<a href={href} className="hover:text-purple-400 transition-colors duration-200 block"\>  
    {children}  
  \</a\>  
);

#### **4\. Integration Instructions**

1. **Install shadcn components** if missing:  
   npx shadcn@latest add button input  
2. **Place the file:** Save as /components/ui/site-footer.tsx.  
3. **Usage:** Import \<SiteFooter /\> in your app/layout.tsx or app/page.tsx and place it at the bottom of the page structure.

Here is the prompt to instruct an AI agent to integrate the provided **Footer** component. This prompt ensures the footer fits perfectly into the shadcn architecture and works with the "Motion" library as requested.

---

### **Prompt for AI Agent**

**Role:** Senior Frontend Engineer

**Stack:** React, TypeScript, Tailwind CSS, shadcn/ui

**Goal:** Integrate the provided Footer component into the project. The footer uses the **Motion** library (not just Framer Motion) for animations and must follow the shadcn/ui directory structure.

---

#### **1\. Project Structure & Prerequisites**

* **Architecture:** The project must follow the shadcn/ui structure.  
* **Target Directory:** /components/ui.  
  * *Why this path?* This is the convention for reusable, atomic UI components in shadcn. Keeping components here ensures compatibility with the CLI and keeps the project organization predictable for other developers.  
* **Styles:** Ensure Tailwind CSS is configured.

**If the environment is missing these tools, provide commands to:**

1. Initialize shadcn: npx shadcn@latest init  
2. Install Tailwind CSS (if missing).

---

#### **2\. Component Integration (Source Code)**

Create the file at /components/ui/footer-section.tsx and paste the following code.

**Code Source:**

TypeScript

'use client';  
import React from 'react';  
import type { ComponentProps, ReactNode } from 'react';  
import { motion, useReducedMotion } from 'motion/react';  
import { FacebookIcon, FrameIcon, InstagramIcon, LinkedinIcon, YoutubeIcon } from 'lucide-react';

interface FooterLink {  
	title: string;  
	href: string;  
	icon?: React.ComponentType\<{ className?: string }\>;  
}

interface FooterSection {  
	label: string;  
	links: FooterLink\[\];  
}

const footerLinks: FooterSection\[\] \= \[  
	{  
		label: 'Product',  
		links: \[  
			{ title: 'Features', href: '\#features' },  
			{ title: 'Pricing', href: '\#pricing' },  
			{ title: 'Testimonials', href: '\#testimonials' },  
			{ title: 'Integration', href: '/' },  
		\],  
	},  
	{  
		label: 'Company',  
		links: \[  
			{ title: 'FAQs', href: '/faqs' },  
			{ title: 'About Us', href: '/about' },  
			{ title: 'Privacy Policy', href: '/privacy' },  
			{ title: 'Terms of Services', href: '/terms' },  
		\],  
	},  
	{  
		label: 'Resources',  
		links: \[  
			{ title: 'Blog', href: '/blog' },  
			{ title: 'Changelog', href: '/changelog' },  
			{ title: 'Brand', href: '/brand' },  
			{ title: 'Help', href: '/help' },  
		\],  
	},  
	{  
		label: 'Social Links',  
		links: \[  
			{ title: 'Facebook', href: '\#', icon: FacebookIcon },  
			{ title: 'Instagram', href: '\#', icon: InstagramIcon },  
			{ title: 'Youtube', href: '\#', icon: YoutubeIcon },  
			{ title: 'LinkedIn', href: '\#', icon: LinkedinIcon },  
		\],  
	},  
\];

export function Footer() {  
	return (  
		\<footer className="md:rounded-t-6xl relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center rounded-t-4xl border-t bg-\[radial-gradient(35%\_128px\_at\_50%\_0%,theme(backgroundColor.white/8%),transparent)\] px-6 py-12 lg:py-16"\>  
			\<div className="bg-foreground/20 absolute top-0 right-1/2 left-1/2 h-px w-1/3 \-translate-x-1/2 \-translate-y-1/2 rounded-full blur" /\>

			\<div className="grid w-full gap-8 xl:grid-cols-3 xl:gap-8"\>  
				\<AnimatedContainer className="space-y-4"\>  
					\<FrameIcon className="size-8" /\>  
					\<p className="text-muted-foreground mt-8 text-sm md:mt-0"\>  
						© {new Date().getFullYear()} Asme. All rights reserved.  
					\</p\>  
				\</AnimatedContainer\>

				\<div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4 xl:col-span-2 xl:mt-0"\>  
					{footerLinks.map((section, index) \=\> (  
						\<AnimatedContainer key={section.label} delay={0.1 \+ index \* 0.1}\>  
							\<div className="mb-10 md:mb-0"\>  
								\<h3 className="text-xs"\>{section.label}\</h3\>  
								\<ul className="text-muted-foreground mt-4 space-y-2 text-sm"\>  
									{section.links.map((link) \=\> (  
										\<li key={link.title}\>  
											\<a  
												href={link.href}  
												className="hover:text-foreground inline-flex items-center transition-all duration-300"  
											\>  
												{link.icon && \<link.icon className="me-1 size-4" /\>}  
												{link.title}  
											\</a\>  
										\</li\>  
									))}  
								\</ul\>  
							\</div\>  
						\</AnimatedContainer\>  
					))}  
				\</div\>  
			\</div\>  
		\</footer\>  
	);  
};

type ViewAnimationProps \= {  
	delay?: number;  
	className?: ComponentProps\<typeof motion.div\>\['className'\];  
	children: ReactNode;  
};

function AnimatedContainer({ className, delay \= 0.1, children }: ViewAnimationProps) {  
	const shouldReduceMotion \= useReducedMotion();

	if (shouldReduceMotion) {  
		return children;  
	}

	return (  
		\<motion.div  
			initial={{ filter: 'blur(4px)', translateY: \-8, opacity: 0 }}  
			whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}  
			viewport={{ once: true }}  
			transition={{ delay, duration: 0.8 }}  
			className={className}  
		\>  
			{children}  
		\</motion.div\>  
	);  
};

---

#### **3\. Implementation Requirements**

1. **Install Dependencies:**  
   * The code imports from motion/react. This requires the new **Motion** package, not the older framer-motion.  
   * **Command:** npm install motion lucide-react  
2. **Usage Demo:**  
   * Create a demo file (e.g., app/footer-demo/page.tsx or components/demo/footer-demo.tsx) to visualize the component.  
   * Copy the DemoOne code provided below into that file.

**Demo Code:**

TypeScript

import { Footer } from '@/components/ui/footer-section';

export default function DemoOne() {  
    return (  
        \<div className="relative flex min-h-svh flex-col bg-background text-foreground"\>  
            \<div className="min-h-screen flex items-center justify-center"\>  
                \<h1 className='font-mono text-2xl font-bold'\>Scroll Down\!\</h1\>  
            \</div\>  
            \<Footer /\>  
        \</div\>  
    );  
}

---

#### **4\. Guidelines for the Agent**

* **Check Imports:** Ensure motion/react is resolved correctly. If the project configuration struggles with the new Motion import, you may need to update tsconfig.json module resolution, but try the direct install first.  
* **Theming:** The footer uses bg-foreground/20 and theme(backgroundColor.white/8%). Ensure the global CSS defines these standard Tailwind/shadcn variables so the footer isn't invisible.  
* **Responsiveness:** Verify the grid behavior (grid-cols-2 on mobile \-\> md:grid-cols-4 \-\> xl:grid-cols-3) matches the layout requirements.

Here is the prompt to instruct an AI agent to integrate the **Glare Card** component, customized specifically to display **Symposium Events** matching your website's theme.

---

### **Prompt for AI Agent**

**Role:** Senior Frontend Engineer

**Stack:** React, TypeScript, Tailwind CSS, shadcn/ui

**Goal:** Integrate the GlareCard component into the project to create a premium **"Events Showcase"** section. The design should fit a dark, futuristic aesthetic.

---

#### **1\. Project Structure & Prerequisites**

* **Target Directory:** /components/ui/glare-card.tsx  
* **Dependencies:**  
  * Ensure clsx and tailwind-merge are installed (for the cn utility).  
  * Ensure /lib/utils.ts exists with the cn helper.  
* **Styling:** The component relies on CSS variables for 3D effects. Ensure tailwind.config.js does not strip generic CSS variables.

**If lib/utils.ts is missing, create it:**

TypeScript

import { type ClassValue, clsx } from "clsx"  
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue\[\]) {  
  return twMerge(clsx(inputs))  
}

---

#### **2\. Component Integration (Source Code)**

Create /components/ui/glare-card.tsx and paste the exact code below.

**Code Source:**

TypeScript

import { cn } from "@/lib/utils";  
import { useRef } from "react";

export const GlareCard \= ({  
  children,  
  className,  
}: {  
  children: React.ReactNode;  
  className?: string;  
}) \=\> {  
  const isPointerInside \= useRef(false);  
  const refElement \= useRef\<HTMLDivElement\>(null);  
  const state \= useRef({  
    glare: { x: 50, y: 50 },  
    background: { x: 50, y: 50 },  
    rotate: { x: 0, y: 0 },  
  });  
  const containerStyle \= {  
    "--m-x": "50%",  
    "--m-y": "50%",  
    "--r-x": "0deg",  
    "--r-y": "0deg",  
    "--bg-x": "50%",  
    "--bg-y": "50%",  
    "--duration": "300ms",  
    "--foil-size": "100%",  
    "--opacity": "0",  
    "--radius": "48px",  
    "--easing": "ease",  
    "--transition": "var(--duration) var(--easing)",  
  } as any;

  const backgroundStyle \= {  
    "--step": "5%",  
    "--foil-svg": \`url("data:image/svg+xml,%3Csvg width='26' height='26' viewBox='0 0 26 26' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2.99994 3.419C2.99994 3.419 21.6142 7.43646 22.7921 12.153C23.97 16.8695 3.41838 23.0306 3.41838 23.0306' stroke='white' stroke-width='5' stroke-miterlimit='3.86874' stroke-linecap='round' style='mix-blend-mode:darken'/%3E%3C/svg%3E")\`,  
    "--pattern": "var(--foil-svg) center/100% no-repeat",  
    "--rainbow": "repeating-linear-gradient( 0deg,rgb(255,119,115) calc(var(--step) \* 1),rgba(255,237,95,1) calc(var(--step) \* 2),rgba(168,255,95,1) calc(var(--step) \* 3),rgba(131,255,247,1) calc(var(--step) \* 4),rgba(120,148,255,1) calc(var(--step) \* 5),rgb(216,117,255) calc(var(--step) \* 6),rgb(255,119,115) calc(var(--step) \* 7\) ) 0% var(--bg-y)/200% 700% no-repeat",  
    "--diagonal": "repeating-linear-gradient( 128deg,\#0e152e 0%,hsl(180,10%,60%) 3.8%,hsl(180,10%,60%) 4.5%,hsl(180,10%,60%) 5.2%,\#0e152e 10%,\#0e152e 12% ) var(--bg-x) var(--bg-y)/300% no-repeat",  
    "--shade": "radial-gradient( farthest-corner circle at var(--m-x) var(--m-y),rgba(255,255,255,0.1) 12%,rgba(255,255,255,0.15) 20%,rgba(255,255,255,0.25) 120% ) var(--bg-x) var(--bg-y)/300% no-repeat",  
    backgroundBlendMode: "hue, hue, hue, overlay",  
  };

  const updateStyles \= () \=\> {  
    if (refElement.current) {  
      const { background, rotate, glare } \= state.current;  
      refElement.current?.style.setProperty("--m-x", \`${glare.x}%\`);  
      refElement.current?.style.setProperty("--m-y", \`${glare.y}%\`);  
      refElement.current?.style.setProperty("--r-x", \`${rotate.x}deg\`);  
      refElement.current?.style.setProperty("--r-y", \`${rotate.y}deg\`);  
      refElement.current?.style.setProperty("--bg-x", \`${background.x}%\`);  
      refElement.current?.style.setProperty("--bg-y", \`${background.y}%\`);  
    }  
  };

  return (  
    \<div  
      style={containerStyle}  
      className="relative isolate \[contain:layout\_style\] \[perspective:600px\] transition-transform duration-\[var(--duration)\] ease-\[var(--easing)\] delay-\[var(--delay)\] will-change-transform w-\[320px\] \[aspect-ratio:17/21\]"  
      ref={refElement}  
      onPointerMove={(event) \=\> {  
        const rotateFactor \= 0.4;  
        const rect \= event.currentTarget.getBoundingClientRect();  
        const position \= { x: event.clientX \- rect.left, y: event.clientY \- rect.top };  
        const percentage \= { x: (100 / rect.width) \* position.x, y: (100 / rect.height) \* position.y };  
        const delta \= { x: percentage.x \- 50, y: percentage.y \- 50 };

        const { background, rotate, glare } \= state.current;  
        background.x \= 50 \+ percentage.x / 4 \- 12.5;  
        background.y \= 50 \+ percentage.y / 3 \- 16.67;  
        rotate.x \= \-(delta.x / 3.5);  
        rotate.y \= delta.y / 2;  
        rotate.x \*= rotateFactor;  
        rotate.y \*= rotateFactor;  
        glare.x \= percentage.x;  
        glare.y \= percentage.y;

        updateStyles();  
      }}  
      onPointerEnter={() \=\> {  
        isPointerInside.current \= true;  
        if (refElement.current) {  
          setTimeout(() \=\> {  
            if (isPointerInside.current) refElement.current?.style.setProperty("--duration", "0s");  
          }, 300);  
        }  
      }}  
      onPointerLeave={() \=\> {  
        isPointerInside.current \= false;  
        if (refElement.current) {  
          refElement.current.style.removeProperty("--duration");  
          refElement.current?.style.setProperty("--r-x", \`0deg\`);  
          refElement.current?.style.setProperty("--r-y", \`0deg\`);  
        }  
      }}  
    \>  
      \<div className="h-full grid will-change-transform origin-center transition-transform duration-\[var(--duration)\] ease-\[var(--easing)\] delay-\[var(--delay)\] \[transform:rotateY(var(--r-x))\_rotateX(var(--r-y))\] rounded-\[var(--radius)\] border border-slate-800 hover:\[--opacity:0.6\] hover:\[--duration:200ms\] hover:\[--easing:linear\] hover:filter-none overflow-hidden"\>  
        \<div className="w-full h-full grid \[grid-area:1/1\] mix-blend-soft-light \[clip-path:inset(0\_0\_0\_0\_round\_var(--radius))\]"\>  
          \<div className={cn("h-full w-full bg-slate-950", className)}\>  
            {children}  
          \</div\>  
        \</div\>  
        \<div className="w-full h-full grid \[grid-area:1/1\] mix-blend-soft-light \[clip-path:inset(0\_0\_1px\_0\_round\_var(--radius))\] opacity-\[var(--opacity)\] transition-opacity transition-background duration-\[var(--duration)\] ease-\[var(--easing)\] delay-\[var(--delay)\] will-change-background \[background:radial-gradient(farthest-corner\_circle\_at\_var(--m-x)\_var(--m-y),\_rgba(255,255,255,0.8)\_10%,\_rgba(255,255,255,0.65)\_20%,\_rgba(255,255,255,0)\_90%)\]" /\>  
        \<div  
          className="w-full h-full grid \[grid-area:1/1\] mix-blend-color-dodge opacity-\[var(--opacity)\] will-change-background transition-opacity \[clip-path:inset(0\_0\_1px\_0\_round\_var(--radius))\] \[background-blend-mode:hue\_hue\_hue\_overlay\] \[background:var(--pattern),\_var(--rainbow),\_var(--diagonal),\_var(--shade)\] relative after:content-\[''\] after:grid-area-\[inherit\] after:bg-repeat-\[inherit\] after:bg-attachment-\[inherit\] after:bg-origin-\[inherit\] after:bg-clip-\[inherit\] after:bg-\[inherit\] after:mix-blend-exclusion after:\[background-size:var(--foil-size),\_200%\_400%,\_800%,\_200%\] after:\[background-position:center,\_0%\_var(--bg-y),\_calc(var(--bg-x)\*\_-1)\_calc(var(--bg-y)\*\_-1),\_var(--bg-x)\_var(--bg-y)\] after:\[background-blend-mode:soft-light,\_hue,\_hard-light\]"  
          style={{ ...backgroundStyle }}  
        /\>  
      \</div\>  
    \</div\>  
  );  
};

---

#### **3\. Implementation: Symposium Events Showcase**

Create a new component /components/events-section.tsx that uses GlareCard to display 3 distinct symposium events (e.g., Keynote, Hackathon, Workshop).

**Requirements for the Demo:**

* **Theme:** Use images related to Technology, AI, or Coding.  
* **Content:**  
  * **Card 1:** "AI Revolution" (Keynote).  
  * **Card 2:** "CodeWar 2026" (Hackathon).  
  * **Card 3:** "Generative Art" (Workshop).  
* **Layout:** Responsive Grid (grid-cols-1 md:grid-cols-3).

**Code to Implement:**

TypeScript

import { GlareCard } from "@/components/ui/glare-card";  
import { Calendar, Code, Cpu } from "lucide-react";

export function EventsSection() {  
  return (  
    \<section className="py-20 px-4"\>  
      \<h2 className="text-3xl font-bold text-center text-white mb-12 tracking-tight"\>  
        Featured \<span className="text-purple-500"\>Events\</span\>  
      \</h2\>  
      \<div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto place-items-center"\>  
          
        {/\* Event 1: AI Keynote \*/}  
        \<GlareCard className="flex flex-col items-center justify-center relative p-6"\>  
          \<div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" /\>  
          \<img   
            className="absolute inset-0 w-full h-full object-cover"  
            src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80\&w=3388\&auto=format\&fit=crop"  
            alt="AI Art"  
          /\>  
          \<div className="relative z-20 text-center"\>  
            \<Cpu className="w-12 h-12 text-purple-400 mx-auto mb-4" /\>  
            \<h3 className="text-2xl font-bold text-white"\>AI Revolution\</h3\>  
            \<p className="text-gray-300 mt-2 text-sm"\>Keynote • 10:00 AM\</p\>  
          \</div\>  
        \</GlareCard\>

        {/\* Event 2: Hackathon \*/}  
        \<GlareCard className="flex flex-col items-center justify-center relative p-6"\>  
           \<div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" /\>  
           \<img   
            className="absolute inset-0 w-full h-full object-cover"  
            src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80\&w=3540\&auto=format\&fit=crop"  
            alt="Coding"  
          /\>  
          \<div className="relative z-20 text-center"\>  
            \<Code className="w-12 h-12 text-blue-400 mx-auto mb-4" /\>  
            \<h3 className="text-2xl font-bold text-white"\>CodeWar 2026\</h3\>  
            \<p className="text-gray-300 mt-2 text-sm"\>Hackathon • 24 Hours\</p\>  
          \</div\>  
        \</GlareCard\>

        {/\* Event 3: Workshop \*/}  
        \<GlareCard className="flex flex-col items-start justify-end py-8 px-6 bg-zinc-900"\>  
          \<Calendar className="w-8 h-8 text-pink-500 mb-4" /\>  
          \<p className="font-bold text-white text-lg"\>Workshop: GenAI\</p\>  
          \<p className="font-normal text-base text-neutral-400 mt-2"\>  
            Learn to build your own agents using LLMs and vector databases.  
            \<br/\>\<span className="text-pink-500 text-sm mt-2 block"\>Limited Seats Available\</span\>  
          \</p\>  
        \</GlareCard\>

      \</div\>  
    \</section\>  
  );  
}

Here is the prompt to instruct an AI agent to integrate the **File Upload** component. This component uses framer-motion and react-dropzone, so the prompt ensures those specific libraries are set up correctly.

---

### **Prompt for AI Agent**

**Role:** Senior Frontend Engineer

**Stack:** React, TypeScript, Tailwind CSS, shadcn/ui

**Goal:** Integrate a modern, animated **File Upload** component into the project.

---

#### **1\. Project Structure & Prerequisites**

* **Target Directory:** /components/ui/file-upload.tsx  
* **Dependencies:**  
  * This component requires specific libraries. Run the following command immediately:  
    npm install framer-motion react-dropzone @tabler/icons-react  
  * Ensure /lib/utils.ts exists (standard shadcn cn helper).  
* **Styling:**  
  * The component uses generic Tailwind colors (neutral-700, sky-400). Ensure these match the project's theme or allow Tailwind to use its default palette.

---

#### **2\. Component Integration (Source Code)**

Create the file /components/ui/file-upload.tsx and paste the following code exactly.

**Code Source:**

TypeScript

import { cn } from "@/lib/utils";  
import React, { useRef, useState } from "react";  
import { motion } from "framer-motion";  
import { IconUpload } from "@tabler/icons-react";  
import { useDropzone } from "react-dropzone";

const mainVariant \= {  
  initial: { x: 0, y: 0 },  
  animate: { x: 20, y: \-20, opacity: 0.9 },  
};

const secondaryVariant \= {  
  initial: { opacity: 0 },  
  animate: { opacity: 1 },  
};

export const FileUpload \= ({  
  onChange,  
}: {  
  onChange?: (files: File\[\]) \=\> void;  
}) \=\> {  
  const \[files, setFiles\] \= useState\<File\[\]\>(\[\]);  
  const fileInputRef \= useRef\<HTMLInputElement\>(null);

  const handleFileChange \= (newFiles: File\[\]) \=\> {  
    setFiles((prevFiles) \=\> \[...prevFiles, ...newFiles\]);  
    onChange && onChange(newFiles);  
  };

  const handleClick \= () \=\> {  
    fileInputRef.current?.click();  
  };

  const { getRootProps, isDragActive } \= useDropzone({  
    multiple: false,  
    noClick: true,  
    onDrop: handleFileChange,  
    onDropRejected: (error) \=\> {  
      console.log(error);  
    },  
  });

  return (  
    \<div className="w-full" {...getRootProps()}\>  
      \<motion.div  
        onClick={handleClick}  
        whileHover="animate"  
        className="p-10 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden"  
      \>  
        \<input  
          ref={fileInputRef}  
          id="file-upload-handle"  
          type="file"  
          onChange={(e) \=\> handleFileChange(Array.from(e.target.files || \[\]))}  
          className="hidden"  
        /\>  
        \<div className="absolute inset-0 \[mask-image:radial-gradient(ellipse\_at\_center,white,transparent)\]"\>  
          \<GridPattern /\>  
        \</div\>  
        \<div className="flex flex-col items-center justify-center"\>  
          \<p className="relative z-20 font-sans font-bold text-neutral-700 dark:text-neutral-300 text-base"\>  
            Upload file  
          \</p\>  
          \<p className="relative z-20 font-sans font-normal text-neutral-400 dark:text-neutral-400 text-base mt-2"\>  
            Drag or drop your files here or click to upload  
          \</p\>  
          \<div className="relative w-full mt-10 max-w-xl mx-auto"\>  
            {files.length \> 0 &&  
              files.map((file, idx) \=\> (  
                \<motion.div  
                  key={"file" \+ idx}  
                  layoutId={idx \=== 0 ? "file-upload" : "file-upload-" \+ idx}  
                  className={cn(  
                    "relative overflow-hidden z-40 bg-white dark:bg-neutral-900 flex flex-col items-start justify-start md:h-24 p-4 mt-4 w-full mx-auto rounded-md",  
                    "shadow-sm"  
                  )}  
                \>  
                  \<div className="flex justify-between w-full items-center gap-4"\>  
                    \<motion.p  
                      initial={{ opacity: 0 }}  
                      animate={{ opacity: 1 }}  
                      layout  
                      className="text-base text-neutral-700 dark:text-neutral-300 truncate max-w-xs"  
                    \>  
                      {file.name}  
                    \</motion.p\>  
                    \<motion.p  
                      initial={{ opacity: 0 }}  
                      animate={{ opacity: 1 }}  
                      layout  
                      className="rounded-lg px-2 py-1 w-fit flex-shrink-0 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-white shadow-input"  
                    \>  
                      {(file.size / (1024 \* 1024)).toFixed(2)} MB  
                    \</motion.p\>  
                  \</div\>

                  \<div className="flex text-sm md:flex-row flex-col items-start md:items-center w-full mt-2 justify-between text-neutral-600 dark:text-neutral-400"\>  
                    \<motion.p  
                      initial={{ opacity: 0 }}  
                      animate={{ opacity: 1 }}  
                      layout  
                      className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 "  
                    \>  
                      {file.type}  
                    \</motion.p\>

                    \<motion.p  
                      initial={{ opacity: 0 }}  
                      animate={{ opacity: 1 }}  
                      layout  
                    \>  
                      modified{" "}  
                      {new Date(file.lastModified).toLocaleDateString()}  
                    \</motion.p\>  
                  \</div\>  
                \</motion.div\>  
              ))}  
            {\!files.length && (  
              \<motion.div  
                layoutId="file-upload"  
                variants={mainVariant}  
                transition={{  
                  type: "spring",  
                  stiffness: 300,  
                  damping: 20,  
                }}  
                className={cn(  
                  "relative group-hover/file:shadow-2xl z-40 bg-white dark:bg-neutral-900 flex items-center justify-center h-32 mt-4 w-full max-w-\[8rem\] mx-auto rounded-md",  
                  "shadow-\[0px\_10px\_50px\_rgba(0,0,0,0.1)\]"  
                )}  
              \>  
                {isDragActive ? (  
                  \<motion.p  
                    initial={{ opacity: 0 }}  
                    animate={{ opacity: 1 }}  
                    className="text-neutral-600 flex flex-col items-center"  
                  \>  
                    Drop it  
                    \<IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-400" /\>  
                  \</motion.p\>  
                ) : (  
                  \<IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-300" /\>  
                )}  
              \</motion.div\>  
            )}

            {\!files.length && (  
              \<motion.div  
                variants={secondaryVariant}  
                className="absolute opacity-0 border border-dashed border-sky-400 inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-\[8rem\] mx-auto rounded-md"  
              \>\</motion.div\>  
            )}  
          \</div\>  
        \</div\>  
      \</motion.div\>  
    \</div\>  
  );  
};

export function GridPattern() {  
  const columns \= 41;  
  const rows \= 11;  
  return (  
    \<div className="flex bg-gray-100 dark:bg-neutral-900 flex-shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px scale-105"\>  
      {Array.from({ length: rows }).map((\_, row) \=\>  
        Array.from({ length: columns }).map((\_, col) \=\> {  
          const index \= row \* columns \+ col;  
          return (  
            \<div  
              key={\`${col}-${row}\`}  
              className={\`w-10 h-10 flex flex-shrink-0 rounded-\[2px\] ${  
                index % 2 \=== 0  
                  ? "bg-gray-50 dark:bg-neutral-950"  
                  : "bg-gray-50 dark:bg-neutral-950 shadow-\[0px\_0px\_1px\_3px\_rgba(255,255,255,1)\_inset\] dark:shadow-\[0px\_0px\_1px\_3px\_rgba(0,0,0,1)\_inset\]"  
              }\`}  
            /\>  
          );  
        })  
      )}  
    \</div\>  
  );  
}

---

#### **3\. Implementation & Demo**

Create a usage example in a new file (e.g., /components/demo/file-upload-demo.tsx or /app/page.tsx).

**Demo Requirements:**

* Wrap the component in a container with a defined min-h-96 to give it space.  
* Log the uploaded files to the console in the handleFileUpload function.  
* Ensure the background contrast works (the demo uses bg-background and border-neutral-800).

**Demo Code:**

TypeScript

"use client";  
import React, { useState } from "react";  
import { FileUpload } from "@/components/ui/file-upload";

export function FileUploadDemo() {  
  const \[files, setFiles\] \= useState\<File\[\]\>(\[\]);  
  const handleFileUpload \= (files: File\[\]) \=\> {  
    setFiles(files);  
    console.log("Uploaded files:", files);  
  };

  return (  
    \<div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-black/20 border-neutral-800 rounded-lg p-8 flex items-center justify-center"\>  
      \<FileUpload onChange={handleFileUpload} /\>  
    \</div\>  
  );  
}

Here is the prompt to instruct an AI agent to integrate the **Password Input** component with strength validation logic.

---

### **Prompt for AI Agent**

**Role:** Senior Frontend Engineer

**Stack:** React, TypeScript, Tailwind CSS, shadcn/ui

**Goal:** Integrate a secure **Password Input** component that includes real-time strength validation and visibility toggling.

---

#### **1\. Project Structure & Prerequisites**

* **Target Directory:** /components/ui/password-input.tsx  
* **Dependencies:**  
  * Install the icon library: npm install lucide-react  
  * Ensure the project has shadcn/ui base styles (colors like bg-border, bg-background, text-muted-foreground must work).

---

#### **2\. Component Integration (Source Code)**

Create the file /components/ui/password-input.tsx and paste the following code.

**Code Source:**

TypeScript

'use client';  
import React, { useState, useMemo } from 'react';  
import { Check, Eye, EyeOff, X } from 'lucide-react';

// Constants  
const PASSWORD\_REQUIREMENTS \= \[  
  { regex: /.{8,}/, text: 'At least 8 characters' },  
  { regex: /\[0-9\]/, text: 'At least 1 number' },  
  { regex: /\[a-z\]/, text: 'At least 1 lowercase letter' },  
  { regex: /\[A-Z\]/, text: 'At least 1 uppercase letter' },  
  { regex: /\[\!-\\/:-@\[-\`{-\~\]/, text: 'At least 1 special characters' },  
\] as const;

type StrengthScore \= 0 | 1 | 2 | 3 | 4 | 5;

const STRENGTH\_CONFIG \= {  
  colors: {  
    0: 'bg-border',  
    1: 'bg-red-500',  
    2: 'bg-orange-500',  
    3: 'bg-amber-500',  
    4: 'bg-amber-700',  
    5: 'bg-emerald-500',  
  } satisfies Record\<StrengthScore, string\>,  
  texts: {  
    0: 'Enter a password',  
    1: 'Weak password',  
    2: 'Medium password\!',  
    3: 'Strong password\!\!',  
    4: 'Very Strong password\!\!\!',  
  } satisfies Record\<Exclude\<StrengthScore, 5\>, string\>,  
} as const;

// Types  
type Requirement \= {  
  met: boolean;  
  text: string;  
};

type PasswordStrength \= {  
  score: StrengthScore;  
  requirements: Requirement\[\];  
};

const PasswordInput \= () \=\> {  
  const \[password, setPassword\] \= useState('');  
  const \[isVisible, setIsVisible\] \= useState(false);

  const calculateStrength \= useMemo((): PasswordStrength \=\> {  
    const requirements \= PASSWORD\_REQUIREMENTS.map((req) \=\> ({  
      met: req.regex.test(password),  
      text: req.text,  
    }));

    return {  
      score: requirements.filter((req) \=\> req.met).length as StrengthScore,  
      requirements,  
    };  
  }, \[password\]);

  return (  
    \<div className='w-full max-w-sm mx-auto'\>  
      \<form className='space-y-2' onSubmit={(e) \=\> e.preventDefault()}\>  
        \<label htmlFor='password' className='block text-sm font-medium text-foreground'\>  
          Password  
        \</label\>  
        \<div className='relative'\>  
          \<input  
            id='password'  
            type={isVisible ? 'text' : 'password'}  
            value={password}  
            onChange={(e) \=\> setPassword(e.target.value)}  
            placeholder='Password'  
            aria-invalid={calculateStrength.score \< 4}  
            aria-describedby='password-strength'  
            className='w-full p-2 border rounded-md bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/50 transition-all'  
          /\>  
          \<button  
            type='button'  
            onClick={() \=\> setIsVisible((prev) \=\> \!prev)}  
            aria-label={isVisible ? 'Hide password' : 'Show password'}  
            className='absolute inset-y-0 right-0 flex items-center justify-center w-10 text-muted-foreground hover:text-foreground transition-colors'  
          \>  
            {isVisible ? \<EyeOff size={16} /\> : \<Eye size={16} /\>}  
          \</button\>  
        \</div\>  
      \</form\>

      {/\* Strength Bar \*/}  
      \<div  
        className='mt-3 mb-4 h-1.5 rounded-full bg-secondary overflow-hidden'  
        role='progressbar'  
        aria-valuenow={calculateStrength.score}  
        aria-valuemin={0}  
        aria-valuemax={5}  
      \>  
        \<div  
          className={\`h-full ${  
            STRENGTH\_CONFIG.colors\[calculateStrength.score\]  
          } transition-all duration-500 ease-out\`}  
          style={{ width: \`${(calculateStrength.score / 5\) \* 100}%\` }}  
        /\>  
      \</div\>

      {/\* Strength Label \*/}  
      \<p  
        id='password-strength'  
        className='mb-2 text-sm font-medium flex justify-between text-foreground'  
      \>  
        \<span className="text-muted-foreground"\>Strength:\</span\>  
        \<span\>  
          {  
            STRENGTH\_CONFIG.texts\[  
              Math.min(  
                calculateStrength.score,  
                4  
              ) as keyof typeof STRENGTH\_CONFIG.texts  
            \]  
          }  
        \</span\>  
      \</p\>

      {/\* Requirements List \*/}  
      \<ul className='space-y-1.5' aria-label='Password requirements'\>  
        {calculateStrength.requirements.map((req, index) \=\> (  
          \<li key={index} className='flex items-center space-x-2'\>  
            {req.met ? (  
              \<Check size={14} className='text-emerald-500' /\>  
            ) : (  
              \<X size={14} className='text-muted-foreground/50' /\>  
            )}  
            \<span  
              className={\`text-xs ${  
                req.met ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'  
              }\`}  
            \>  
              {req.text}  
            \</span\>  
          \</li\>  
        ))}  
      \</ul\>  
    \</div\>  
  );  
};

export default PasswordInput;

---

#### **3\. Usage Demo**

Create a demo file (e.g., /app/demo/password/page.tsx or /components/demo/password-demo.tsx) to visualize the component.

**Demo Requirements:**

* Center the component on the screen.  
* Use a background that contrasts well with the input field.

**Demo Code:**

TypeScript

import PasswordInput from '@/components/ui/password-input';

export default function PasswordDemo() {  
  return (  
    \<div className="flex min-h-\[500px\] w-full items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-8"\>  
      \<div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-sm"\>  
        \<h2 className="mb-6 text-lg font-semibold text-card-foreground"\>Create Account\</h2\>  
        \<PasswordInput /\>  
      \</div\>  
    \</div\>  
  );  
}

Here is the prompt to instruct an AI agent to integrate the **Auth Dialog** component, ensuring all dependencies (Input, Button, Dialog, Label) are correctly set up.

---

### **Prompt for AI Agent**

**Role:** Senior Frontend Engineer

**Stack:** React, TypeScript, Tailwind CSS, shadcn/ui

**Goal:** Integrate a reusable **Auth Dialog** (Sign Up / Login modal) component into the project.

---

#### **1\. Project Structure & Prerequisites**

* **Target Directory:** /components/ui/auth-dialog.tsx  
* **Dependencies:**  
  * Install the required libraries immediately:  
    npm install lucide-react @radix-ui/react-slot class-variance-authority @radix-ui/react-icons @radix-ui/react-dialog @radix-ui/react-label  
  * Ensure /lib/utils.ts exists (standard shadcn cn helper).

---

#### **2\. Component Integration (Source Code)**

You must create **five files** to make this work. Follow the order below.

**File 1: /components/ui/auth-dialog.tsx (The Main Component)**

TypeScript

"use client"

import { useState, useId } from "react"  
import { Button } from "@/components/ui/button"  
import {  
  Dialog,  
  DialogContent,  
  DialogHeader,  
  DialogTitle,  
  DialogDescription,  
  DialogTrigger,  
} from "@/components/ui/dialog"  
import { Input } from "@/components/ui/input"  
import { Label } from "@/components/ui/label"  
import { Eye, EyeOff } from "lucide-react"

export default function AuthDialog() {  
  const \[mode, setMode\] \= useState\<"signup" | "login"\>("signup")  
  const \[showPassword, setShowPassword\] \= useState(false)  
  const id \= useId()

  const toggleMode \= () \=\> setMode(mode \=== "signup" ? "login" : "signup")  
  const togglePassword \= () \=\> setShowPassword(\!showPassword)

  return (  
    \<Dialog\>  
      \<DialogTrigger asChild\>  
        \<Button variant="outline" className="rounded-lg"\>Sign up / Login\</Button\>  
      \</DialogTrigger\>  
      \<DialogContent className="sm:max-w-md \!rounded-2xl"\>  
        \<div className="flex flex-col items-center gap-2"\>  
          \<DialogHeader\>  
            \<DialogTitle className="sm:text-center"\>  
              {mode \=== "signup" ? "Sign Up" : "Login"}  
            \</DialogTitle\>  
            \<DialogDescription className="sm:text-center"\>  
              {mode \=== "signup"  
                ? "We just need a few details to get you started."  
                : "Enter your credentials to log in."}  
            \</DialogDescription\>  
          \</DialogHeader\>  
        \</div\>

        \<form className="space-y-4"\>  
          {mode \=== "signup" && (  
            \<div className="space-y-4"\>  
              \<div className="\*:not-first:mt-2"\>  
                \<Label htmlFor={\`${id}-name\`}\>Full name\</Label\>  
                \<Input  
                  id={\`${id}-name\`}  
                  placeholder="Matt Welsh"  
                  type="text"  
                  required  
                  className="rounded-lg"  
                /\>  
              \</div\>  
            \</div\>  
          )}

          \<div className="space-y-4"\>  
            \<div className="\*:not-first:mt-2"\>  
              \<Label htmlFor={\`${id}-email\`}\>Email\</Label\>  
              \<Input  
                id={\`${id}-email\`}  
                placeholder="hi@yourcompany.com"  
                type="email"  
                required  
                className="rounded-lg"  
              /\>  
            \</div\>  
            \<div className="relative"\>  
              \<Label htmlFor={\`${id}-password\`}\>Password\</Label\>  
              \<Input  
                id={\`${id}-password\`}  
                placeholder="Enter your password"  
                type={showPassword ? "text" : "password"}  
                required  
                className="rounded-lg pr-10"  
              /\>  
              \<button  
                type="button"  
                onClick={togglePassword}  
                className="absolute right-3 top-\[38px\] text-muted-foreground"  
              \>  
                {showPassword ? \<EyeOff size={18} /\> : \<Eye size={18} /\>}  
              \</button\>  
            \</div\>  
          \</div\>

          \<Button type="button" className="w-full rounded-lg"\>  
            {mode \=== "signup" ? "Sign Up" : "Login"}  
          \</Button\>  
        \</form\>

        \<div className="mt-2 text-center text-sm text-muted-foreground"\>  
          {mode \=== "signup" ? (  
            \<\>  
              Already have an account?{" "}  
              \<button className="underline" onClick={toggleMode}\>  
                Login  
              \</button\>  
            \</\>  
          ) : (  
            \<\>  
              Don't have an account?{" "}  
              \<button className="underline" onClick={toggleMode}\>  
                Sign Up  
              \</button\>  
            \</\>  
          )}  
        \</div\>

        {mode \=== "signup" && (  
          \<\>  
            \<div className="before:bg-border after:bg-border flex items-center gap-3 before:h-px before:flex-1 after:h-px after:flex-1 my-4"\>  
              \<span className="text-muted-foreground text-xs"\>Or\</span\>  
            \</div\>  
            \<Button variant="outline" className="w-full rounded-lg"\>  
              Continue with Google  
            \</Button\>  
            \<p className="text-muted-foreground text-center text-xs mt-2"\>  
              By signing up you agree to our{" "}  
              \<a className="underline hover:no-underline" href="\#"\>  
                Terms  
              \</a\>  
              .  
            \</p\>  
          \</\>  
        )}  
      \</DialogContent\>  
    \</Dialog\>  
  )  
}

**File 2: /components/ui/input.tsx**

TypeScript

import { cn } from "@/lib/utils";  
import \* as React from "react";

const Input \= React.forwardRef\<HTMLInputElement, React.ComponentProps\<"input"\>\>(  
  ({ className, type, ...props }, ref) \=\> {  
    return (  
      \<input  
        type={type}  
        className={cn(  
          "flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm shadow-black/5 transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-\[3px\] focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50",  
          type \=== "search" &&  
            "\[&::-webkit-search-cancel-button\]:appearance-none \[&::-webkit-search-decoration\]:appearance-none \[&::-webkit-search-results-button\]:appearance-none \[&::-webkit-search-results-decoration\]:appearance-none",  
          type \=== "file" &&  
            "p-0 pr-3 italic text-muted-foreground/70 file:me-3 file:h-full file:border-0 file:border-r file:border-solid file:border-input file:bg-transparent file:px-3 file:text-sm file:font-medium file:not-italic file:text-foreground",  
          className,  
        )}  
        ref={ref}  
        {...props}  
      /\>  
    );  
  },  
);  
Input.displayName \= "Input";

export { Input };

**File 3: /components/ui/button.tsx**

TypeScript

import { Slot } from "@radix-ui/react-slot";  
import { cva, type VariantProps } from "class-variance-authority";  
import \* as React from "react";  
import { cn } from "@/lib/utils";

const buttonVariants \= cva(  
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:opacity-50 \[&\_svg\]:pointer-events-none \[&\_svg\]:shrink-0",  
  {  
    variants: {  
      variant: {  
        default: "bg-primary text-primary-foreground shadow-sm shadow-black/5 hover:bg-primary/90",  
        destructive: "bg-destructive text-destructive-foreground shadow-sm shadow-black/5 hover:bg-destructive/90",  
        outline: "border border-input bg-background shadow-sm shadow-black/5 hover:bg-accent hover:text-accent-foreground",  
        secondary: "bg-secondary text-secondary-foreground shadow-sm shadow-black/5 hover:bg-secondary/80",  
        ghost: "hover:bg-accent hover:text-accent-foreground",  
        link: "text-primary underline-offset-4 hover:underline",  
      },  
      size: {  
        default: "h-9 px-4 py-2",  
        sm: "h-8 rounded-lg px-3 text-xs",  
        lg: "h-10 rounded-lg px-8",  
        icon: "h-9 w-9",  
      },  
    },  
    defaultVariants: {  
      variant: "default",  
      size: "default",  
    },  
  },  
);

export interface ButtonProps  
  extends React.ButtonHTMLAttributes\<HTMLButtonElement\>,  
    VariantProps\<typeof buttonVariants\> {  
  asChild?: boolean;  
}

const Button \= React.forwardRef\<HTMLButtonElement, ButtonProps\>(  
  ({ className, variant, size, asChild \= false, ...props }, ref) \=\> {  
    const Comp \= asChild ? Slot : "button";  
    return (  
      \<Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} /\>  
    );  
  },  
);  
Button.displayName \= "Button";

export { Button, buttonVariants };

**File 4: /components/ui/dialog.tsx**

TypeScript

"use client";

import \* as DialogPrimitive from "@radix-ui/react-dialog";  
import \* as React from "react";  
import { cn } from "@/lib/utils";  
import { Cross2Icon } from "@radix-ui/react-icons";

const Dialog \= DialogPrimitive.Root;  
const DialogTrigger \= DialogPrimitive.Trigger;  
const DialogPortal \= DialogPrimitive.Portal;  
const DialogClose \= DialogPrimitive.Close;

const DialogOverlay \= React.forwardRef\<  
  React.ElementRef\<typeof DialogPrimitive.Overlay\>,  
  React.ComponentPropsWithoutRef\<typeof DialogPrimitive.Overlay\>  
\>(({ className, ...props }, ref) \=\> (  
  \<DialogPrimitive.Overlay  
    ref={ref}  
    className={cn(  
      "fixed inset-0 z-\[101\] bg-black/80 data-\[state=open\]:animate-in data-\[state=closed\]:animate-out data-\[state=closed\]:fade-out-0 data-\[state=open\]:fade-in-0",  
      className,  
    )}  
    {...props}  
  /\>  
));  
DialogOverlay.displayName \= DialogPrimitive.Overlay.displayName;

const DialogContent \= React.forwardRef\<  
  React.ElementRef\<typeof DialogPrimitive.Content\>,  
  React.ComponentPropsWithoutRef\<typeof DialogPrimitive.Content\>  
\>(({ className, children, ...props }, ref) \=\> (  
  \<DialogPortal\>  
    \<DialogOverlay /\>  
    \<DialogPrimitive.Content  
      ref={ref}  
      className={cn(  
        "fixed left-1/2 top-1/2 z-\[101\] grid max-h-\[calc(100%-4rem)\] w-full \-translate-x-1/2 \-translate-y-1/2 gap-4 overflow-y-auto border bg-background p-6 shadow-lg shadow-black/5 duration-200 data-\[state=open\]:animate-in data-\[state=closed\]:animate-out data-\[state=closed\]:fade-out-0 data-\[state=open\]:fade-in-0 data-\[state=closed\]:zoom-out-95 data-\[state=open\]:zoom-in-95 data-\[state=closed\]:slide-out-to-left-1/2 data-\[state=closed\]:slide-out-to-top-\[48%\] data-\[state=open\]:slide-in-from-left-1/2 data-\[state=open\]:slide-in-from-top-\[48%\] sm:max-w-\[400px\] sm:rounded-xl",  
        className,  
      )}  
      {...props}  
    \>  
      {children}  
      \<DialogPrimitive.Close className="group absolute right-3 top-3 flex size-7 items-center justify-center rounded-lg outline-offset-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none"\>  
        \<Cross2Icon  
          width={16}  
          height={16}  
          strokeWidth={2}  
          className="opacity-60 transition-opacity group-hover:opacity-100"  
        /\>  
        \<span className="sr-only"\>Close\</span\>  
      \</DialogPrimitive.Close\>  
    \</DialogPrimitive.Content\>  
  \</DialogPortal\>  
));  
DialogContent.displayName \= DialogPrimitive.Content.displayName;

const DialogHeader \= ({ className, ...props }: React.HTMLAttributes\<HTMLDivElement\>) \=\> (  
  \<div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} /\>  
);  
DialogHeader.displayName \= "DialogHeader";

const DialogFooter \= ({ className, ...props }: React.HTMLAttributes\<HTMLDivElement\>) \=\> (  
  \<div  
    className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3", className)}  
    {...props}  
  /\>  
);  
DialogFooter.displayName \= "DialogFooter";

const DialogTitle \= React.forwardRef\<  
  React.ElementRef\<typeof DialogPrimitive.Title\>,  
  React.ComponentPropsWithoutRef\<typeof DialogPrimitive.Title\>  
\>(({ className, ...props }, ref) \=\> (  
  \<DialogPrimitive.Title  
    ref={ref}  
    className={cn("text-lg font-semibold tracking-tight", className)}  
    {...props}  
  /\>  
));  
DialogTitle.displayName \= DialogPrimitive.Title.displayName;

const DialogDescription \= React.forwardRef\<  
  React.ElementRef\<typeof DialogPrimitive.Description\>,  
  React.ComponentPropsWithoutRef\<typeof DialogPrimitive.Description\>  
\>(({ className, ...props }, ref) \=\> (  
  \<DialogPrimitive.Description  
    ref={ref}  
    className={cn("text-sm text-muted-foreground", className)}  
    {...props}  
  /\>  
));  
DialogDescription.displayName \= DialogPrimitive.Description.displayName;

export {  
  Dialog,  
  DialogClose,  
  DialogContent,  
  DialogDescription,  
  DialogFooter,  
  DialogHeader,  
  DialogOverlay,  
  DialogPortal,  
  DialogTitle,  
  DialogTrigger,  
};

**File 5: /components/ui/label.tsx**

TypeScript

"use client"  
import \* as React from "react"  
import \* as LabelPrimitive from "@radix-ui/react-label"  
import { cva, type VariantProps } from "class-variance-authority"  
import { cn } from "@/lib/utils"

const labelVariants \= cva(  
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",  
)

const Label \= React.forwardRef\<  
  React.ElementRef\<typeof LabelPrimitive.Root\>,  
  React.ComponentPropsWithoutRef\<typeof LabelPrimitive.Root\> &  
    VariantProps\<typeof labelVariants\>  
\>(({ className, ...props }, ref) \=\> (  
  \<LabelPrimitive.Root  
    ref={ref}  
    className={cn(labelVariants(), className)}  
    {...props}  
  /\>  
))  
Label.displayName \= LabelPrimitive.Root.displayName

export { Label }

---

#### **3\. Usage Demo**

Create a demo file (e.g., /app/demo/auth/page.tsx) to show the button.

TypeScript

import AuthDialog from "@/components/ui/auth-dialog";

export default function DemoAuth() {  
  return (  
    \<div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-zinc-950"\>  
      \<AuthDialog /\>  
    \</div\>  
  );  
}

