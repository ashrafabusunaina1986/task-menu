
// components/settings/TokenExpiry.tsx"use client";

import AccessTokenProcessor from "./AccessTokenProcessor";
import RefreshTokenProcessor from "./RefreshTokenProcessor";

interface TokenExpiryProps {
    accessToken: string;
    refreshToken: string;
}

export default function TokenExpiry({
    accessToken,
    refreshToken,
}: TokenExpiryProps) {

    return (
        <section className="mt-12 space-y-6 animate-fadeIn">
            {/* 📊 ترويسة اللوحة التحليلية للتحقق والمصادقة الأمنية */}
            <div className="border-b border-gray-900/60 pb-3">
                <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-purple-500 shadow-md shadow-purple-500/50"></span>
                    Cryptographic Authentication Credentials
                </h2>
                <p className="mt-1 text-xs text-gray-500 max-w-xl">
                    Live telemetry tracking of active token lifecycle thresholds, encryption expirations, and tunnel stream authorization nodes.
                </p>
            </div>

            {/* شبكة توزيع متجاوبة لعرض المعالجات الإحصائية حياً بمرور واحد دون تداخل كروت */}
            <div className="
                grid
                grid-cols-1
                gap-5
                md:grid-cols-2
                w-full
            ">
                {/* Access Token Lifespan Controller Module */}
                <AccessTokenProcessor
                    accessToken={accessToken}
                />

                {/* Refresh Token Lifespan Controller Module */}
                <RefreshTokenProcessor
                    refreshToken={refreshToken}
                />
            </div>
        </section>
    );
}
