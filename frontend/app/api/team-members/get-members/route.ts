
// app/api/team-members/get-members/route.ts

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

    searchParams.forEach((value, key) => {
        params.append(key, value);
    });

    const query = params.toString();

    return proxyRequest(
        `team-members/get-members${query ? `?${query}` : ""}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
            },
            cache: "no-store",
        }
    );
}