// frontend/app/tasks/edit/[id]/TaskEditClient.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TaskForm from "@/components/TaskForm";
import { getTask, updateTask } from "@/lib/task/task";
import { Task, UpdateTask } from "@/types/task";

interface TaskEditClientProps {
    id: string;
    projectId: string;
    currentDate: {
        start: string | null;
        due: string | null;
    };
    projectOwner: {
        id: string;
        role: string;
    };
}

export default function TaskEditClient({ id, projectId, currentDate, projectOwner }: TaskEditClientProps) {
    const router = useRouter();
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // Dynamic asynchronous pipeline loop to pull atomic task variables on initialization
    useEffect(() => {
        let isMounted = true;

        async function loadTargetTaskInstance() {
            try {
                setLoading(true);
                setError(null);
                const data = await getTask(id, projectId);
                if (isMounted) setTask(data);
            } catch (err) {
                console.error("Failed to load task node:", err);
                if (isMounted) setError("Synchronization failure: Unable to fetch target task instance variables.");
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        if (id && projectId) {
            void loadTargetTaskInstance();
        }
        return () => { isMounted = false; };
    }, [id, projectId]);

    // Handle transactional update payloads directed into the secure client proxy pipelines
    async function handleSubmit(data: UpdateTask) {
        if (!task || !projectId) return;

        setIsUpdating(true);
        setError(null);

        try {
            const targetTaskId = task._id || (task as any)._id;
            if (!targetTaskId) {
                throw new Error("Target structural atomic verification token is missing.");
            }

            await updateTask(targetTaskId, data, projectId);
            router.push(`/tasks?project_id=${encodeURIComponent(projectId)}`);
            router.refresh();
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "Deployment failure: Internal status mutation rejected.");
            setIsUpdating(false);
        }
    }
    // Loading skeleton state wrapper layout
    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#08080d]">
                <div className="text-center space-y-3">
                    <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-purple-500/20 border-t-purple-500" />
                    <p className="text-xs text-zinc-500 font-medium tracking-wide uppercase">Decrypting atomic task parameters...</p>
                </div>
            </main>
        );
    }

    // Isolated fallback safety terminal view
    if (!task) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#08080d] p-4">
                <div className="text-center max-w-sm p-6 rounded-2xl border border-dashed border-rose-900/40 bg-rose-950/5 space-y-3">
                    <span className="text-2xl">⚠️</span>
                    <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider block">Task Node Isolation</h3>
                    <p className="text-xs text-gray-500 leading-5">The requested sub-task operational index does not match any compiled data registry inside your workspace pipeline.</p>
                    <button type="button" onClick={() => router.push("/project")} className="mt-2 text-xs font-bold text-gray-400 hover:text-white transition cursor-pointer">Return to Pipelines</button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#08080d] relative overflow-hidden flex items-center justify-center p-4 md:p-8 w-full">
            {/* Ambient Cyberpunk Glow Background Overlays */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <div className="w-[1000px] h-[1000px] rounded-full bg-purple-600/[0.04] blur-[220px]" />
                <div className="w-[600px] h-[600px] rounded-full bg-blue-500/[0.03] blur-[180px] absolute" />
            </div>

            {/* Premium Glassmorphic Card Housing Wrapper */}
            <div className="relative z-10 w-full max-w-3xl rounded-[32px] border border-white/5 bg-[#0d0d16]/80 p-6 md:p-12 shadow-[0_30px_90px_rgba(0,0,0,0.85)] backdrop-blur-2xl transition-all duration-300 hover:border-purple-500/15">
                
                {/* Back Track Cancel Navigation Trigger Control */}
                <button
                    type="button"
                    onClick={() => router.push(`/tasks?project_id=${encodeURIComponent(projectId)}`)}
                    className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-purple-400 uppercase tracking-wider mb-6 transition cursor-pointer"
                >
                    <span>←</span> Cancel Mutation
                </button>

                {/* Header Context Typography */}
                <div className="mb-8 border-b border-gray-900 pb-5">
                    <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
                        Modify Task Instance
                    </h1>
                    <p className="text-xs text-gray-500 mt-1.5">Alter localized execution parameters, operational priorities, and synchronize state maps directly back to the database hub.</p>
                </div>

                {/* Operational Exception Feedback Banner */}
                {error && (
                    <div className="mb-6 bg-rose-950/40 border border-rose-800 text-rose-200 p-4 rounded-xl text-sm font-medium animate-pulse">
                        ⚠️ Failure Exception: {error}
                    </div>
                )}

                {/* Submitting Status Overlays */}
                {isUpdating ? (
                    <div className="flex flex-col justify-center items-center py-20 space-y-3">
                        <div className="animate-spin rounded-full h-9 w-9 border-t-2 border-b-2 border-purple-500 shadow-[0_0_15px_rgba(139,92,246,0.15)]"></div>
                        <p className="text-xs text-gray-500 font-medium tracking-wide">Pushing encryption packets and updating pipeline registry...</p>
                    </div>
                ) : (
                    /* Injected: Re-aligned TaskForm feeding core security identifiers and parent dates */
                    <div className="animate-fadeIn">
                        <TaskForm
                            initialData={task}
                            onSubmit={handleSubmit}
                            currentDate={currentDate}
                            projectOwner={projectOwner}
                        />
                    </div>
                )}
            </div>
        </main>
    );
}
