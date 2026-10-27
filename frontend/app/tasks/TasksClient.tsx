
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
    project_id: string
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
    const [selectedStatus, setSelectedStatus] =
        useState<TaskStatusTab>("all");

    const loadTasks = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await getTasks(project_id);

            // Supports either Task[] or { success, data: Task[] }.
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
    }, []);

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
            setTasks((previous) => previous.filter((task) => task._id !== id));
        } catch (err) {
            console.error("Failed to delete task:", err);
            window.alert("Failed to delete the task. Please try again.");
        }
    }

    function handleEdit(id: string) {
        router.push(`/tasks/edit/${id}?project_id=${encodeURIComponent(project_id)}`);
    }

    const filteredTasks = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();

        return tasks.filter((task) => {
            const matchesStatus =
                selectedStatus === "all" || task.status === selectedStatus;

            const matchesSearch =
                !query ||
                (task.title ?? "").toLowerCase().includes(query) ||
                (task.description ?? "").toLowerCase().includes(query);

            return matchesStatus && matchesSearch;
        });
    }, [tasks, selectedStatus, searchTerm]);

    const counts = useMemo(
        () => ({
            all: tasks.length,
            todo: tasks.filter((task) => task.status === "todo").length,
            in_progress: tasks.filter(
                (task) => task.status === "in_progress"
            ).length,
            done: tasks.filter((task) => task.status === "done").length,
        }),
        [tasks]
    );

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-black">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-violet-500/20 border-t-violet-500" />
                    <p className="text-sm text-zinc-400">Loading tasks...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="relative min-h-screen overflow-hidden bg-black py-8 sm:py-10">
            {/* Background glow */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-blue-700/10 blur-[150px]" />
                <div className="absolute -right-20 top-40 h-[500px] w-[500px] rounded-full bg-violet-700/15 blur-[180px]" />
            </div>

            <UserHeader user={user} logout={handleLogout} />

            <div className="relative mx-auto mt-8 w-[92%] max-w-6xl rounded-3xl border border-white/10 bg-zinc-950/90 p-5 shadow-[0_25px_80px_rgba(0,0,0,.7)] backdrop-blur-xl sm:p-8">
                {/* Page heading */}
                <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-violet-400">
                            Workspace
                        </p>
                        <h1 className="bg-gradient-to-r from-blue-400 to-violet-500 bg-clip-text text-4xl font-extrabold text-transparent sm:text-5xl">
                            Task Menu
                        </h1>
                        <p className="mt-3 text-sm text-zinc-400 sm:text-base">
                            Organize your work and keep track of your progress.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => router.push(`/tasks/create?project_id=${encodeURIComponent(project_id)}`)}
                        className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 font-semibold text-white shadow-lg shadow-violet-950/40 transition hover:-translate-y-0.5 hover:shadow-violet-700/20"
                    >
                        + Create Task
                    </button>
                </div>

                {/* Error message */}
                {error && (
                    <div
                        role="alert"
                        className="mb-6 flex flex-col gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                        <p className="text-sm text-red-300">{error}</p>
                        <button
                            type="button"
                            onClick={() => void loadTasks()}
                            className="flex items-center gap-2 self-start text-sm font-semibold text-red-300 hover:text-white"
                        >
                            <FiRefreshCw />
                            Try again
                        </button>
                    </div>
                )}

                {/* Statistics */}
                <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {[
                        {
                            label: "All Tasks",
                            count: counts.all,
                            color: "text-blue-400",
                            glow: "bg-blue-500/10",
                        },
                        {
                            label: "To Do",
                            count: counts.todo,
                            color: "text-amber-400",
                            glow: "bg-amber-500/10",
                        },
                        {
                            label: "In Progress",
                            count: counts.in_progress,
                            color: "text-violet-400",
                            glow: "bg-violet-500/10",
                        },
                        {
                            label: "Completed",
                            count: counts.done,
                            color: "text-emerald-400",
                            glow: "bg-emerald-500/10",
                        },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 transition hover:border-white/15"
                        >
                            <div
                                className={`absolute -right-5 -top-5 h-20 w-20 rounded-full ${item.glow} blur-2xl`}
                            />
                            <p className="relative text-xs text-zinc-500 sm:text-sm">
                                {item.label}
                            </p>
                            <p
                                className={`relative mt-2 text-2xl font-bold ${item.color}`}
                            >
                                {item.count}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Tasks toolbar */}
                <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-white">
                            Your Tasks{" "}
                            <span className="ml-1 text-sm font-normal text-zinc-500">
                                ({filteredTasks.length})
                            </span>
                        </h2>
                        <p className="mt-1 text-xs text-zinc-500">
                            Search, filter, and manage your tasks.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 focus-within:border-violet-500/60 sm:w-64 sm:flex-none">
                            <FiSearch className="shrink-0 text-zinc-500" />
                            <input
                                type="search"
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                                placeholder="Search tasks..."
                                aria-label="Search tasks"
                                className="w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
                            />
                        </div>

                        {/* View switcher */}
                        <div
                            className="flex shrink-0 items-center gap-1 rounded-xl border border-white/10 bg-black/40 p-1"
                            aria-label="Task view mode"
                        >
                            <button
                                type="button"
                                aria-label="Card view"
                                aria-pressed={viewMode === "card"}
                                onClick={() => setViewMode("card")}
                                className={`rounded-lg p-2.5 transition ${viewMode === "card"
                                    ? "bg-violet-600 text-white shadow-lg"
                                    : "text-zinc-500 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                <TiDocument className="text-xl" />
                            </button>

                            <button
                                type="button"
                                aria-label="Menu view"
                                aria-pressed={viewMode === "menu"}
                                onClick={() => setViewMode("menu")}
                                className={`rounded-lg p-2.5 transition ${viewMode === "menu"
                                    ? "bg-violet-600 text-white shadow-lg"
                                    : "text-zinc-500 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                <IoMenu className="text-xl" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Status tabs */}
                <div
                    className="mb-7 flex gap-6 overflow-x-auto border-b border-white/10"
                    role="tablist"
                    aria-label="Filter tasks by status"
                >
                    {taskTabs.map((tab) => {
                        const active = selectedStatus === tab.value;

                        return (
                            <button
                                key={tab.value}
                                id={`task-tab-${tab.value}`}
                                type="button"
                                role="tab"
                                aria-selected={active}
                                onClick={() => setSelectedStatus(tab.value)}
                                className={`relative flex shrink-0 items-center gap-2 pb-4 text-sm font-medium transition ${active
                                    ? "text-violet-400"
                                    : "text-zinc-500 hover:text-white"
                                    }`}
                            >
                                {tab.label}
                                <span
                                    className={`rounded-full px-2 py-0.5 text-xs ${active
                                        ? "bg-violet-500/15 text-violet-300"
                                        : "bg-white/5 text-zinc-500"
                                        }`}
                                >
                                    {counts[tab.value]}
                                </span>
                                {active && (
                                    <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-violet-500" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Task content */}
                {error ? null : filteredTasks.length > 0 ? (
                    <div
                        role="tabpanel"
                        aria-labelledby={`task-tab-${selectedStatus}`}
                    >
                        <TaskList
                            project_id={project_id}
                            tasks={filteredTasks}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            viewMode={viewMode}
                        />
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-white/10 px-4 py-16 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-500/15 bg-violet-500/5">
                            <TiDocument className="text-4xl text-violet-400/70" />
                        </div>

                        <h3 className="text-lg font-semibold text-zinc-200">
                            {searchTerm.trim()
                                ? "No matching tasks"
                                : selectedStatus === "all"
                                    ? "No tasks yet"
                                    : "No tasks in this status"}
                        </h3>

                        <p className="mx-auto mt-2 max-w-sm text-sm text-zinc-500">
                            {searchTerm.trim()
                                ? "Try another search term."
                                : selectedStatus === "all"
                                    ? "Create your first task to get started."
                                    : "Tasks with this status will appear here."}
                        </p>

                        {!searchTerm.trim() && selectedStatus === "all" && (
                            <button
                                type="button"
                                onClick={() => router.push(`/tasks/create?project_id=${encodeURIComponent(project_id)}`)}
                                className="mt-5 rounded-xl border border-violet-500/30 bg-violet-500/10 px-5 py-2.5 text-sm font-semibold text-violet-300 transition hover:bg-violet-500/20"
                            >
                                Create your first task
                            </button>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}
