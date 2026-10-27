// app/api/project/get-project-by-user/route.ts

import { auth } from "@/auth";
import { proxyRequest } from "@/lib/server_proxy";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const session = await auth()

    if (!session?.accessToken) {
        return NextResponse.json(
            {
                success: false,
                message: "Not authenticated"
            }, { status: 401 }
        )
    }

    const user_id = req.nextUrl.searchParams.get("user_id")

    if (!user_id) {
        return NextResponse.json(
            {
                success: false,
                message: "User id is required"
            }, { status: 400 }
        )
    }

    return proxyRequest(
        `project/get-project-by-user?user_id=${encodeURIComponent(user_id)}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${session.accessToken}`
            }
        }
    )
}