// components/user/CreateUser.tsx
"use client";

import { createUser } from "@/lib/user/user";
import { CreateUser as CreateUserType } from "@/types/user";
import { useRouter } from "next/navigation";
import UserForm from "../user/UserForm";
import Link from "next/link";
import { registerSchema } from "@/schemas/register";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { RecaptchaResponse } from "@/types/recaptcha";
import { recaptcha } from "@/lib/recaptcha/recaptcha";

// تعريف أمني داخلي متوافق مع معطيات السيرفر لاستقبال استثناءات الأخطاء
interface ServerAuthError {
    message?: string | { reason?: string };
}

export default function CreateUser() {
    const router = useRouter();
    const [authError, setAuthError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { executeRecaptcha } = useGoogleReCaptcha();
    const [errors, setErrors] = useState<{
        name?: string[];
        email?: string[];
        password?: string[];
    }>({});

    // ===============================================
    // FEDERATED GOOGLE REGISTRATION GATEWAY
    // ===============================================
    async function handleGoogleSignIn() {
        setAuthError("");
        if (!executeRecaptcha) {
            setAuthError("Security verification engine is not ready. Please refresh session.");
            return;
        }

        try {
            const recaptchaToken = await executeRecaptcha('login');
            const resRecaptcha: RecaptchaResponse = await recaptcha({
                recaptchaToken,
                expectedAction: 'login'
            });

            if (!resRecaptcha.success) {
                setAuthError("Security verification deployment failed.");
                return;
            }
            await signIn("google", { callbackUrl: "/" });
        } catch (err) {
            setAuthError("Google single sign-on synchronization failed.");
        }
    }
    // ===============================================
    // CORE ACCOUNT CREATION PIPELINE HANDLER
    // ===============================================
    async function handleCreate(data: CreateUserType) {
        setAuthError("");
        setErrors({});

        if (!executeRecaptcha) {
            setAuthError("Security verification framework not initialized.");
            return;
        }

        setIsSubmitting(true);

        try {
            const recaptchaToken = await executeRecaptcha('register');
            const resRecaptcha: RecaptchaResponse = await recaptcha({
                recaptchaToken,
                expectedAction: 'register'
            });

            if (!resRecaptcha.success) {
                setAuthError("Automated packet integrity interception active.");
                setIsSubmitting(false);
                return;
            }

            const result = registerSchema.safeParse(data);
            if (!result.success) {
                setErrors(result.error.flatten().fieldErrors);
                setIsSubmitting(false);
                return;
            }

            const pending_register = await createUser(data);
            router.push(`/verify-otp?register_token=${encodeURIComponent(pending_register.register_token)}`);
        }
        catch (error) {
            const err = error as ServerAuthError;
            setAuthError(
                typeof err?.message === 'string'
                    ? err.message
                    : (err?.message && typeof err.message === 'object' && err.message.reason)
                        ? err.message.reason
                        : "An internal security deployment exception occurred."
            );
            setIsSubmitting(false);
        }
    }
    return (
        <main className="min-h-screen bg-[#08080d] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden text-white">
            {/* Cyberpunk Fluid Glow Background Layers */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-0">
                <div className="w-[900px] h-[900px] rounded-full bg-purple-600/[0.04] blur-[200px]" />
                <div className="w-[500px] h-[500px] rounded-full bg-blue-500/[0.03] blur-[150px] absolute" />
            </div>

            {/* Premium Glassmorphic Dynamic Container */}
            <div className="
                relative 
                z-10 
                w-full 
                max-w-md 
                rounded-[32px] 
                border border-white/5 
                bg-[#0d0d16]/80 
                backdrop-blur-2xl 
                p-6 
                sm:p-10 
                shadow-[0_30px_90px_rgba(0,0,0,0.85)] 
                space-y-6
                transition-all
                duration-300
                hover:border-purple-500/15
                animate-fadeIn
            ">
                {/* Header Metadata Title */}
                <div className="text-center space-y-1.5 border-b border-gray-900/60 pb-4">
                    <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
                        Create Operator Account
                    </h1>
                    <p className="text-xs text-gray-500">Initialize credential nodes to connect to Workora network.</p>
                </div>

                {/* Processing State Loader Mask */}
                {isSubmitting ? (
                    <div className="flex flex-col justify-center items-center py-16 space-y-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                        <p className="text-xs text-gray-500 font-medium tracking-wide">Deploying user container and broadcasting OTP packet...</p>
                    </div>
                ) : (
                    /* Core User Forms Module */
                    <div className="space-y-4 animate-fadeIn">
                        <UserForm<CreateUserType>
                            onSubmit={handleCreate}
                            errors={errors}
                            authError={authError}
                        />

                        {/* Federated SSO Row Separator */}
                        <div className="relative flex items-center justify-center my-4 pt-2">
                            <div className="absolute w-full border-t border-gray-900 z-0" />
                            <span className="relative z-10 bg-[#0d0d16] px-3 text-[10px] font-bold text-gray-600 uppercase tracking-widest">Or Federated Identity</span>
                        </div>

                        {/* Google Account Creation Button Trigger */}
                        <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-800 bg-[#141423]/30 text-xs font-bold text-gray-300 hover:bg-[#141423]/60 hover:text-white transition duration-150 cursor-pointer active:scale-[0.99]"
                        >
                            <span>🌐</span> Continue registration via Google
                        </button>
                    </div>
                )}

                {/* Account Redirection Footnotes */}
                <div className="text-center pt-2 border-t border-gray-900/60">
                    <p className="text-xs text-gray-500">
                        Already have an operational signature?{" "}
                        <Link href="/login" className="font-bold text-purple-400 hover:text-purple-300 transition">
                            Sign in to Terminal
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
