// lib/otp/client_api.ts

import { OTPResponse } from "@/types/otp";
import { clientFetch } from "../client_api";

// =========================
// SEND OTP
// =========================

export async function sendOTP(
    email: string
) {
    return clientFetch(
        "/otp/send-otp", {
        method: "POST",
        body: JSON.stringify({
            email
        })
    })
}


// =========================
// VERIFY OTP
// =========================

export async function verifyOTP(
    email: string,
    otp: string
) {
    return clientFetch(
        "/otp/verify-otp", {
        method: "POST",
        body: JSON.stringify({
            email,
            otp
        })
    })
}

export async function resendOTP(
    email: string
): Promise<OTPResponse> {
    return clientFetch<OTPResponse>(
        "/otp/resend-otp", {
        method: "POST",
        body: JSON.stringify({
            email
        })
    })
}










