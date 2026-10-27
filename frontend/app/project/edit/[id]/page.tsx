
// app/project/edit/[id]/page.tsx

"use client";

import ProjectForm from "@/components/project/ProjectForm";
import {
  getProject,
  updateProject,
} from "@/lib/project/project";
import type {
  Project,
  ProjectRead,
  ProjectUpdate,
} from "@/types/project";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ProjectEditPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProject() {
      try {
        const data: ProjectRead = {
          project_id: id,
        };

        const result = await getProject(data);
        setProject(result.data);
        console.log(result)
      } catch (error) {
        console.error(error);
        alert("Failed to load project.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadProject();
    }
  }, [id]);

  async function handleSubmit(data: ProjectUpdate) {
    if (!project) return;

    try {
      const projectId = project._id ?? (project as any)._id;

      if (!projectId) {
        throw new Error("Project ID is missing.");
      }

      await updateProject(projectId, data);
      router.push("/project");
    } catch (error) {
      console.error(error);
      alert("Failed to update project.");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-gray-300">
        Loading...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-red-400">
        Project not found
      </div>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black p-6">
      {/* Glow Background */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[900px] w-[900px] rounded-full bg-violet-700/20 blur-[200px]" />
        <div className="absolute h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[180px]" />
      </div>

      {/* Card */}
      <div className="relative w-full max-w-3xl rounded-[28px] border border-white/10 bg-zinc-950/80 p-10 shadow-[0_30px_90px_rgba(0,0,0,0.85)] backdrop-blur-2xl transition-transform duration-300 hover:scale-[1.01]">
        <h1 className="mb-8 bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-4xl font-extrabold text-transparent">
          Edit Project
        </h1>

        <ProjectForm
          initialData={project}
          onSubmit={handleSubmit}
        />
      </div>
    </main>
  );
}







