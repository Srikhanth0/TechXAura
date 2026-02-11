# TechXaura 2K26 - Codebase Documentation

## 1. Project Overview

**TechXaura 2K26** is a comprehensive web application designed to manage the registration and organization of a college technical symposium. It facilitates user authentication, event browsing, team registration, conflict detection, cart management, and payment processing. Additionally, it features an administrative dashboard for real-time analytics and management.

---

## 2. Technology Stack

The project leverages a modern stack built for performance, scalability, and developer experience:

### Frontend
- **Framework**: [Next.js 16 (App Router)](https://nextjs.org) - React framework for production.
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Static typing for scalable development.
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) - Utility-first CSS framework.
- **Design System**: Golden Ratio typography and spacing.
- **Animations**: [Framer Motion](https://www.framer.com/motion/) - Production-ready animation library.
- **Icons**: [Lucide React](https://lucide.dev/) - Beautiful & consistent icons.
- **Components**: [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible components foundation.

### Backend & Services
- **Authentication**: [Firebase Auth](https://firebase.google.com/docs/auth) - Google & Email/Password login.
- **Database**: [Cloud Firestore](https://firebase.google.com/docs/firestore) - NoSQL database for real-time data.
- **Storage**: [Firebase Storage](https://firebase.google.com/docs/storage) - Secure file storage for payment proofs.
- **Hosting**: Vercel (recommended) or Firebase Hosting.

### Utilities
- **State Management**: React Context API (`AuthContext`, `CartContext`, `EventsContext`).
- **Data Export**: `exceljs` for generating administrative reports.
- **QR Codes**: `qrcode.react` for payment generation.
- **Image Optimization**: `sharp` (via Next.js).

---

## 3. Project Structure

The codebase follows the Next.js App Router convention, organizing routes and logic modularly.

```
src/
├── app/                  # Next.js App Router (Routes & Pages)
│   ├── layout.tsx        # Root layout (Metadata, Fonts, Providers)
│   ├── page.tsx          # Landing page
│   ├── auth/             # Authentication routes (login, register)
│   ├── dashboard/        # User dashboard (events, status)
│   ├── checkout/         # Cart, payment, and order summary
│   ├── admin/            # Administrative panel
│   ├── error.tsx         # Global error boundary
│   └── not-found.tsx     # 404 page
│
├── components/           # Reusable React components
│   ├── ui/               # Core UI elements (Button, Card, Input...)
│   ├── layout/           # Navbar, Footer
│   ├── home/             # Landing page sections (Hero, Features)
│   ├── dashboard/        # Dashboard widgets
│   └── auth/             # Login/Register forms
│
├── context/              # Global State Providers
│   ├── AuthContext.tsx   # User session & profile management
│   ├── CartContext.tsx   # Shopping cart logic & persistence
│   └── EventsContext.tsx # Event data fetching & caching
│
├── lib/                  # Core configurations & utilities
│   ├── firebase.ts       # Firebase app initialization
│   └── utils.ts          # Tailwind class merger (cn)
│
├── hooks/                # Custom React Hooks
│   ├── use-image-upload.tsx   # Handling file uploads to Storage
│   └── use-performance-mode.tsx # device capability detection
│
└── utils/                # Helper functions
    └── excel-utils.ts    # Logic for exporting data to Excel
```

---

## 4. Key Systems & Features

### 4.1 Authentication System
- **Provider**: Firebase Authentication.
- **Flow**: Supports Email/Password and Google OAuth.
- **Validation**: Enforces domain constraints (e.g., `@gmail.com` or specific college domains).
- **Session**: Managed via `AuthContext`, persisting user state across reloads.

### 4.2 Database Schema (Firestore)
- **`users` Collection**: Stores user profiles (name, college, phone).
- **`events` Collection**: Catalog of technical and non-technical events with metadata (team size limits, timing).
- **`registrations` Collection**: Links users to events, storing payment status (`pending`, `verified`) and team details.

### 4.3 Registration & Cart Logic (`CartContext`)
- **Team Management**: Allows adding team members per event constraints.
- **Conflict Detection**: Prevents registering for overlapping events based on time slots.
- **Persistence**: Cart data is saved to `localStorage` or Firestore drafts.

### 4.4 Payment System
- **Workflow**: 
  1. User adds events to cart.
  2. Proceeds to checkout.
  3. Scans dynamic QR code (UPI).
  4. Uploads payment screenshot (validated for size/type).
  5. Admin verifies proof in Dashboard.

### 4.5 Administrative Dashboard
- **Access Control**: Restricted to authorized admin email accounts.
- **Features**:
  - Live statistics (registrations, revenue).
  - Verification queue for payment proofs.
  - One-click Excel export of all participant data.

---

## 5. Setup & Installation

Follow these steps to run the project locally:

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/your-username/TECHXAURA_2K26.git
    cd TECHXAURA_2K26
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Variables**:
    Create a `.env.local` file in the root directory and add your Firebase credentials:
    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the application.

5.  **Build for Production**:
    ```bash
    npm run build
    npm start
    ```

---

## 6. Design Philosophy
The UI follows a strict **Golden Ratio** based design system for typography and spacing, ensuring visual harmony. Components use a unified design language with consistent border radii, shadows, and interactive states powered by Framer Motion.
