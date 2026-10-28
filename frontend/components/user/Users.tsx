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
    } | null;
}

export default function Users({ user }: Props) {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function handleLogout() {
        const res = await fetch("/api/auth/logout", {
            method: "POST",
        });

        if (res.ok) {
            router.push("/login");
            router.refresh();
        }
    }

    // مزامنة آمنة ومحمية بالكامل O(1) لجلب مصفوفةOperators مع عزل أخطاء حاويات الـ Database
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
            <div className="relative z-10 w-full max-w-7xl mx-auto space-y-4">
                <UserHeader
                    user={user}
                    logout={handleLogout}
                    home={true}
                />

                {/* Inline Exception Exception Alert Panel Layout */}
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
