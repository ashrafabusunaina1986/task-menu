
// components/settings/AccessTokenProcessor.tsx

"use client"

interface Props {
    accessToken: string
}

import { decodeJwt } from 'jose'
import React, { useEffect, useMemo, useState } from 'react'

export default function AccessTokenProcessor(
    { accessToken }: Props
) {
    const [now, setNow] = useState(Date.now())

    const expiration = useMemo(() => {
        try {
            const payload = decodeJwt(accessToken)
            if (!payload.exp) return null

            return payload.exp * 1000
        } catch (error) {
            return null
        }
    }, [accessToken])

    useEffect(() => {
        const timer = setInterval(() => {
            setNow(Date.now())
        }, 1000);
        return () => clearInterval(timer)
    }, [])

    if (!expiration) {
        return (
            <div className='text-sm text-red-400'>
                Invalid Access Token
            </div>
        )
    }

    const remaining = Math.max(0, expiration - now)

    const total = 15 * 60 * 1000

    const progress = Math.min(
        100,
        Math.max(0, (remaining / total) * 100)
    )

    const minutes = Math.floor(
        remaining / (60 * 1000)
    )
    const seconds = Math.floor(
        (remaining % (60 * 1000)) / 1000
    )

    return (
        <div className='w-full'>

            <div className='mb-2 flex items-center
            justify-between
            '
            >
                <span className='text-sm font-medium
                text-white'>
                    Access Token
                </span>

                <span className='text-sm text-gray-500'>

                    {minutes}m {seconds}s
                </span>

            </div>

            {/* Processor */}
            <div
                className='
            h-3 w-full overflow-hidden rounded-full
            bg-zinc-800
            '
            >

                <div
                    className='
                        h-full
                        rounded-full
                        bg-blue-500 transition-all duration-1000
                        ease-linear
                        '
                    style={{
                        width: `${progress}%`
                    }}
                />

            </div>



            <div className='mt-2 text-xs text-gray-500'>
                {
                    remaining > 0
                        ?
                        "Active"
                        :
                        "Expire"
                }

            </div>
        </div>
    )
}
