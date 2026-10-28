// components/user/Users.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUsers } from '@/lib/user/user';
import { User } from '@/types/user';
import UserList from './UserList';
import UserHeader from './UserHeader';

interface Props {
    user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        role?: string | null; // تم تمديد الواجهة لاستقبال رتبة Operator والتحقق منها صارماً
    } | null;
}

export default function Users({ user }: Props) {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // فحص صلاحية الآدمين حياً لمنع الموظفين العاديين من رؤية بوابة حقن الحسابات الجديدة
    const isAdminOperator = user?.role?.toLowerCase() === "admin";

    async function handleLogout() {
        const res = await fetch("/api/auth/logout", {
            method: "POST",
        });

        if (res.ok) {
            router.push("/login");
            router.refresh();
        }
    }

    useEffect(() => {
        let isMounted = true;

        async function synchronizeOperators() {
            try {
                setLoading(true);
                setError(null);
                const data = await getUsers();
                if (isMounted) setUsers(data || []);
            } catch (err) {
                console.error("Critical: Admin network telemetry synchronization exception:", err);
                if (isMounted) setError("Synchronization failure: Unable to decode user repository database shards.");
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        void synchronizeOperators();
        return () => { isMounted = false; };
    }, []);
    return (
        <main className="min-h-screen bg-[#08080d] relative overflow-hidden flex flex-col p-4 md:p-8 text-white">
            
            {/* Ambient Cyberpunk Fluid Glow Background Layers */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <div className="w-[1100px] h-[1000px] rounded-full bg-purple-600/[0.04] blur-[240px]" />
                <div className="w-[600px] h-[600px] rounded-full bg-blue-500/[0.03] blur-[180px] absolute" />
            </div>

            {/* Centralized Glassmorphic Application Wrapper */}
            <div className="relative z-10 w-full max-w-7xl mx-auto space-y-5">
                <UserHeader
                    user={user}
                    logout={handleLogout}
                    home={true}
                />

                {/* 🔒 قسم حقن وإنشاء الحسابات المتقدم - يظهر حصرياً للرتب الإدارية العليا لـ Workora */}
                {isAdminOperator && (
                    <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between p-5 rounded-2xl border border-purple-500/10 bg-gradient-to-r from-[#11111e]/80 to-[#0e0e18]/40 gap-4 shadow-xl animate-fadeIn">
                        <div className="space-y-1">
                            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" />
                                Root Operator Provisioning Channel
                            </h3>
                            <p className="text-[11px] text-gray-500 max-w-xl leading-relaxed">
                                Deploy an isolated credential node instance, allocate microservice clearance parameters, and authorize new infrastructure operators.
                            </p>
                        </div>
                        
                        <button
                            type="button"
                            onClick={() => router.push("/register")}
                            className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 active:scale-[0.98] rounded-xl shadow-md shadow-purple-600/10 transition duration-150 cursor-pointer text-center"
                        >
                            + Provision New Operator
                        </button>
                    </div>
                )}

                {/* Inline Exception Alert Panel Layout */}
                {error && (
                    <div className="bg-rose-950/40 border border-rose-800 text-rose-200 p-4 rounded-xl text-xs font-semibold animate-pulse max-w-7xl mx-auto">
                        ⚠️ {error}
                    </div>
                )}

                {/* Loading Grid Mask Gate */}
                {loading ? (
                    <div className="flex flex-col justify-center items-center py-32 space-y-3 rounded-3xl border border-white/5 bg-[#0d0d16]/40 backdrop-blur-md">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 shadow-[0_0_15px_rgba(139,92,246,0.2)]"></div>
                        <p className="text-xs text-zinc-500 font-semibold tracking-wider uppercase">Decrypting cloud user clusters registries...</p>
                    </div>
                ) : (
                    /* رندر شبكة كروت وقوائم المستخدمين المصلحة بالكامل لـ Workora */
                    <div className="rounded-3xl border border-white/5 bg-[#0d0d16]/40 backdrop-blur-md p-2 shadow-xl animate-fadeIn">
                        <UserList users={users} />
                    </div>
                )}
            </div>
        </main>
    );
}

