
// app/project/[id]/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";

import { Project } from "@/types/project";
import LocalDate from "@/components/date/LocalDate";
import { getProject } from "@/lib/project/server";

interface ProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectPage({
  params,
}: ProjectPageProps) {
  const { id } = await params;

  let project: Project | null;

  try {
    project = await getProject({ project_id: id });
    console.log(project)
    if (!project) {
      notFound()
    }
  } catch (error) {
    console.error(error);
    notFound();
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black py-10">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[900px] w-[900px] rounded-full bg-violet-700/15 blur-[220px]" />
      </div>

      <div className="relative mx-auto max-w-4xl rounded-3xl border border-white/10 bg-zinc-950/90 p-10 shadow-[0_25px_80px_rgba(0,0,0,.8)] backdrop-blur-xl">
        <h1 className="mb-10 bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-5xl font-extrabold text-transparent">
          Project Details
        </h1>

        <div className="space-y-8">
          {/* Name */}
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-sm uppercase tracking-wider text-gray-400">
              Name
            </h2>

            <p className="mt-2 text-2xl font-semibold text-white">
              {project.name}
            </p>
          </div>

          {/* Description */}
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-sm uppercase tracking-wider text-gray-400">
              Description
            </h2>

            <p className="mt-2 leading-7 text-gray-300">
              {project.description || "No description"}
            </p>
          </div>

          {/* Status and Priority */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-zinc-900 p-5">
              <h2 className="mb-2 text-sm text-gray-400">
                Status
              </h2>

              <span className="inline-block rounded-full border border-blue-500/30 bg-blue-600/20 px-4 py-2 font-medium text-blue-300">
                {project.status}
              </span>
            </div>

            <div className="rounded-xl border border-white/10 bg-zinc-900 p-5">
              <h2 className="mb-2 text-sm text-gray-400">
                Priority
              </h2>

              <span className="inline-block rounded-full border border-violet-500/30 bg-violet-600/20 px-4 py-2 font-medium text-violet-300">
                {project.priority}
              </span>
            </div>
          </div>

          {/* Start and Due Dates */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-zinc-900 p-5">
              <h2 className="text-sm text-gray-400">
                Start Date
              </h2>

              <p className="mt-2 text-white">
                {project.start_date
                  ? <LocalDate date={project.start_date} />
                  : "Not set"}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-zinc-900 p-5">
              <h2 className="text-sm text-gray-400">
                Due Date
              </h2>

              <p className="mt-2 text-white">
                {project.due_date
                  ? <LocalDate date={project.due_date} />
                  : "Not set"}
              </p>
            </div>
          </div>

          {/* Created and Updated */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-zinc-900 p-5">
              <h2 className="text-sm text-gray-400">
                Created At
              </h2>

              <p className="mt-2 text-white">
                {project.created_at
                  ? <LocalDate date={project.created_at} />
                  : "Not available"}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-zinc-900 p-5">
              <h2 className="text-sm text-gray-400">
                Updated At
              </h2>

              <p className="mt-2 text-white">
                {project.updated_at
                  ? <LocalDate date={project.updated_at} />
                  : "Not available"}
              </p>
            </div>
          </div>
        </div>

        {/* Project Tasks */}
        <div className="mt-10 border border-white/10 pt-8">
          <h2 className="mb-3 text-xl font-bold text-white">
            Project Tasks
          </h2>


          <p className="mb-5 text-gray-400">
            View and manage the tasks associated with this project
          </p>

          <Link
            href={`/tasks?project_id=${encodeURIComponent(project._id)}`}
            className="inline-flex items-center gap-2 rounded-xl border
        border-cyan-500/30 bg-cyan-500/10 px-6 py-3 font-semibold text-cyan-300
        transition hover:border-cyan-400/60 hover:bg-cyan-500/20
        "
          >
            <span>View Project Tasks</span>
            <span aria-hidden="true"></span>
          </Link>
        </div>

        {/* Actions */}
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href={`/project/edit/${project._id}`}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 font-semibold text-white shadow-[0_0_25px_rgba(99,102,241,.5)] transition hover:scale-105"
          >
            Edit Project
          </Link>

          <Link
            href="/project"
            className="rounded-xl border border-white/10 bg-zinc-900 px-6 py-3 text-gray-200 transition hover:bg-zinc-800"
          >
            Back
          </Link>
        </div>
      </div>
    </main>
  );
}



