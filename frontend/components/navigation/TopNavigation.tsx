"use client";

import Link from "next/link";
import { useState } from "react";

type TopNavigationProps = {
    isAuthenticated: boolean;
    role?: string | null;
};

export default function TopNavigation({
    isAuthenticated,
    role,
}: TopNavigationProps) {
    const [menuOpen, setMenuOpen] = useState(false);

    function closeMenu() {
        setMenuOpen(false);
    }

    // دالة ديناميكية لتحديد شارة اللون لدور المستخدم بشكل إحصائي بارز
    const getRoleBadgeClass = (userRole: string | null | undefined) => {
        if (!userRole) return "hidden";
        switch (userRole.toLowerCase()) {
            case "admin":
                return "bg-rose-500/10 text-rose-400 border-rose-500/20";
            default:
                return "bg-purple-500/10 text-purple-400 border-purple-500/20";
        }
    };

    const linkClass = `
        rounded-xl
        px-3.5 py-1.5
        text-xs
        font-semibold
        text-gray-400
        transition-all
        duration-150
        hover:bg-[#161624]
        hover:text-white
    `;

    const mobileLinkClass = `
        rounded-xl
        px-4 py-2.5
        text-sm
        font-medium
        text-gray-400
        transition-all
        duration-150
        hover:bg-[#161624]
        hover:text-white
    `;

    const authLinkClass = `
        rounded-xl
        bg-purple-600
        text-xs
        font-bold
        text-white
        shadow-lg
        shadow-purple-600/10
        transition-all
        duration-150
        hover:bg-purple-700
        active:scale-[0.98]
    `;
    return (
        <nav className="relative z-50 mx-auto w-[94%] max-w-7xl pt-4 sm:pt-6">
            <div className="rounded-2xl border border-white/5 bg-[#0d0d16]/90 px-4 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.75)] backdrop-blur-xl sm:px-6 sm:py-3.5 flex flex-col justify-center">
                
                {/* Top Desktop Row Panel */}
                <div className="flex items-center justify-between">
                    {/* Brand Interactive Logo */}
                    <div className="flex items-center gap-3">
                        <Link
                            href="/"
                            onClick={closeMenu}
                            className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-lg font-black text-transparent tracking-tight sm:text-xl transition"
                        >
                            Workora
                        </Link>
                        
                        {/* الإحصائية البصرية لدور المالك حياً داخل الهيدر */}
                        {isAuthenticated && role && (
                            <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded border uppercase tracking-wider select-none ${getRoleBadgeClass(role)}`}>
                                {role} Node
                            </span>
                        )}
                    </div>

                    {/* Desktop Dynamic Navigation Links Core */}
                    <div className="hidden items-center gap-1.5 md:flex">
                        <Link href="/" className={linkClass}>
                            Home
                        </Link>

                        {isAuthenticated && (
                            <Link href="/project" className={linkClass}>
                                Projects
                            </Link>
                        )}

                        {role === "admin" && (
                            <Link href="/users" className={linkClass}>
                                Users
                            </Link>
                        )}

                        {isAuthenticated && (
                            <Link href="/settings" className={linkClass}>
                                Settings
                            </Link>
                        )}

                        <Link href="/about" className={linkClass}>
                            About Us
                        </Link>

                        <Link
                            href={!isAuthenticated ? "/login" : "/logout"}
                            className={`${authLinkClass} ml-3 px-4 py-2 text-center cursor-pointer`}
                        >
                            {!isAuthenticated ? "Login Gate" : "Disconnect"}
                        </Link>
                    </div>

                    {/* Mobile Menu Action Toggle Trigger Button */}
                    <button
                        type="button"
                        onClick={() => setMenuOpen((open) => !open)}
                        aria-label="Toggle navigation menu"
                        aria-expanded={menuOpen}
                        className="rounded-xl border border-gray-800 bg-[#141423]/30 px-3 py-2 text-gray-400 transition hover:bg-[#141423]/70 hover:text-white md:hidden cursor-pointer flex items-center justify-center text-xs"
                    >
                        {menuOpen ? "✕" : "☰"}
                    </button>
                </div>

                {/* Mobile Responsive Navigation Drawer Layer */}
                {menuOpen && (
                    <div className="mt-3 flex flex-col gap-1 border-t border-gray-900/60 pt-3 md:hidden animate-fadeIn">
                        <Link href="/" onClick={closeMenu} className={mobileLinkClass}>
                            Home
                        </Link>

                        {isAuthenticated && (
                            <Link href="/project" onClick={closeMenu} className={mobileLinkClass}>
                                Projects
                            </Link>
                        )}

                        {role === "admin" && (
                            <Link href="/users" onClick={closeMenu} className={mobileLinkClass}>
                                Users
                            </Link>
                        )}

                        {isAuthenticated && (
                            <Link href="/settings" onClick={closeMenu} className={mobileLinkClass}>
                                Settings
                            </Link>
                        )}

                        <Link href="/about" onClick={closeMenu} className={mobileLinkClass}>
                            About Us
                        </Link>

                        <Link
                            href={!isAuthenticated ? "/login" : "/logout"}
                            onClick={closeMenu}
                            className={`${authLinkClass} mt-2.5 py-2.5 text-center cursor-pointer block text-xs`}
                        >
                            {!isAuthenticated ? "Login Gate" : "Disconnect Session"}
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
