// app/api/auth/users/owner-list/route.ts

import { auth } from "@/auth";
import { proxyRequest } from "@/lib/server_proxy";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth()

    if (!session?.accessToken) {
        return NextResponse.json(
            {
                success: false,
                message: "Not authenticated"
            },
            {
                status: 401
            }
        )
    }

    return proxyRequest(
        "auth/users/owner-list", {
        headers: {
            Authorization: `Bearer ${session.accessToken}`
        }
    }
    )
}