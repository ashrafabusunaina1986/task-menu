
// components/project/ProjectCard.tsx"use client";

import { useMemo } from "react";
import { Project } from "@/types/project";
import { useRouter } from "next/navigation";

// تمديد واجهة الـ Project لتشمل الخصائص الإحصائية الاختيارية ودور المالك القادم من السيرفر
type ExtendedProject = Project & {
    owner_role?: string | null;
    tasks_stats?: {
        todo: number;
        in_progress: number;
        done: number;
    } | null;
};

interface ProjectCardProps {
    project: Project;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export default function ProjectCard({
    project,
    onEdit,
    onDelete
}: ProjectCardProps) {
    const router = useRouter();
    const extProject = project as ExtendedProject;

    // معرف موحد آمن للتعامل مع معايير تنقل وإدارة MongoDB
    const targetId = extProject._id || "";

    // حساب إحصائيات المهام ديناميكياً ونسبة التقدم الكلية للمشروع
    const taskAnalytics = useMemo(() => {
        if (!extProject.tasks_stats) return null;

        const { todo = 0, in_progress = 0, done = 0 } = extProject.tasks_stats;
        const totalTasks = todo + in_progress + done;
        const progressPercentage = totalTasks > 0 ? Math.round((done / totalTasks) * 100) : 0;

        return {
            totalTasks,
            progressPercentage,
            todo,
            in_progress,
            done
        };
    }, [extProject.tasks_stats]);

    // دالة ديناميكية لتحديد لون شارة دور المالك بشكل جمالي
    const getRoleBadgeStyles = (role: string | null | undefined) => {
        if (!role) return "bg-gray-800 text-gray-400 border-gray-700/60";
        switch (role.toLowerCase()) {
            case "admin":
                return "bg-rose-500/10 text-rose-400 border-rose-500/20";
            case "manager":
                return "bg-purple-500/10 text-purple-400 border-purple-500/20";
            case "user":
                return "bg-blue-500/10 text-blue-400 border-blue-500/20";
            default:
                return "bg-zinc-800 text-zinc-400 border-zinc-700";
        }
    };
    return (
        <div
            className="
                relative
                overflow-hidden
                rounded-2xl
                border border-white/5
                bg-[#0d0d16]/90
                backdrop-blur-md
                p-5
                shadow-[0_12px_40px_rgba(0,0,0,.6)]
                transition-all
                duration-300
                hover:-translate-y-1.5
                hover:border-purple-500/25
                hover:shadow-[0_0_35px_rgba(139,92,246,.25)]
                flex
                flex-col
                justify-between
                h-full
            "
        >
            {/* Ambient Radial Cyberpunk Glow */}
            <div
                className="
                    absolute
                    top-0
                    right-0
                    w-28
                    h-28
                    bg-purple-500/5
                    blur-3xl
                    rounded-full
                    pointer-events-none
                "
            />

            <div>
                {/* العنوان ورابط التنقل التفصيلي */}
                <h2
                    className="
                        text-lg
                        font-bold
                        text-white
                        mb-2
                        cursor-pointer
                        hover:text-purple-400
                        transition
                        truncate
                    "
                    onClick={() => router.push(`/project/${targetId}`)}
                >
                    {extProject.name}
                </h2>

                {/* شارة عرض دور المالك الاحترافية */}
                <div className="flex items-center gap-1.5 mb-4">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Owner:</span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border uppercase ${getRoleBadgeStyles(extProject.owner_role)}`}>
                        {extProject.owner_role || "No Owner"}
                    </span>
                </div>

                {/* الوصف النصي المعزز بحدود كسر تدفق الكلمات */}
                <p className="text-gray-400 text-sm line-clamp-3 min-h-[60px] break-words">
                    {extProject.description || "No project description metadata provided."}
                </p>

                {/* قسم إحصائيات المهام المتقدم - يعرض فقط في حال وجود داتا إحصائية */}
                {taskAnalytics && taskAnalytics.totalTasks > 0 && (
                    <div className="mt-4 p-3 rounded-xl bg-[#131322]/70 border border-gray-800/60 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-400 font-medium">Task Velocity</span>
                            <span className="text-emerald-400 font-bold">{taskAnalytics.progressPercentage}%</span>
                        </div>
                        {/* بار التقدم الإحصائي */}
                        <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-purple-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                                style={{ width: `${taskAnalytics.progressPercentage}%` }}
                            />
                        </div>
                        {/* تفصيل أرقام الحالات الصافية للمهام */}
                        <div className="flex justify-between text-[10px] text-gray-500 pt-0.5">
                            <span>Todo: <b className="text-gray-300">{taskAnalytics.todo}</b></span>
                            <span>Active: <b className="text-amber-400">{taskAnalytics.in_progress}</b></span>
                            <span>Done: <b className="text-emerald-400">{taskAnalytics.done}</b></span>
                        </div>
                    </div>
                )}
            </div>

            <div>
                {/* الخصائص الأساسية للمشروع */}
                <div
                    className="
                        mt-5
                        space-y-2
                        text-xs
                        border-t
                        border-gray-800/80
                        pt-4
                    "
                >
                    <p className="text-gray-400 flex justify-between">
                        <span className="font-semibold text-gray-500">Status:</span>
                        <span className="capitalize font-medium text-white">{extProject.status}</span>
                    </p>

                    <p className="text-gray-400 flex justify-between">
                        <span className="font-semibold text-gray-500">Priority:</span>
                        <span className="capitalize font-medium text-purple-400">{extProject.priority}</span>
                    </p>
                </div>

                {/* أزرار التحكم والتعديل الرسومية الفاخرة */}
                <div className="mt-5 flex gap-3.5">
                    <button
                        type="button"
                        onClick={() => onEdit(targetId)}
                        className="
                            flex-1
                            py-2
                            rounded-xl
                            text-xs
                            font-bold
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
                    </button>

                    <button
                        type="button"
                        onClick={() => onDelete(targetId)}
                        className="
                            flex-1
                            py-2
                            rounded-xl
                            text-xs
                            font-bold
                            text-rose-400
                            border
                            border-rose-500/20
                            bg-rose-500/5
                            hover:bg-rose-500/15
                            transition
                            duration-150
                        "
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
