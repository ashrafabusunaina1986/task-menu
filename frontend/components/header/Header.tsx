// frontend/components/header/Header.tsx
// frontend/components/header/Header.tsx

import { auth } from '@/auth';
import TopNavigation from '../navigation/TopNavigation';
import React from 'react';

export default async function Header() {
    // 1. Retrieve the active live session from the core NextAuth server infrastructure layer
    const session = await auth();
    
    // 2. Render the structural layout wrapper passing verified clearance metrics downstream
    // ✅ FIXED VIEWPORT MODE: Injected 'fixed top-0 left-0 right-0' utility classes to anchor the glassmorphic shell beautifully
    return (
        <header className="fixed top-0 left-0 right-0 w-full z-50 bg-[#08080d]/90 backdrop-blur-xl border-b border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-300">
            {/* Ambient dynamic accent line for premium visual tracking */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

            <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
                <TopNavigation
                    isAuthenticated={!!session}
                    role={session?.user?.role || "user"}
                />
            </div>
        </header>
    );
}
