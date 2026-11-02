
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

    if (accessDenied && accessDenied.blockedUntil && (new Date(accessDenied.blockedUntil).getTime() - Date.now()) > 0) {
        return (
            <AccessDenied
                message={accessDenied.message}
                blockedUntil={accessDenied.blockedUntil}
            />
        );
    }
    return (
        <main className="min-h-screen bg-[#08080d] flex items-center justify-center px-4 relative overflow-hidden text-white w-full">
            {/* Cyberpunk Ambient Fluid Glow Background */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-0">
                <div className="w-[800px] h-[800px] rounded-full bg-purple-600/[0.04] blur-[160px]" />
                <div className="w-[500px] h-[500px] rounded-full bg-blue-500/[0.03] blur-[140px] absolute" />
            </div>

            {/* Premium Glassmorphic Card Login Box Housing */}
            <div className="relative z-10 w-full max-w-md rounded-[32px] border border-white/5 bg-[#0d0d16]/80 backdrop-blur-2xl p-6 sm:p-10 shadow-[0_30px_90px_rgba(0,0,0,0.85)] space-y-6 transition-all duration-300 hover:border-purple-500/15 animate-fadeIn">

                {/* Header Context Metadata Branding Layout */}
                <div className="text-center space-y-1">
                    <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Authorize Identity
                    </h1>
                    <p className="text-xs text-gray-500 font-medium">Access your enterprise project pipeline environment</p>
                </div>

                {/* Inline Production Exception Alert Node */}
                {authError && (
                    <div className="bg-rose-950/40 border border-rose-800 text-rose-200 p-3.5 rounded-xl text-xs font-semibold animate-pulse tracking-wide">
                        ⚠️ Security Exception: {authError}
                    </div>
                )}

                {/* Secure Form Execution Matrix */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Target Email Input Grid */}
                    <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Database Email Shard</Label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            required
                            placeholder="username@workora.cloud"
                            className="w-full bg-[#141423]/60 text-sm focus:border-purple-500/50"
                        />
                        {errors.email && <p className="text-[11px] text-rose-400 font-medium mt-1">⚠️ {errors.email[0]}</p>}
                    </div>

                    {/* Cryptographic Password Input Grid */}
                    <div className="space-y-1.5 relative">
                        <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Cryptographic Password Key</Label>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                required
                                placeholder="••••••••••••"
                                className="w-full bg-[#141423]/60 text-sm pr-10 focus:border-purple-500/50"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-400 transition cursor-pointer"
                            >
                                {showPassword ? <IoEyeOff className="text-sm" /> : <IoEye className="text-sm" />}
                            </button>
                        </div>
                        {errors.password && <p className="text-[11px] text-rose-400 font-medium mt-1">⚠️ {errors.password[0]}</p>}
                    </div>

                    {/* Trigger Authentication Signature Packet Action Button */}
                    <div className="pt-2">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 text-xs font-bold uppercase tracking-wider text-white bg-purple-600 hover:bg-purple-700 active:scale-[0.99] rounded-xl transition duration-150 cursor-pointer shadow-lg shadow-purple-600/10"
                        >
                            {loading ? "Verifying Credentials..." : "Request Signature Access"}
                        </Button>
                    </div>
                </form>

                {/* Decorative Structural Splitter Ribbon */}
                <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-white/5" />
                    <span className="flex-shrink mx-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest">OR</span>
                    <div className="flex-grow border-t border-white/5" />
                </div>

                {/* Google Single Sign-On Provider Grid */}
                <div>
                    <button
                        type="button"
                        disabled={loading}
                        onClick={handleGoogleSignIn}
                        className="w-full py-3 bg-[#11111a] border border-gray-800 hover:border-gray-700 text-xs font-bold uppercase tracking-wider rounded-xl transition active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
                    >
                        <span>🌐</span> Synchronize Google Identity
                    </button>
                </div>

                {/* Link Redirection Footer Block */}
                <div className="text-center pt-2">
                    <p className="text-xs text-gray-500 font-medium">
                        New operator resource?{" "}
                        <Link href="/register" className="text-purple-400 font-bold hover:underline transition">
                            Provision Credential Node
                        </Link>
                    </p>
                </div>

            </div>
        </main>
    );
}
