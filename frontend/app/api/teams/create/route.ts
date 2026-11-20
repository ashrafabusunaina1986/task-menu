// app/api/teams/create/route.ts


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

    const body = await request.json();

    return proxyRequest(
        `teams/create`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
            },
            body: JSON.stringify(body),
        }
    );
}
