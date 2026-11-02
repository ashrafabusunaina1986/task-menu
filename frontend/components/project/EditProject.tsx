// frontend/components/project/EditProject.tsx
"use client";

import ProjectForm from "@/components/project/ProjectForm";
import { getProject, updateProject } from "@/lib/project/project";
import type { Project, ProjectRead, ProjectUpdate } from "@/types/project";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface EditProjectProps {
    id: string;
    currentUser: {
        id: string;
        role: string;
    };
}

export default function EditProject({ id, currentUser }: EditProjectProps) {
    const router = useRouter();

    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // Dynamic asynchronous hook loop to pull baseline project variables without hydration lags
    useEffect(() => {
        let isMounted = true;

        async function loadProject() {
            try {
                setLoading(true);
                setError(null);
                const data: ProjectRead = { project_id: id };
                const result = await getProject(data);

                if (isMounted) setProject(result.data);
            } catch (err) {
                console.error("Critical Client Exception: Project data sync crashed:", err);
                if (isMounted) setError("Synchronization failure: Unable to fetch target pipeline metadata container.");
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        if (id) {
            void loadProject();
        }
        return () => { isMounted = false; };
    }, [id]);

    // Handle transactional form update payloads directed into the backend API proxies
    async function handleSubmit(data: ProjectUpdate) {
        if (!project) return;
        
        setIsUpdating(true);
        setError(null);

        try {
            const projectId = project._id || (project as any)._id;

            if (!projectId) {
                throw new Error("Target structural node identification token is missing.");
            }

            // Broadcast mutations directly (including owner_id and owner_role variables)
            await updateProject(projectId, data);
            router.push("/project");
            router.refresh();
        } catch (err) {
            console.error("Critical Exception: Pipeline mutation rejected by host:", err);
            setError(err instanceof Error ? err.message : "Deployment failure: Internal status alternation rejected by host.");
            setIsUpdating(false);
        }
    }

    // Server-to-Client synchronization loading skeleton view layout
    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#08080d]">
                <div className="text-center space-y-3">
                    <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-purple-500/20 border-t-purple-500" />
                    <p className="text-xs text-zinc-500 font-medium tracking-wider uppercase">Decrypting container metadata rules...</p>
                </div>
            </main>
        );
    }

    // Isolated structural isolation boundary fallback view
    if (!project || (error && !project)) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#08080d] p-4">
                <div className="text-center max-w-sm p-6 rounded-2xl border border-dashed border-rose-900/40 bg-rose-950/5 space-y-3">
                    <span className="text-2xl">⚠️</span>
                    <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider block">Container Node Isolation</h3>
                    <p className="text-xs text-gray-500 leading-5">The requested cluster reference ID does not match any operational index inside this cloud workspace.</p>
                    <button onClick={() => router.push("/project")} className="mt-2 text-xs font-bold text-gray-400 hover:text-white transition cursor-pointer">Return to Pipelines</button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#08080d] relative overflow-hidden flex items-center justify-center p-4 md:p-8">
            {/* Ambient Cyberpunk Glow Background Overlays */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-0">
                <div className="w-[1000px] h-[1000px] rounded-full bg-purple-600/[0.04] blur-[220px]" />
                <div className="w-[600px] h-[600px] rounded-full bg-blue-500/[0.03] blur-[180px] absolute" />
            </div>

            {/* Premium Glassmorphic Center Card Housing Frame */}
            <div className="relative z-10 w-full max-w-3xl rounded-[32px] border border-white/5 bg-[#0d0d16]/80 p-6 md:p-12 shadow-[0_30px_90px_rgba(0,0,0,0.85)] backdrop-blur-2xl transition-all duration-300 hover:border-purple-500/15">
                
                {/* Back Track Cancel Navigation Trigger Control */}
                <button
                    onClick={() => router.push("/project")}
                    className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-purple-400 uppercase tracking-wider mb-6 transition cursor-pointer"
                >
                    <span>←</span> Cancel Alteration
                </button>

                {/* Typography Header Content Layout */}
                <div className="mb-8 border-b border-gray-900 pb-5">
                    <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
                        Modify Configuration
                    </h1>
                    <p className="text-xs text-gray-500 mt-1.5">Re-route runtime statuses, priority variables, or alter active lifecycle timestamps safely.</p>
                </div>

                {/* Inline Exception Feedback Warning Board */}
                {error && (
                    <div className="mb-6 bg-rose-950/40 border border-rose-800 text-rose-200 p-4 rounded-xl text-sm font-medium animate-pulse">
                        ⚠️ Failure Exception: {error}
                    </div>
                )}

                {/* Active Transaction State Loading Overlays Mask */}
                {isUpdating ? (
                    <div className="flex flex-col justify-center items-center py-20 space-y-3">
                        <div className="animate-spin rounded-full h-9 w-9 border-t-2 border-b-2 border-purple-500 shadow-[0_0_15px_rgba(139,92,246,0.15)]"></div>
                        <p className="text-xs text-gray-500 font-medium tracking-wide">Syncing state alterations and rebuilding pipeline matrices...</p>
                    </div>
                ) : (
                    /* The Re-engineered Form Core Layout */
                    <div className="animate-fadeIn">
                        <ProjectForm
                            initialData={project}
                            onSubmit={handleSubmit}
                            currentUser={{
                                id: currentUser.id,
                                role: currentUser.role
                            }}
                        />
                    </div>
                )}
            </div>
        </main>
    );
}
