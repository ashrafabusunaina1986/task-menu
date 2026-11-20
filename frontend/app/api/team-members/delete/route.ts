// app/api/team-members/delete/route.ts

import { auth } from "@/auth";
import { proxyRequest } from "@/lib/server_proxy";

export async function DELETE(request: Request) {

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
    const membership_id = searchParams.get("membership_id");

    if (!membership_id) {
        return Response.json(
            {
                success: false,
                message: "membership_id is required",
            },
            { status: 400 }
        );
    }

    return proxyRequest(
        `team-members/delete/${encodeURIComponent(membership_id)}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
            },
        }
    );
}