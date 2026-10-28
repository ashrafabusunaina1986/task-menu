// components/user/UserList.tsx
"use client";

import { User } from "@/types/user";
import UserCard from "./UserCard";
import React from "react";

interface Props {
    users: User[];
}

export default function UserList({ users = [] }: Props) {
    const totalUsers = users.length;

    return (
        <section className="mx-auto w-full space-y-6 animate-fadeIn">
            
            {/* 📊 ترويسة لوحة التحكم والمراقبة التراكمية - Operators Analytics Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-gray-900 pb-4">
                <div className="space-y-1">
                    <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-purple-500 shadow-md shadow-purple-500/50" />
                        Infrastructure Operators
                    </h2>
                    <p className="text-xs text-gray-500">
                        Manage clearance authorization roles, audit registration contexts, and isolate operational signature nodes.
                    </p>
                </div>

                {/* العداد الإحصائي الحي لشارات المستخدمين */}
                <div className="self-start sm:self-auto text-[10px] font-bold px-3 py-1.5 rounded-full text-purple-400 bg-purple-500/5 border border-purple-500/10 uppercase tracking-widest select-none">
                    {totalUsers} {totalUsers === 1 ? "Active Node" : "Active Nodes"}
                </div>
            </div>
            {/* 🛡️ Empty State Core Section - يعرض فقط في حال غياب معطيات الحسابات من قاعدة البيانات */}
            {totalUsers === 0 ? (
                <div className="
                    flex min-h-[320px]
                    flex-col items-center justify-center
                    rounded-3xl
                    border border-dashed border-gray-800
                    bg-[#0d0d16]/30
                    backdrop-blur-sm
                    px-6 py-12
                    text-center
                    space-y-4
                ">
                    {/* Security Empty SVG Core Box */}
                    <div className="
                        flex h-14 w-14
                        items-center justify-center
                        rounded-xl
                        border border-gray-800
                        bg-[#141423]/60
                        text-gray-500
                        shadow-inner
                        select-none
                    ">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className="h-6 w-6 opacity-60 text-purple-400"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 19a4 4 0 0 0-8 0m4-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7 8a4 4 0 0 0-3-3.87m1-4.13a3 3 0 1 0 0-6"
                            />
                        </svg>
                    </div>

                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-white tracking-wide">
                            No Operator Nodes Localized
                        </h3>
                        <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                            There are currently no registered security user containers dispatched inside this database cluster cluster zone.
                        </p>
                    </div>
                </div>
            ) : (
                /* 🎛️ Users Matrix Responsive Grid Layout */
                <div className="
                    grid grid-cols-1 gap-5
                    sm:grid-cols-2
                    lg:grid-cols-3
                    xl:grid-cols-4
                    w-full
                ">
                    {users.map((user) => {
                        const targetUserId =  user._id || "";
                        return (
                            <div
                                key={targetUserId}
                                className="min-w-0"
                            >
                                <UserCard user={user} />
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
