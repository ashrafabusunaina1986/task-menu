"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Task } from "@/types/task";
import TaskCard from "./TaskCard";

type ViewMode = "card" | "menu";

interface TaskListProps {
    project_id: string;
    tasks: Task[];
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    viewMode: ViewMode;
}

const STATUSES = [
    { value: "todo", label: "To Do", color: "bg-blue-500", text: "text-blue-400", border: "border-blue-500/20", bg: "bg-blue-500/5" },
    { value: "in_progress", label: "In Progress", color: "bg-amber-500", text: "text-amber-400", border: "border-amber-500/20", bg: "bg-amber-500/5" },
    { value: "done", label: "Done", color: "bg-emerald-500", text: "text-emerald-400", border: "border-emerald-500/20", bg: "bg-emerald-500/5" },
] as const;

export default function TaskList({
    project_id,
    tasks = [],
    onEdit,
    onDelete,
    viewMode
}: TaskListProps) {

    // الفرز الإحصائي المتقدم للمهام بمرور أحادي عالي السرعة O(N) لحماية موارد المتصفح للعامة
    const taskAnalytics = useMemo(() => {
        const total = tasks.length;
        const groups: Record<string, Task[]> = {
            todo: [],
            in_progress: [],
            done: []
        };
        
        let doneCount = 0;
        
        tasks.forEach(task => {
            if (groups[task.status]) {
                groups[task.status].push(task);
            }
            if (task.status === "done") {
                doneCount++;
            }
        });

        const burnRate = total > 0 ? Math.round((doneCount / total) * 100) : 0;

        return {
            total,
            groups,
            burnRate
        };
    }, [tasks]);

    if (!tasks || tasks.length === 0) {
        return (
            <div className="text-center py-20 border border-dashed border-gray-800/80 rounded-2xl bg-[#0b0b14]/50 backdrop-blur-sm">
                <div className="mx-auto w-12 h-12 rounded-xl bg-gray-900/60 border border-gray-800 flex items-center justify-center text-gray-500 mb-3">
                    📋
                </div>
                <p className="text-gray-400 font-medium text-sm">No tasks dispatched to this pipeline yet.</p>
                <p className="text-gray-600 text-xs mt-1">Deploy an atomic task instance to begin tracking action operations.</p>
            </div>
        );
    }
    return (
        <div className="space-y-10">
            {/* 📊 لوحة مؤشرات الأداء والإنتاجية للمهام - Task Micro-Analytics Dashboard */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-[#11111a]/80 border border-gray-800/60 rounded-2xl p-4 backdrop-blur-md shadow-xl">
                <div className="p-4 bg-[#161622]/60 border border-gray-800/40 rounded-xl">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Total Tracked Tasks</span>
                    <span className="text-3xl font-extrabold text-white mt-1 block">{taskAnalytics.total} <span className="text-xs font-normal text-gray-500">Units</span></span>
                </div>
                
                <div className="p-4 bg-[#161622]/60 border border-gray-800/40 rounded-xl">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Burn Velocity</span>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl font-extrabold text-emerald-400">{taskAnalytics.burnRate}%</span>
                        <div className="w-16 bg-gray-800 h-1.5 rounded-full overflow-hidden hidden sm:block">
                            <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${taskAnalytics.burnRate}%` }} />
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-[#161622]/60 border border-gray-800/40 rounded-xl col-span-2 grid grid-cols-2 gap-4 items-center">
                    <div>
                        <span className="text-[10px] font-bold text-amber-500 uppercase block">Active In Progress</span>
                        <span className="text-xl font-bold text-white mt-0.5 block">{taskAnalytics.groups.in_progress.length}</span>
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-blue-400 uppercase block">Staged In Backlog</span>
                        <span className="text-xl font-bold text-white mt-0.5 block">{taskAnalytics.groups.todo.length}</span>
                    </div>
                </div>
            </div>

            {/* 📋 القوائم المصنفة هيكلياً بناءً على الحالات المكتشفة حياً */}
            <div className="flex flex-col gap-10">
                {STATUSES.map((status) => {
                    const statusTasks = taskAnalytics.groups[status.value] || [];
                    if (statusTasks.length === 0) return null;
                    return (
                        <section key={status.value} className="space-y-4">
                            {/* ترويسة فرز الحالة وعرض العدادات */}
                            <div className="flex items-center justify-between border-b border-gray-900 pb-2">
                                <div className="flex items-center gap-2">
                                    <span className={`h-2.5 w-2.5 rounded-full ${status.color} shadow-sm`} />
                                    <h2 className="text-lg font-bold text-white tracking-wide">
                                        {status.label}
                                    </h2>
                                </div>
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${status.text} ${status.bg} border ${status.border}`}>
                                    {statusTasks.length} {statusTasks.length === 1 ? 'Task' : 'Tasks'}
                                </span>
                            </div>

                            {/* التبديل بين الـ Menu Linear List والـ Card Grid المتجاوبة */}
                            {viewMode === "menu" ? (
                                <div className="flex flex-col gap-3">
                                    {statusTasks.map((task) => {
                                        const targetTaskId = task._id || "";
                                        return (
                                            <div
                                                key={targetTaskId}
                                                className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-gray-800/40 bg-[#0f0f18]/80 px-5 py-4 gap-4 transition-all duration-200 hover:border-purple-500/30 hover:bg-[#12121e]"
                                            >
                                                <div className="min-w-0 space-y-1">
                                                    <h3 className="font-semibold text-white text-base truncate hover:text-purple-400 transition">
                                                        <Link href={`/tasks/${targetTaskId}?project_id=${encodeURIComponent(project_id)}`}>
                                                            {task.title}
                                                        </Link>
                                                    </h3>
                                                    <p className="text-sm text-gray-400 truncate max-w-2xl">
                                                        {task.description || "No task description metadata provided."}
                                                    </p>
                                                    {task.priority && (
                                                        <div className="pt-0.5">
                                                            <span className="text-[10px] font-bold text-purple-400 bg-[#161624] px-1.5 py-0.5 rounded border border-gray-800 uppercase tracking-wide">
                                                                Priority: {task.priority}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-2 sm:ml-4 self-end sm:self-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => onEdit(targetTaskId)}
                                                        className="rounded-lg border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/15 px-3.5 py-1.5 text-xs font-semibold text-blue-400 shadow-sm transition duration-150 cursor-pointer"
                                                    >
                                                        Modify
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => onDelete(targetTaskId)}
                                                        className="rounded-lg border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/15 px-3.5 py-1.5 text-xs font-semibold text-rose-400 shadow-sm transition duration-150 cursor-pointer"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {statusTasks.map((task) => (
                                        <TaskCard
                                            project_id={project_id}
                                            key={task._id}
                                            task={task}
                                            onEdit={onEdit}
                                            onDelete={onDelete}
                                        />
                                    ))}
                                </div>
                            )}
                        </section>
                    );
                })}
            </div>
        </div>
    );
}
