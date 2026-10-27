// components/security/RecaptchaProvider.tsx

"use client";

import React, { useMemo } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

interface Props {
    children: React.ReactNode;
}

export default function RecaptchaProvider({ children }: Props) {
    // جلب مفتاح التحقق العام المشفر من متغيرات الخادم المحقونة بالـ Dockerfile
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    // عزل وفحص سلامة التوكن أمنياً دون كتابة سجلات علنية مكشوفة للمتصفح
    const validatedSiteKey = useMemo(() => {
        if (!siteKey) {
            if (process.env.NODE_ENV !== "production") {
                console.warn("[Security Alert]: NEXT_PUBLIC_RECAPTCHA_SITE_KEY is completely missing from your environment config.");
            }
            // تمرير كائن وهمي آمن لمنع تكسر الـ Compiler لـ Next.js أثناء الـ Build
            return "MISSING_SECURITY_FALLBACK_KEY";
        }
        return siteKey;
    }, [siteKey]);
    return (
        <GoogleReCaptchaProvider
            reCaptchaKey={validatedSiteKey}
            scriptProps={{
                async: true,   // تشغيل التحميل غير المتزامن لعدم حظر رندرة واجهات الـ CSS
                defer: true,   // تأجيل التنفيذ حتى اكتمال تحميل هيكل الصفحة لسرعة الـ SEO
                appendTo: "head", // حقن السكربت في رأس الصفحة لحماية بوابات الـ Forms مبكراً
                nonce: undefined,
            }}
        >
            {children}
        </GoogleReCaptchaProvider>
    );
}
