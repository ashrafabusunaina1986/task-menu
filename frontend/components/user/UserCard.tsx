// components/user/UserCard.tsx


"use client";

import { User } from "@/types/user";
import Link from "next/link";
import React from "react";

interface Props {
    user: User;
}

export default function UserCard({ user }: Props) {
    // معرف موحد آمن لحل توافقية حقول الهوية في MongoDB وقواعد البيانات
    const targetUserId = user._id || "";

    // فلتر حماية المالك الفائق - البواب الأساسي لـ Workora
    const isSuperAdmin = user.email === "ashrafabusunaina1986@gmail.com";

    // دالة ديناميكية لتحديد ألوان وسم صلاحيات الوصول بشكل إحصائي ذكي للعامة
    const getRoleBadgeStyles = (role: string) => {
        switch (role?.toLowerCase()) {
            case "admin":
                return "bg-rose-500/10 text-rose-400 border-rose-500/20";
            case "manager":
                return "bg-purple-500/10 text-purple-400 border-purple-500/20";
            default:
                return "bg-blue-500/10 text-blue-400 border-blue-500/20";
        }
    };
    return (
        <div
            className="
                group
                relative
                overflow-hidden
                rounded-3xl
                border border-white/5
                bg-[#0d0d16]/90
                backdrop-blur-md
                p-6
                shadow-[0_15px_50px_rgba(0,0,0,0.7)]
                transition-all
                duration-300
                hover:-translate-y-1.5
                hover:border-purple-500/25
                hover:shadow-[0_0_35px_rgba(139,92,246,0.2)]
                flex
                flex-col
                justify-between
                h-full
            "
        >
            {/* Ambient Purple Backdrop Glow */}
            <div className="absolute top-0 right-0 w-20 h-24 bg-purple-500/5 blur-2xl rounded-full pointer-events-none" />

            <div>
                {/* تم إصلاح القوس المغلّق: الهيكل الرسومي لأيقونة المستخدم النيون */}
                <div className="
                    mb-5
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#141423]/60
                    border border-white/5
                    text-2xl
                    shadow-[0_0_30px_rgba(139,92,246,0.15)]
                    select-none
                ">
                    👤
                </div>

                {/* الاسم المعزز بتدرجات نيون فخمة */}
                <h2 className="
                    text-xl
                    font-extrabold
                    bg-gradient-to-r
                    from-blue-400
                    via-purple-400
                    to-pink-400
                    bg-clip-text
                    text-transparent
                    truncate
                    tracking-tight
                ">
                    {user.name}
                </h2>

                {/* محيط البريد الإلكتروني الآمن للموظفين */}
                <p className="mt-2 text-xs text-gray-500 font-mono font-medium truncate max-w-full">
                    {user.email}
                </p>

                {/* تم إصلاح الفراغات: شارة استعراض دور المستخدم الإحصائي حياً */}
                <div className="mt-4 flex items-center gap-1.5">
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded border uppercase tracking-wider ${getRoleBadgeStyles(user.role)}`}>
                        {user.role || "Operator"}
                    </span>
                    {isSuperAdmin && (
                        <span className="text-[9px] font-black px-1.5 py-0.2 rounded border border-amber-500/30 bg-amber-500/10 text-amber-400 uppercase tracking-wide">
                            Root Node
                        </span>
                    )}
                </div>
            </div>

            {/* أزرار الإجراءات والتحكم المصقولة بالكامل */}
            <div className="mt-6 flex gap-3 border-t border-gray-900/60 pt-4">
                <Link
                    href={`/users/${targetUserId}`}
                    className="
                        flex-1 
                        py-2
                        rounded-xl
                        text-xs
                        font-bold
                        text-center
                        text-purple-400
                        border
                        border-purple-500/20
                        bg-purple-500/5
                        hover:bg-purple-500/15
                        transition
                        duration-150
                    "
                >
                    View Info
                </Link>

                {/* جدار الحجر البرمي لحساب الأدمن الأساسي لـ أشرف */}
                {!isSuperAdmin ? (
                    <Link
                        href={`/users/edit/${targetUserId}`}
                        className="
                            flex-1
                            py-2
                            rounded-xl
                            text-xs
                            font-bold
                            text-center
                            text-blue-400
                            border
                            border-blue-500/20
                            bg-blue-500/5
                            hover:bg-blue-500/15
                            transition
                            duration-150
                        "
                    >
                        Modify
                    </Link>
                ) : (
                    <button
                        type="button"
                        className="
                            flex-1
                            py-2
                            rounded-xl
                            text-xs
                            font-bold
                            text-center
                            text-gray-700
                            border
                            border-gray-900
                            bg-gray-950/40
                            cursor-not-allowed
                            select-none
                        "
                        disabled
                        title="Root infrastructure configuration node is locked."
                    >
                        Locked
                    </button>
                )}
            </div>
        </div>
    );
}
