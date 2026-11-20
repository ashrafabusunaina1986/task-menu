// app/api/teams/get-teams-by-owner/route.ts


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
    const ownerId = searchParams.get("owner_id");

    if (!ownerId) {
        return Response.json(
            {
                success: false,
                message: "Owner ID is required",
            },
            { status: 400 }
        );
    }

    return proxyRequest(
        `teams/get-teams-by-owner?owner_id=${encodeURIComponent(ownerId)}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
            },
            cache: "no-store",
        }
    );
}
