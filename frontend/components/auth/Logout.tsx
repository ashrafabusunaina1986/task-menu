// components/Logout.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Logout() {
    const router = useRouter();

    useEffect(() => {
        async function executeLogout() {
            try {
                // إرسال حزم التدمير الآمن لتوكنات الجلسة على السيرفر
                const res = await fetch("/api/auth/logout", {
                    method: "POST"
                });
                
                if (res.ok) {
                    router.replace("/");
                    router.refresh(); // إنعاش شجرة الحماية لـ Next.js لقطع الاتصال فوراً
                } else {
                    // تحويل احترافي احتياطي في حال رفض السيرفر لضمان عدم تعليق المستخدم
                    router.replace("/login");
                }
            } catch (error) {
                console.error("Security logout node session termination failure:", error);
                router.replace("/login");
            }
        }
        
        void executeLogout();
    }, [router]);
    return (
        <main className="min-h-screen bg-[#08080d] relative overflow-hidden flex items-center justify-center p-4 text-white">
            
            {/* Ambient Cyberpunk Fluid Glow Background */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-0">
                <div className="w-[800px] h-[800px] rounded-full bg-purple-600/[0.03] blur-[180px]" />
                <div className="w-[500px] h-[500px] rounded-full bg-blue-500/[0.02] blur-[140px] absolute" />
            </div>

            {/* Premium Glassmorphic Logout Processing Box */}
            <div className="
                relative 
                z-10 
                w-full 
                max-w-xs 
                text-center 
                rounded-3xl 
                border border-white/5 
                bg-[#0d0d16]/80 
                backdrop-blur-2xl 
                p-6 
                shadow-[0_30px_90px_rgba(0,0,0,0.85)] 
                space-y-4
                animate-fadeIn
            ">
                {/* Dynamic Cyberpunk Spinner Ring */}
                <div className="relative flex justify-center items-center py-2">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-purple-500/20 border-t-purple-500 shadow-lg shadow-purple-500/10" />
                    <span className="absolute text-[10px] opacity-30">🔒</span>
                </div>

                {/* Status Metadata Feedback */}
                <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
                        [ Session Terminated ]
                    </p>
                    <p className="text-sm font-semibold text-white tracking-wide">
                        Clearing Workspace Nodes...
                    </p>
                    <p className="text-[10px] text-gray-600 leading-relaxed max-w-[200px] mx-auto">
                        Encrypting signature payloads and disconnecting active Cloudflare tunnel streams safely.
                    </p>
                </div>
            </div>
        </main>
    );
}
