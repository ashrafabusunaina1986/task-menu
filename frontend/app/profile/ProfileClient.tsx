// app/profile/ProfileClient.tsx
"use client";

import { useEffect, useState } from "react";
import UserHeader from "@/components/user/UserHeader";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/date/date"; // استدعاء دالة التاريخ الموحدة والمحمية التي عزلناها سابقاً

type ProfileClientProps = {
    user: User;
};

export default function ProfileClient({ user }: ProfileClientProps) {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    // حل أزمة الـ Hydration Mismatch لتواريخ السيرفر والمتصفح
    useEffect(() => {
        setMounted(true);
    }, []);

    async function handleLogout() {
        const res = await fetch("/api/auth/logout", {
            method: "POST",
        });

        if (res.ok) {
            router.push("/login");
            router.refresh();
        }
    }

    // دالة ديناميكية لتحديد شارات ألوان الأدوار بشكل إحصائي بارز
    const getRoleBadgeClass = (role: string) => {
        switch (role?.toLowerCase()) {
            case "admin":
                return "bg-rose-500/10 text-rose-400 border-rose-500/20";
            case "manager":
                return "bg-purple-500/10 text-purple-400 border-purple-500/20";
            default:
                return "bg-blue-500/10 text-blue-400 border-blue-500/20";
        }
    };
    return (
        <main className="min-h-screen bg-[#08080d] relative overflow-hidden py-10 text-white px-4 sm:px-6">
            
            {/* Cyberpunk Fluid Glow Background Layers */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <div className="w-[1000px] h-[1000px] rounded-full bg-purple-600/5 blur-[240px]" />
                <div className="w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-[180px] absolute" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto space-y-6">
                <UserHeader isBack={true} logout={handleLogout} />

                {/* 💳 Premium Glassmorphic Center Profile Profile Container */}
                <div className="relative w-full rounded-[32px] border border-white/5 bg-[#0d0d16]/90 p-6 md:p-12 shadow-[0_30px_90px_rgba(0,0,0,0.85)] backdrop-blur-2xl space-y-8 animate-fadeIn">
                    
                    {/* Header Bio Info Block */}
                    <div className="flex flex-col items-center text-center space-y-4">
                        {/* Interactive Avatar Node */}
                        {user.image ? (
                            <img
                                src={user.image}
                                alt={user.name}
                                className="h-24 w-24 rounded-full object-cover border border-purple-500/30 shadow-[0_0_40px_rgba(139,92,246,0.2)] transition duration-200 hover:scale-105"
                            />
                        ) : (
                            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-4xl font-black text-white shadow-[0_0_40px_rgba(139,92,246,0.2)] select-none">
                                {user.name?.charAt(0).toUpperCase()}
                            </div>
                        )}

                        <div className="space-y-1">
                            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight sm:text-4xl">
                                {user.name}
                            </h1>
                            <p className="text-xs text-gray-500 font-medium font-mono tracking-wide">{user.email}</p>
                        </div>

                        {/* Role Status Tag Indicator */}
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded border uppercase tracking-wider ${getRoleBadgeClass(user.role)}`}>
                            {user.role || "Operator"} Node
                        </span>
                    </div>

                    {/* Cyberpunk Divider Matrix Line */}
                    <div className="relative flex justify-center py-2">
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
                        <div className="absolute -top-[3px] h-2 w-2 rounded-full bg-purple-500 shadow-[0_0_15px_#8b5cf6]" />
                    </div>

                    {/* 📊 Grid Infrastructure Configuration Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <Info label="Operator Node ID" value={user._id || (user as any).id || "N/A"} isMono={true} />
                        <Info label="Full Name Registry" value={user.name} />
                        <Info label="Primary Communication Email" value={user.email} isMono={true} />
                        <Info label="Assigned System Role" value={user.role} className="capitalize" />
                        
                        <StatusInfo label="Firewall Account Status" value={user.is_active} trueText="Active Process" falseText="Deallocated Container" />
                        
                        
                        <Info label="Node Initialization" value={mounted ? formatDate(user.created_at) : "Syncing..."} isMono={true} />
                        <Info label="Last Infrastructure Sync" value={mounted ? formatDate(user.updated_at) : "Syncing..."} isMono={true} />
                    </div>
                </div>
            </div>
        </main>
    );
}
/* ============================================================================
   📋 Sub-Component: Info Data Telemetry Field Matrix (N-Layer Encapsulated)
   ============================================================================ */
function Info({
    label,
    value,
    isMono = false,
    className = ""
}: {
    label: string;
    value: string;
    isMono?: boolean;
    className?: string;
}) {
    return (
        <div className="rounded-xl border border-gray-800/60 bg-[#11111a]/40 p-4 space-y-1.5 transition hover:bg-[#11111a]/80 duration-150">
            <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider select-none">
                {label}
            </span>
            <p className={`text-sm font-semibold text-white tracking-wide truncate ${isMono ? "font-mono text-xs text-purple-400" : ""} ${className}`}>
                {value || "Null Dynamic Field Metadata"}
            </p>
        </div>
    );
}

/* ============================================================================
   📋 Sub-Component: Status Secure Ring Field Matrix (N-Layer Encapsulated)
   ============================================================================ */
function StatusInfo({
    label,
    value,
    trueText,
    falseText,
}: {
    label: string;
    value: boolean;
    trueText: string;
    falseText: string;
}) {
    return (
        <div className="rounded-xl border border-gray-800/60 bg-[#11111a]/40 p-4 space-y-2 transition hover:bg-[#11111a]/80 duration-150">
            <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider select-none">
                {label}
            </span>
            <div className="flex items-center gap-2.5 pt-0.5">
                <span
                    className={`h-2 w-2 rounded-full transition-all duration-300 ${
                        value
                            ? "bg-emerald-500 shadow-[0_0_10px_#10b981]"
                            : "bg-rose-500 shadow-[0_0_10px_#f43f5e]"
                    }`}
                />
                <span className={`text-xs font-bold ${value ? "text-emerald-400" : "text-rose-400"}`}>
                    {value ? trueText : falseText}
                </span>
            </div>
        </div>
    );
}
