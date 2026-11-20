// app/api/teams/get-team-by-project/route.ts


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
    const projectId = searchParams.get("project_id");

    if (!projectId) {
        return Response.json(
            {
                success: false,
                message: "Project id is required",
            },
            { status: 400 }
        );
    }

    return proxyRequest(
        `teams/get-team-by-project?project_id=${encodeURIComponent(projectId)}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
            },
            cache: "no-store",
        }
    );
}
