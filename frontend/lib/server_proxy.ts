// lib/server_proxy.ts

import { NextResponse } from "next/server";

const API_URL_SERVER = process.env.API_URL_SERVER;

if (!API_URL_SERVER) {
    throw new Error("API_URL_SERVER is not defined.");
}

export async function proxyRequest(
    path: string,
    options: RequestInit = {}
) {
    try {
        const url = new URL(path, `${API_URL_SERVER}/`);

        const response = await fetch(url.toString(), {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(options.headers ?? {}),
            },
        });

        const data = await response.json().catch(() => null);
        console.log("API ERROR:", data)
        if (!response.ok) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        data?.detail ??
                        data?.message ??
                        "Request failed",
                },
                {
                    status: response.status,
                }
            );
        }

        return NextResponse.json(
            {
                success: true,
                data,
            },
            {
                status: response.status,
            }
        );
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
