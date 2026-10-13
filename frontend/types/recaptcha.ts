// app/types/recaptcha.ts


export type RecaptchaAction =
    | "login"
    | "register"
    | "reset"

export type RecaptchaRequest = {
    recaptchaToken: string
    expectedAction: RecaptchaAction
}

export type RecaptchaResponse = {
    success: boolean
    action: RecaptchaAction
}