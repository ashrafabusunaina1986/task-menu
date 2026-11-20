// app/api/team-members/create/route.ts


import { auth } from "@/auth";
import { proxyRequest } from "@/lib/server_proxy";
import { NextResponse } from "next/server";

export async function POST(request: Request) {

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
        "team-members/create",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
            },
            body: JSON.stringify(body),
        }
    );
}