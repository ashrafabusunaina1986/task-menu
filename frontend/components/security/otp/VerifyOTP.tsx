// components/security/otp/VerifyOTP.tsx
"use client";

import { signIn } from "next-auth/react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import { resendOTP } from "@/lib/otp/otp";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState, useTransition } from "react";
import { block_status } from "@/lib/block/block";
import AccessDenied from "../blocks/AccessDenied";
import { getEmail } from "@/lib/email/email";
import { jwtDecode } from "jwt-decode";
import RegisterExpired from "../register/RegisterExpired";
import { ApiError, UserBlockError, verify_register } from "@/lib/user/user";

export default function VerifyOTP() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const user_id = searchParams.get("user_id") || "";
    const register_token = searchParams.get("register_token") || "";

    // ===============================================
    // DYNAMIC INTERACTIVE SECURITY STATES
    // ===============================================
    const [otp, setOtp] = useState("");
    const [email, setEmail] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(60);

    const [accessDenied, setAccessDenied] = useState<{
        message: string;
        blockedUntil?: string;
    } | null>(null);
    const [checkingBlock, setCheckingBlock] = useState(true);
    const [dataRegister, setDataRegister] = useState<{
        register_id?: string;
        email?: string;
        exp?: number;
    } | null>(null);

    // ===============================================
    // DECODE REGISTER TOKEN PIPELINE
    // ===============================================
    useEffect(() => {
        if (!register_token) {
            setDataRegister(null);
            return;
        }
        try {
            const payload = jwtDecode<{ sub?: string; email?: string; exp?: number }>(register_token);
            setDataRegister({
                register_id: payload.sub,
                email: payload.email,
                exp: payload.exp
            });
        } catch (err) {
            setDataRegister(null);
        }
    }, [register_token]);

    // ===============================================
    // FETCH TARGET LOGGED OPERATOR EMAIL NODE
    // ===============================================
    useEffect(() => {
        if (user_id) {
            async function fetchEmailNode() {
                try {
                    const emailResponse = await getEmail(user_id);
                    setEmail(emailResponse.data.email);
                } catch (err) {
                    console.error("Email destination query failure:", err);
                }
            }
            void fetchEmailNode();
        }
    }, [user_id]);

    // ===============================================
    // FIREWALL MULTI-LAYER ATTEMPT BLOCK AUDIT
    // ===============================================
    useEffect(() => {
        async function checkBlockStatus() {
            try {
                const resultDevice = await block_status('device');
                let result = resultDevice;
                if (!resultDevice.data.blocked && user_id) {
                    result = await block_status('user', user_id);
                }

                if (result.data.blocked) {
                    setAccessDenied({
                        message: result.data.reason || "Too many authentication verification attempts.",
                        blockedUntil: result.data.blocked_until
                    });
                }
            } catch (err) {
                console.error("OTP structural firewall trace exception:", err);
            } finally {
                setCheckingBlock(false);
            }
        }
        void checkBlockStatus();
    }, [user_id]);

    // ===============================================
    // AUTOMATED RESEND TICK TIMER COOLDOWN
    // ===============================================
    useEffect(() => {
        if (resendCooldown <= 0) return;
        const timer = setInterval(() => {
            setResendCooldown(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [resendCooldown]);
    // ===============================================
    // INTERACTIVE RESEND PACKET OPT EXECUTION
    // ===============================================
    async function handleResend() {
        if (resendCooldown > 0 || resending) return;
        setResending(true);
        setError("");
        setResendSuccess(false);

        try {
            const targetId = user_id || dataRegister?.email;
            if (!targetId) throw new Error("Target destination profile identity is missing.");

            await resendOTP(targetId);
            setResendSuccess(true);
            setResendCooldown(60); // إعادة تصفير الوقت الإحصائي للعد التنازلي
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to broadcast secure authorization packet.");
        } finally {
            setResending(false);
        }
    }

    // ===============================================
    // OTP VERIFICATION SIGNATURE SUBMIT MATRIX
    // ===============================================
    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setResendSuccess(false);

        const id = user_id || register_token;
        if (!id) {
            setError("Operator clearance metadata is missing.");
            return;
        }

        if (!/^\d{6}$/.test(otp)) {
            setError("Input block requires a valid 6-digit cryptographic numerical code.");
            return;
        }

        try {
            setLoading(true);

            // الحوزة الأولى: توثيق مصادقة الدخول عبر المكون العميل
            if (user_id) {
                const result = await signIn("credentials", {
                    user_id: user_id,
                    otp,
                    redirect: false,
                });

                if (!result || result.error) {
                    const blockResult = await block_status("user", user_id);
                    if (blockResult.data.blocked) {
                        setAccessDenied({
                            message: blockResult.data.reason ?? "Access denied due to excessive transaction attempts.",
                            blockedUntil: blockResult.data.blocked_until
                        });
                        return;
                    }
                    setError("Invalid security verification code signature.");
                    return;
                }

                setSuccess(true);
                router.push("/");
                router.refresh();
            }

            // الحوزة الثانية: تأكيد تفعيل الحسابات الجديدة المعلقة
            if (register_token) {
                await verify_register({ register_token, otp });
                setSuccess(true);
                router.push("/login?verified=true");
                router.refresh();
            }
        } catch (err) {
            if (err instanceof ApiError) {
                const detail = err.data;
                if (detail && typeof detail === "object" && "blocked" in detail && detail.blocked === true) {
                    const block = detail as UserBlockError;
                    setAccessDenied({
                        message: block.reason,
                        blockedUntil: block.blocked_until,
                    });
                } else {
                    setError(err.message);
                }
            } else {
                setError("An internal deployment lifecycle error occurred.");
            }
        } finally {
            setLoading(false);
        }
    }
    // واجهة تتبع فحص جدار الحماية للشبكة الداخلي للـ Docker
    if (checkingBlock) {
        return (
            <main className="min-h-screen bg-[#08080d] flex items-center justify-center p-4">
                <div className="text-center space-y-3">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-purple-500/20 border-t-purple-500" />
                    <p className="text-xs text-zinc-500 font-semibold tracking-wider uppercase">Auditing security network clearance...</p>
                </div>
            </main>
        );
    }

    // شاشة الحجر الأمني والعزل الفوري في حال حظر الاتصال للتوكن أو الحاوية
    if (accessDenied && accessDenied.blockedUntil && (new Date(accessDenied.blockedUntil).getTime() - Date.now()) > 0) {
        return <AccessDenied message={accessDenied.message} blockedUntil={accessDenied.blockedUntil} />;
    }

    // شاشة حظر الـ Register في حال تجاوز توكن الـ JWT زمن الصلاحية المسموح
    // تم إزالة حقل token لتطابق الـ Props الافتراضية للمكون ومنع خطأ الـ Build
    if (register_token && dataRegister?.exp && (dataRegister.exp * 1000 < Date.now())) {
        return <RegisterExpired />;
    }


    const displayEmail = email || dataRegister?.email || "Protected Node User";

    return (
        <main className="min-h-screen bg-[#08080d] flex items-center justify-center px-4 relative overflow-hidden text-white">
            {/* Ambient Background Matrix Fluorescent Lights */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-0">
                <div className="w-[800px] h-[800px] rounded-full bg-purple-600/[0.04] blur-[180px]" />
                <div className="w-[500px] h-[500px] rounded-full bg-blue-500/[0.03] blur-[140px] absolute" />
            </div>

            {/* Premium Glassmorphic Security Token Container Frame */}
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
                {/* Header Metadata Section */}
                <div className="text-center space-y-2 border-b border-gray-900 pb-4">
                    <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
                        Identity OTP Check
                    </h1>
                    <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
                        A verification packet was broadcasted to target clearance layer node: <span className="text-purple-400 font-bold break-all block font-mono text-[11px] pt-1">{displayEmail}</span>
                    </p>
                </div>

                {/* Status Exception Messages Banner Box Feedback */}
                {error && (
                    <div className="bg-rose-950/40 border border-rose-800 text-rose-200 p-3.5 rounded-xl text-xs font-medium animate-pulse">
                        ⚠️ {error}
                    </div>
                )}
                {resendSuccess && (
                    <div className="bg-emerald-950/40 border border-emerald-800 text-emerald-200 p-3.5 rounded-xl text-xs font-medium animate-fadeIn">
                        ✅ Security token re-broadcasted successfully to encryption host.
                    </div>
                )}

                {/* Main Action Form Gate */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide flex justify-between">
                            <span>One-Time Password Code</span>
                            <span className="text-purple-500 text-[10px] animate-pulse">[ 6-Digits Locked ]</span>
                        </Label>
                        <Input
                            type="text"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} // حظر الحروف يدوياً لضمان النقاء العددي
                            placeholder="000000"
                            required
                            disabled={loading || success}
                            className="bg-[#141423]/60 border-gray-800 focus:border-purple-500/50 py-3.5 font-mono text-center text-xl tracking-[0.4em] rounded-xl text-white placeholder:text-gray-700"
                        />
                    </div>

                    <div className="pt-2">
                        <Button
                            type="submit"
                            disabled={loading || success}
                            className="w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-purple-600 hover:bg-purple-700 active:scale-[0.99] shadow-lg shadow-purple-600/20 transition duration-150 cursor-pointer"
                        >
                            {loading ? "Decrypting Matrix Clearance..." : "Confirm & Access Workspace"}
                        </Button>
                    </div>
                </form>

                {/* 📊 Resend Cryptographic Package Cooldown Counter Dashboard Panel */}
                <div className="pt-4 border-t border-gray-900/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <span className="text-gray-500 font-medium">Didn&apos;t receive signature token?</span>
                    {resendCooldown > 0 ? (
                        <div className="font-mono text-gray-400 bg-[#141423] border border-gray-800 px-3 py-1.5 rounded-xl text-[11px]">
                            Resend lock: <b className="text-purple-400 font-bold">{resendCooldown.toString().padStart(2, "0")}s</b>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={resending || success}
                            className="text-xs font-bold text-purple-400 hover:text-purple-300 underline cursor-pointer transition select-none disabled:opacity-40"
                        >
                            {resending ? "Transmitting..." : "Re-broadcast OTP Packet"}
                        </button>
                    )}
                </div>
            </div>
        </main>
    );
}
