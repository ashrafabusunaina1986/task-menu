// components/TaskCard.tsx
// 
"use client";

import { Task } from "@/types/task";
import { useRouter } from "next/navigation";

interface TaskCardProps {
    project_id: string;
    task: Task;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export default function TaskCard({
    project_id,
    task,
    onEdit,
    onDelete
}: TaskCardProps) {
    const router = useRouter();

    // معرف موحد آمن لحل توافقية حقول الهوية في MongoDB
    const targetTaskId = task._id || "";

    // دالة ديناميكية لتحديد شارات ألوان الحالات (Status Badges)
    const getStatusStyles = (status: string) => {
        switch (status?.toLowerCase()) {
            case "todo":
                return "bg-blue-500/10 text-blue-400 border-blue-500/20";
            case "in_progress":
                return "bg-amber-500/10 text-amber-400 border-amber-500/20";
            case "done":
                return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
            default:
                return "bg-zinc-800 text-zinc-400 border-zinc-700";
        }
    };

    // دالة ديناميكية لتحديد شارات ألوان مستويات الأولوية (Priority Badges)
    const getPriorityStyles = (priority: string) => {
        switch (priority?.toLowerCase()) {
            case "high":
                return "bg-rose-500/10 text-rose-400 border-rose-500/20";
            case "medium":
                return "bg-purple-500/10 text-purple-400 border-purple-500/20";
            case "low":
                return "bg-gray-500/10 text-gray-400 border-gray-700/60";
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
            {/* Ambient Cyberpunk Glow */}
            <div
                className="
                    absolute
                    top-0
                    right-0
                    w-24
                    h-24
                    bg-purple-500/5
                    blur-3xl
                    rounded-full
                    pointer-events-none
                "
            />

            <div>
                {/* عنوان المهمة التفاعلي مع روابط التنقل المؤمنة */}
                <h2
                    className="
                        text-lg
                        font-bold
                        text-white
                        mb-3
                        cursor-pointer
                        hover:text-purple-400
                        transition
                        truncate
                    "
                    onClick={() => router.push(`/tasks/${targetTaskId}?project_id=${encodeURIComponent(project_id)}`)}
                >
                    {task.title}
                </h2>

                {/* الوصف النصي للمهمة */}
                <p className="text-gray-400 text-sm line-clamp-3 min-h-[60px] break-words">
                    {task.description || "No task description metadata provided."}
                </p>
            </div>

            <div>
                {/* الخصائص والعدادات الأساسية للـ Task المعززة بالشارات الملونة */}
                <div
                    className="
                        mt-5
                        space-y-3
                        text-xs
                        border-t
                        border-gray-800/80
                        pt-4
                    "
                >
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-500">Status:</span>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border uppercase ${getStatusStyles(task.status)}`}>
                            {task.status || "Todo"}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-500">Priority:</span>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border uppercase ${getPriorityStyles(task.priority)}`}>
                            {task.priority || "Medium"}
                        </span>
                    </div>
                </div>

                {/* أزرار الإجراءات والتحكم المتطابقة كلياً مع كرت المشروع */}
                <div className="mt-5 flex gap-3.5">
                    <button
                        type="button"
                        onClick={() => onEdit(targetTaskId)}
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
                            cursor-pointer
                        "
                    >
                        Modify
                    </button>

                    <button
                        type="button"
                        onClick={() => onDelete(targetTaskId)}
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
                            cursor-pointer
                        "
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
