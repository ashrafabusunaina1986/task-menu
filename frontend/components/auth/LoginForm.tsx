
// components/auth/LoginForm.tsx
"use client";

import { signIn } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";
import Label from "../ui/Label";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Link from "next/link";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { loginSchema } from "@/schemas/login";
import { useRouter } from "next/navigation";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { recaptcha } from "@/lib/recaptcha/recaptcha";
import { RecaptchaResponse } from "@/types/recaptcha";
import { login } from "@/lib/login/login";
import { ApiError } from "@/lib/client_api";
import AccessDenied from "../security/blocks/AccessDenied";
import { block_status } from "@/lib/block/block";

export default function LoginForm() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState<{
        email?: string[];
        password?: string[];
    }>({});

    const [authError, setAuthError] = useState("");
    const [accessDenied, setAccessDenied] = useState<{
        message: string;
        blockedUntil?: string;
    } | null>(null);
    const [checkingBlock, setCheckingBlock] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    const { executeRecaptcha } = useGoogleReCaptcha();

    // ===============================================
    // CHECK BLOCK STATUS (Audit Device Firewall Log)
    // ===============================================
    useEffect(() => {
        async function checkBlockStatus() {
            try {
                const result = await block_status('device');
                if (result?.data?.blocked) {
                    setAccessDenied({
                        message: "Too many login attempts. Temporary structural lockout active.",
                        blockedUntil: result.data.blocked_until
                    });
                }
            } catch (error) {
                console.error("Block status security check failure:", error);
            } finally {
                setCheckingBlock(false);
            }
        }
        void checkBlockStatus();
    }, []);
    // ===============================================
    // GOOGLE AUTHENTICATION INTEGRATION GATES
    // ===============================================
    async function handleGoogleSignIn() {
        setLoading(true);
        setAuthError("");

        if (!executeRecaptcha) {
            setLoading(false);
            setAuthError("Security verification engine is not initialized. Please refresh standard session tokens.");
            return;
        }

        try {
            const recaptchaToken = await executeRecaptcha("login");
            const resRecaptcha: RecaptchaResponse = await recaptcha({
                recaptchaToken,
                expectedAction: "login"
            });

            if (!resRecaptcha.success) {
                setAuthError("Security verification layer rejected this action packet.");
                setLoading(false);
                return;
            }

            await signIn("google", { callbackUrl: "/" });
        } catch (err) {
            setAuthError("Google single sign-on synchronization failed.");
            setLoading(false);
        }
    }

    // ===============================================
    // CORE EMAIL & SECURE PASSWORD TRANSACTION HANDLER
    // ===============================================
    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setAuthError("");
        setErrors({});

        // Validate client inputs via schema tree
        const resultSchema = loginSchema.safeParse({ email, password });
        if (!resultSchema.success) {
            setLoading(false);
            setErrors(resultSchema.error.flatten().fieldErrors);
            return;
        }

        if (!executeRecaptcha) {
            setLoading(false);
            setAuthError("Security protocol framework not established.");
            return;
        }

        try {
            const recaptchaToken = await executeRecaptcha("login");
            const resRecaptcha: RecaptchaResponse = await recaptcha({
                recaptchaToken,
                expectedAction: "login"
            });

            if (!resRecaptcha.success) {
                setAuthError("Automated bot tracking system intercepted this submission.");
                setLoading(false);
                return;
            }

            const result = await login({ email, password });

            // OTP Context Required Redirection Gate
            if (result && "data" in result) {
                const user_id = result.data?.user_id as string;
                router.push(`/verify-otp?user_id=${encodeURIComponent(user_id)}`);
                return;
            }

            setAuthError("An unexpected signature response returned from credential host.");
        } catch (error) {
            console.error("Login endpoint execution exception:", error);

            if (error instanceof ApiError && error.status === 403) {
                const data = error.data as {
                    success?: boolean;
                    message?: { blocked?: boolean; reason?: string; blocked_until?: string };
                } | undefined;

                if (data?.message?.blocked) {
                    setAccessDenied({
                        message: data.message.reason ?? "This signature node is temporarily frozen.",
                        blockedUntil: data.message.blocked_until
                    });
                    setLoading(false);
                    return;
                }
            }

            setAuthError(error instanceof Error ? error.message : "Invalid authentication signature matches.");
        }
        setLoading(false);
    }
    // واجهة التحميل المبدئية لفحص أمن جدار حماية الخادم
    if (checkingBlock) {
        return (
            <main className="min-h-screen bg-[#08080d] flex items-center justify-center p-4">
                <div className="text-center space-y-3">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-purple-500/20 border-t-purple-500" />
                    <p className="text-xs text-zinc-500 font-semibold tracking-wider uppercase">Checking firewall policy status...</p>
                </div>
            </main>
        );
    }

    // شاشة الحجر الأمني وعزل الاتصال في حال الحظر المؤقت
    if (accessDenied && accessDenied.blockedUntil && (new Date(accessDenied.blockedUntil).getTime() - Date.now()) > 0) {
        return (
            <AccessDenied
                message={accessDenied.message}
                blockedUntil={accessDenied.blockedUntil}
            />
        );
    }

    return (
        <main className="min-h-screen bg-[#08080d] flex items-center justify-center px-4 relative overflow-hidden text-white">
            {/* Cyberpunk Ambient Fluid Glow Background */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-0">
                <div className="w-[800px] h-[800px] rounded-full bg-purple-600/[0.04] blur-[160px]" />
                <div className="w-[500px] h-[500px] rounded-full bg-blue-500/[0.03] blur-[140px] absolute" />
            </div>

            {/* Premium Glassmorphic Card Login Box */}
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
                {/* Header Context Meta */}
                <div className="text-center space-y-1.5 border-b border-gray-900 pb-4">
                    <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
                        Sign In to Workora
                    </h1>
                    <p className="text-xs text-gray-500">Provide clearance payload keys to enter the terminal cluster.</p>
                </div>

                {/* Exception Alert Sign-in Message Feedback */}
                {authError && (
                    <div className="bg-rose-950/40 border border-rose-800 text-rose-200 p-3.5 rounded-xl text-xs font-medium animate-pulse">
                        ⚠️ {authError}
                    </div>
                )}

                {/* Form Logic Module Grid */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Identity Email Address</Label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="username@domain.cloud"
                            required
                            disabled={loading}
                            className="bg-[#141423]/60 border-gray-800 focus:border-purple-500/50 py-3 text-sm rounded-xl placeholder:text-gray-700"
                        />
                        {errors.email && <p className="text-[10px] font-semibold text-rose-400 pt-0.5">{errors.email[0]}</p>}
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between items-center">
                            <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Signature Token Password</Label>
                            <Link href="/forgot-password" className="text-[10px] font-bold text-purple-400 hover:text-purple-300 transition">Forgot Key?</Link>
                        </div>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••••"
                                required
                                disabled={loading}
                                className="bg-[#141423]/60 border-gray-800 focus:border-purple-500/50 py-3 pr-10 text-sm rounded-xl placeholder:text-gray-700"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition cursor-pointer"
                            >
                                {showPassword ? <IoEyeOff className="h-4 w-4" /> : <IoEye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.password && <p className="text-[10px] font-semibold text-rose-400 pt-0.5">{errors.password[0]}</p>}
                    </div>

                    <div className="pt-2">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-purple-600 hover:bg-purple-700 active:scale-[0.99] shadow-lg shadow-purple-600/20 transition duration-150 cursor-pointer"
                        >
                            {loading ? "Decrypting Node Connection..." : "Verify & Sync Logs"}
                        </Button>
                    </div>
                </form>

                {/* Federated Identity Provider Row Separator */}
                <div className="relative flex items-center justify-center my-4">
                    <div className="absolute w-full border-t border-gray-900 z-0" />
                    <span className="relative z-10 bg-[#0d0d16] px-3 text-[10px] font-bold text-gray-600 uppercase tracking-widest">Or Federated Access</span>
                </div>

                {/* Google External SSO Provider Button Trigger */}
                <div>
                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-800 bg-[#141423]/30 text-xs font-bold text-gray-300 hover:bg-[#141423]/60 hover:text-white transition duration-150 cursor-pointer active:scale-[0.99]"
                    >
                        <span>🌐</span> Continue authentication via Google
                    </button>
                </div>

                {/* Lower Redirection Access Footnotes */}
                <div className="text-center pt-2 border-t border-gray-900/60">
                    <p className="text-xs text-gray-500">
                        New system operator?{" "}
                        <Link href="/register" className="font-bold text-purple-400 hover:text-purple-300 transition">
                            Register dynamic account
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
