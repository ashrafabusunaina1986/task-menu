// types/login.ts

export interface LoginData {
    user_id: string
    otp_required: boolean;
    message: string;
}

export interface BlockData {
    blocked: boolean
    reason?: string
    blocked_until?: string
}
export type LoginResponse =
    | {
        data: LoginData
        block?: never
    } | {
        data?: never
        block: BlockData
    }


export type LoginRequest = {
    email: string
    password: string
}