// app/verify-otp/page.tsx

import { Suspense } from "react"
import VerifyOTP from "@/components/security/otp/VerifyOTP"

export default function VerifyOTPPage() {
    return (
        <Suspense
            fallback={
                <main className="
                    min-h-screen bg-black
                    flex items-center justify-center
                    text-white
                ">
                    Loading...
                </main>
            }
        >
            <VerifyOTP />
        </Suspense>
    )
}