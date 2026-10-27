// app/api/project/delete/route.ts

import { auth } from "@/auth";
import { proxyRequest } from "@/lib/server_proxy";
import { NextRequest, NextResponse } from "next/server";


export async function DELETE(req: NextRequest) {
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

    const project_id = req.nextUrl.searchParams.get(
        "project_id"
    )

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

    return proxyRequest(
        `project/delete?project_id=${encodeURIComponent(project_id)}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${session.accessToken}`
            }
        }
    )
}