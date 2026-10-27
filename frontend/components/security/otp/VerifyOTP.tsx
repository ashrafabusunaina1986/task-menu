// components/security/otp/VerifyOTP.tsx

// components/security/otp/VerifyOTP.tsx

'use client'

import { signIn } from "next-auth/react"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import Label from "@/components/ui/Label"
import { resendOTP } from "@/lib/otp/otp"
import { useRouter, useSearchParams } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"
import { block_status } from "@/lib/block/block"
import AccessDenied from "../blocks/AccessDenied"
import { getEmail } from "@/lib/email/email"
import { jwtDecode } from "jwt-decode"
import RegisterExpired from "../register/RegisterExpired"
import { ApiError, UserBlockError, verify_register } from "@/lib/user/user"


export default function VerifyOTP() {

    const router = useRouter()
    const searchParams = useSearchParams()

    const user_id = searchParams.get("user_id") || ""
    const register_token = searchParams.get("register_token") || ""


    // ===============================================
    // STATE
    // ===============================================

    const [otp, setOtp] = useState("")
    const [email, setEmail] = useState<string>("")

    const [loading, setLoading] = useState(false)

    const [resending, setResending] = useState(false)

    const [error, setError] = useState("")

    const [success, setSuccess] = useState(false)

    const [resendSuccess, setResendSuccess] =
        useState(false)

    const [resendCooldown, setResendCooldown] =
        useState(60)


    const [accessDenied, setAccessDenied] = useState<{
        message: string
        blockedUntil?: string
    } | null>(null)
    const [checkingBlock, setCheckingBlock] = useState(true)
    const [dataRegister, setDataRegister] = useState<{
        register_id?: string;
        email?: string;
        exp?: number
    } | null>(null)
    // ===============================================
    // DECODE REGISTER TOKEN
    // ===============================================

    useEffect(() => {
        if (!register_token) {
            setDataRegister(null)
            return
        }
        try {
            const payload = jwtDecode<{
                sub?: string;
                email?: string;
                exp?: number
            }>(
                register_token
            )
            setDataRegister({
                register_id: payload.sub,
                email: payload.email,
                exp: payload.exp
            })
        } catch (error) {
            setDataRegister(null)
        }
    }, [register_token])

    //================================================
    // GET EMAIL 
    //================================================

    useEffect(() => {
        if (user_id) {

            async function get_email() {

                try {

                    const email = await getEmail(user_id)

                    setEmail(email.data.email)
                } catch (error) {

                }
            }
            get_email()
        }

    }, [user_id])
    // ===============================================
    // CHECK BLOCK STATUS
    // ===============================================

    useEffect(() => {
        async function checkBlockStatus() {

            try {

                const resultDevice = await block_status('device')
                let result = resultDevice
                if (!resultDevice.data.blocked) result = await block_status('user', user_id)

                console.error("3 - RESULT:", result)
                console.error("4 - BLOCKED:", result.data.blocked)
                if (result.data.blocked) {
                    setAccessDenied({
                        message: result.data.reason!,
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
    // RESEND COOLDOWN
    // ===============================================

    useEffect(() => {

        if (resendCooldown <= 0) {
            return
        }

        const timer = setInterval(() => {

            setResendCooldown(
                prev => prev - 1
            )

        }, 1000)

        return () => clearInterval(timer)

    }, [resendCooldown])


    // ===============================================
    // VERIFY OTP
    // ===============================================

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {

        event.preventDefault()

        setError("")
        setResendSuccess(false)


        // -------------------------------------------
        // EMAIL
        // -------------------------------------------
        const id = user_id || register_token
        if (!id) {

            setError("Email is missing")

            return
        }

        // -------------------------------------------
        // OTP
        // -------------------------------------------

        if (!/^\d{6}$/.test(otp)) {

            setError(
                "Enter a valid 6-digit code"
            )

            return
        }


        try {

            setLoading(true)


            // =======================================
            // AUTH.JS LOGIN
            // =======================================
            if (user_id) {
                const result = await signIn(
                    "credentials",
                    {
                        user_id: user_id,
                        otp,
                        redirect: false,
                    }
                )
                // =======================================
                // AUTH.JS ERROR
                // =======================================

                if (!result || result.error) {
                    const blockResult = await block_status("user", user_id)


                    if (blockResult.data.blocked) {

                        setAccessDenied({
                            message:
                                blockResult.data.reason ??
                                "Access denied",

                            blockedUntil:
                                blockResult.data.blocked_until
                        })

                        return
                    }

                    setError(
                        "Invalid verification code"
                    )

                    return
                }

                // =======================================
                // SUCCESS
                // =======================================

                setSuccess(true)

                router.push("/")

                router.refresh()
            }
            if (register_token) {
                const result = await verify_register({
                    register_token,
                    otp
                })

                // =======================================
                // SUCCESS
                // =======================================

                setSuccess(true)

                router.push("/login")

                router.refresh()
            }


        } catch (error) {

            if (error instanceof ApiError) {
                const detail = error.data;

                if (
                    detail !== null &&
                    typeof detail === "object" &&
                    "blocked" in detail &&
                    detail.blocked === true
                ) {
                    const block = detail as UserBlockError;

                    setAccessDenied({
                        message: block.reason,
                        blockedUntil: block.blocked_until,
                    });
                } else {
                    setError(error.message);
                }
            } else {
                setError("An unexpected error occurred.");
            }

        } finally {

            setLoading(false)
        }
    }


    // ===============================================
    // RESEND OTP
    // ===============================================

    async function handleResend() {

        setError("")
        setResendSuccess(false)


        // -------------------------------------------
        // EMAIL
        // -------------------------------------------
        const e_mail = email || dataRegister?.email
        if (!e_mail) {
            setError("Email is missing")

            return
        }

        try {

            setResending(true)

            const result = await resendOTP(
                e_mail
            )

            console.log(result)


            // ---------------------------------------
            // RESEND ERROR
            // ---------------------------------------


            const block = await block_status('user', user_id)
            if (block.data.blocked) {
                setAccessDenied({
                    message: block.data.reason ?? 'Access Denied',
                    blockedUntil: block.data.blocked_until
                })
                setError(
                    "If the account exists and can receive an OTP, an OTP has been sent."
                )
                return
            }




            // ---------------------------------------
            // RESEND SUCCESS
            // ---------------------------------------

            setOtp("")

            setResendSuccess(true)

            setResendCooldown(60)

        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "If the account exists and can receive an OTP, an OTP has been sent."
            )

        } finally {

            setResending(false)
        }
    }


    // ===============================================
    // UI
    // ===============================================
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

    if (
        dataRegister?.exp !== undefined &&
        (dataRegister.exp * 1000 - Date.now() < 0)
    ) {
        return (
            <RegisterExpired />
        )
    }

    if (accessDenied &&
        accessDenied.blockedUntil &&
        (
            (new Date(accessDenied.blockedUntil).getTime())
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
            "
        >

            <div
                className="
                    w-full
                    max-w-md
                    rounded-[32px]
                    border
                    border-white/10
                    bg-zinc-950
                    p-10
                    shadow-[0_25px_80px_rgba(0,0,0,0.8)]
                "
            >

                {/* ================================= */}
                {/* HEADER */}
                {/* ================================= */}

                <div
                    className="
                        text-center
                        mb-8
                    "
                >

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
                        "
                    >

                        <span className="text-4xl">
                            🔐
                        </span>

                    </div>


                    <h1
                        className="
                            text-3xl
                            font-extrabold
                            bg-gradient-to-r
                            from-blue-500
                            to-violet-500
                            bg-clip-text
                            text-transparent
                        "
                    >
                        Verify Your Email
                    </h1>


                    <p className="mt-3 text-gray-400">
                        Enter the 6-digit verification code
                    </p>


                    {email && (
                        <p
                            className="
                                mt-2
                                text-sm
                                text-gray-500
                            "
                        >
                            {email}
                        </p>
                    )}

                </div>


                {/* ================================= */}
                {/* FORM */}
                {/* ================================= */}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* OTP */}

                    <div>

                        <Label
                            htmlFor="otp"
                            className="
                                mb-2
                                block
                                text-sm
                                font-medium
                                text-gray-300
                            "
                        >
                            Verification Code
                        </Label>


                        <Input
                            type="text"
                            id="otp"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            maxLength={6}
                            value={otp}
                            onChange={event => {

                                const value =
                                    event.target.value
                                        .replace(/\D/g, "")

                                setOtp(value)

                            }}
                            placeholder="000000"
                            className="
                                w-full
                                rounded-xl
                                border
                                border-white/10
                                bg-zinc-900
                                px-4
                                py-4
                                text-center
                                text-2xl
                                tracking-[0.5em]
                                text-white
                                outline-none
                                transition
                                focus:border-violet-500
                            "
                        />

                    </div>


                    {/* ERROR */}

                    {error && (

                        <p
                            className="
                                text-center
                                text-sm
                                text-red-400
                            "
                        >
                            {error}
                        </p>

                    )}


                    {/* RESEND SUCCESS */}

                    {resendSuccess && (

                        <p
                            className="
                                text-center
                                text-sm
                                text-green-400
                            "
                        >
                            If the account exists and can receive an OTP, an OTP has been sent.
                        </p>

                    )}


                    {/* VERIFY SUCCESS */}

                    {success && (

                        <p
                            className="
                                text-center
                                text-sm
                                text-green-400
                            "
                        >
                            Verification successful
                        </p>

                    )}


                    {/* ================================= */}
                    {/* VERIFY BUTTON */}
                    {/* ================================= */}

                    <Button
                        type="submit"
                        disabled={
                            loading ||
                            otp.length !== 6
                        }
                        className="
                            w-full
                            rounded-xl
                            bg-violet-600
                            py-3
                            font-semibold
                            text-white
                            transition
                            hover:bg-violet-500
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >

                        {loading
                            ? "Verifying..."
                            : "Verify Code"
                        }

                    </Button>


                    {/* ================================= */}
                    {/* RESEND BUTTON */}
                    {/* ================================= */}

                    <Button
                        type="button"
                        onClick={handleResend}
                        disabled={
                            loading ||
                            resending ||
                            resendCooldown > 0
                        }
                        className="
                            w-full
                            rounded-xl
                            border
                            border-white/10
                            bg-zinc-900
                            py-3
                            font-semibold
                            text-gray-300
                            transition
                            hover:bg-zinc-800
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >

                        {resending

                            ? "Sending..."

                            : resendCooldown > 0

                                ? `Resend Code (${resendCooldown}s)`

                                : "Resend Code"

                        }

                    </Button>

                </form>

            </div>

        </main>
    )
}
