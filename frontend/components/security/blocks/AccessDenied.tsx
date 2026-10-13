
// components/security/blocks/AccessDenied.tsx

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface AccessDeniedProps {
    message?: string
    blockedUntil?: string
}

export default function AccessDenied({
    message = "Access to this resource has been denied.",
    blockedUntil,
}: AccessDeniedProps) {

    const router = useRouter()

    const [remaining, setRemaining] = useState(0)

    useEffect(() => {

        if (!blockedUntil) {
            return
        }

        const targetTime = new Date(blockedUntil).getTime()

        const updateRemaining = () => {

            const difference = targetTime - Date.now()

            if (difference <= 0) {
                setRemaining(0)
                router.refresh()
                return
            }

            setRemaining(difference)
        }

        updateRemaining()

        const interval = setInterval(
            updateRemaining,
            1000
        )

        return () => clearInterval(interval)

    }, [blockedUntil, router])


    const totalSeconds = Math.ceil(remaining / 1000)

    const minutes = Math.floor(totalSeconds / 60)

    const seconds = totalSeconds % 60


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
                    shadow-[0_0_40px_rgba(99,102,241,0.35)]
                ">
                    <span className="text-5xl">
                        🛡️
                    </span>
                </div>


                {/* Title */}
                <h1 className="
                    text-5xl
                    font-extrabold
                    bg-gradient-to-r
                    from-blue-500
                    to-violet-500
                    bg-clip-text
                    text-transparent
                ">
                    Access Denied
                </h1>


                {/* Message */}
                <p className="
                    mt-5
                    text-xl
                    text-gray-400
                ">
                    {message}
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
                        h-2
                        w-2
                        rounded-full
                        bg-violet-500
                        shadow-[0_0_20px_#8b5cf6]
                    " />

                </div>


                {/* Countdown */}
                {blockedUntil && remaining > 0 && (
                    <div className="
                        mx-auto
                        max-w-xl
                        rounded-2xl
                        border
                        border-white/10
                        bg-zinc-900/70
                        px-6
                        py-6
                    ">

                        <p className="
                            text-sm
                            uppercase
                            tracking-widest
                            text-gray-500
                        ">
                            Security Restriction
                        </p>


                        <p className="
                            mt-3
                            text-gray-400
                        ">
                            Try again in
                        </p>


                        <p className="
                            mt-2
                            font-mono
                            text-4xl
                            font-bold
                            text-violet-400
                        ">
                            {minutes.toString().padStart(2, "0")}
                            :
                            {seconds.toString().padStart(2, "0")}
                        </p>

                    </div>
                )}


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

