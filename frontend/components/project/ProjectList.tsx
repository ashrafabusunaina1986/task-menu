
// components/project/ProjectList.tsx
"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Project } from "@/types/project";
import ProjectCard from "./ProjectCard";

type ViewMode = "card" | "menu";

interface ProjectListProps {
    projects: Project[];
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    viewMode: ViewMode;
}

const STATUSES = [
    { value: "planned", label: "Planned", color: "bg-blue-500", text: "text-blue-400", border: "border-blue-500/20", bg: "bg-blue-500/5" },
    { value: "in_progress", label: "In Progress", color: "bg-amber-500", text: "text-amber-400", border: "border-amber-500/20", bg: "bg-amber-500/5" },
    { value: "on_hold", label: "On Hold", color: "bg-purple-500", text: "text-purple-400", border: "border-purple-500/20", bg: "bg-purple-500/5" },
    { value: "completed", label: "Completed", color: "bg-emerald-500", text: "text-emerald-400", border: "border-emerald-500/20", bg: "bg-emerald-500/5" },
    { value: "cancelled", label: "Cancelled", color: "bg-rose-500", text: "text-rose-400", border: "border-rose-500/20", bg: "bg-rose-500/5" },
] as const;

export default function ProjectList({
    projects = [],
    onEdit,
    onDelete,
    viewMode
}: ProjectListProps) {

    // المعالجة الإحصائية المتقدمة وتوزيع الحالات بمرور واحد ومستقر للأداء العالي O(N)
    const analytics = useMemo(() => {
        const total = projects.length;
        const groups: Record<string, Project[]> = {
            planned: [],
            in_progress: [],
            on_hold: [],
            completed: [],
            cancelled: []
        };

        let completedCount = 0;

        projects.forEach(project => {
            if (groups[project.status]) {
                groups[project.status].push(project);
            }
            if (project.status === "completed") {
                completedCount++;
            }
        });

        const completionRate = total > 0 ? Math.round((completedCount / total) * 100) : 0;

        return {
            total,
            groups,
            completionRate
        };
    }, [projects]);

    if (!projects || projects.length === 0) {
        return (
            <div className="text-center py-20 border border-dashed border-gray-800/80 rounded-2xl bg-[#0b0b14]/50 backdrop-blur-sm">
                <div className="mx-auto w-12 h-12 rounded-xl bg-gray-900/60 border border-gray-800 flex items-center justify-center text-gray-500 mb-3">
                    📊
                </div>
                <p className="text-gray-400 font-medium text-sm">No active pipeline projects discovered.</p>
                <p className="text-gray-600 text-xs mt-1">Create a new container or expand your active criteria metrics.</p>
            </div>
        );
    }
    return (
        <div className="space-y-10">
            {/* 📊 لوحة المؤشرات الإحصائية العلوية المتقدمة - Analytical Dashboard Topbar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-[#11111a]/80 border border-gray-800/60 rounded-2xl p-4 backdrop-blur-md shadow-xl">
                <div className="p-4 bg-[#161622]/60 border border-gray-800/40 rounded-xl">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Total Pipeline</span>
                    <span className="text-3xl font-extrabold text-white mt-1 block">{analytics.total} <span className="text-xs font-normal text-gray-500">Units</span></span>
                </div>

                <div className="p-4 bg-[#161622]/60 border border-gray-800/40 rounded-xl">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Success Rate</span>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl font-extrabold text-emerald-400">{analytics.completionRate}%</span>
                        <div className="w-16 bg-gray-800 h-1.5 rounded-full overflow-hidden hidden sm:block">
                            <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${analytics.completionRate}%` }} />
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-[#161622]/60 border border-gray-800/40 rounded-xl col-span-2 grid grid-cols-3 gap-2 items-center">
                    <div>
                        <span className="text-[10px] font-bold text-amber-500 uppercase block">Active Process</span>
                        <span className="text-xl font-bold text-white mt-0.5 block">{analytics.groups.in_progress.length}</span>
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-purple-400 uppercase block">On Retention</span>
                        <span className="text-xl font-bold text-white mt-0.5 block">{analytics.groups.on_hold.length}</span>
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-blue-400 uppercase block">Planned Stage</span>
                        <span className="text-xl font-bold text-white mt-0.5 block">{analytics.groups.planned.length}</span>
                    </div>
                </div>
            </div>

            {/* 📋 رندر أقسام المشاريع المصنفة تلقائياً بناءً على مخرجات التحليل الإحصائي الحية */}
            <div className="flex flex-col gap-10">
                {STATUSES.map((status) => {
                    const statusProjects = analytics.groups[status.value] || [];
                    if (statusProjects.length === 0) return null;

                    return (
                        <section key={status.value} className="space-y-4">
                            {/* ترويسة القسم الإحصائي التفاعلي */}
                            <div className="flex items-center justify-between border-b border-gray-900 pb-2">
                                <div className="flex items-center gap-2">
                                    <span className={`h-2.5 w-2.5 rounded-full ${status.color} shadow-sm`} />
                                    <h2 className="text-lg font-bold text-white tracking-wide">
                                        {status.label}
                                    </h2>
                                </div>
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${status.text} ${status.bg} border ${status.border}`}>
                                    {statusProjects.length} {statusProjects.length === 1 ? 'Project' : 'Projects'}
                                </span>
                            </div>

                            {/* التبديل الهيكلي الذكي للرؤية: قائمة خطية أم كروت متجاوبة */}
                            {viewMode === "menu" ? (
                                <div className="flex flex-col gap-3">
                                    {statusProjects.map((project) => {
                                        const targetId = project._id || "";
                                        return (
                                            <div
                                                key={targetId}
                                                className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-gray-800/40 bg-[#0f0f18]/80 px-5 py-4 gap-4 transition-all duration-200 hover:border-purple-500/30 hover:bg-[#12121e]"
                                            >
                                                <div className="min-w-0 space-y-1">
                                                    <h3 className="font-semibold text-white text-base truncate hover:text-purple-400 transition">
                                                        <Link href={`/project/${targetId}`}>
                                                            {project.name}
                                                        </Link>
                                                    </h3>
                                                    <p className="text-sm text-gray-400 truncate max-w-2xl">
                                                        {project.description || "No project description metadata provided."}
                                                    </p>
                                                    <div className="flex items-center gap-3 pt-1">
                                                        <span className="text-[11px] font-medium text-gray-500 bg-[#161624] px-2 py-0.5 rounded border border-gray-800">
                                                            Priority: <span className="text-purple-400 font-bold capitalize">{project.priority}</span>
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 sm:ml-4 self-end sm:self-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => onEdit(targetId)}
                                                        className="rounded-lg border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/15 px-3.5 py-1.5 text-xs font-semibold text-blue-400 shadow-sm transition duration-150"
                                                    >
                                                        Modify
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => onDelete(targetId)}
                                                        className="rounded-lg border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/15 px-3.5 py-1.5 text-xs font-semibold text-rose-400 shadow-sm transition duration-150"
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
                                    {statusProjects.map((project) => (
                                        <ProjectCard
                                            key={project._id}
                                            project={project}
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
