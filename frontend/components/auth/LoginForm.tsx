
// components/auth/LoginForm.tsx

"use client"

import { signIn } from "next-auth/react"
import { FormEvent, useEffect, useState } from "react"
import Label from "../ui/Label"
import Input from "../ui/Input"
import Button from "../ui/Button"
import Link from "next/link"
import { IoEye, IoEyeOff } from "react-icons/io5"
import { loginSchema } from "@/schemas/login"
import { useRouter } from "next/navigation"
import { useGoogleReCaptcha } from "react-google-recaptcha-v3"
import { recaptcha } from "@/lib/recaptcha/recaptcha"
import { RecaptchaResponse } from "@/types/recaptcha"
import { login } from "@/lib/login/login"
import { ApiError } from "@/lib/client_api"
import AccessDenied from "../security/blocks/AccessDenied"
import { block_status } from "@/lib/block/block"

export default function LoginForm() {
    const router = useRouter()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const [errors, setErrors] = useState<{
        email?: string[]
        password?: string[]
    }>({})

    const [authError, setAuthError] = useState("")
    const [accessDenied, setAccessDenied] = useState<{
        message: string
        blockedUntil?: string
    } | null>(null)
    const [checkingBlock, setCheckingBlock] = useState(true)
    const [showPassword, setShowPassword] = useState(false)

    const { executeRecaptcha } = useGoogleReCaptcha()

    // ===============================================
    // CHECK BLOCK STATUS
    // ===============================================

    useEffect(() => {
        async function checkBlockStatus() {

            try {

                const result = await block_status('device')
                console.error("3 - RESULT:", result)
                console.error("4 - BLOCKED:", result.data.blocked)
                if (result.data.blocked) {
                    setAccessDenied({
                        message: "Too many login attempts.",
                        blockedUntil: result.data.blocked_until
                    })
                }

            } catch (error) {

                console.error(
                    "Block status error:",
                    error
                )

            } finally {

                setCheckingBlock(false)

            }
        }

        checkBlockStatus()

    }, [])

    // ===============================================
    // GOOGLE LOGIN
    // ===============================================

    async function handleGoogleSignIn() {
        setLoading(true)

        if (!executeRecaptcha) {
            setLoading(false)
            setAuthError(
                "Security verification is not ready. Please try again"
            )
            return
        }

        const recaptchaToken = await executeRecaptcha("login")

        const resRecaptcha: RecaptchaResponse = await recaptcha({
            recaptchaToken,
            expectedAction: "login"
        })

        if (!resRecaptcha.success) {
            setAuthError("Security verification failed")
            setLoading(false)
            return
        }

        await signIn("google", {
            callbackUrl: "/"
        })

        setAuthError("")
    }


    // ===============================================
    // EMAIL + PASSWORD LOGIN
    // ===============================================

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault()

        setLoading(true)
        setAuthError("")
        setErrors({})


        // ===========================================
        // VALIDATE FORM
        // ===========================================

        const resultSchema = loginSchema.safeParse({
            email,
            password
        })

        if (!resultSchema.success) {
            setLoading(false)
            setErrors(
                resultSchema.error.flatten().fieldErrors
            )
            return
        }


        // ===========================================
        // RECAPTCHA
        // ===========================================

        if (!executeRecaptcha) {
            setLoading(false)
            setAuthError(
                "Security verification is not ready. Please try again"
            )
            return
        }

        const recaptchaToken = await executeRecaptcha("login")

        const resRecaptcha: RecaptchaResponse = await recaptcha({
            recaptchaToken,
            expectedAction: "login"
        })

        if (!resRecaptcha.success) {
            setAuthError("Security verification failed")
            setLoading(false)
            return
        }


        // ===========================================
        // BACKEND LOGIN
        // ===========================================

        try {
            const result = await login({
                email,
                password
            })


            // =======================================
            // OTP REQUIRED
            // =======================================

            if ("data" in result) {
                const user_id = result.data?.user_id as string
                router.push(
                    `/verify-otp?user_id=${encodeURIComponent(user_id)}`
                )
                return
            }


            // =======================================
            // UNEXPECTED RESPONSE
            // =======================================

            setAuthError(
                "Unable to sign in"
            )
        } catch (error) {

            console.error("Login error:", error)

            if (error instanceof ApiError && error.status === 403) {

                const data = error.data as {
                    success?: boolean
                    message?: {
                        blocked?: boolean
                        reason?: string
                        blocked_until?: string
                    }
                } | undefined

                if (data?.message?.blocked) {
                    setAccessDenied({
                        message: data.message.reason ?? "The user is blocked",
                        blockedUntil: data.message.blocked_until
                    })

                    setLoading(false)
                    return
                }
            }

            setAuthError(
                error instanceof Error
                    ? error.message
                    : "Invalid email or password"
            )
        }

        setLoading(false)
    }
    if (checkingBlock) {
        return (
            <main className="
            min-h-screen
            bg-black
            flex
            items-center
            justify-center
        ">
                <p className="text-gray-400">
                    Checking security status...
                </p>
            </main>
        )
    }

    if (accessDenied &&
        accessDenied.blockedUntil &&
        (
            (new Date(accessDenied.blockedUntil as string).getTime())
            - Date.now()
        ) > 0
    ) {
        return (
            <AccessDenied
                message={accessDenied.message}
                blockedUntil={accessDenied.blockedUntil}
            />
        )
    }
    return (
        <main
            className="
                min-h-screen
                bg-black
                flex
                items-center
                justify-center
                px-6
                relative
                overflow-hidden
            "
        >

            {/* Glow */}
            <div
                className="
                    absolute
                    w-[600px]
                    h-[600px]
                    rounded-full
                    bg-violet-600/20
                    blur-[180px]
                "
            />


            {/* Card */}
            <div
                className="
                    relative
                    w-full
                    max-w-md
                    rounded-[32px]
                    border
                    border-white/10
                    bg-zinc-950/90
                    shadow-[0_25px_80px_rgba(0,0,0,0.8)]
                    backdrop-blur-xl
                    p-10
                "
            >

                {/* Header */}
                <div className="text-center mb-8">

                    <div
                        className="
                            mx-auto
                            mb-6
                            flex
                            h-20
                            w-20
                            items-center
                            justify-center
                            rounded-3xl
                            border
                            border-white/10
                            bg-zinc-900
                            shadow-[0_0_40px_rgba(99,102,241,0.35)]
                        "
                    >
                        <span className="text-4xl">🔐</span>
                    </div>

                    <h1
                        className="
                            text-4xl
                            font-extrabold
                            bg-gradient-to-r
                            from-blue-500
                            to-violet-500
                            bg-clip-text
                            text-transparent
                        "
                    >
                        Welcome Login
                    </h1>

                    <p className="mt-3 to-gray-400">
                        Sign in to your account
                    </p>

                </div>


                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* Email */}
                    <div>

                        <Label htmlFor="email">
                            Email
                        </Label>

                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={e =>
                                setEmail(e.target.value)
                            }
                            placeholder="your@example.com"
                            autoComplete="email"
                            required
                        />

                        {errors.email && (
                            <p className="mt-1 text-sm text-red-400">
                                {errors.email[0]}
                            </p>
                        )}

                    </div>


                    {/* Password */}
                    <div>

                        <Label htmlFor="password">
                            Password
                        </Label>

                        <div className="relative">

                            <Input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                id="password"
                                value={password}
                                onChange={e =>
                                    setPassword(e.target.value)
                                }
                                placeholder="************"
                                autoComplete="current-password"
                                required
                                className="pr-12"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(
                                        prev => !prev
                                    )
                                }
                                className="
                                    absolute
                                    right-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-gray-400
                                    transition
                                    hover:text-white
                                "
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                {showPassword ? (
                                    <IoEyeOff size={20} />
                                ) : (
                                    <IoEye size={20} />
                                )}
                            </button>

                        </div>

                        {errors.password && (
                            <p className="mt-1 text-sm text-red-400">
                                {errors.password[0]}
                            </p>
                        )}

                    </div>


                    {/* Authentication error */}
                    {authError && (
                        <p className="mt-1 text-sm text-red-400">
                            {authError}
                        </p>
                    )}


                    {/* Submit */}
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                    >
                        {loading
                            ? "Signing in..."
                            : "Sign In"
                        }
                    </Button>

                </form>


                {/* Google */}
                <div className="relative my-6">

                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10" />
                    </div>

                    <div className="relative flex justify-center">

                        <span className="bg-zinc-950 px-3 text-sm text-gray-500">
                            OR
                        </span>

                    </div>

                </div>


                <Button
                    type="button"
                    className="w-full"
                    disabled={loading}
                    onClick={handleGoogleSignIn}
                >
                    Continue with Google
                </Button>


                {/* Register Link */}
                <p className="mt-6 text-center text-sm text-gray-400">

                    Don't have an account?{" "}

                    <Link
                        href="/register"
                        className="
                            font-medium
                            text-violet-400
                            transition
                            hover:text-violet-300
                        "
                    >
                        Sign up
                    </Link>

                </p>

            </div>

        </main>
    )
}

