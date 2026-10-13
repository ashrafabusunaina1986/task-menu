//app/api/auth/users/route.ts

import { proxyRequest } from "@/lib/server_proxy"
import { auth } from "@/auth"


export async function GET() {

    const session = await auth()

    return proxyRequest(
        "auth/users/",
        {
            headers: {
                Authorization: `Bearer ${session?.accessToken}`
            }
        }
    )
}


export async function POST(
    req: Request
) {

    const session = await auth()

    if (!session?.accessToken) {
        return Response.json(
            {
                success: false,
                message: "Unauthorized"
            },
            {
                status: 401
            }
        )
    }


    const body = await req.json()


    return proxyRequest(
        "auth/users",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",

                Authorization: `Bearer ${session.accessToken}`
            },

            body: JSON.stringify(body)
        }
    )
}