// app/api/teams/get-team-by-id/route.ts


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
    const team_id = searchParams.get("team_id");

    if (!team_id) {
        return Response.json(
            {
                success: false,
                message: "Team id is required",
            },
            { status: 400 }
        );
    }

    return proxyRequest(
        `teams/get-team-by-id?team_id=${encodeURIComponent(team_id)}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
            },
            cache: "no-store",
        }
    );
}
