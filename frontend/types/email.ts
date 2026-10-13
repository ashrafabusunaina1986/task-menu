export interface EmailRequest {
    user_id: string
}

export interface EmailResponse {
    data: { email: string }
}