
// components/settings/RefreshTokenProcessor.tsx
"use client"

import { decodeJwt } from "jose"
import { useEffect, useMemo, useState } from "react"

interface Props {
    refreshToken: string
}

export default function RefreshTokenProcessor(
    { refreshToken, }: Props
) {
    const [now, setNow] = useState(Date.now())

    const expiration = useMemo(() => {
        try {
            const payload = decodeJwt(refreshToken)
            if (!payload.exp) return null
            return payload.exp * 1000
        } catch (error) {
            return null
        }
    }, [refreshToken])

    useEffect(() => {
        const timer = setInterval(() => {
            setNow(Date.now())
        }, 1000);
        return () => clearInterval(timer)
    }, [])

    if (!expiration) return (
        <div className="text-sm text-red-400">
            Invalid Refresh Token
        </div>
    )

    const remaining = Math.max(0, expiration - now)

    // 30d
    const total = 30 * 24 * 60 * 60 * 1000

    const progress = Math.min(
        100,
        Math.max(0, (remaining / total) * 100)
    )
    const days = Math.floor(
        remaining / (1000 * 60 * 60 * 24)
    )
    const hours = Math.floor(
        (remaining % (1000 * 60 * 60 * 24)) /
        (1000 * 60 * 60)
    )
    const minutes = Math.floor(
        (remaining % (1000 * 60 * 60)) / (1000 * 60)
    )
    const seconds = Math.floor(
        (remaining % (1000 * 60) / 1000)
    )
    return (
        <div className="w-full">
            <div className="mb-2
            flex items-center justify-between
            ">

                <span className="
                text-sm font-medium text-white">
                    Refresh Token
                </span>

                <span className="text-sm text-gray-400">
                    {days}d {hours}h {minutes}m {seconds}s
                </span>

            </div>

            {/* Processor */}
            <div className="h-3 rounded-full w-full overflow-hidden bg-zinc-800">
                <div
                    className="h-full rounded-full bg-violet-500 transition-all
                duration-1000 ease-linear"
                    style={{
                        width: `${progress}`
                    }}
                />
            </div>

            <div
                className="mt-2 text-xs text-gray-500"
            >
                {
                    remaining > 0
                        ? "Active"
                        : "Expired"
                }
            </div>
        </div>
    )
}
