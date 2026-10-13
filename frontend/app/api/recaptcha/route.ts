// app/api/recaptcha/route.ts

import { proxyRequest } from "@/lib/server_proxy"

export async function POST(
    req: Request
) {
    const body = await req.json()

    return proxyRequest(
        "recaptcha/",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }
    )

}