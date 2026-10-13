// app/api/auth/profile/route.ts

import { auth } from "@/auth";
import { proxyRequest } from "@/lib/server_proxy";

export async function GET() {
    const session = await auth()

    if (!session?.accessToken) {
        return new Response(
            JSON.stringify({
                success: false,
                message: "Unauthorized"
            }),
            {
                status: 401,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )
    }
    return proxyRequest("/profile", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${session.accessToken}`
        }
    })
}