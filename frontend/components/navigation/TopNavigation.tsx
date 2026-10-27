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

    const linkClass = `
        rounded-xl
        px-4 py-2
        text-sm
        text-gray-300
        transition
        hover:bg-white/5
        hover:text-white
    `;

    const mobileLinkClass = `
        rounded-xl
        px-4 py-3
        text-sm
        text-gray-300
        transition
        hover:bg-white/5
        hover:text-white
    `;

    const authLinkClass = `
        rounded-xl
        bg-gradient-to-r
        from-blue-600
        to-violet-600
        text-sm
        font-medium
        text-white
        transition
        hover:scale-105
    `;

    return (
        <nav
            className="
                relative z-50
                mx-auto
                w-[92%] max-w-6xl
                pt-4 sm:pt-6
            "
        >
            <div
                className="
                    rounded-2xl
                    border border-white/10
                    bg-zinc-950/90
                    px-4 py-3
                    shadow-[0_15px_50px_rgba(0,0,0,.6)]
                    backdrop-blur-xl
                    sm:px-6 sm:py-4
                "
            >
                {/* Top Row */}
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link
                        href="/"
                        onClick={closeMenu}
                        className="
                            bg-gradient-to-r
                            from-blue-500
                            to-violet-500
                            bg-clip-text
                            text-lg font-bold
                            text-transparent
                            sm:text-xl
                        "
                    >
                        Workora
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden items-center gap-2 md:flex">
                        <Link href="/" className={linkClass}>
                            Home
                        </Link>

                        {isAuthenticated && (
                            <Link href="/project" className={linkClass}>
                                Projects
                            </Link>
                        )}

                        {role === "admin"  && (
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
                            className={`${authLinkClass} ml-2 px-5 py-2`}
                        >
                            {!isAuthenticated ? "Login" : "Logout"}
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        type="button"
                        onClick={() => setMenuOpen((open) => !open)}
                        aria-label="Toggle navigation menu"
                        aria-expanded={menuOpen}
                        className="
                            rounded-xl
                            border border-white/10
                            bg-white/5
                            px-3 py-2
                            text-gray-300
                            transition
                            hover:bg-white/10
                            hover:text-white
                            md:hidden
                        "
                    >
                        {menuOpen ? "✕" : "☰"}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {menuOpen && (
                    <div
                        className="
                            mt-4 flex flex-col gap-1
                            border-t border-white/10
                            pt-4 md:hidden
                        "
                    >
                        <Link
                            href="/"
                            onClick={closeMenu}
                            className={mobileLinkClass}
                        >
                            Home
                        </Link>

                        {isAuthenticated && (
                            <Link
                                href="/project"
                                onClick={closeMenu}
                                className={mobileLinkClass}
                            >
                                Projects
                            </Link>
                        )}

                        {role === "admin" && (
                            <Link
                                href="/users"
                                onClick={closeMenu}
                                className={mobileLinkClass}
                            >
                                Users
                            </Link>
                        )}

                        {isAuthenticated && (
                            <Link
                                href="/settings"
                                onClick={closeMenu}
                                className={mobileLinkClass}
                            >
                                Settings
                            </Link>
                        )}

                        <Link
                            href="/about"
                            onClick={closeMenu}
                            className={mobileLinkClass}
                        >
                            About Us
                        </Link>

                        <Link
                            href={!isAuthenticated ? "/login" : "/logout"}
                            onClick={closeMenu}
                            className={`${authLinkClass} mt-2 px-4 py-3 text-center hover:scale-[1.02]`}
                        >
                            {!isAuthenticated ? "Login" : "Logout"}
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
