import { proxyRequest } from "@/lib/server_proxy";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const user_id = req.nextUrl.searchParams.get(
        "user_id"
    )

    if (!user_id)
        return NextResponse.json({
            message: "user id is required"
        },
            { status: 400 })
    const path = `auth/users/email/${user_id}`
    return proxyRequest(
        path
        ,
        {
            method: "GET",
        }
    )
}