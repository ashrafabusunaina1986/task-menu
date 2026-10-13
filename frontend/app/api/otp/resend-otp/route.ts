// app/api/otp/resend-otp/route.ts

import { proxyRequest } from "@/lib/server_proxy"
import { randomUUID } from "crypto"
import { cookies } from "next/headers"

export async function POST(req: Request) {
    const body = await req.json()


    const cookieStore = await cookies()

    let deviceId = cookieStore.get(
        "device_id"
    )?.value

    if (!deviceId) {
        deviceId = randomUUID()

        cookieStore.set("device_id", deviceId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: '/',
            maxAge: 60 * 60 * 24 * 365
        })
    }
    const ip = req.headers.get(
        "CF-Connecting-IP"
    )

    if (!ip) {
        return new Response(
            "Client IP is required",
            { status: 400 }
        )
    }

    return proxyRequest(
        "resend-otp", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "CF-Connecting-IP": ip,
            "X-Device-ID": deviceId,
        },
        body: JSON.stringify(body)
    }
    )
}