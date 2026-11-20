// app/api/teams/get-teams-by-status/route.ts

// app/api/teams/get-teams-by-status/route.ts

import { auth } from "@/auth";
import { proxyRequest } from "@/lib/server_proxy";

export async function GET(request: Request) {

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
    const status = searchParams.get("status");

    if (!status) {
        return Response.json(
            {
                success: false,
                message: "Status is required",
            },
            { status: 400 }
        );
    }

    return proxyRequest(
        `teams/get-teams-by-status?status=${encodeURIComponent(status)}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
            },
            cache: "no-store",
        }
    );
}