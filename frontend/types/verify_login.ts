// types/verify_login.ts

// export interface LoginResponse {
//     data: {
//         otp_required: boolean;
//         message: string;
//     }
// }

export type VerifyLoginRequest = {
    email: string
    otp: string
}