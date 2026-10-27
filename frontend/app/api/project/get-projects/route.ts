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


    return proxyRequest(
        `project/get-projects`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${session.accessToken}`
            },
            cache: 'no-store'
        }
    )
}