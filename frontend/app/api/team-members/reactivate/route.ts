// app/api/team-members/reactivate/route.ts

import { auth } from "@/auth";
import { proxyRequest } from "@/lib/server_proxy";

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

    const user_id = searchParams.get("user_id");
    const team_id = searchParams.get("team_id");

    if (!user_id || !team_id) {
        return Response.json(
            {
                success: false,
                message: "user_id and team_id are required",
            },
            { status: 400 }
        );
    }

    const params = new URLSearchParams({
        user_id,
        team_id,
    });

    return proxyRequest(
        `team-members/reactivate?${params.toString()}`,
        {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
            },
        }
    );
}