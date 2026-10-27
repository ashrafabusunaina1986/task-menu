"use client";

import { deleteTask, getTasks } from "@/lib/task/task";
import TaskList from "@/components/TaskList";
import { Task } from "@/types/task";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import UserHeader from "@/components/user/UserHeader";
import { TiDocument } from "react-icons/ti";
import { IoMenu } from "react-icons/io5";
import { FiSearch, FiRefreshCw } from "react-icons/fi";

type TasksClientProps = {
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
    project_id: string;
};

type ViewMode = "card" | "menu";
type TaskStatusTab = "all" | "todo" | "in_progress" | "done";

const taskTabs: { label: string; value: TaskStatusTab }[] = [
    { label: "All Tasks", value: "all" },
    { label: "To Do", value: "todo" },
    { label: "In Progress", value: "in_progress" },
    { label: "Completed", value: "done" },
];

export default function TasksClient({ user, project_id }: TasksClientProps) {
    const router = useRouter();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState<ViewMode>("card");
    const [selectedStatus, setSelectedStatus] = useState<TaskStatusTab>("all");

    // إصلاح 1: إضافة project_id كاعتمادية أساسية لمنع مشاكل الـ Stale Closures أثناء التنقل
    const loadTasks = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await getTasks(project_id);

            const result: unknown = response;
            const data = Array.isArray(result)
                ? result
                : result !== null &&
                    typeof result === "object" &&
                    "data" in result
                    ? result.data
                    : null;

            if (!Array.isArray(data)) {
                throw new Error("The server returned an invalid tasks response.");
            }

            setTasks(data as Task[]);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to load tasks."
            );
        } finally {
            setLoading(false);
        }
    }, [project_id]);

    useEffect(() => {
        void loadTasks();
    }, [loadTasks]);

    async function handleLogout() {
        const response = await fetch("/api/auth/logout", {
            method: "POST",
        });

        if (response.ok) {
            router.push("/login");
            router.refresh();
        }
    }
    async function handleDelete(id: string) {
        if (!window.confirm("Are you sure you want to delete this task?")) {
            return;
        }

        try {
            await deleteTask(id, project_id);
            setTasks((previous) => previous.filter((task) => (task._id) !== id));
        } catch (err) {
            console.error("Failed to delete task:", err);
            window.alert("Failed to delete the task. Please try again.");
        }
    }

    function handleEdit(id: string) {
        router.push(`/tasks/edit/${id}?project_id=${encodeURIComponent(project_id)}`);
    }

    // إصلاح 2: معالجة موحدة وشاملة للفرز التصفيفي لحماية الذاكرة وعزل النصوص الفارغة
    const filteredTasks = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();

        return tasks.filter((task) => {
            const matchesStatus =
                selectedStatus === "all" || task.status === selectedStatus;

            const matchesSearch =
                query === "" ||
                (task.title ?? "").toLowerCase().includes(query) ||
                (task.description ?? "").toLowerCase().includes(query);

            return matchesStatus && matchesSearch;
        });
    }, [tasks, selectedStatus, searchTerm]);

    // إصلاح O(N): حساب الحصائيات التراكمية حياً بمرور واحد فائق السرعة لمنع الـ Lag
    const counts = useMemo(() => {
        const summary = { all: 0, todo: 0, in_progress: 0, done: 0 };
        summary.all = tasks.length;

        tasks.forEach((task) => {
            if (task.status === "todo") summary.todo++;
            else if (task.status === "in_progress") summary.in_progress++;
            else if (task.status === "done") summary.done++;
        });

        return summary;
    }, [tasks]);

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#08080d]">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-2 border-purple-500/20 border-t-purple-500" />
                    <p className="text-xs text-zinc-500 font-medium tracking-wide">Decrypting active task payload...</p>
                </div>
            </main>
        );
    }
    return (
        <main className="relative min-h-screen overflow-hidden bg-[#08080d] py-6 sm:py-10">
            {/* Ambient Cyberpunk Background Glow */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-blue-700/5 blur-[150px]" />
                <div className="absolute -right-20 top-40 h-[500px] w-[500px] rounded-full bg-purple-700/10 blur-[180px]" />
            </div>

            <UserHeader user={user} logout={handleLogout} />

            <div className="relative mx-auto mt-6 w-[94%] max-w-7xl rounded-3xl border border-white/5 bg-[#0d0d16]/90 p-5 shadow-[0_30px_90px_rgba(0,0,0,.8)] backdrop-blur-xl sm:p-8 space-y-6">

                {/* Page Heading & Trigger Controls */}
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between border-b border-gray-900 pb-6">
                    <div>
                        <p className="mb-1 text-xs font-bold uppercase tracking-[0.25em] text-purple-400">
                            Operational Panel
                        </p>
                        <h1 className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-3xl sm:text-4xl font-extrabold text-transparent tracking-tight">
                            Task Pipelines
                        </h1>
                        <p className="mt-2 text-xs text-zinc-500 sm:text-sm max-w-xl">
                            Isolate workflows, monitor operational velocity, and maintain full control over atomic deployment units.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => router.push(`/tasks/create?project_id=${encodeURIComponent(project_id)}`)}
                        className="rounded-xl bg-purple-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-purple-600/20 transition hover:bg-purple-700 active:scale-[0.98]"
                    >
                        + Deploy Task
                    </button>
                </div>

                {/* Exception Error Handling Terminal Layout */}
                {error && (
                    <div
                        role="alert"
                        className="flex flex-col gap-3 rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 sm:flex-row sm:items-center sm:justify-between animate-pulse"
                    >
                        <p className="text-xs font-medium text-rose-300">⚠️ {error}</p>
                        <button
                            type="button"
                            onClick={() => void loadTasks()}
                            className="flex items-center gap-2 self-start text-xs font-bold text-rose-300 hover:text-white transition"
                        >
                            <FiRefreshCw className="animate-spin" />
                            Synchronize State
                        </button>
                    </div>
                )}

                {/* Analytical Filter & View Mode Topbar Dashboard */}
                <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-[#11111a]/80 p-4 rounded-2xl border border-gray-800/60 shadow-inner">
                    {/* Search & Tabs Segmented Group controls */}
                    <div className="flex flex-col sm:flex-row flex-wrap gap-4 w-full lg:w-auto items-start sm:items-center">
                        <div className="relative w-full sm:w-60 group">
                            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-purple-500 transition" />
                            <input
                                type="text"
                                placeholder="Filter query items..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-[#161622] border border-gray-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition"
                            />
                        </div>

                        {/* Slotted Tabs with Live Statistics Counters */}
                        <div className="flex bg-[#161622] p-1 rounded-xl border border-gray-800/60 flex-wrap gap-1">
                            {taskTabs.map((tab) => {
                                const currentCount = tab.value === "all" ? counts.all : counts[tab.value];
                                return (
                                    <button
                                        key={tab.value}
                                        type="button"
                                        onClick={() => setSelectedStatus(tab.value)}
                                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${selectedStatus === tab.value ? "bg-purple-600 text-white shadow-md" : "text-gray-500 hover:text-gray-300"}`}
                                    >
                                        <span>{tab.label}</span>
                                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedStatus === tab.value ? "bg-purple-700 text-purple-200" : "bg-[#1f1f33] text-gray-500"}`}>
                                            {currentCount}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* View Switcher Block */}
                    <div className="bg-[#161622] p-1 rounded-xl flex border border-gray-800/60 self-end lg:self-center">
                        <button
                            type="button"
                            onClick={() => setViewMode("card")}
                            className={`p-2 rounded-lg transition ${viewMode === "card" ? "bg-purple-600 text-white shadow-sm" : "text-gray-500 hover:text-white"}`}
                            title="Grid Mode"
                        >
                            <TiDocument className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode("menu")}
                            className={`p-2 rounded-lg transition ${viewMode === "menu" ? "bg-purple-600 text-white shadow-sm" : "text-gray-500 hover:text-white"}`}
                            title="Linear List Mode"
                        >
                            <IoMenu className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Render Unified Task List Layout Core */}
                <div className="pt-2">
                    <TaskList
                        project_id={project_id}
                        tasks={filteredTasks}
                        viewMode={viewMode}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>
            </div>
        </main>
    );
}
