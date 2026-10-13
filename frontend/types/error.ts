// types/error.ts

type AuthError = {
    success: boolean;
    message: string | { reason: string }
}