// components/security/RecaptchaProvider.tsx

"use client"

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3"

interface Props {
    children: React.ReactNode
}

export default function RecaptchaProvider({
    children,
}: Props) {

    const siteKey =
        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

    console.log(
        "RECAPTCHA SITE KEY EXISTS:",
        Boolean(siteKey)
    )

    return (
        <GoogleReCaptchaProvider
            reCaptchaKey={siteKey ?? ""}
            scriptProps={{
                async: true,
                defer: true,
                appendTo: "head",
            }}
        >
            {children}
        </GoogleReCaptchaProvider>
    )
}
