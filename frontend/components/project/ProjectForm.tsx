
// components/project/ProjectForm.tsx

"use client";

import {
    Project,
    ProjectPriority,
    ProjectStatus,
    ProjectCreate
} from "@/types/project";
import React, { useState } from "react";

interface ProjectFormProps {
    initialData?: Project;
    onSubmit: (data: ProjectCreate) => void;
}

export default function ProjectForm({
    initialData,
    onSubmit
}: ProjectFormProps) {
    const [name, setName] = useState(
        initialData?.name ?? ""
    );

    const [description, setDescription] = useState(
        initialData?.description ?? ""
    );

    const [status, setStatus] = useState<ProjectStatus>(
        initialData?.status ?? "planned"
    );

    const [priority, setPriority] = useState<ProjectPriority>(
        initialData?.priority ?? "medium"
    );

    const [startDate, setStartDate] = useState(
        initialData?.start_date?.slice(0, 10) ?? ""
    );

    const [dueDate, setDueDate] = useState(
        initialData?.due_date?.slice(0, 10) ?? ""
    );

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        onSubmit({
            name,
            description,
            status,
            priority,
            start_date: startDate || null,
            due_date: dueDate || null
        });
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="
                space-y-6
                rounded-3xl
                border border-white/10
                bg-zinc-950/90
                backdrop-blur-xl
                shadow-[0_20px_70px_rgba(0,0,0,.8)]
                p-8
            "
        >
            {/* Name */}
            <div>
                <label className="block mb-2 text-sm font-semibold text-gray-300">
                    Project Name
                </label>

                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    maxLength={150}
                    className="
                        w-full
                        rounded-xl
                        border border-white/10
                        bg-zinc-900
                        px-4
                        py-3
                        text-white
                        placeholder:text-gray-500
                        outline-none
                        transition
                        focus:border-violet-500
                        focus:ring-2
                        focus:ring-violet-500/30
                    "
                />
            </div>

            {/* Description */}
            <div>
                <label className="block mb-2 text-sm font-semibold text-gray-300">
                    Description
                </label>

                <textarea
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={2000}
                    className="
                        w-full
                        rounded-xl
                        border border-white/10
                        bg-zinc-900
                        px-4
                        py-3
                        text-white
                        placeholder:text-gray-500
                        outline-none
                        transition
                        focus:border-violet-500
                        focus:ring-2
                        focus:ring-violet-500/30
                    "
                />
            </div>

            {/* Status & Priority */}
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-300">
                        Status
                    </label>

                    <select
                        value={status}
                        onChange={(e) =>
                            setStatus(e.target.value as ProjectStatus)
                        }
                        className="
                            w-full
                            rounded-xl
                            border border-white/10
                            bg-zinc-900
                            px-4
                            py-3
                            text-white
                            outline-none
                            transition
                            focus:border-violet-500
                            focus:ring-2
                            focus:ring-violet-500/30
                        "
                    >
                        <option value="planned">Planned</option>
                        <option value="in_progress">In Progress</option>
                        <option value="on_hold">On Hold</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-300">
                        Priority
                    </label>

                    <select
                        value={priority}
                        onChange={(e) =>
                            setPriority(e.target.value as ProjectPriority)
                        }
                        className="
                            w-full
                            rounded-xl
                            border border-white/10
                            bg-zinc-900
                            px-4
                            py-3
                            text-white
                            outline-none
                            transition
                            focus:border-violet-500
                            focus:ring-2
                            focus:ring-violet-500/30
                        "
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
            </div>

            {/* Dates */}
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-300">
                        Start Date
                    </label>

                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="
                            w-full
                            rounded-xl
                            border border-white/10
                            bg-zinc-900
                            px-4
                            py-3
                            text-white
                            outline-none
                            transition
                            focus:border-violet-500
                            focus:ring-2
                            focus:ring-violet-500/30
                        "
                    />
                </div>

                <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-300">
                        Due Date
                    </label>

                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        min={startDate || undefined}
                        className="
                            w-full
                            rounded-xl
                            border border-white/10
                            bg-zinc-900
                            px-4
                            py-3
                            text-white
                            outline-none
                            transition
                            focus:border-violet-500
                            focus:ring-2
                            focus:ring-violet-500/30
                        "
                    />
                </div>
            </div>

            {/* Button */}
            <div className="pt-4">
                <button
                    type="submit"
                    className="
                        w-full
                        py-3
                        rounded-xl
                        font-semibold
                        text-white
                        bg-gradient-to-r
                        from-blue-600
                        to-violet-600
                        shadow-[0_0_25px_rgba(99,102,241,.5)]
                        hover:scale-[1.02]
                        hover:shadow-[0_0_40px_rgba(139,92,246,.8)]
                        transition-all
                        duration-300
                    "
                >
                    Save Project
                </button>
            </div>
        </form>
    );
}
