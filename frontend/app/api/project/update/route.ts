// app/api/project/update/route.ts

import { auth } from "@/auth";
import { proxyRequest } from "@/lib/server_proxy";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
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

    const project_id = req.nextUrl.searchParams.get("project_id")

    if (!project_id) {
        return NextResponse.json(
            {
                success: false,
                message: "Project id is required"
            },
            {
                status: 400
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
            }, { status: 400 }
        )
    }

    return proxyRequest(
        `project/update?project_id=${encodeURIComponent(project_id)}`,
        {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${session.accessToken}`
            },
            body: JSON.stringify(body)
        }
    )
}