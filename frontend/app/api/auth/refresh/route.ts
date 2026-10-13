// app/api/auth/refresh/route.ts

import { auth } from "@/auth";
import { proxyRequest } from "@/lib/server_proxy";
import { NextResponse } from "next/server";

export async function POST() {
    const session = await auth()

    if (!session?.refreshToken) {
        return NextResponse.json({
            success: false,
            message: "no refresh token"
        },
            {
                status: 401
            }
        )
    }

    return proxyRequest(
        "auth/refresh",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(
                {
                    refreshToken: session.refreshToken
                }
            )
        }
    )
}