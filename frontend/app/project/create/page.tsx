// app/project/create/page.tsx


"use client";

import { useRouter } from "next/navigation";
import ProjectForm from "@/components/project/ProjectForm";
import { createProject } from "@/lib/project/project";
import type { ProjectCreate } from "@/types/project";

export default function ProjectCreatePage() {
    const router = useRouter();

    async function handleSubmit(data: ProjectCreate) {
        try {
            await createProject(data);
            router.push("/project");
        } catch (error) {
            console.error(error);
            alert("Failed to create project.");
        }
    }

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black p-6">

            {/* Glow Background */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-[900px] w-[900px] rounded-full bg-violet-700/20 blur-[200px]" />
                <div className="absolute h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[180px]" />
            </div>

            {/* Card */}
            <div
                className="
                    relative w-full max-w-3xl
                    rounded-[28px]
                    border border-white/10
                    bg-zinc-950/80
                    p-10
                    shadow-[0_30px_90px_rgba(0,0,0,0.85)]
                    backdrop-blur-2xl
                    transition-transform duration-300
                    hover:scale-[1.01]
                "
            >
                {/* Title */}
                <h1
                    className="
                        mb-8 text-4xl font-extrabold
                        bg-gradient-to-r from-blue-500 to-violet-500
                        bg-clip-text text-transparent
                    "
                >
                    Create New Project
                </h1>

                {/* Form */}
                <ProjectForm onSubmit={handleSubmit} />
            </div>
        </main>
    );
}


