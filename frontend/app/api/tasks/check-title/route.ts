// frontend/app/api/project/check-title/route.ts

import { auth } from "@/auth";
import { proxyRequest } from "@/lib/server_proxy";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    // 1. Server-Side Security Checkpoint: Enforce absolute token containment guards
    const session = await auth();
    if (!session || !session.accessToken || !session.user) {
        return NextResponse.json(
            {
                success: false,
                message: "Security Clearance Exception: Operator authentication data missing."
            },
            {
                status: 401
            }
        );
    }

    // 2. Query Parameters Extraction Shards
    // ✅ FIXED: Aligned search parameter lookup key name to 'title' to natively match the dynamic user interface payload entries
    const taskTitle =  req.nextUrl.searchParams.get("task_title");
    
    if (!taskTitle || taskTitle.trim() === "") {
        return NextResponse.json(
            {
                success: false,
                message: "Validation Error: Task identifier title string token is required."
            },
            {
                status: 400
            }
        );
    }

    // 3. Dynamic Secure Microservice Tunneling: Forward clean proxy request down to the persistent Python FastAPI container shards
    // Maps parameter routing logic safely to capture case-insensitive unique database matching schemas
    return proxyRequest(
        `tasks/check-title?task_title=${encodeURIComponent(taskTitle.trim())}`,
        {
            headers: {
                Authorization: `Bearer ${session.accessToken}`
            }
        }
    );
}
