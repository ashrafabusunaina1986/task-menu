import { EmailRequest, EmailResponse } from "@/types/email";
import { clientFetch } from "../client_api";

// ===============================
// GET EMAIL
// ===============================

export async function getEmail(
    user_id: string
): Promise<EmailResponse> {

    const params = new URLSearchParams()

    if (user_id) params.set("user_id", user_id)

    return clientFetch<EmailResponse>(
        `/auth/email?${params.toString()}`, {
        method: "GET",
    })

}