// components/task/create/TaskCreate.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TaskForm from "@/components/TaskForm";
import { createTask } from "@/lib/task/task";
import { CreateTask } from "@/types/task";
import { Role } from "@/types/user";

interface TaskCreateProps {
    projectId: string;
    currentDate: {
        start?: string | null; // Fixed String capitalization anomaly to primitive string
        due?: string | null;
    };
    projectOwner: {
        id: string;
        role: Role;
    };
}

export default function TaskCreate({ projectId, currentDate, projectOwner }: TaskCreateProps) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Operational event execution handler targeting the core client Proxy pipelines
    async function handleSubmit(data: CreateTask) {
        setError(null);
        setSubmitting(true);

        try {
            // Dispatch the validated atomic data bundle directly into the secure task runtime gateway
            await createTask(data, projectId);
            router.push(`/tasks?project_id=${encodeURIComponent(projectId)}`);
            router.refresh();
        } catch (err) {
            console.error("Critical Client Exception: Task allocation workflow collapsed:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "Security execution failed: Unable to deploy new task container instance into the cluster registers."
            );
            setSubmitting(false);
        }
    }
    return (
        <main className="min-h-screen bg-[#08080d] relative overflow-hidden flex items-center justify-center p-4 md:p-8">

            {/* Ambient Radial Cyberpunk Glow Background Layer */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <div className="w-[1000px] h-[1000px] rounded-full bg-purple-600/[0.04] blur-[220px]" />
                <div className="w-[600px] h-[600px] rounded-full bg-blue-500/[0.03] blur-[180px] absolute" />
            </div>

            {/* Premium Glassmorphic Card Container Component Box */}
            <div className="relative z-10 w-full max-w-3xl rounded-[32px] border border-white/5 bg-[#0d0d16]/80 p-6 md:p-12 shadow-[0_30px_90px_rgba(0,0,0,0.85)] backdrop-blur-2xl transition-all duration-300 hover:border-purple-500/15">

                {/* Back Link Navigation Trigger Control */}
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-purple-400 uppercase tracking-wider mb-6 transition cursor-pointer"
                >
                    <span>←</span> Return to Pipeline
                </button>

                {/* Section Header Cluster Metadata Layout */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
                        Deploy Task Container
                    </h1>
                    <p className="text-xs text-gray-500 mt-1.5">
                        Inject a new atomic task unit linked to project pipeline reference ID:{" "}
                        <span className="text-purple-400 font-mono font-bold text-[11px] bg-[#141423] px-1.5 py-0.5 rounded border border-gray-800">
                            {projectId}
                        </span>
                    </p>
                </div>

                {/* Inline Production Gateway Error Panel Display */}
                {error && (
                    <div className="mb-6 bg-rose-950/40 border border-rose-800 text-rose-200 p-4 rounded-xl text-sm font-medium animate-pulse">
                        ⚠️ Failure Exception: {error}
                    </div>
                )}

                {/* Dynamic Content Loading Mask Gate Layout */}
                {submitting ? (
                    <div className="flex flex-col justify-center items-center py-20 space-y-3">
                        <div className="animate-spin rounded-full h-9 w-9 border-t-2 border-b-2 border-purple-500 shadow-[0_0_15px_rgba(139,92,246,0.15)]"></div>
                        <p className="text-xs text-gray-500 font-medium tracking-wide">Encrypting payload and pushing state alterations into central database nodes...</p>
                    </div>
                ) : (
                    /* The Actual Inner Form Execution Matrix Module Core */
                    <div className="animate-fadeIn">
                        {/* 
                           ✅ Enhanced Injected Core properties: Feeding projectOwner roles and currentDate parameters
                           straight down to TaskForm layout fields to guarantee robust boundary tracking live.
                        */}
                        <TaskForm
                            onSubmit={handleSubmit}
                            currentDate={{
                                start: currentDate.start,
                                due: currentDate.due
                            }}
                            projectOwner={projectOwner}
                        />
                    </div>
                )}
            </div>
        </main>
    );
}
