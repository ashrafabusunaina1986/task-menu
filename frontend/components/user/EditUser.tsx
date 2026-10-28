// components/user/EditUser.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, updateUser } from "@/lib/user/user";
import { UpdateUser, User } from "@/types/user";
import UserForm from "./UserForm";
import UserHeader from "./UserHeader";

interface Props {
    id: string;
}

export default function EditUser({ id }: Props) {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [authError, setAuthError] = useState("");
    const [errors, setErrors] = useState<{
        name?: string[];
        email?: string[];
        password?: string[];
    }>({});

    // مزامنة دقيقة لمعطيات المستخدم من الخادم الخلفي مع معالجة آمنة للاستثناءات
    useEffect(() => {
        let isMounted = true;
        
        async function loadUserNode() {
            try {
                setLoading(true);
                setAuthError("");
                const data = await getUser(id);
                if (isMounted) setUser(data);
            } catch (err) {
                console.error("User payload sync exception:", err);
                if (isMounted) setAuthError("Failed to synchronize operator infrastructure variables.");
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        if (id) void loadUserNode();
        return () => { isMounted = false; };
    }, [id]);

    async function handleUpdate(data: UpdateUser) {
        setIsUpdating(true);
        setAuthError("");
        setErrors({});

        try {
            await updateUser(id, data);
            router.push("/users");
            router.refresh();
        } catch (err) {
            console.error("Account parameter mutation error:", err);
            setAuthError(err instanceof Error ? err.message : "Internal system mutation rejected by authentication cluster host.");
            setIsUpdating(false);
        }
    }
    // واجهة فحص التحميل ومزامنة السيرفر لـ Workora
    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#08080d]">
                <div className="text-center space-y-3">
                    <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-purple-500/20 border-t-purple-500" />
                    <p className="text-xs text-zinc-500 font-medium tracking-wide">Decrypting operator profile telemetry...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#08080d] relative overflow-hidden flex items-center justify-center p-4 md:p-8 text-white">
            
            {/* Cyberpunk Fluid Glow Background Layers */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <div className="w-[1000px] h-[1000px] rounded-full bg-purple-600/5 blur-[240px]" />
                <div className="w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-[180px] absolute" />
            </div>

            {/* Premium Glassmorphic Container Box */}
            <div className="
                relative 
                z-10 
                w-full 
                max-w-xl 
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
            ">
                <UserHeader isBack={true} />

                {/* Section Heading Metadata Layout */}
                <div className="mb-6 border-b border-gray-900 pb-4">
                    <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
                        Modify Operator Data
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">Alleviate credentials, re-route clearance roles, or modify account parameter logs safely.</p>
                </div>

                {/* Production Inline Exception Alert Panel */}
                {(authError || !user) && (
                    <div className="bg-rose-950/40 border border-rose-800 text-rose-200 p-4 rounded-xl text-xs font-medium animate-pulse">
                        ⚠️ {authError || "Target operational user node cannot be localized."}
                    </div>
                )}

                {/* Active Transaction State Loading Mask */}
                {isUpdating ? (
                    <div className="flex flex-col justify-center items-center py-16 space-y-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                        <p className="text-xs text-gray-500 font-medium tracking-wide">Syncing account parameters and updating firewall maps...</p>
                    </div>
                ) : (
                    user && (
                        /* Core Forms Matrix Module */
                        <div className="animate-fadeIn">
                            <UserForm<UpdateUser>
                                initialData={user}
                                showRole
                                onSubmit={handleUpdate}
                                disabled={false} // تم تعديل الخيار ليكون متاحاً للتعديل التفاعلي الصافي للمدراء
                                is_pass={false}
                                errors={errors}
                                authError={authError}
                            />
                        </div>
                    )
                )}
            </div>
        </main>
    );
}
