// components/user/Users.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getUsers } from '@/lib/user/user';
import { User } from '@/types/user';
import UserList from './UserList';
import UserHeader from './UserHeader';
import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface Props {
    user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        role?: string | null;
    } | null;
}

export default function Users({ user }: Props) {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // حالات التحكم الإحصائي في البحث وتقسيم الصفحات (Pagination & Filter States)
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const USERS_PER_PAGE = 10; // شرط العرض: 10 يوزرز فقط في كل صفحة

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
                console.error("Admin network telemetry exception:", err);
                if (isMounted) setError("Synchronization failure: Unable to decode user shards.");
            } finally {
                if (isMounted) setLoading(false);
            }
        }
        void synchronizeOperators();
        return () => { isMounted = false; };
    }, []);

    // 🔍 منطق الفرز والبحث الذكي الموحد عبر الـ useMemo لحماية أداء المتصفح
    const filteredUsers = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        return users.filter((u) => {
            return (
                query === "" ||
                (u.name ?? "").toLowerCase().includes(query) ||
                (u.email ?? "").toLowerCase().includes(query) ||
                (u.role ?? "").toLowerCase().includes(query)
            );
        });
    }, [users, searchTerm]);
    // 📊 عمليات الحساب الرقمي الدقيق لتقسيم الصفحات بناءً على الفرز الفعلي
    const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE) || 1;

    // تصفير مؤشر الصفحة تلقائياً في حال تجاوز البحث للنطاق المتاح
    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(1);
        }
    }, [searchTerm, totalPages, currentPage]);

    // عزل واستخراج الـ 10 مستخدمين المخصصين للصفحة النشطة حالياً O(1)
    const paginatedUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * USERS_PER_PAGE;
        return filteredUsers.slice(startIndex, startIndex + USERS_PER_PAGE);
    }, [filteredUsers, currentPage]);

    return (
        <main className="min-h-screen bg-[#08080d] relative overflow-hidden flex flex-col p-4 md:p-8 text-white">
            {/* Ambient Fluid Glow Background Layers */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <div className="w-[1100px] h-[1000px] rounded-full bg-purple-600/[0.04] blur-[240px]" />
                <div className="w-[600px] h-[600px] rounded-full bg-blue-500/[0.03] blur-[180px] absolute" />
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto space-y-5">
                <UserHeader user={user} logout={handleLogout} home={true} />

                {/* 🔒 Root Operator Provisioning Channel - Admin Gate */}
                {isAdminOperator && (
                    <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between p-5 rounded-2xl border border-purple-500/10 bg-gradient-to-r from-[#11111e]/80 to-[#0e0e18]/40 gap-4 shadow-xl">
                        <div className="space-y-1">
                            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" />
                                Root Operator Provisioning Channel
                            </h3>
                            <p className="text-[11px] text-gray-500 max-w-xl">
                                Deploy an isolated credential node instance, allocate microservice clearance parameters, and authorize new infrastructure operators.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => router.push("/register")}
                            className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 active:scale-[0.98] rounded-xl transition duration-150 cursor-pointer text-center"
                        >
                            + Provision New Operator
                        </button>
                    </div>
                )}

                {/* 🔍 قسم شريط البحث الذكي المطور - Advanced Search Filter Bar */}
                <div className="flex bg-[#11111a]/80 p-4 rounded-2xl border border-gray-800/60 shadow-inner">
                    <div className="relative w-full max-w-md group">
                        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-purple-500 transition" />
                        <input
                            type="text"
                            placeholder="Search by name, email database node, or role scope..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1); // تصفير الصفحة عند إدخال فلتر جديد
                            }}
                            className="w-full bg-[#161622] border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/5 transition duration-150"
                        />
                    </div>
                </div>
                {/* Error Banner System */}
                {error && (
                    <div className="bg-rose-950/40 border border-rose-800 text-rose-200 p-4 rounded-xl text-xs font-semibold animate-pulse">
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
                    /* رندر شبكة كروت وقوائم المستخدمين المحددة بـ 10 حسابات فقط */
                    <div className="space-y-6">
                        <div className="rounded-3xl border border-white/5 bg-[#0d0d16]/40 backdrop-blur-md p-2 shadow-xl animate-fadeIn">
                            <UserList users={paginatedUsers} />
                        </div>

                        {/* 🎛️ لوحة أزرار تقسيم وحساب الصفحات الختامية - Translucent Analytics Pagination Panel */}
                        {filteredUsers.length > 0 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#11111a]/80 p-4 rounded-2xl border border-gray-800/60 shadow-lg">
                                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                    Showing <b className="text-gray-300 font-mono">{(currentPage - 1) * USERS_PER_PAGE + 1}</b> - <b className="text-gray-300 font-mono">{Math.min(currentPage * USERS_PER_PAGE, filteredUsers.length)}</b> of <b className="text-purple-400 font-mono">{filteredUsers.length}</b> Entries
                                </span>

                                <div className="flex items-center bg-[#161622] p-1 rounded-xl border border-gray-800/60 gap-1 select-none">
                                    <button
                                        type="button"
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 disabled:opacity-20 disabled:hover:bg-transparent disabled:cursor-not-allowed transition cursor-pointer"
                                        title="Previous Matrix Page"
                                    >
                                        <FiChevronLeft size={16} />
                                    </button>

                                    {/* عرض أرقام الصفحات التراكمية ديناميكياً */}
                                    <div className="flex gap-1 px-1">
                                        {Array.from({ length: totalPages }, (_, index) => {
                                            const pageNum = index + 1;
                                            return (
                                                <button
                                                    key={pageNum}
                                                    type="button"
                                                    onClick={() => setCurrentPage(pageNum)}
                                                    className={`h-7 w-7 rounded-lg text-xs font-bold tracking-tight transition-all duration-150 cursor-pointer ${currentPage === pageNum ? "bg-purple-600 text-white shadow-md shadow-purple-600/20" : "text-gray-500 hover:text-gray-300"}`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <button
                                        type="button"
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 disabled:opacity-20 disabled:hover:bg-transparent disabled:cursor-not-allowed transition cursor-pointer"
                                        title="Next Matrix Page"
                                    >
                                        <FiChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}
