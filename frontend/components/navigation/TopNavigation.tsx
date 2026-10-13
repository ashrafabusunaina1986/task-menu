
// components/navigation/TopNavigation.tsx

"use client"

import Link from "next/link"
import { useState } from "react"

type TopNavigationProps = {
    isAuthenticated: boolean
    role?: string | null
}

export default function TopNavigation({
    isAuthenticated,
    role,
}: TopNavigationProps) {

    const [menuOpen, setMenuOpen] = useState(false)

    function closeMenu() {
        setMenuOpen(false)
    }

    return (
        <nav
            className="
                relative z-50
                w-[92%] max-w-6xl
                mx-auto
                pt-4 sm:pt-6
            "
        >

            <div
                className="
                    rounded-2xl
                    border border-white/10
                    bg-zinc-950/90
                    backdrop-blur-xl
                    px-4 py-3
                    sm:px-6 sm:py-4
                    shadow-[0_15px_50px_rgba(0,0,0,.6)]
                "
            >

                {/* Top Row */}

                <div className="flex items-center justify-between">

                    {/* Logo */}

                    <Link
                        href="/"
                        onClick={closeMenu}
                        className="
                            text-lg sm:text-xl
                            font-bold
                            bg-gradient-to-r
                            from-blue-500
                            to-violet-500
                            bg-clip-text
                            text-transparent
                        "
                    >
                        Task Menu
                    </Link>


                    {/* Desktop Navigation */}

                    <div className="hidden md:flex items-center gap-2">

                        <Link
                            href="/"
                            className="
                                rounded-xl
                                px-4 py-2
                                text-sm
                                text-gray-300
                                transition
                                hover:bg-white/5
                                hover:text-white
                            "
                        >
                            Home
                        </Link>

                        <Link
                            href="/tasks"
                            className="
                                rounded-xl
                                px-4 py-2
                                text-sm
                                text-gray-300
                                transition
                                hover:bg-white/5
                                hover:text-white
                            "
                        >
                            Tasks
                        </Link>

                        {role === "admin" && (
                            <Link
                                href="/users"
                                className="
                                    rounded-xl
                                    px-4 py-2
                                    text-sm
                                    text-gray-300
                                    transition
                                    hover:bg-white/5
                                    hover:text-white
                                "
                            >
                                Users
                            </Link>
                        )}

                        {isAuthenticated && (
                            <Link
                                href="/settings"
                                className="
                                    rounded-xl
                                    px-4 py-2
                                    text-sm
                                    text-gray-300
                                    transition
                                    hover:bg-white/5
                                    hover:text-white
                                "
                            >
                                Settings
                            </Link>
                        )}

                        <Link
                            href="/about"
                            className="
                                rounded-xl
                                px-4 py-2
                                text-sm
                                text-gray-300
                                transition
                                hover:bg-white/5
                                hover:text-white
                            "
                        >
                            About Us
                        </Link>

                        <Link
                            href={!isAuthenticated ? "/login" : "/logout"}
                            className="
                                ml-2
                                rounded-xl
                                bg-gradient-to-r
                                from-blue-600
                                to-violet-600
                                px-5 py-2
                                text-sm
                                font-medium
                                text-white
                                transition
                                hover:scale-105
                            "
                        >
                            {!isAuthenticated ? "Login" : "Logout"}
                        </Link>

                    </div>


                    {/* Mobile Menu Button */}

                    <button
                        type="button"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle navigation menu"
                        aria-expanded={menuOpen}
                        className="
                            md:hidden
                            rounded-xl
                            border border-white/10
                            bg-white/5
                            px-3 py-2
                            text-gray-300
                            transition
                            hover:bg-white/10
                            hover:text-white
                        "
                    >
                        {menuOpen ? "✕" : "☰"}
                    </button>

                </div>


                {/* Mobile Navigation */}

                {menuOpen && (
                    <div
                        className="
                            mt-4
                            flex
                            flex-col
                            gap-1
                            border-t
                            border-white/10
                            pt-4
                            md:hidden
                        "
                    >

                        <Link
                            href="/"
                            onClick={closeMenu}
                            className="
                                rounded-xl
                                px-4 py-3
                                text-sm
                                text-gray-300
                                transition
                                hover:bg-white/5
                                hover:text-white
                            "
                        >
                            Home
                        </Link>

                        <Link
                            href="/tasks"
                            onClick={closeMenu}
                            className="
                                rounded-xl
                                px-4 py-3
                                text-sm
                                text-gray-300
                                transition
                                hover:bg-white/5
                                hover:text-white
                            "
                        >
                            Tasks
                        </Link>

                        {role === "admin" && (
                            <Link
                                href="/users"
                                onClick={closeMenu}
                                className="
                                    rounded-xl
                                    px-4 py-3
                                    text-sm
                                    text-gray-300
                                    transition
                                    hover:bg-white/5
                                    hover:text-white
                                "
                            >
                                Users
                            </Link>
                        )}

                        {isAuthenticated && (
                            <Link
                                href="/settings"
                                onClick={closeMenu}
                                className="
                                    rounded-xl
                                    px-4 py-3
                                    text-sm
                                    text-gray-300
                                    transition
                                    hover:bg-white/5
                                    hover:text-white
                                "
                            >
                                Settings
                            </Link>
                        )}

                        <Link
                            href="/about"
                            onClick={closeMenu}
                            className="
                                rounded-xl
                                px-4 py-3
                                text-sm
                                text-gray-300
                                transition
                                hover:bg-white/5
                                hover:text-white
                            "
                        >
                            About Us
                        </Link>

                        <Link
                            href={!isAuthenticated ? "/login" : "/logout"}
                            onClick={closeMenu}
                            className="
                                mt-2
                                rounded-xl
                                bg-gradient-to-r
                                from-blue-600
                                to-violet-600
                                px-4 py-3
                                text-center
                                text-sm
                                font-medium
                                text-white
                                transition
                                hover:scale-[1.02]
                            "
                        >
                            {!isAuthenticated ? "Login" : "Logout"}
                        </Link>

                    </div>
                )}

            </div>

        </nav>
    )
}
