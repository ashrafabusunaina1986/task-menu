// app/api/teams/get-team-by-name/route.ts


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
    const name = searchParams.get("name");

    if (!name) {
        return Response.json(
            {
                success: false,
                message: "Name is required",
            },
            { status: 400 }
        );
    }

    return proxyRequest(
        `teams/get-team-by-name?name=${encodeURIComponent(name)}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
            },
            cache: "no-store",
        }
    );
}
