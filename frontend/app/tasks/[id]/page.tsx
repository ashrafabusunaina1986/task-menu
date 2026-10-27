// app/tasks/[id]/page.tsx
// 
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { getTask } from "@/lib/server_api";
import { Task } from "@/types/task";
import LocalDate from "@/components/date/LocalDate";

interface TaskPageProps {
    params: Promise<{
        id: string;
    }>;
    searchParams: Promise<{
        project_id?: string;
    }>;
}

export default async function TaskPage({
    params,
    searchParams
}: TaskPageProps) {

    const { id } = await params;
    const { project_id } = await searchParams;

    if (!project_id) {
        return redirect("/project");
    }

    let task: Task;

    try {
        task = await getTask(id, project_id);
        if (!task) {
            notFound();
        }
    } catch (error) {
        console.error(error);
        notFound();
    }

    const targetTaskId = task._id || "";

    // دالة تحديد سمات شارات ألوان الحالات للمهام داخل السيرفر
    const getStatusBadgeStyles = (status: string) => {
        switch (status?.toLowerCase()) {
            case "todo": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
            case "in_progress": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
            case "done": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
            default: return "bg-zinc-800 text-zinc-400 border-zinc-700";
        }
    };

    // دالة تحديد سمات شارات ألوان مستويات الأولوية داخل السيرفر
    const getPriorityBadgeStyles = (priority: string) => {
        switch (priority?.toLowerCase()) {
            case "high": return "bg-rose-500/10 text-rose-400 border-rose-500/20";
            case "medium": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
            case "low": return "bg-gray-500/10 text-gray-400 border-gray-700/60";
            default: return "bg-zinc-800 text-zinc-400 border-zinc-700";
        }
    };
    return (
        <main className="relative min-h-screen overflow-hidden bg-[#08080d] py-10 px-4 sm:px-6">
            {/* Premium Ambient Background Glow Layer */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-[1000px] w-[1000px] rounded-full bg-purple-600/5 blur-[240px]" />
                <div className="absolute h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[180px]" />
            </div>

            <div className="relative mx-auto max-w-4xl rounded-[32px] border border-white/5 bg-[#0d0d16]/90 p-6 md:p-10 shadow-[0_30px_90px_rgba(0,0,0,.85)] backdrop-blur-xl space-y-8 animate-fadeIn">
                
                {/* Translucent Navigation Breadcrumb Top Ribbon */}
                <div className="flex justify-between items-center border-b border-gray-900 pb-5">
                    <Link 
                        href={`/tasks?project_id=${encodeURIComponent(project_id)}`} 
                        className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-purple-400 uppercase tracking-wider transition"
                    >
                        <span>←</span> Back to Tasks Pipeline
                    </Link>
                    <div className="text-[10px] font-mono text-gray-600 bg-[#121222] px-2 py-0.5 rounded border border-gray-800/80">
                        REF_ID: {targetTaskId.slice(0, 8)}...
                    </div>
                </div>

                {/* Section Header Metadata Layout */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-900/60 pb-6">
                    <div>
                        <h1 className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl tracking-tight">
                            Task Instance Details
                        </h1>
                        <p className="text-xs text-gray-500 mt-1">Review atomic context metrics, task progression scopes, and lifecycle log data.</p>
                    </div>

                    {/* Integrated Micro-Metrics Bar Badges */}
                    <div className="flex items-center gap-3 bg-[#11111a] p-2 rounded-xl border border-gray-800/40">
                        <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md border uppercase ${getStatusBadgeStyles(task.status)}`}>
                            {task.status || "Todo"}
                        </span>
                        <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md border uppercase ${getPriorityBadgeStyles(task.priority)}`}>
                            {task.priority || "Medium"}
                        </span>
                    </div>
                </div>

                {/* Structural Content Fields Dashboard */}
                <div className="space-y-6 pt-2">
                    {/* Task Title Block */}
                    <div className="p-5 rounded-2xl bg-[#141423]/40 border border-gray-800/60 space-y-1">
                        <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500">
                            Task Content Title
                        </h2>
                        <p className="text-lg font-extrabold text-white tracking-tight pt-1">
                            {task.title}
                        </p>
                    </div>

                    {/* Task Description Context Block */}
                    <div className="p-5 rounded-2xl bg-[#141423]/40 border border-gray-800/60 space-y-1">
                        <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500">
                            Contextual Description Parameters
                        </h2>
                        <p className="text-sm leading-6 text-gray-300 pt-1 break-words whitespace-pre-line">
                            {task.description || "No specific detailed description metadata compiled for this action item."}
                        </p>
                    </div>

                    {/* Operational Lifecycle Database Logs Timestamps */}
                    <div className="grid gap-4 sm:grid-cols-2 border-t border-gray-900 pt-6">
                        <div className="rounded-xl border border-gray-800/40 bg-[#141423]/20 p-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Instance Dispatched</h2>
                                <p className="mt-1 text-xs text-gray-300 font-medium">
                                    <LocalDate date={task.created_at} />
                                </p>
                            </div>
                            <span className="text-base opacity-40">📥</span>
                        </div>

                        <div className="rounded-xl border border-gray-800/40 bg-[#141423]/20 p-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Last Core Mutation</h2>
                                <p className="mt-1 text-xs text-purple-400 font-medium">
                                    <LocalDate date={task.updated_at} />
                                </p>
                            </div>
                            <span className="text-base opacity-40">🔄</span>
                        </div>
                    </div>
                </div>

                {/* Global Administrative Control Panel Buttons */}
                <div className="mt-8 pt-5 border-t border-gray-900 flex flex-col sm:flex-row sm:justify-between gap-4 items-center">
                    <Link
                        href={`/project/${encodeURIComponent(project_id)}`}
                        className="w-full sm:w-auto text-center rounded-xl border border-gray-800 bg-[#141423]/40 px-6 py-2.5 text-xs font-bold text-gray-400 transition hover:bg-gray-800 hover:text-white"
                    >
                        Return to Cluster Mappings
                    </Link>

                    <Link
                        href={`/tasks/edit/${targetTaskId}?project_id=${encodeURIComponent(project_id)}`}
                        className="w-full sm:w-auto text-center rounded-xl bg-purple-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-600/20 transition hover:bg-purple-700 active:scale-[0.98]"
                    >
                        Modify Task Parameters
                    </Link>
                </div>
            </div>
        </main>
    );
}
