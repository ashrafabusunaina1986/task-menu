// lib/recaptcha/recaptcha.ts

import { RecaptchaRequest, RecaptchaResponse } from "@/types/recaptcha";
import { clientFetch } from "../client_api";

// =========================
// RECAPTCHA
// =========================


export function recaptcha(
    data: RecaptchaRequest
) {
    return clientFetch<RecaptchaResponse>(
        "/recaptcha", {
        method: "POST",
        body: JSON.stringify({
            recaptcha_token: data.recaptchaToken,
            expected_action: data.expectedAction
        })
    }
    )
}