// app/api/teams/get-teams/route.ts

import { auth } from "@/auth";
import { proxyRequest } from "@/lib/server_proxy";


export async function GET() {

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

    return proxyRequest(
        `teams/get-teams`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
            },
            cache: "no-store",
        }
    )
}
