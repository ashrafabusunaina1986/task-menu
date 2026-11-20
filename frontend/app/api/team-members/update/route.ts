// app/api/team-members/update/route.ts

import { auth } from "@/auth";
import { proxyRequest } from "@/lib/server_proxy";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {

    const session = await auth();

    if (!session || !session.user || !session.accessToken) {
        return Response.json(
            {
                success: false,
                message: "Not authenticated",
            },
            { status: 401 }
        );
    }

    const { searchParams } = new URL(request.url);
    const membership_id = searchParams.get("membership_id");

    if (!membership_id) {
        return Response.json(
            {
                success: false,
                message: "membership_id is required",
            },
            { status: 400 }
        );
    }

    let body: unknown;

    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            {
                success: false,
                message: "Invalid JSON body",
            },
            { status: 400 }
        );
    }

    return proxyRequest(
        `team-members/update/${encodeURIComponent(membership_id)}`,
        {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
            },
            body: JSON.stringify(body),
        }
    );
}