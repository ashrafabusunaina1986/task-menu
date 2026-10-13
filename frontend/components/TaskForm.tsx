// components/TaskForm.tsx
"use client"

import { CreateTask, Task, TaskPriority, TaskStatus } from "@/types/task"
import React, { useState } from "react"

interface TaskFormProps {
    initialData?: Task
    onSubmit: (data: CreateTask) => void
}

export default function TaskForm({
    initialData,
    onSubmit
}: TaskFormProps) {
    const [title, setTitle] = useState(
        initialData?.title ?? ""
    )
    const [description, setDescription] = useState(
        initialData?.description ?? ""
    )
    const [status, setStatus] = useState<TaskStatus>(
        initialData?.status ?? 'todo'
    )
    const [priority, setPriority] = useState<TaskPriority>(
        initialData?.priority ?? 'low'
    )

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        onSubmit(
            {
                title,
                description,
                status,
                priority
            }
        )
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
            {/* Title */}
            <div>
                <label className="block mb-2 text-sm font-semibold text-gray-300">
                    Title
                </label>

                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
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
                            setStatus(e.target.value as TaskStatus)
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
                        <option value="todo">Todo</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Done</option>
                    </select>
                </div>

                <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-300">
                        Priority
                    </label>

                    <select
                        value={priority}
                        onChange={(e) =>
                            setPriority(e.target.value as TaskPriority)
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
                    Save Task
                </button>

            </div>
        </form>
    )
}