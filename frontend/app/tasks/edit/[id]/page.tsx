// app/tasks/edit/[id]/page.tsx

"use client";

import TaskForm from "@/components/TaskForm";
import { getTask, updateTask } from "@/lib/task/task";
import { Task, UpdateTask } from "@/types/task";
import { useRouter, useParams, notFound } from "next/navigation";
import React, { useEffect, useState } from "react";

interface TaskEditPageProps {
    searchParams: Promise<{
        project_id?: string
    }>
}

export default function EditTaskPage({ searchParams }: TaskEditPageProps) {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const id = params.id;
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadTask() {

            const { project_id } = await searchParams
            if (!project_id) notFound()
            try {
                const data = await getTask(id, project_id);
                setTask(data);
            } catch (error) {
                console.error(error);
                alert("Failed to load task.");
            } finally {
                setLoading(false);
            }
        }

        if (id) loadTask();
    }, [id]);

    async function handleSubmit(data: UpdateTask) {
        if (!task) return;

        try {
            const { project_id } = await searchParams
            if (!project_id) notFound()
            await updateTask(
                task._id ?? (task as any)._id,
                data,
                project_id
            );
            router.push("/tasks");
        } catch (error) {
            console.error(error);
            alert("Failed to update task.");
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-gray-300">
                Loading...
            </div>
        );
    }

    if (!task) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-red-400">
                Task not found
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center p-6">

            {/* Glow Background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[900px] h-[900px] rounded-full bg-violet-700/20 blur-[200px]" />
                <div className="w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[180px] absolute" />
            </div>

            {/* Card */}
            <div className="
                relative
                w-full max-w-3xl
                rounded-[28px]
                border border-white/10
                bg-zinc-950/80
                backdrop-blur-2xl
                shadow-[0_30px_90px_rgba(0,0,0,0.85)]
                p-10
                hover:scale-[1.01]
                transition-transform
                duration-300
            ">

                {/* Title */}
                <h1 className="
                    text-4xl font-extrabold mb-8
                    bg-gradient-to-r from-blue-500 to-violet-500
                    bg-clip-text text-transparent
                ">
                    Edit Task
                </h1>

                {/* Form */}
                <TaskForm
                    initialData={task}
                    onSubmit={handleSubmit}
                />

            </div>

        </main>
    );
}