# Techxaura 2K26

Official website for Techxaura 2K26, a National Level Technical Symposium.

## Stack

- **Framework**: [Next.js 16](https://nextjs.org/)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **3D/Animations**: Three.js (@react-three/fiber), Framer Motion
- **Backend**: Firebase (Auth & Firestore)

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env` file with your Firebase config:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## Project Structure

- `src/app`: App router pages
- `src/components`: UI components (Auth, Dashboard, Home, UI primitives)
- `src/context`: React contexts (Auth, Cart, Events)
- `src/lib`: Firebase configuration
- `src/data`: Static event data
- `public`: Static assets (images, videos)
