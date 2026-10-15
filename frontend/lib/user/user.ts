
// lib/user/user.ts

import {
    User,
    CreateUser,
    UpdateUser,
} from "@/types/user";

// ====================================
// API ERROR
// ====================================

export type UserBlockError = {
    blocked: true;
    reason: string;
    blocked_until: string;
};

export class ApiError extends Error {
    constructor(
        message: string,
        public readonly status: number,
        public readonly data: unknown
    ) {
        super(message);
        this.name = "ApiError";
    }
}

// ====================================
// API RESPONSE
// ====================================

type ApiResponse<T> = {
    success: boolean;
    data?: T;
    message?: string | UserBlockError | Record<string, unknown>;
};

// ====================================
// INTERNAL FETCH
// ====================================

async function userFetch<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const response = await fetch(`/api/auth${path}`, {
        ...options,
        headers: {
            ...(options.body
                ? { "Content-Type": "application/json" }
                : {}),
            ...(options.headers ?? {}),
        },
    });

    const result: ApiResponse<T> = await response.json().catch(() => ({
        success: false,
        message: "Invalid server response",
    }));

    if (!response.ok || !result.success) {
        const message =
            typeof result.message === "string"
                ? result.message
                : "Request failed";

        throw new ApiError(
            message,
            response.status,
            result.message
        );
    }

    return result.data as T;
}

// ====================================
// USERS
// ====================================

export function getUsers() {
    return userFetch<User[]>("/users");
}

export function getUser(id: string) {
    return userFetch<User>(`/users/${id}`);
}

// ====================================
// REGISTER
// ====================================

export function createUser(data: CreateUser) {
    return userFetch<{
        register_token: string;
        message: string;
    }>("/register", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

// ====================================
// VERIFY REGISTER
// ====================================

export function verify_register(
    data: {
        register_token: string;
        otp: string;
    }
) {
    return userFetch<{
        message: string;
        user_id: string;
    }>("/verify-register", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

// ====================================
// UPDATE USER
// ====================================

export function updateUser(
    id: string,
    data: UpdateUser
) {
    return userFetch<User>(`/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

// ====================================
// DELETE USER
// ====================================

export function deleteUser(id: string) {
    return userFetch<void>(`/users/${id}`, {
        method: "DELETE",
    });
}
