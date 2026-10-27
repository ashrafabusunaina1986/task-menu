
// app/project/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";

import { Project } from "@/types/project";
import LocalDate from "@/components/date/LocalDate";
import { getProject } from "@/lib/project/server";

// تمديد واجهة الـ Project لتشمل الخصائص الإحصائية ودور المالك القادم من قاعدة البيانات
type ExtendedProject = Project & {
  owner_role?: string | null;
  tasks_stats?: {
    todo: number;
    in_progress: number;
    done: number;
  } | null;
};

interface ProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectPage({
  params,
}: ProjectPageProps) {
  const { id } = await params;

  let project: ExtendedProject | null = null;

  try {
    const response = await getProject({ project_id: id });
    project = response as ExtendedProject;

    if (!project) {
      notFound();
    }
  } catch (error) {
    console.error(error);
    notFound();
  }

  const targetProjectId = project._id || "";

  // حساب كفاءة إنجاز المهام التراكمية ديناميكيًا داخل السيرفر
  const totalTasks = project.tasks_stats
    ? (project.tasks_stats.todo + project.tasks_stats.in_progress + project.tasks_stats.done)
    : 0;

  const completionRate = totalTasks > 0 && project.tasks_stats
    ? Math.round((project.tasks_stats.done / totalTasks) * 100)
    : 0;

  // دالة تحديد سمات شارات الألوان للأدوار
  const getRoleBadgeStyles = (role: string | null | undefined) => {
    if (!role) return "bg-gray-850 text-gray-500 border-gray-800";
    switch (role.toLowerCase()) {
      case "admin": return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "manager": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "user": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default: return "bg-zinc-800 text-zinc-400 border-zinc-700";
    }
  };
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#08080d] py-10 px-4 sm:px-6">
      {/* Premium Ambient Background Glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[1000px] w-[1000px] rounded-full bg-purple-600/5 blur-[240px]" />
        <div className="absolute h-[600px] w-[600px] rounded-full bg-blue-500/5 blur-[180px]" />
      </div>

      <div className="relative mx-auto max-w-4xl rounded-[32px] border border-white/5 bg-[#0d0d16]/90 p-6 md:p-10 shadow-[0_30px_90px_rgba(0,0,0,.85)] backdrop-blur-xl space-y-8">

        {/* Navigation Breadcrumb Top Ribbon */}
        <div className="flex justify-between items-center border-b border-gray-900 pb-5">
          <Link
            href="/project"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-purple-400 uppercase tracking-wider transition"
          >
            <span>←</span> Pipelines Container
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Security clearance:</span>
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border uppercase ${getRoleBadgeStyles(project.owner_role)}`}>
              {project.owner_role || "No Owner"}
            </span>
          </div>
        </div>

        {/* Dynamic Analytics Overview Dashboard Section */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#11111a]/80 border border-gray-800/60 rounded-2xl p-4 shadow-xl">
          <div className="p-3 bg-[#161622]/60 border border-gray-800/40 rounded-xl">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Operational Status</span>
            <span className="text-sm font-bold text-white mt-1 capitalize block flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" />
              {project.status}
            </span>
          </div>
          <div className="p-3 bg-[#161622]/60 border border-gray-800/40 rounded-xl">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Risk Level</span>
            <span className="text-sm font-bold text-purple-400 mt-1 capitalize block">{project.priority}</span>
          </div>
          <div className="p-3 bg-[#161622]/60 border border-gray-800/40 rounded-xl col-span-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Pipeline Completion Velocity</span>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-lg font-extrabold text-emerald-400">{completionRate}%</span>
              <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${completionRate}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Structural Detailed Parameters */}
        <div className="space-y-6 pt-2">
          {/* Project Identity Name Block */}
          <div className="p-5 rounded-2xl bg-[#141423]/40 border border-gray-800/60 space-y-1">
            <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500">
              Container Node Identifier
            </h2>
            <p className="text-xl font-extrabold text-white tracking-tight pt-1">
              {project.name}
            </p>
          </div>

          {/* Contextual Meta Description Block */}
          <div className="p-5 rounded-2xl bg-[#141423]/40 border border-gray-800/60 space-y-1">
            <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500">
              Metadata Architectural Description
            </h2>
            <p className="text-sm leading-6 text-gray-300 pt-1 break-words whitespace-pre-line">
              {project.description || "No project description metadata provided in this operational node."}
            </p>
          </div>
          {/* Timeline Execution Timestamps */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-800/60 bg-[#141423]/40 p-4 flex items-center justify-between">
              <div>
                <h2 className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">Start Execution</h2>
                <p className="mt-1 text-xs font-semibold text-white">
                  {project.start_date ? <LocalDate date={project.start_date} /> : "Not Staged"}
                </p>
              </div>
              <span className="text-lg opacity-40">📅</span>
            </div>

            <div className="rounded-xl border border-gray-800/60 bg-[#141423]/40 p-4 flex items-center justify-between">
              <div>
                <h2 className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">Expiration Due Date</h2>
                <p className="mt-1 text-xs font-semibold text-purple-400">
                  {project.due_date ? <LocalDate date={project.due_date} /> : "Not Staged"}
                </p>
              </div>
              <span className="text-lg opacity-40">⏳</span>
            </div>
          </div>

          {/* Infrastructure Logging Metadata Timestamps */}
          <div className="grid gap-4 sm:grid-cols-2 border-t border-gray-900 pt-6">
            <div className="rounded-xl border border-gray-800/30 bg-[#141423]/10 p-4">
              <h2 className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Node Initialization</h2>
              <p className="mt-1 text-xs text-gray-400">
                {project.created_at ? <LocalDate date={project.created_at} /> : "Not available"}
              </p>
            </div>

            <div className="rounded-xl border border-gray-800/30 bg-[#141423]/10 p-4">
              <h2 className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Last Database Sync</h2>
              <p className="mt-1 text-xs text-gray-400">
                {project.updated_at ? <LocalDate date={project.updated_at} /> : "Not available"}
              </p>
            </div>
          </div>
        </div>

        {/* Associated Core Project Task Management Module */}
        <div className="mt-6 p-6 rounded-2xl border border-purple-500/10 bg-gradient-to-b from-[#121222]/60 to-[#0e0e18]/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white tracking-wide">
              Atomic Task Instances Pipeline
            </h2>
            <p className="text-xs text-gray-500 max-w-md">
              Review isolated sub-task velocities, clear backend logs, and coordinate execution instances assigned to this parent cluster.
            </p>
          </div>

          <Link
            href={`/tasks?project_id=${encodeURIComponent(targetProjectId)}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-5 py-2.5 text-xs font-bold text-cyan-400 transition hover:bg-cyan-500/15 active:scale-[0.98] self-start sm:self-center"
          >
            <span>View Tracked Tasks</span>
            <span className="text-[10px] bg-cyan-950 px-1.5 py-0.2 rounded text-cyan-300 font-mono font-bold">{totalTasks}</span>
          </Link>
        </div>

        {/* Global Administrative Actions Panel Control */}
        <div className="mt-8 pt-5 border-t border-gray-900 flex flex-col sm:flex-row sm:justify-between gap-4 items-center">
          <Link
            href="/project"
            className="w-full sm:w-auto text-center rounded-xl border border-gray-800 bg-[#141423]/40 px-6 py-2.5 text-xs font-bold text-gray-400 transition hover:bg-gray-800 hover:text-white"
          >
            Back to Container List
          </Link>

          <Link
            href={`/project/edit/${targetProjectId}`}
            className="w-full sm:w-auto text-center rounded-xl bg-purple-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-600/20 transition hover:bg-purple-700 active:scale-[0.98]"
          >
            Modify Project Parameters
          </Link>
        </div>
      </div>
    </main>
  );
}
