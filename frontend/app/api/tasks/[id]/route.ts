// app/api/tasks/[id]/route.ts

import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.API_URL_SERVER;

if (!BACKEND) {
    throw new Error("API_URL_SERVER is not defined");
}

// ===============================================
// GET TASK
// ===============================================

export async function GET(
    _: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const task_id = (await params).id,
        project_id = _.nextUrl.searchParams.get("project_id")

    if (!task_id) {
        return NextResponse.json(
            {
                success: false,
                message: "Task id is required"
            },
            {
                status: 400
            }
        )
    }
    if (!project_id) {
        return NextResponse.json(
            {
                success: false,
                message: "Project id is required"
            },
            {
                status: 400
            }
        )
    }
    try {
        const session = await auth()

        const res = await fetch(`${BACKEND}/tasks/task?task_id=${encodeURIComponent(task_id)}&project_id=${encodeURIComponent(project_id)}`, {
            headers: {
                Authorization: `Bearer ${session?.accessToken}`,
            },
            cache: 'no-store'
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
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (!session?.accessToken) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Not authenticated"
                },
                {
                    status: 401
                }
            )
        }
        const { id } = await params;
        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Task id is required"
                },
                {
                    status: 400
                }
            )
        }
        let body: unknown

        try {
            body = await req.json()
        } catch {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid body json"
                },
                {
                    status: 400
                }
            )
        }
        const project_id = req.nextUrl.searchParams.get("project_id")

        if (!project_id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Project id is required"
                },
                {
                    status: 400
                }
            )
        }

        const res = await fetch(`${BACKEND}/tasks/${id}?project_id=${encodeURIComponent(project_id)}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.accessToken}`
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
    _: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await auth()
        if (!session?.accessToken) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Not authenticated"
                },
                {
                    status: 401
                }
            )
        }
        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Task id is required"
                },
                {
                    status: 400
                }
            )
        }
        const project_id = _.nextUrl.searchParams.get("project_id")
        if (!project_id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Project id is required"
                },
                {
                    status: 400
                }
            )
        }

        const res = await fetch(`${BACKEND}/tasks/${id}?project_id=${encodeURIComponent(project_id)}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${session.accessToken}`
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
