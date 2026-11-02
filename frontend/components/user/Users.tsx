// components/user/Users.tsx

"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getUsers } from '@/lib/user/user';
import { User } from '@/types/user';
import UserList from './UserList';
import UserHeader from './UserHeader';
import { FiSearch, FiChevronLeft, FiChevronRight, FiSliders } from "react-icons/fi";
import { Session } from "next-auth";
import TopNavigation from "../navigation/TopNavigation";

interface Props {
    user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        role?: string | null;
    } | null;
    session: Session
}

export default function Users({ user, session }: Props) {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Operational parameters controlling unified multi-layered search filters and paging frameworks
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRole, setSelectedRole] = useState<string>("all"); // Injected: Dedicated state to map dynamic role filtering loops
    const [currentPage, setCurrentPage] = useState(1);
    const USERS_PER_PAGE = 10;

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

    // 🔍 OPTIMIZED: Blending both input query strings and the selected drop-down role state into a memoized filtration pipeline
    const filteredUsers = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        return users.filter((u) => {
            const matchesQuery =
                query === "" ||
                (u.name ?? "").toLowerCase().includes(query) ||
                (u.email ?? "").toLowerCase().includes(query) ||
                (u.role ?? "").toLowerCase().includes(query);

            const matchesRole =
                selectedRole === "all" ||
                (u.role ?? "").toLowerCase() === selectedRole.toLowerCase();

            return matchesQuery && matchesRole;
        });
    }, [users, searchTerm, selectedRole]);

    const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE) || 1;

    // Reset pagination indices dynamically if filtering inputs shift bounds
    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(1);
        }
    }, [searchTerm, selectedRole, totalPages, currentPage]);

    const paginatedUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * USERS_PER_PAGE;
        return filteredUsers.slice(startIndex, startIndex + USERS_PER_PAGE);
    }, [filteredUsers, currentPage]);
    return (
        <main className="min-h-screen bg-[#08080d] relative overflow-hidden flex flex-col p-4 md:p-8 text-white w-full">
            {/* Ambient Fluid Glow Background Layers */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <div className="w-[1100px] h-[1000px] rounded-full bg-purple-600/[0.04] blur-[240px]" />
                <div className="w-[600px] h-[600px] rounded-full bg-blue-500/[0.03] blur-[180px] absolute" />
            </div>
            <div className="relative z-10 w-full max-w-7xl mx-auto space-y-5">

                {/* Root Operator Provisioning Channel - Admin Gate */}
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
                            onClick={() => router.push("/users/create")}
                            className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 active:scale-[0.98] rounded-xl transition duration-150 cursor-pointer text-center"
                        >
                            + Provision New Operator
                        </button>
                    </div>
                )}

                {/* 🔍 ENHANCED: Integrated Advanced Double-Filter Bar containing the new role mapping dropdown selection block */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#11111a]/80 p-4 rounded-2xl border border-gray-800/60 shadow-inner">
                    <div className="relative w-full md:col-span-2 group">
                        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-purple-500 transition" />
                        <input
                            type="text"
                            placeholder="Search by name, email database node, or keyword tokens..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full bg-[#161622] border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/5 transition duration-150"
                        />
                    </div>

                    {/* 🎛️ Injected Drop-down layout mapping structural roles smoothly to separate metrics on screen */}
                    <div className="relative w-full group">
                        <FiSliders className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400 text-xs" />
                        <select
                            value={selectedRole}
                            onChange={(e) => {
                                setSelectedRole(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full bg-[#161622] border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/5 transition duration-150 cursor-pointer appearance-none"
                        >
                            <option value="all">Filter Scope: All System Roles</option>
                            <option value="admin">Administrators</option>
                            <option value="manager">Managers</option>
                            <option value="user">Standard Operators (Users)</option>
                        </select>
                        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-purple-500 text-[10px]">▼</div>
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
                    /* Render paginated accounts registry */
                    <div className="space-y-6">
                        <div className="rounded-3xl border border-white/5 bg-[#0d0d16]/40 backdrop-blur-md p-2 shadow-xl animate-fadeIn">
                            <UserList users={paginatedUsers} />
                        </div>

                        {/* ✅ FIXED: Reconstructed and closed the missing pagination tracking controls perfectly */}
                        {filteredUsers.length > 0 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 px-2 text-xs font-medium text-gray-500">
                                <span className="font-mono text-[11px]">
                                    Showing <span className="text-purple-400 font-bold">{paginatedUsers.length}</span> of <span className="text-white font-bold">{filteredUsers.length}</span> operators localized.
                                </span>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        className="inline-flex items-center justify-center p-2 rounded-xl bg-[#141423]/60 border border-gray-800 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-purple-500/40 hover:bg-[#141423] transition cursor-pointer"
                                    >
                                        <FiChevronLeft className="text-sm" />
                                    </button>

                                    <span className="font-mono text-[11px] bg-[#11111a] border border-gray-800 px-3 py-1.5 rounded-xl text-gray-300">
                                        Page <span className="text-purple-400 font-bold">{currentPage}</span> / {totalPages}
                                    </span>

                                    <button
                                        type="button"
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        className="inline-flex items-center justify-center p-2 rounded-xl bg-[#141423]/60 border border-gray-800 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-purple-500/40 hover:bg-[#141423] transition cursor-pointer"
                                    >
                                        <FiChevronRight className="text-sm" />
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
