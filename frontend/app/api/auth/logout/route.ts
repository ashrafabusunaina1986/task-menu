// app/api/auth/logout/route.ts

import { auth, signOut } from "@/auth";
import { proxyRequest } from "@/lib/server_proxy";
import { NextResponse } from "next/server";



export async function POST() {
    const session = await auth()
    console.log(
        {
            isAuthentication: !!session,
            hasRefreshToken: !!session?.refreshToken
        }
    )
    if (session?.refreshToken) {
        const response = await proxyRequest(
            "auth/logout",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(
                    {
                        refresh_token: session.refreshToken
                    }
                )
            }
        )
    }



    await signOut({
        redirect: false
    })

    return NextResponse.json({
        message: "Logged out successful"
    })
}