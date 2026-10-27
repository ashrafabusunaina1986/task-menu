
// components/security/blocks/AccessDenied.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AccessDeniedProps {
    message?: string;
    blockedUntil?: string;
}

export default function AccessDenied({
    message = "Access to this resource has been denied.",
    blockedUntil,
}: AccessDeniedProps) {
    const router = useRouter();
    const [remaining, setRemaining] = useState<number>(0);
    const [initialDiff, setInitialDiff] = useState<number>(1); // حساب المدة الكلية الإحصائية للبار

    useEffect(() => {
        if (!blockedUntil) return;

        const targetTime = new Date(blockedUntil).getTime();
        const startDiff = targetTime - Date.now();
        if (startDiff > 0) {
            setInitialDiff(startDiff);
        }

        const updateRemaining = () => {
            const difference = targetTime - Date.now();

            if (difference <= 0) {
                setRemaining(0);
                router.refresh();
                return;
            }
            setRemaining(difference);
        };

        updateRemaining();
        const interval = setInterval(updateRemaining, 1000);

        return () => clearInterval(interval);
    }, [blockedUntil, router]);

    const totalSeconds = Math.ceil(remaining / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // حساب نسبة الحظر المنقضية ديناميكياً للوحة الإحصائية
    const progressPercent = Math.max(0, Math.min(100, Math.round((remaining / initialDiff) * 100)));
    return (
        <main className="min-h-screen bg-[#08080d] overflow-hidden relative flex items-center justify-center px-4 text-white">

            {/* Ambient Security Red & Purple Backdrop Glow */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-0">
                <div className="w-[900px] h-[900px] rounded-full bg-rose-950/[0.04] blur-[220px]" />
                <div className="w-[500px] h-[500px] rounded-full bg-purple-900/[0.03] blur-[160px] absolute" />
            </div>

            {/* Premium Glassmorphic Lockdown Container Frame */}
            <div className="
                relative 
                z-10 
                w-full 
                max-w-2xl 
                rounded-[32px] 
                border border-rose-950/30 
                bg-[#0d0d16]/90 
                shadow-[0_30px_100px_rgba(0,0,0,0.9)] 
                backdrop-blur-2xl 
                p-6 
                md:p-14 
                text-center 
                space-y-6
                transition-all
                duration-300
                hover:border-rose-900/20
                animate-fadeIn
            ">
                {/* 🛡️ Secure Animated Shield Icon Centerpiece */}
                <div className="
                    mx-auto
                    flex
                    h-24
                    w-24
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-rose-500/20
                    bg-[#141423]/60
                    shadow-[0_0_50px_rgba(244,63,94,0.15)]
                    animate-bounce
                ">
                    <span className="text-4xl select-none">🛡️</span>
                </div>

                {/* Section Text Header Details */}
                <div className="space-y-2">
                    <h1 className="
                        text-3xl 
                        md:text-4xl 
                        font-black 
                        bg-gradient-to-b 
                        from-white 
                        via-gray-300 
                        to-rose-500/80 
                        bg-clip-text 
                        text-transparent 
                        tracking-tight
                    ">
                        Access Policy Denied
                    </h1>
                    <p className="text-xs font-mono text-rose-400/60 uppercase tracking-widest">[ Firewall Sandbox Isolation Active ]</p>
                    <p className="text-sm text-gray-400 max-w-md mx-auto pt-2 leading-relaxed">
                        {message}
                    </p>
                </div>

                {/* Cyberpunk Divider Module */}
                <div className="relative flex justify-center py-2">
                    <div className="h-px w-56 bg-gradient-to-r from-transparent via-rose-500/30 to-transparent" />
                    <div className="absolute -top-[3px] h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_15px_#f43f5e]" />
                </div>

                {/* 📊 Countdown Dashboard Box Component - يعرض في حال وجود حظر زمني متبقي */}
                {blockedUntil && remaining > 0 && (
                    <div className="
                        mx-auto
                        max-w-md
                        rounded-xl
                        border
                        border-gray-800/80
                        bg-[#131322]/70
                        p-5
                        space-y-4
                        shadow-inner
                    ">
                        <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                            <span>Security Restriction Lock</span>
                            <span className="text-rose-400 animate-pulse">Cooling Node Down</span>
                        </div>

                        {/* بار التقدم الإحصائي التفاعلي للحظر */}
                        <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 h-full rounded-full transition-all duration-300"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>

                        <div className="flex justify-between items-center pt-1">
                            <span className="text-xs text-gray-400 font-medium">Try again synchronization in:</span>
                            <span className="font-mono text-2xl font-black text-rose-400 tracking-tight">
                                {minutes.toString().padStart(2, "0")}
                                <span className="animate-pulse">:</span>
                                {seconds.toString().padStart(2, "0")}
                            </span>
                        </div>
                    </div>
                )}

                {/* Lower System Technical Footnotes */}
                <div className="text-center pt-4 border-t border-gray-900/60 flex items-center justify-center gap-1.5 text-[10px] font-bold text-gray-600 uppercase tracking-widest select-none">
                    <span>Workora Advanced Cyber-Security Gate</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                </div>
            </div>
        </main>
    );
}
