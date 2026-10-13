// app/page.tsx

import Link from "next/link";
import { auth } from "@/auth";
import TopNavigation from "@/components/navigation/TopNavigation";

export default async function HomePage() {

    const session = await auth();

    const role = session?.user?.role;

    return (
        <main className="min-h-screen bg-black overflow-hidden relative">
            <TopNavigation
                isAuthenticated={!!session}
                role={role}
            />


            {/* Hero */}
            <div className="
                min-h-[calc(100vh-100px)]
                flex items-center justify-center
                relative
            ">

                {/* Glow Background */}
                <div className="
                    absolute
                    w-[700px] h-[700px]
                    rounded-full
                    bg-violet-600/20
                    blur-[180px]
                " />


                {/* Card */}
                <div className="
                    relative
                    w-full max-w-3xl
                    mx-6
                    rounded-[32px]
                    border border-white/10
                    bg-zinc-950/90
                    shadow-[0_25px_80px_rgba(0,0,0,0.8)]
                    backdrop-blur-xl
                    p-16
                    text-center
                ">

                    {/* Icon */}
                    <div className="
                        mx-auto mb-10
                        flex h-28 w-28
                        items-center justify-center
                        rounded-3xl
                        border border-white/10
                        bg-zinc-900
                        shadow-[0_0_40px_rgba(99,102,241,0.35)]
                    ">
                        <span className="text-5xl">
                            📋
                        </span>
                    </div>


                    {/* Title */}
                    <h1 className="
                        text-6xl
                        font-extrabold
                        bg-gradient-to-r
                        from-blue-500
                        to-violet-500
                        bg-clip-text
                        text-transparent
                    ">
                        Task Menu
                    </h1>


                    {/* Subtitle */}
                    <p className="
                        mt-5
                        text-xl
                        text-gray-400
                    ">
                        Simple Task Management Application
                    </p>


                    {/* Divider */}
                    <div className="
                        relative
                        my-10
                        flex
                        justify-center
                    ">

                        <div className="
                            h-px
                            w-72
                            bg-gradient-to-r
                            from-transparent
                            via-violet-500
                            to-transparent
                        " />

                        <div className="
                            absolute
                            -top-[4px]
                            h-2 w-2
                            rounded-full
                            bg-violet-500
                            shadow-[0_0_20px_#8b5cf6]
                        "
                        />

                    </div>


                    {/* Button */}
                    <Link
                        href="/tasks"
                        className="
                            inline-flex
                            items-center
                            gap-3
                            rounded-2xl
                            px-8 py-4
                            text-xl
                            font-semibold
                            text-white
                            bg-gradient-to-r
                            from-blue-600
                            to-violet-600
                            transition-all
                            duration-300
                            hover:scale-105
                            hover:shadow-[0_0_35px_rgba(99,102,241,0.8)]
                        "
                    >
                        📋 View Tasks →
                    </Link>

                </div>

            </div>

        </main>
    );
}