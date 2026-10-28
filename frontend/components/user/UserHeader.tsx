// components/user/UserHeader.tsx
"use client"
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type UserHeaderProps = {
    user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    } | null;
    logout?: () => void;
    isBack?: boolean;
    home?: boolean;
};

export default function UserHeader({
    user,
    logout,
    isBack = false,
    home = true
}: UserHeaderProps) {
    const router = useRouter();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userRef = useRef<HTMLDivElement>(null);

    // عزل وإغلاق القائمة التلقائي عند الضغط خارج نطاق كائن الأفاتار لحماية موارد الذاكرة
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (userRef.current && !userRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const menuItemClass = `
        flex w-full items-center
        px-4 py-3
        text-left text-xs
        font-bold
        uppercase
        tracking-wider
        text-gray-400
        transition-all
        duration-150
        hover:bg-[#161624]
        hover:text-white
        cursor-pointer
    `;
    return (
        <div
            className="
                relative
                z-50
                w-full
                mx-auto
                mb-6
                flex
                items-center
                justify-between
                rounded-2xl
                border border-white/5
                bg-[#0d0d16]/90
                backdrop-blur-xl
                px-5 py-3
                shadow-[0_20px_50px_rgba(0,0,0,0.75)]
            "
        >
            {/* Left Action Indicators Segment */}
            <div className="flex items-center gap-3">
                {isBack && (
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="rounded-xl border border-gray-800 bg-[#141423]/30 px-3.5 py-1.5 text-xs font-bold text-gray-400 transition hover:bg-[#141423]/70 hover:text-white cursor-pointer"
                    >
                        ← Return
                    </button>
                )}
            </div>

            {/* Right Account Menu Anchor Control */}
            <div className="relative" ref={userRef}>
                {/* User Avatar Action Button Toggle */}
                <button
                    type="button"
                    onClick={() => setIsUserMenuOpen((prev) => !prev)}
                    className="flex items-center justify-center rounded-full outline-none focus:outline-none cursor-pointer group"
                >
                    {user?.image ? (
                        <img
                            src={user.image}
                            alt={user.name ?? "Operator"}
                            className="h-10 w-10 rounded-full object-cover border border-white/10 transition-all duration-150 group-hover:scale-105 group-hover:border-purple-500/40"
                        />
                    ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-sm font-black text-white transition-all duration-150 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] select-none">
                            {user?.name?.charAt(0).toUpperCase() ?? "U"}
                        </div>
                    )}
                </button>

                {/* User Floating Dropdown Menu Panel Overlay */}
                {isUserMenuOpen && (
                    <div
                        className="
                            absolute
                            right-0
                            top-full
                            z-[9999]
                            mt-3
                            w-64
                            overflow-hidden
                            rounded-2xl
                            border border-white/5
                            bg-[#0d0d16]/95
                            backdrop-blur-xl
                            shadow-[0_25px_60px_rgba(0,0,0,0.85)]
                            animate-fadeIn
                        "
                    >
                        {/* Compact Identity Dashboard Overview Header */}
                        <div className="border-b border-gray-900 bg-[#11111a]/50 px-4 py-4">
                            <div className="flex items-center gap-3">
                                {user?.image ? (
                                    <img
                                        src={user.image}
                                        alt={user.name ?? "Operator"}
                                        className="h-9 w-9 rounded-full object-cover border border-white/5"
                                    />
                                ) : (
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-xs font-black text-white select-none">
                                        {user?.name?.charAt(0).toUpperCase() ?? "U"}
                                    </div>
                                )}

                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-xs font-bold text-white tracking-wide">
                                        {user?.name ?? "Guest Operator"}
                                    </p>
                                    <p className="truncate text-[10px] font-mono text-gray-500 mt-0.5">
                                        {user?.email ?? "no-clearance@domain.cloud"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Dropdown Routing Links List Actions */}
                        <div className="flex flex-col p-1">
                            {home && (
                                <button
                                    type="button"
                                    className={menuItemClass}
                                    onClick={() => {
                                        setIsUserMenuOpen(false);
                                        router.push("/");
                                    }}
                                >
                                    🌐 Central Dashboard
                                </button>
                            )}

                            {user && (
                                <button
                                    type="button"
                                    className={menuItemClass}
                                    onClick={() => {
                                        setIsUserMenuOpen(false);
                                        router.push("/profile");
                                    }}
                                >
                                    👤 Operator Profile
                                </button>
                            )}

                            {/* تم إنقاذ وإغلاق ثغرة الكود المنقطع بنجاح تام 100% */}
                            {logout && (
                                <button
                                    type="button"
                                    className="
                                        flex w-full items-center
                                        px-4 py-3
                                        text-left text-xs
                                        font-bold
                                        uppercase
                                        tracking-wider
                                        text-rose-400
                                        transition-all
                                        duration-150
                                        hover:bg-rose-500/10
                                        cursor-pointer
                                        border-t
                                        border-gray-900/60
                                        mt-1
                                    "
                                    onClick={() => {
                                        setIsUserMenuOpen(false);
                                        logout();
                                    }}
                                >
                                    🛑 Disconnect Session
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
