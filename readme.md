detail
============
register_token
message

grep -Rni --exclude-dir='.next' 'decode' frontend/

find frontend/ -type f -not -path 'frontend/.next/*' -exec grep -nH 'decode' {} +

=========================
detail:string
detail object

message,user


export class ApiError extends Error {
    constructor(
        message: string,
        public readonly data: unknown,
        public readonly status: number
    ) {
        super(message);
        this.name = "ApiError";
    }
}



import { ApiError } from "@/lib/client_api";

} catch (error) {
    console.error("Register error:", error);

    if (error instanceof ApiError) {
        const body = error.data as {
            detail?: string | {
                reason?: string;
                blocked_until?: string;
            };
            message?: string;
        } | null;

        const detail = body?.detail;

        if (detail && typeof detail === "object") {
            setAccessDenied({
                message: detail.reason ?? "Access Denied",
                blockedUntil: detail.blocked_until
            });
        } else {
            setError(
                typeof detail === "string"
                    ? detail
                    : body?.message ?? error.message
            );
        }
    } else {
        setError("An unexpected error occurred.");
    }
}
