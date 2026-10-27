// components/task/create/TaskCreate.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TaskForm from "@/components/TaskForm";
import { createTask } from "@/lib/task/task";
import { CreateTask } from "@/types/task";

interface TaskCreateProps {
    projectId: string;
}

export default function TaskCreate({ projectId }: TaskCreateProps) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(data: CreateTask) {
        setError(null);
        setSubmitting(true);

        try {
            await createTask(data, projectId);
            router.push(`/tasks?project_id=${encodeURIComponent(projectId)}`);
        } catch (err) {
            console.error(err);
            setError(
                err instanceof Error
                    ? err.message
                    : "Security execution failed: Unable to deploy new task container."
            );
            setSubmitting(false);
        }
    }
    return (
        <main className="min-h-screen bg-[#08080d] relative overflow-hidden flex items-center justify-center p-4 md:p-8">

            {/* Ambient Radial Cyberpunk Glow Background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[1000px] h-[1000px] rounded-full bg-purple-600/5 blur-[220px]" />
                <div className="w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-[180px] absolute" />
            </div>

            {/* Premium Glassmorphic Card Container */}
            <div className="
                relative
                w-full 
                max-w-3xl
                rounded-[32px]
                border border-white/5
                bg-[#0d0d16]/80
                backdrop-blur-2xl
                shadow-[0_30px_90px_rgba(0,0,0,0.85)]
                p-6
                md:p-12
                transition-all
                duration-300
                hover:border-purple-500/15
            ">
                {/* Back Link Indicator Button */}
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-purple-400 uppercase tracking-wider mb-6 transition cursor-pointer"
                >
                    <span>←</span> Return to Pipeline
                </button>

                {/* Section Header Title with Dynamic Linear Gradients */}
                <div className="mb-8">
                    <h1 className="
                        text-3xl 
                        md:text-4xl 
                        font-extrabold 
                        bg-gradient-to-r 
                        from-blue-400 
                        via-purple-400 
                        to-pink-400 
                        bg-clip-text 
                        text-transparent
                        tracking-tight
                    ">
                        Deploy Task Container
                    </h1>
                    <p className="text-xs text-gray-500 mt-1.5">Inject a new atomic task unit linked to project pipeline reference ID: <span className="text-purple-400 font-mono font-bold text-[11px] bg-[#141423] px-1.5 py-0.5 rounded border border-gray-800">{projectId}</span></p>
                </div>

                {/* Inline Production Error Alert Board */}
                {error && (
                    <div className="mb-6 bg-rose-950/40 border border-rose-800 text-rose-200 p-4 rounded-xl text-sm font-medium animate-pulse">
                        ⚠️ {error}
                    </div>
                )}

                {/* Dynamic Content Loading Mask Gate */}
                {submitting ? (
                    <div className="flex flex-col justify-center items-center py-20 space-y-3">
                        <div className="animate-spin rounded-full h-9 w-9 border-t-2 border-b-2 border-purple-500"></div>
                        <p className="text-xs text-gray-500 font-medium">Encrypting payload and pushing state alterations...</p>
                    </div>
                ) : (
                    /* The Actual Inner Form Execution Core */
                    <div className="animate-fadeIn">
                        <TaskForm onSubmit={handleSubmit} />
                    </div>
                )}
            </div>
        </main>
    );
}
