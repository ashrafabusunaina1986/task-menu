// app/api/teams/delete/route.ts


import { auth } from "@/auth";
import { proxyRequest } from "@/lib/server_proxy";

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

    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get("team_id");

    if (!teamId) {
        return Response.json(
            {
                success: false,
                message: "Team id is required",
            },
            { status: 400 }
        );
    }

    return proxyRequest(
        `teams/delete?team_id=${encodeURIComponent(teamId)}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
            },
        }
    );
}
