
// components/project/ProjectCard.tsx

"use client";

import { Project } from "@/types/project";
import { useRouter } from "next/navigation";

interface ProjectCardProps {
    project: Project;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export default function ProjectCard({
    project,
    onEdit,
    onDelete
}: ProjectCardProps) {
    const router = useRouter();

    return (
        <div
            className="
                relative
                overflow-hidden
                rounded-2xl
                border border-white/10
                bg-zinc-900/90
                backdrop-blur-md
                p-5
                shadow-[0_10px_35px_rgba(0,0,0,.5)]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-[0_0_30px_rgba(139,92,246,.35)]
            "
        >
            {/* Glow */}
            <div
                className="
                    absolute
                    top-0
                    right-0
                    w-24
                    h-24
                    bg-violet-500/10
                    blur-3xl
                    rounded-full
                    pointer-events-none
                "
            />

            <h2
                className="
                    text-xl
                    font-bold
                    text-white
                    mb-3
                    cursor-pointer
                "
                onClick={() => router.push(`/project/${project._id}`)}
            >
                {project.name}
            </h2>

            <p className="text-gray-400 min-h-[60px] break-all">
                {project.description || "No description"}
            </p>

            <div
                className="
                    mt-5
                    space-y-2
                    text-sm
                    border-t
                    border-white/10
                    pt-4
                "
            >
                <p className="text-gray-300">
                    <span className="font-semibold text-white">
                        Status:
                    </span>{" "}
                    {project.status}
                </p>

                <p className="text-gray-300">
                    <span className="font-semibold text-white">
                        Priority:
                    </span>{" "}
                    {project.priority}
                </p>
            </div>

            <div className="mt-6 flex gap-3">
                <button
                    type="button"
                    onClick={() => onEdit(project._id)}
                    className="
                        flex-1
                        py-2
                        rounded-xl
                        font-medium
                        text-white
                        bg-blue-600
                        hover:bg-blue-700
                        transition
                    "
                >
                    Edit
                </button>

                <button
                    type="button"
                    onClick={() => onDelete(project._id)}
                    className="
                        flex-1
                        py-2
                        rounded-xl
                        font-medium
                        text-white
                        bg-red-600
                        hover:bg-red-700
                        transition
                    "
                >
                    Delete
                </button>
            </div>
        </div>
    );
}
