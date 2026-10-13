
// components/settings/TokenExpiry.tsx

"use client"

import AccessTokenProcessor from "./AccessTokenProcessor"
import RefreshTokenProcessor from "./RefreshTokenProcessor"

interface TokenExpiryProps {
    accessToken: string
    refreshToken: string
}

export default function TokenExpiry({
    accessToken,
    refreshToken,
}: TokenExpiryProps) {

    return (
        <section className="mt-10">

            <div className="mb-6">

                <h2 className="
                    text-2xl
                    font-bold
                    text-white
                ">
                    Authentication
                </h2>

                <p className="
                    mt-1
                    text-sm
                    text-gray-400
                ">
                    Monitor authentication token expiration.
                </p>

            </div>


            <div className="
                grid
                grid-cols-1
                gap-6
                md:grid-cols-2
            ">

                {/* Access Token */}

                <div className="
                    rounded-3xl
                    border border-white/10
                    bg-zinc-950/80
                    p-6
                    backdrop-blur-xl
                    shadow-[0_15px_50px_rgba(0,0,0,.5)]
                ">

                    <AccessTokenProcessor
                        accessToken={accessToken}
                    />

                </div>


                {/* Refresh Token */}

                <div className="
                    rounded-3xl
                    border border-white/10
                    bg-zinc-950/80
                    p-6
                    backdrop-blur-xl
                    shadow-[0_15px_50px_rgba(0,0,0,.5)]
                ">

                    <RefreshTokenProcessor
                        refreshToken={refreshToken}
                    />

                </div>

            </div>

        </section>
    )
}
