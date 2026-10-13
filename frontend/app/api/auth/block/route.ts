
// app/api/auth/block/route.ts

import { NextRequest } from "next/server"
import { proxyRequest } from "@/lib/server_proxy"
import { randomUUID } from "crypto"
import { cookies } from "next/headers"

export async function GET(req: NextRequest) {

    const cookieStore = await cookies()

    let deviceId = cookieStore.get(
        "device_id"
    )?.value

    if (!deviceId) {
        deviceId = randomUUID()

        cookieStore.set(
            "device_id",
            deviceId,
            {
                httpOnly: true,
                secure:
                    process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 60 * 24 * 365
            }
        )
    }

    const ipId = req.headers.get(
        "CF-Connecting-IP"
    )

    if (!ipId) {
        return new Response(
            "Client IP is required",
            { status: 400 }
        )
    }

    const blockType =
        req.nextUrl.searchParams.get(
            "block_type"
        )

    const user_id =
        req.nextUrl.searchParams.get(
            "user_id"
        )
    const register_id =
        req.nextUrl.searchParams.get(
            "register_id"
        )

    if (
        blockType !== "user" &&
        blockType !== "ip" &&
        blockType !== "device"
    ) {
        return Response.json(
            {
                message: "Invalid block type"
            },
            {
                status: 400
            }
        )
    }

    const params =
        new URLSearchParams()

    params.set(
        "block_type",
        blockType
    )

    if (blockType === "device") {
        params.set(
            "device_id",
            deviceId
        )
    }

    if (blockType === "ip") {
        params.set(
            "ip_id",
            ipId
        )
    }
    if (user_id)
        params.set(
            "user_id", user_id
        )
    
    if (register_id)
        params.set(
            "register_id", register_id
        )
    
    return proxyRequest(
        `/user-block/block-status?${params.toString()}`,
        {
            method: "GET"
        }
    )
}