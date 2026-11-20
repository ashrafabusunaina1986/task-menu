// app/api/teams/get-team/route.ts


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

    const params = new URLSearchParams();

    const team_id = searchParams.get("team_id");
    const project_id = searchParams.get("project_id");
    const owner_id = searchParams.get("owner_id");
    const name = searchParams.get("name");
    const status = searchParams.get("status");

    if (team_id) params.set("team_id", team_id);
    if (project_id) params.set("project_id", project_id);
    if (owner_id) params.set("owner_id", owner_id);
    if (name) params.set("name", name);
    if (status) params.set("status", status);

    return proxyRequest(
        `teams/get-team?${params.toString()}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
            },
            cache: "no-store",
        }
    );
}
