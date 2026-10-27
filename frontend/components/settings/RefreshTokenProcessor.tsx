
// components/settings/RefreshTokenProcessor.tsx
"use client";

import { decodeJwt } from "jose";
import React, { useEffect, useMemo, useState } from "react";

interface Props {
    refreshToken: string;
}

export default function RefreshTokenProcessor({ refreshToken }: Props) {
    const [now, setNow] = useState<number | null>(null);

    // فك تشفير توكن التجديد الطويل وحساب زمن انتهاء الصلاحية الموثق
    const expiration = useMemo(() => {
        try {
            const payload = decodeJwt(refreshToken);
            if (!payload.exp) return null;
            return payload.exp * 1000;
        } catch (error) {
            return null;
        }
    }, [refreshToken]);

    // حماية الـ Hydration لـ Next.js: بدء العداد اللحظي التفاعلي داخل المتصفح فقط بعد الإقلاع الكامل
    useEffect(() => {
        setNow(Date.now());
        const timer = setInterval(() => {
            setNow(Date.now());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    if (!expiration) return (
        <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-xs font-bold text-rose-400 uppercase tracking-wider animate-pulse">
            ⚠️ Refresh Lifecycle Cryptographic Signature Invalid
        </div>
    );

    // تلافي الحسابات العشوائية الصفرية قبل الـ Client Mount
    const currentNow = now ?? Date.now();
    const remaining = Math.max(0, expiration - currentNow);

    // ميزانية صلاحية توكن التجديد الطويل الافتراضية (30 يوماً)
    const total = 30 * 24 * 60 * 60 * 1000;
    const progress = Math.min(100, Math.max(0, (remaining / total) * 100));

    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    const isActive = remaining > 0;

    // دالة ديناميكية لتحديد تدرج ألوان نيون يتناسب مع العمر الطويل للتوكن
    const getProgressBarColor = (percent: number) => {
        if (percent > 40) return "from-purple-600 via-indigo-500 to-blue-500 shadow-purple-500/10";
        if (percent > 15) return "from-purple-500 to-amber-500 shadow-amber-500/20";
        return "from-amber-500 to-rose-500 shadow-rose-500/30";
    };
    return (
        <div className="w-full p-4 rounded-2xl border border-gray-800/60 bg-[#11111a]/70 backdrop-blur-md shadow-lg space-y-3.5 animate-fadeIn">
            {/* Upper Telemetry Metrics Metadata Row */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Persistence Refresh Token
                    </span>
                    {now === null && (
                        <span className="h-1.5 w-1.5 rounded-full bg-purple-500 " />
                    )}
                </div>

                <span className={`font-mono text-xs font-bold tracking-tight px-2 py-0.5 rounded ${isActive ? "text-purple-400 bg-[#16162a]" : "text-rose-400 bg-rose-500/5"}`}>
                    {days}d {hours}h {minutes}m {seconds}s
                </span>
            </div>

            {/* Premium Processor Container Track Bar */}
            <div className="h-2 rounded-full w-full overflow-hidden bg-gray-900 border border-gray-800/40 p-[1px]">
                <div
                    className={`h-full rounded-full bg-gradient-to-r shadow-md transition-all duration-1000 ease-linear ${getProgressBarColor(progress)}`}
                    // تم الإصلاح الجذري: حقن علامة النسبة المئوية % ليعمل شريط التحميل حياً بنجاح دون أي تجمد
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Lower Telemetry Footnotes Indicator */}
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest select-none">
                <div className="flex items-center gap-1.5">
                    <span className="text-gray-600">Gate State:</span>
                    <span className={isActive ? "text-purple-400" : "text-rose-500 animate-pulse"}>
                        {isActive ? "Persistent Trusted Node" : "Expired Integrity Token"}
                    </span>
                </div>

                <span className="text-gray-600 font-mono hidden sm:inline">
                    REF_KEY: {(expiration / 1000).toString().slice(0, 6)}...
                </span>
            </div>
        </div>
    );
}
