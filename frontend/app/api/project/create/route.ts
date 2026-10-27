// app/api/project/create/route.ts

import { auth } from "@/auth";
import { proxyRequest } from "@/lib/server_proxy";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
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

    let body: unknown;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json(
            {
                success: false,
                message: "Invalid json body"
            },
            {
                status: 400
            }
        )
    }


    return proxyRequest(
        `project/create`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${session.accessToken}`
            },
            body: JSON.stringify(body)
        }
    )
}