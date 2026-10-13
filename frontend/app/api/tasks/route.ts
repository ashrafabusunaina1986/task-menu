// app/api/tasks/route.ts

import { NextResponse } from "next/server";
import { auth } from "@/auth";

const BACKEND = process.env.API_URL_SERVER;

if (!BACKEND) {
    throw new Error("API_URL_SERVER is not defined");
}

export async function GET() {
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

        console.log("TOKEN EXISTS:", !!token);
        console.log("TOKEN PREFIX:", token?.slice(0, 20));
        console.log({ "TASK SESSION": session });

        console.log({
            "TOKEN EXISTS":
                !!session?.accessToken
        }
        );

        const res = await fetch(`${BACKEND}/tasks/`, {
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

export async function POST(req: Request) {
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