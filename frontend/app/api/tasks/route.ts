// app/api/tasks/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

const BACKEND = process.env.API_URL_SERVER;

if (!BACKEND) {
    throw new Error("API_URL_SERVER is not defined");
}

export async function GET(req: NextRequest) {


    try {
        const session = await auth();

        console.log("TASK API SESSION:", {
            user: session?.user,
            hasToken: !!session?.accessToken,
        });

        if (!session?.accessToken) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }
        const token = session.accessToken;
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



        const res = await fetch(`${BACKEND}/tasks/?project_id=${encodeURIComponent(project_id)}`, {
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
                Accept: "application/json"
            },
            cache: "no-store",
        });
        console.log("BACKEND STATUS:", res.status);
        const text = await res.text()
        console.log({ "BACKEND RESPONSE": text })
        const data = JSON.parse(text)

        return NextResponse.json(data, {
            status: res.status,
            headers: {
                "Content-Type": "application/json"
            }
        });

    } catch (error) {
        return NextResponse.json(
            {
                success: false,
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

export async function POST(req: NextRequest) {
    try {
        const session = await auth();

        if (!session?.accessToken) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }



        const body = await req.json();

        const res = await fetch(`${BACKEND}/tasks/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.accessToken}`,
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
                success: false,
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