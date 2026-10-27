
// components/settings/AccessTokenProcessor.tsx
"use client";

import { decodeJwt } from 'jose';
import React, { useEffect, useMemo, useState } from 'react';

interface Props {
    accessToken: string;
}

export default function AccessTokenProcessor({ accessToken }: Props) {
    const [now, setNow] = useState<number | null>(null);

    // حساب زمن انتهاء صلاحية التوكن بشكل معزول ومحمي من الـ Memory Leaks
    const expiration = useMemo(() => {
        try {
            const payload = decodeJwt(accessToken);
            if (!payload.exp) return null;
            return payload.exp * 1000;
        } catch (error) {
            return null;
        }
    }, [accessToken]);

    // حل مشكلة الـ SSR Hydration: بدء التوقيت اللحظي فقط بعد الإقلاع الكامل داخل المتصفح
    useEffect(() => {
        setNow(Date.now());
        const timer = setInterval(() => {
            setNow(Date.now());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    if (!expiration) {
        return (
            <div className='p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-xs font-bold text-rose-400 uppercase tracking-wider animate-pulse'>
                ⚠️ Cryptographic Signature Node Invalid
            </div>
        );
    }

    // الانتظار الآمن لتجنب الحسابات العشوائية الصفرية قبل الـ Mount
    const currentNow = now ?? Date.now();
    const remaining = Math.max(0, expiration - currentNow);
    const total = 15 * 60 * 1000; // ميزانية التوكن الافتراضية 15 دقيقة
    const progress = Math.min(100, Math.max(0, (remaining / total) * 100));

    const minutes = Math.floor(remaining / (60 * 1000));
    const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
    const isActive = remaining > 0;

    // دالة ديناميكية لتغيير لون البار الإحصائي تدريجياً لبيان اقتراب انتهاء الجلسة
    const getProgressBarColor = (percent: number) => {
        if (percent > 50) return "from-blue-500 to-purple-500 shadow-purple-500/20";
        if (percent > 20) return "from-purple-500 to-amber-500 shadow-amber-500/20";
        return "from-amber-500 to-rose-500 shadow-rose-500/30";
    };
    return (
        <div className='w-full p-4 rounded-2xl border border-gray-800/60 bg-[#11111a]/70 backdrop-blur-md shadow-lg space-y-3.5 animate-fadeIn'>
            {/* Upper Telemetry Metrics Metadata Row */}
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Session Payload Authorization
                    </span>
                    {now === null && (
                        <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-ping" />
                    )}
                </div>

                <span className={`font-mono text-xs font-bold tracking-tight px-2 py-0.5 rounded ${isActive ? "text-purple-400 bg-[#16162a]" : "text-rose-400 bg-rose-500/5"}`}>
                    {minutes.toString().padStart(2, "0")}m {seconds.toString().padStart(2, "0")}s
                </span>
            </div>

            {/* Premium Processor Container Track Bar */}
            <div className='h-2 w-full overflow-hidden rounded-full bg-gray-900 border border-gray-800/40 p-[1px]'>
                <div
                    className={`h-full rounded-full bg-gradient-to-r shadow-md transition-all duration-1000 ease-linear ${getProgressBarColor(progress)}`}
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Lower Telemetry Footnotes Indicator */}
            <div className='flex justify-between items-center text-[10px] font-bold uppercase tracking-widest select-none'>
                <div className="flex items-center gap-1.5">
                    <span className="text-gray-600">Status Node:</span>
                    <span className={isActive ? "text-emerald-400" : "text-rose-500 animate-pulse"}>
                        {isActive ? "Active Verified Pipeline" : "Expired Session Token"}
                    </span>
                </div>
                
                <span className="text-gray-600 font-mono hidden sm:inline">
                    JWT_EXP: {(expiration / 1000).toString().slice(-6)}...
                </span>
            </div>
        </div>
    );
}
