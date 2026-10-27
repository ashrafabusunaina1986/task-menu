// components/task/create/TaskCreate.tsx


"use client";

import TaskForm from "@/components/TaskForm";
import { createTask } from "@/lib/task/task";
import { CreateTask } from "@/types/task";
import { useRouter } from "next/navigation";


interface TaskCreateProps {
    projectId: string
}

export default function TaskCreate(
    { projectId }: TaskCreateProps
) {

    const router = useRouter();
    async function handleSubmit(data: CreateTask) {

        try {
            await createTask(data, projectId);
            router.push(`/tasks?project_id=${encodeURIComponent(projectId)}`);
        } catch (error) {
            console.error(error);
            alert("Failed to create task.");
        }
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
                    Create New Task
                </h1>

                {/* Form */}
                <TaskForm onSubmit={handleSubmit} />

            </div>

        </main>
    )
}
