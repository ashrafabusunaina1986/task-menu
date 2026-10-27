
// components/security/register/RegisterExpired.tsx
"use client";

import { useRouter } from "next/navigation";

// إصلاح TypeScript التام: إضافة حقل token كحقل اختياري لتتطابق المواصفات الهيكلية مع منادي المكون في ملف الـ OTP ومنع أخطاء الـ Build
interface RegisterExpiredProps {
    message?: string;
    token?: string;
}

export default function RegisterExpired({
    message = "Your registration session has expired. Please register again.",
    token // يستقبل التوكن بأمان دون كسر الـ IntrinsicAttributes الخاصة بالـ Compiler
}: RegisterExpiredProps) {
    const router = useRouter();
    return (
        <main className="min-h-screen bg-[#08080d] overflow-hidden relative flex items-center justify-center px-4 text-white">

            {/* Ambient Red & Purple Alert Backdrop Glow Overlays */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-0">
                <div className="w-[900px] h-[900px] rounded-full bg-rose-950/[0.03] blur-[220px]" />
                <div className="w-[500px] h-[500px] rounded-full bg-purple-900/[0.02] blur-[160px] absolute" />
            </div>

            {/* Premium Glassmorphic Frame Box */}
            <div className="
                relative 
                z-10 
                w-full 
                max-w-2xl 
                rounded-[32px] 
                border border-rose-950/20 
                bg-[#0d0d16]/90 
                shadow-[0_30px_100px_rgba(0,0,0,0.9)] 
                backdrop-blur-2xl 
                p-6 
                md:p-14 
                text-center 
                space-y-6
                transition-all
                duration-300
                hover:border-rose-900/10
                animate-fadeIn
            ">
                {/* ⏳ Secure Animated Hourglass Icon Centerpiece */}
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
                    shadow-[0_0_50px_rgba(239,68,68,0.12)]
                    animate-pulse
                ">
                    <span className="text-4xl select-none">⏳</span>
                </div>

                {/* Section Header Metadata Layout Text */}
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
                        Session Expired
                    </h1>
                    <p className="text-xs font-mono text-rose-400/50 uppercase tracking-widest">[ Token Lifecycle Expiration Timeout ]</p>
                    <p className="text-sm text-gray-400 max-w-md mx-auto pt-2 leading-relaxed">
                        {message}
                    </p>
                </div>

                {/* Cyberpunk Translucent Divider Line */}
                <div className="relative flex justify-center py-2">
                    <div className="h-px w-56 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
                    <div className="absolute -top-[3px] h-2 w-2 rounded-full bg-purple-500 shadow-[0_0_15px_#8b5cf6]" />
                </div>

                {/* Interactive Dynamic Action Redirect Trigger Control */}
                <div className="pt-2">
                    <button
                        type="button"
                        onClick={() => router.replace("/register")}
                        className="
                            w-full
                            sm:w-auto
                            px-8
                            py-3.5
                            rounded-xl
                            text-xs
                            font-bold
                            uppercase
                            tracking-wider
                            text-white
                            bg-purple-600
                            hover:bg-purple-700
                            active:scale-[0.99]
                            shadow-lg
                            shadow-purple-600/20
                            transition
                            duration-150
                            cursor-pointer
                        "
                    >
                        Re-initialize Operator Registration
                    </button>
                </div>

                {/* Lower System Technical Footnotes */}
                <div className="text-center pt-4 border-t border-gray-900/60 flex items-center justify-center gap-1.5 text-[10px] font-bold text-gray-600 uppercase tracking-widest select-none">
                    <span>Workora Advanced Cyber-Security Gate</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
                </div>
            </div>
        </main>
    );
}
