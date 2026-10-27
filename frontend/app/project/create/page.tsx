// app/project/create/page.tsx


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProjectForm from "@/components/project/ProjectForm";
import { createProject } from "@/lib/project/project";
import type { ProjectCreate } from "@/types/project";

export default function ProjectCreatePage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isDeploying, setIsDeploying] = useState(false);

    async function handleSubmit(data: ProjectCreate) {
        setError(null);
        setIsDeploying(true);

        try {
            await createProject(data);
            router.push("/project");
        } catch (err) {
            console.error(err);
            setError(
                err instanceof Error 
                    ? err.message 
                    : "Security validation failure: Unable to dispatch project container instance to production server."
            );
            setIsDeploying(false);
        }
    }
    return (
        <main className="min-h-screen bg-[#08080d] relative overflow-hidden flex items-center justify-center p-4 md:p-8">
            
            {/* Ambient Radial Cyberpunk Glow Background Layer */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[1000px] h-[1000px] rounded-full bg-purple-600/5 blur-[220px]" />
                <div className="w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-[180px] absolute" />
            </div>

            {/* Premium Glassmorphic Center Card Container */}
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
                {/* Back Navigation Translucent Link Button */}
                <button 
                    onClick={() => router.push("/project")} 
                    className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-purple-400 uppercase tracking-wider mb-6 transition cursor-pointer"
                >
                    <span>←</span> Return to Pipelines
                </button>

                {/* Section Header Metadata Layout */}
                <div className="mb-8 border-b border-gray-900 pb-5">
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
                        Deploy New Project
                    </h1>
                    <p className="text-xs text-gray-500 mt-1.5">Configure and initialize a new tracked security pipeline infrastructure inside your workspace environment.</p>
                </div>

                {/* Exception Failure Inline Alert Board */}
                {error && (
                    <div className="mb-6 bg-rose-950/40 border border-rose-800 text-rose-200 p-4 rounded-xl text-sm font-medium animate-pulse">
                        ⚠️ {error}
                    </div>
                )}

                {/* Loading Gate Mask Overlay */}
                {isDeploying ? (
                    <div className="flex flex-col justify-center items-center py-20 space-y-3">
                        <div className="animate-spin rounded-full h-9 w-9 border-t-2 border-b-2 border-purple-500"></div>
                        <p className="text-xs text-gray-500 font-medium tracking-wide">Allocating repository nodes and initializing metadata variables...</p>
                    </div>
                ) : (
                    /* The Refactored Inner Project Form Integration */
                    <div className="animate-fadeIn">
                        <ProjectForm onSubmit={handleSubmit} />
                    </div>
                )}
            </div>
        </main>
    );
}

