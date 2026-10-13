"use client";

import { deleteTask, getTasks } from "@/lib/task/task";
import TaskList from "@/components/TaskList";
import { Task } from "@/types/task";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import UserHeader from "@/components/user/UserHeader";
import { Role } from "@/types/user";
import { TiDocument } from "react-icons/ti";
import { IoMenu } from "react-icons/io5";

type TasksClientProps = {
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
};

type ViewMode = "card" | "menu";

export default function TasksClient({ user }: TasksClientProps) {
    const router = useRouter();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [viewMode, setViewMode] = useState<ViewMode>("card");


    async function handleLogout() {
        const res = await fetch("/api/auth/logout", {
            method: "POST",
        });

        if (res.ok) {
            router.push("/login");
            router.refresh();
        }
    }

    async function loadTasks() {
        try {
            setLoading(true);

            const data = await getTasks();

            setTasks(data);
            setError(null);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load tasks"
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string) {
        const confirmDelete = window.confirm("Are you sure?");

        if (!confirmDelete) return;

        try {
            await deleteTask(id);

            setTasks((prev) =>
                prev.filter((task) => task._id !== id)
            );
        } catch (err) {
            console.error(err);
            alert("Delete failed");
        }
    }

    function handleEdit(id: string) {
        router.push(`/tasks/edit/${id}`);
    }

    useEffect(() => {
        loadTasks();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h2 className="text-lg font-semibold text-gray-600">
                    Loading...
                </h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h2 className="text-lg font-semibold text-red-600">
                    {error}
                </h2>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-black relative overflow-hidden py-10">

            {/* Background Glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[900px] h-[900px] rounded-full bg-violet-700/15 blur-[220px]" />
            </div>

            {/* User Header */}
            <UserHeader
                user={user}
                logout={handleLogout}
            />

            {/* Main Container */}
            <div className="relative w-[90%] max-w-6xl mx-auto rounded-[32px] border border-white/10 bg-zinc-950/90 backdrop-blur-xl shadow-[0_25px_80px_rgba(0,0,0,.8)] p-8">

                {/* Header */}
                <div className="flex items-center justify-between mb-10">

                    <div>
                        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
                            Task Menu
                        </h1>

                        <p className="mt-2 text-gray-400">
                            Manage your daily tasks easily.
                        </p>
                    </div>

                    <button
                        onClick={() => router.push("/tasks/create")}
                        className="
                            px-6 py-3
                            rounded-xl
                            font-semibold
                            text-white
                            bg-gradient-to-r
                            from-blue-600
                            to-violet-600
                            hover:scale-105
                            duration-300
                            shadow-[0_0_30px_rgba(99,102,241,.6)]
                        "
                    >
                        + Create Task
                    </button>

                </div>

                {/* Toolbar */}
                <div className="flex items-center justify-between mb-6">

                    <h2 className="text-white font-semibold text-lg">
                        Tasks
                    </h2>

                    {/* View Switcher */}
                    <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-black/40 p-1">

                        <button
                            type="button"
                            onClick={() => setViewMode("card")}
                            className={`
                                px-4 py-2
                                rounded-lg
                                text-sm
                                font-medium
                                transition
                                ${viewMode === "card"
                                    ? "bg-violet-600 text-white shadow-lg"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                                }
                            `}
                        >
                            <TiDocument className="text-xl" />
                        </button>

                        <button
                            type="button"
                            onClick={() => setViewMode("menu")}
                            className={`
                                px-4 py-2
                                rounded-lg
                                text-sm
                                font-medium
                                transition
                                ${viewMode === "menu"
                                    ? "bg-violet-600 text-white shadow-lg"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                                }
                            `}
                        >
                            <IoMenu className="text-xl" />
                        </button>

                    </div>

                </div>

                {/* Divider */}
                <div className="relative mb-8 flex justify-center">
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-violet-500 to-transparent" />

                    <div className="absolute -top-1 w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_18px_#8b5cf6]" />
                </div>

                {/* Tasks */}
                <TaskList
                    tasks={tasks}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    viewMode={viewMode}
                />

            </div>
        </main>
    );
}