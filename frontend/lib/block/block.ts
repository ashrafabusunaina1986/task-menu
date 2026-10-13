// lib/block/block.ts

import { BlockStatus } from "@/types/block";
import { clientFetch } from "../client_api";
import { string } from "zod";


// =========================
// BLOCK STATUS
// =========================
export async function block_status(
    blockType: "user" | "ip" | "device",
    user_id?: string,
    register_id?: string
): Promise<BlockStatus> {

    const params = new URLSearchParams({
        block_type: blockType,
    })

    if (user_id) {
        params.set("user_id", user_id)
    }
    if (register_id) {
        params.set("register_id", register_id)
    }

    return clientFetch<BlockStatus>(
        `/auth/block?${params.toString()}`,
        {
            method: "GET",
        }
    )
}