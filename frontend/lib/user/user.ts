// lib/user/user.ts

import {
    User,
    CreateUser,
    UpdateUser,
} from "@/types/user";

type ApiResponse<T> = {
    success: boolean;
    data: T;
    message?: string;
};

async function userFetch<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {

    const response = await fetch(`/api/auth${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers ?? {}),
        },
    });

    const result: ApiResponse<T> = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(
            result.message ?? "Request failed"
        );
    }

    return result.data;
}

export function getUsers() {
    return userFetch<User[]>("/users");
}

export function getUser(
    id: string
) {
    return userFetch<User>(
        `/users/${id}`
    );
}

export function createUser(
    data: CreateUser
) {
    return userFetch<{ register_token: string; message: string }>(
        "/register",
        {
            method: "POST",
            body: JSON.stringify(data),
        }
    );
}

export function updateUser(
    id: string,
    data: UpdateUser
) {
    return userFetch(
        `/users/${id}`,
        {
            method: "PUT",
            body: JSON.stringify(data),
        }
    );
}

export function deleteUser(
    id: string
) {
    return userFetch(
        `/users/${id}`,
        {
            method: "DELETE",
        }
    );
}