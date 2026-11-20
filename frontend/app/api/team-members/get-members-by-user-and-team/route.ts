// app/api/team-members/get-members-by-user-and-team/route.ts

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
        `team-members/get-members-by-user-and-team?${params.toString()}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
            },
            cache: "no-store",
        }
    );
}