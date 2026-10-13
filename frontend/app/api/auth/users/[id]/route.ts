// app/api/auth/users/[id]/route.ts

import { proxyRequest } from "@/lib/server_proxy"
import { auth } from "@/auth"


interface Props {
    params: Promise<{
        id: string
    }>
}


async function getToken() {

    const session = await auth()

    if (!session?.accessToken) {
        return null
    }

    return session.accessToken
}


export async function GET(
    _: Request,
    { params }: Props
) {

    const token = await getToken()

    if (!token) {
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

    const { id } = await params

    return proxyRequest(
        `auth/users/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
}


export async function PUT(
    req: Request,
    { params }: Props
) {

    const token = await getToken()

    if (!token) {
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

    const { id } = await params

    return proxyRequest(
        `auth/users/${id}`,
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },

            body: JSON.stringify(
                await req.json()
            )
        }
    )
}


export async function DELETE(
    _: Request,
    { params }: Props
) {

    const token = await getToken()

    if (!token) {
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

    const { id } = await params

    return proxyRequest(
        `auth/users/${id}`,
        {
            method: "DELETE",

            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
}