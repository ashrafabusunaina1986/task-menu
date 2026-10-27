// lib/project/server.ts

import { auth } from "@/auth";
import { Project, ProjectRead } from "@/types/project";

const SERVER_API = process.env.API_URL_SERVER;


if (!SERVER_API) {
    throw new Error(
        "API_URL_SERVER is not defined"
    );
}

// ==========================
// projects
// ==========================


export async function getProject(
    data: ProjectRead
): Promise<Project | null> {
    const session = await auth()
    if (!session?.accessToken) {
        throw new Error("Not authenticated")
    }

    const res = await fetch(
        `${SERVER_API}/project/get-project`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.accessToken}`
            },
            body: JSON.stringify(data),
            cache: 'no-store'
        }
    )

    if (res.status === 400) {
        return null
    }

    if (!res.ok) {
        const message = await res.text()

        throw new Error(message || `Request failed with status ${res.status}`)
    }
    return res.json() as Promise<Project | null>
}