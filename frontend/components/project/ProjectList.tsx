
// components/project/ProjectList.tsx

import { Project } from "@/types/project";
import ProjectCard from "./ProjectCard";
import Link from "next/link";

type ViewMode = "card" | "menu";

interface ProjectListProps {
    projects: Project[];
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    viewMode: ViewMode;
}

const statuses = [
    {
        value: "planned",
        label: "Planned",
    },
    {
        value: "in_progress",
        label: "In Progress",
    },
    {
        value: "on_hold",
        label: "On Hold",
    },
    {
        value: "completed",
        label: "Completed",
    },
    {
        value: "cancelled",
        label: "Cancelled",
    },
] as const;

export default function ProjectList({
    projects,
    onEdit,
    onDelete,
    viewMode
}: ProjectListProps) {

    if (!projects || projects.length === 0) {
        return (
            <div className="text-center text-gray-500 py-10">
                No projects found
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-10">

            {statuses.map((status) => {

                const statusProjects = projects.filter(
                    (project) => project.status === status.value
                );

                return statusProjects.length > 0 && (
                    <section key={status.value}>

                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">
                                {status.label}
                            </h2>

                            <span className="text-sm text-gray-500">
                                {statusProjects.length}
                            </span>
                        </div>

                        {viewMode === "menu" ? (

                            <div className="flex flex-col gap-3 p-2">

                                {statusProjects.map((project) => (
                                    <div
                                        key={project._id}
                                        className="
                                            flex items-center justify-between
                                            rounded-xl
                                            border border-white/10
                                            bg-zinc-900/70
                                            px-5 py-4
                                            transition
                                            hover:border-violet-500/40
                                            hover:bg-zinc-900
                                        "
                                    >
                                        <div className="min-w-0">
                                            <h3 className="font-semibold text-white truncate">
                                                <Link href={`/project/${project._id}`}>
                                                    {project.name}
                                                </Link>
                                            </h3>

                                            <p className="mt-1 text-sm text-gray-400 truncate">
                                                {project.description || "No description"}
                                            </p>

                                            <p className="mt-1 text-xs text-gray-500">
                                                Priority: {project.priority}
                                            </p>
                                        </div>

                                        <div className="ml-4 flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => onEdit(project._id)}
                                                className="
                                                    rounded-lg
                                                    border border-blue-500/20
                                                    bg-blue-500/10
                                                    px-3 py-2
                                                    text-sm text-blue-400
                                                    hover:bg-blue-500/20
                                                "
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => onDelete(project._id)}
                                                className="
                                                    rounded-lg
                                                    border border-red-500/20
                                                    bg-red-500/10
                                                    px-3 py-2
                                                    text-sm text-red-400
                                                    hover:bg-red-500/20
                                                "
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}

                            </div>

                        ) : (

                            <div
                                className="
                                    grid
                                    grid-cols-1
                                    sm:grid-cols-2
                                    lg:grid-cols-3
                                    xl:grid-cols-4
                                    gap-8
                                    p-2
                                "
                            >
                                {statusProjects.map((project) => (
                                    <ProjectCard
                                        key={project._id}
                                        project={project}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                    />
                                ))}
                            </div>

                        )}

                    </section>
                );
            })}

        </div>
    );
}
