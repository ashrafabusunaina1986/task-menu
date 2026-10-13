// lib/client_api.ts

// ===============================================
// API ERROR
// ===============================================

export class ApiError extends Error {
    status: number;
    data: unknown;

    constructor(
        message: string,
        status: number,
        data: unknown
    ) {
        super(message);

        this.name = "ApiError";
        this.status = status;
        this.data = data;

    }
}

// ===============================================
// INTERNAL FETCH
// ===============================================

export async function clientFetch<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {

    const res = await fetch(`/api${path}`, {
        ...options,
        headers: {
            ...(options.body ? { "Content-Type": "application/json" } : {}),
            ...options.headers,
        },
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
        const message =
            typeof data?.message === "string"
                ? data.message
                : typeof data?.detail === "string"
                    ? data.detail
                    : "Request failed";

        throw new ApiError(
            message,
            res.status,
            data
        );
    }

    return data as T;
}