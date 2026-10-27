// app/not-found.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
    const router = useRouter();

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08080d] p-6 text-white">
            
            {/* Ambient Cyberpunk Radial Glow Layer */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-[900px] w-[900px] rounded-full bg-purple-600/5 blur-[220px]" />
                <div className="absolute h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[180px]" />
            </div>
            {/* Premium Glassmorphic 404 Center Frame */}
            <div className="
                relative 
                w-full 
                max-w-md 
                text-center 
                rounded-[32px] 
                border border-white/5 
                bg-[#0d0d16]/70 
                p-8 
                md:p-12 
                shadow-[0_30px_90px_rgba(0,0,0,0.85)] 
                backdrop-blur-2xl 
                transition-all 
                duration-300 
                hover:border-purple-500/15
                space-y-6
                animate-fadeIn
            ">
                {/* Visual Glitch-like Indicator */}
                <div className="space-y-2">
                    <h1 className="
                        text-7xl 
                        md:text-8xl 
                        font-extrabold 
                        bg-gradient-to-b 
                        from-purple-400 
                        via-pink-400 
                        to-rose-500 
                        bg-clip-text 
                        text-transparent
                        tracking-tighter
                        animate-pulse
                    ">
                        404
                    </h1>
                    <div className="text-[10px] font-mono text-purple-400/60 uppercase tracking-widest">
                        [ Isolate Node Exception ]
                    </div>
                </div>

                {/* Contextual Error Message */}
                <div className="space-y-2">
                    <p className="text-lg font-bold text-white tracking-wide">
                        Lost In Space?
                    </p>
                    <p className="text-xs text-gray-500 leading-5 max-w-xs mx-auto">
                        The dynamic route directory or workspace cluster node you are trying to sync with does not exist inside Workora network.
                    </p>
                </div>

                {/* Global Translucent Action Control Buttons */}
                <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center items-center">
                    <button
                        onClick={() => router.back()}
                        className="w-full sm:w-auto text-center rounded-xl border border-gray-800 bg-[#141423]/40 px-5 py-2.5 text-xs font-bold text-gray-400 transition hover:bg-gray-800 hover:text-white cursor-pointer"
                    >
                        Go Back
                    </button>
                    
                    <Link
                        href="/"
                        className="w-full sm:w-auto text-center rounded-xl bg-purple-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-600/20 transition hover:bg-purple-700 active:scale-[0.98]"
                    >
                        Back to Core Dashboard
                    </Link>
                </div>
            </div>
        </main>
    );
}
