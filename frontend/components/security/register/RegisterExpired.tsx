
// components/security/register/RegisterExpired.tsx

"use client"

import { useRouter } from "next/navigation"

interface RegisterExpiredProps {
    message?: string
}

export default function RegisterExpired({
    message = "Your registration session has expired. Please register again.",
}: RegisterExpiredProps) {

    const router = useRouter()

    return (
        <main className="
            min-h-screen
            bg-black
            overflow-hidden
            relative
            flex
            items-center
            justify-center
            px-6
        ">

            {/* Glow */}
            <div className="
                absolute
                w-[700px]
                h-[700px]
                rounded-full
                bg-violet-600/20
                blur-[180px]
            " />

            {/* Card */}
            <div className="
                relative
                w-full
                max-w-3xl
                rounded-[32px]
                border
                border-white/10
                bg-zinc-950/90
                shadow-[0_25px_80px_rgba(0,0,0,0.8)]
                backdrop-blur-xl
                p-16
                text-center
            ">

                {/* Icon */}
                <div className="
                    mx-auto
                    mb-10
                    flex
                    h-28
                    w-28
                    items-center
                    justify-center
                    rounded-3xl
                    border
                    border-white/10
                    bg-zinc-900
                    shadow-[0_0_40px_rgba(239,68,68,0.25)]
                ">
                    <span className="text-5xl">
                        ⏳
                    </span>
                </div>

                {/* Title */}
                <h1 className="
                    text-4xl
                    md:text-5xl
                    font-extrabold
                    bg-gradient-to-r
                    from-red-500
                    to-violet-500
                    bg-clip-text
                    text-transparent
                ">
                    Registration Expired
                </h1>

                {/* Message */}
                <p className="
                    mt-5
                    text-lg
                    md:text-xl
                    text-gray-400
                ">
                    {message}
                </p>

                {/* Divider */}
                <div className="
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
                </div>

                {/* Register Again */}
                <button
                    type="button"
                    onClick={() => router.replace("/register")}
                    className="
                        rounded-xl
                        bg-violet-600
                        px-8
                        py-4
                        font-semibold
                        text-white
                        transition
                        hover:bg-violet-500
                        focus:outline-none
                        focus:ring-2
                        focus:ring-violet-400
                    "
                >
                    Register Again
                </button>

                {/* Footer */}
                <p className="
                    mt-10
                    text-sm
                    text-gray-600
                ">
                    Workora Security System
                </p>

            </div>

        </main>
    )
}
