// lib/login/login.ts

import { LoginRequest, LoginResponse } from "@/types/login";
import { clientFetch } from "../client_api";
import { VerifyLoginRequest } from "@/types/verify_login";

// =========================
// LOGIN
// =========================
export async function login(
    data: LoginRequest
): Promise<LoginResponse> {
    return clientFetch<LoginResponse>(
        "/auth/login", {
        method: "POST",
        body: JSON.stringify(data)
    })
}

// =========================
// VERIFY LOGIN
// =========================
export async function verify_login(
    data: VerifyLoginRequest
) {
    return clientFetch(
        "/auth/verify-login", {
        method: "POST",
        body: JSON.stringify(data)
    })
}
