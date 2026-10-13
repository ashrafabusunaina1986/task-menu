// app/api/tasks/[id]/route.ts

import { auth } from "@/auth";
import { NextResponse } from "next/server";

const BACKEND = process.env.API_URL_SERVER;

if (!BACKEND) {
    throw new Error("API_URL_SERVER is not defined");
}

// ===============================================
// GET TASK
// ===============================================

export async function GET(
    _: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await auth()

        const res = await fetch(`${BACKEND}/tasks/${id}`, {
            headers: {
                Authorization: `Bearer ${session?.accessToken}`,
            },
        });

        const data = await res.json();

        return NextResponse.json(data, {
            status: res.status,
        });
    } catch (error) {
        return NextResponse.json(
            {
                message:
                    error instanceof Error
                        ? error.message
                        : "Internal Server Error",
            },
            {
                status: 500,
            }
        );
    }
}

// ===============================================
// UPDATE TASK
// ===============================================

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        const { id } = await params;
        const body = await req.json();

        const res = await fetch(`${BACKEND}/tasks/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer  ${session?.accessToken}`
            },
            body: JSON.stringify(body),
        });

        const data = await res.json();

        return NextResponse.json(data, {
            status: res.status,
        });
    } catch (error) {
        return NextResponse.json(
            {
                message:
                    error instanceof Error
                        ? error.message
                        : "Internal Server Error",
            },
            {
                status: 500,
            }
        );
    }
}

// ===============================================
// DELETE TASK
// ===============================================

export async function DELETE(
    _: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session=await auth()

        const res = await fetch(`${BACKEND}/tasks/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer  ${session?.accessToken}`
            }
        });

        const data = await res.json();

        return NextResponse.json(data, {
            status: res.status,
        });
    } catch (error) {
        return NextResponse.json(
            {
                message:
                    error instanceof Error
                        ? error.message
                        : "Internal Server Error",
            },
            {
                status: 500,
            }
        );
    }
}
