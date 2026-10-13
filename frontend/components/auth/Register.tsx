// components/user/CreateUser.tsx

"use client"

import { createUser } from "@/lib/user/user"
import {
    CreateUser as CreateUserType
} from "@/types/user"
import { useRouter } from "next/navigation"
import UserForm from "../user/UserForm"
import Link from "next/link"
import { registerSchema } from "@/schemas/register"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useGoogleReCaptcha } from "react-google-recaptcha-v3"
import { RecaptchaResponse } from "@/types/recaptcha"
import { recaptcha } from "@/lib/recaptcha/recaptcha"

export default function CreateUser() {
    const router = useRouter()
    const [authError, setAuthError] = useState("")
    const { executeRecaptcha } = useGoogleReCaptcha()
    const [errors, setErrors] = useState<{
        name?: string[],
        email?: string[],
        password?: string[]
    }>({})
    async function handleGoogleSignIn() {
        if (!executeRecaptcha) {
            setAuthError("Security verification is not ready. Please try again")
            return
        }
        const recaptchaToken = await executeRecaptcha('login')
        const resRecaptcha: RecaptchaResponse = await recaptcha({
            recaptchaToken,
            expectedAction: 'login'
        })

        if (!resRecaptcha.success) {
            setAuthError("Security verification failed")
            return
        }
        await signIn("google", {
            callbackUrl: "/"
        })
        setAuthError("")
    }
    async function handleCreate(
        data: CreateUserType
    ) {
        if (!executeRecaptcha) {

            setAuthError("Security verification is not ready. Please try again")
            return
        }
        const recaptchaToken = await executeRecaptcha('register')
        const resRecaptcha: RecaptchaResponse = await recaptcha({
            recaptchaToken,
            expectedAction: 'register'
        })
        if (!resRecaptcha.success) {
            setAuthError("Security verification failed")

            return
        }
        const result = registerSchema.safeParse(data)
        if (!result.success) {

            setErrors(
                result.error.flatten().fieldErrors
            )
            return
        }
        try {
            const pending_register = await createUser(data)

            router.push(`/verify-otp?register_token=${encodeURIComponent(pending_register.register_token)}`)
        }
        catch (error) {
            const err = error as AuthError
            setAuthError(
                typeof err.message === 'string' ?
                    err.message
                    : typeof err.message === 'object'
                        ? err.message.reason
                        : "An error occurred"
            )
        }

    }
    return (
        <main
            className="
            min-h-screen
            bg-black
            flex flex-col gap-3
            items-center justify-center p-6
                "
        >
            <h1
                className="
            mb-8 text-4xl font-bold text-white
            "
            >
                Register            </h1>

            <UserForm<CreateUserType>
                onSubmit={handleCreate}
                errors={errors}
                authError={authError}
            />
            <button
                type="button"
                onClick={handleGoogleSignIn}
                className="
                    w-full max-w-md
                    rounded-lg
                    bg-white
                    px-4 py-3
                    font-medium
                    text-black
                    transition
                    hover:bg-gray-200
                    "
            >
                Sign up with Google
            </button>
            {/* Login */}
            <p className="mt-6 text-center text-sm text-gray-400">
                Already have an account?{" "}
                <Link
                    href="/login"
                    className="font-medium text-violet-400 transition hover:text-violet-300"
                >
                    Sign in
                </Link>
            </p>

        </main>
    )
}
