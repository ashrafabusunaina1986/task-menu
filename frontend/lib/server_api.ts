// lib/server_api.ts

import { auth } from "@/auth";

import { Task } from "@/types/task";
import { User } from "@/types/user";


const SERVER_API = process.env.API_URL_SERVER;


if (!SERVER_API) {
    throw new Error(
        "API_URL_SERVER is not defined"
    );
}


// ===============================================
// INTERNAL FETCH
// ===============================================

async function serverFetch<T>(
    path: string
): Promise<T> {

    const session = await auth();


    const res = await fetch(
        `${SERVER_API}${path}`,
        {
            headers: {
                Authorization:
                    `Bearer ${session?.accessToken}`
            },

            cache: "no-store"
        }
    );


    if (!res.ok) {

        const message = await res.text();

        throw new Error(
            message ||
            `Request failed with status ${res.status}`
        );
    }


    return res.json() as Promise<T>;
}


// ===============================================
// TASKS
// ===============================================

export function getTasks(
    project_id: string
) {
    return serverFetch<Task[]>(
        `/tasks?project_id=${encodeURIComponent(project_id)}`
    );
}


export function getTask(
    task_id: string,
    project_id: string
) {
    return serverFetch<Task>(
        `/tasks/task?task_id=${encodeURIComponent(task_id)}&project_id=${encodeURIComponent(project_id)}`
    );
}


// ===============================================
// USERS
// ===============================================

export function getUsers() {
    return serverFetch<User[]>(
        "/users"
    );
}


export function getUser(
    id: string
) {
    return serverFetch<User>(
        `/auth/users/${id}`
    );
}

// profile
export function getProfile() {
    return serverFetch<User>(
        "/profile"
    );
}