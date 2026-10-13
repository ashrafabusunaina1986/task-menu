// components/user/UserHeader.tsx
"use client"

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
    home?: boolean
};

export default function UserHeader(
    { user
        , logout,
        isBack = false,
        home = true
    }: UserHeaderProps) {
    const router = useRouter()
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                userRef.current
                &&
                !userRef.current.contains(event.target as Node)
            ) {
                setIsUserMenuOpen(false)
            }

        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])
    return (
        <div
            className="
        relative
        z-50
        w-[90%]
        max-w-6xl
        mx-auto
        mb-4
        flex
        items-center
        justify-between
        rounded-2xl
        border border-white/10
        bg-zinc-950/90
        backdrop-blur-xl
        px-6 py-4
        shadow-[0_15px_50px_rgba(0,0,0,.6)]
        "
        >

            <div className="relative z-[100]"
                ref={userRef}
            >

                {/* User Avatar */}
                <button
                    type="button"
                    onClick={() => setIsUserMenuOpen((prev) => !prev)}
                    className="flex items-center justify-center rounded-full focus:outline-none"
                >
                    {user?.image ? (
                        <img
                            src={user.image}
                            alt={user.name ?? "User"}
                            className="
                        h-12 w-12
                        rounded-full
                        object-cover
                        border border-white/10
                        transition
                        hover:scale-105
                    "
                        />
                    ) : (
                        <div
                            className="
                        flex h-12 w-12
                        items-center justify-center
                        rounded-full
                        bg-gradient-to-r
                        from-blue-600
                        to-violet-600
                        text-lg font-bold
                        text-white
                        transition
                        hover:scale-105
                    "
                        >
                            {user?.name?.charAt(0).toUpperCase() ?? "U"}
                        </div>
                    )}
                </button>


                {/* User Dropdown */}
                {isUserMenuOpen && (
                    <div
                        className="
                    absolute
                    left-0
                    top-full
                    z-[9999]
                    mt-3
                    w-64
                    overflow-hidden
                    rounded-2xl
                    border border-white/10
                    bg-zinc-950/95
                    backdrop-blur-xl
                    shadow-[0_15px_50px_rgba(0,0,0,.6)]
                "
                    >

                        {/* User Info */}
                        <div className="border-b border-white/10 px-4 py-4">

                            <div className="flex items-center gap-3">

                                {user?.image ? (
                                    <img
                                        src={user.image}
                                        alt={user.name ?? "User"}
                                        className="h-10 w-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div
                                        className="
                                    flex h-10 w-10
                                    items-center justify-center
                                    rounded-full
                                    bg-gradient-to-r
                                    from-blue-600
                                    to-violet-600
                                    font-bold
                                    text-white
                                "
                                    >
                                        {user?.name?.charAt(0).toUpperCase() ?? "U"}
                                    </div>
                                )}

                                <div className="min-w-0">
                                    <p className="truncate font-semibold text-white">
                                        {user?.name}
                                    </p>

                                    <p className="truncate text-xs text-gray-400">
                                        {user?.email}
                                    </p>
                                </div>

                            </div>

                        </div>
                        {/* Home */}
                        {
                            home ?
                                <button
                                    type="button"
                                    className="
                        flex w-full items-center
                        px-4 py-3
                        text-left text-sm
                        text-gray-300
                        transition
                        hover:bg-white/5
                        hover:text-white
                    "
                                    onClick={() => {
                                        setIsUserMenuOpen(false);
                                        router.push("/");
                                    }}
                                >
                                    Home
                                </button> : ""
                        }
                        {/* Back */}
                        {isBack ? <button
                            type="button"
                            className="
                        flex w-full items-center
                        px-4 py-3
                        text-left text-sm
                        text-gray-300
                        transition
                        hover:bg-white/5
                        hover:text-white
                    "
                            onClick={() => {
                                setIsUserMenuOpen(false);
                                router.back()
                            }}
                        >
                            Back
                        </button> : ""

                        }

                        {/* Profile */}
                        {
                            user ?
                                <button
                                    type="button"
                                    className="
                        flex w-full items-center
                        px-4 py-3
                        text-left text-sm
                        text-gray-300
                        transition
                        hover:bg-white/5
                        hover:text-white
                    "
                                    onClick={() => {
                                        setIsUserMenuOpen(false);
                                        router.push("/profile");
                                    }}
                                >
                                    Profile
                                </button> : ""
                        }

                        {/* Logout */}
                        {logout ? <button
                            type="button"
                            onClick={() => {
                                setIsUserMenuOpen(false);
                                logout?.();
                            }}
                            className="
                        flex w-full items-center
                        border-t border-white/10
                        px-4 py-3
                        text-left text-sm
                        text-red-400
                        transition
                        hover:bg-red-500/10
                        hover:text-red-300
                    "
                        >
                            Logout
                        </button> : ""}

                    </div>
                )}

            </div>

        </div>
    )
}
