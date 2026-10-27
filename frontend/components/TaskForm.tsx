// components/TaskForm.tsx
// 
"use client";

import { CreateTask, Task, TaskPriority, TaskStatus } from "@/types/task";
import React, { useState } from "react";

interface TaskFormProps {
    initialData?: Task;
    onSubmit: (data: CreateTask) => void;
}

export default function TaskForm({
    initialData,
    onSubmit
}: TaskFormProps) {
    const [title, setTitle] = useState(initialData?.title ?? "");
    const [description, setDescription] = useState(initialData?.description ?? "");
    const [status, setStatus] = useState<TaskStatus>(initialData?.status ?? 'todo');
    const [priority, setPriority] = useState<TaskPriority>(initialData?.priority ?? 'low');

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        onSubmit({
            title,
            description,
            status,
            priority
        });
    }

    // خيارات الحالات بلمسة نيون تفاعلية متناسقة مع كروت الحالات لـ Workora
    const statusOptions = [
        { value: "todo", label: "Todo", activeClass: "border-blue-500/40 bg-blue-500/10 text-blue-400" },
        { value: "in_progress", label: "In Progress", activeClass: "border-amber-500/40 bg-amber-500/10 text-amber-400" },
        { value: "done", label: "Done", activeClass: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" }
    ] as const;

    // خيارات مستويات الخطورة والأولوية البصرية الملونة
    const priorityOptions = [
        { value: "low", label: "Low", activeClass: "border-gray-500/30 bg-gray-500/5 text-gray-400" },
        { value: "medium", label: "Medium", activeClass: "border-purple-500/40 bg-purple-500/10 text-purple-400" },
        { value: "high", label: "High", activeClass: "border-rose-500/40 bg-rose-500/10 text-rose-400" }
    ] as const;
    return (
        <form
            onSubmit={handleSubmit}
            className="
                relative
                overflow-hidden
                space-y-8
                rounded-3xl
                border border-white/5
                bg-[#0d0d16]/90
                backdrop-blur-xl
                shadow-[0_25px_80px_rgba(0,0,0,.8)]
                p-6
                md:p-8
                w-full
                transition-all
                duration-300
                hover:border-purple-500/15
            "
        >
            {/* Ambient Ambient Purple Backdrop Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-24 bg-purple-600/5 blur-[100px] rounded-full pointer-events-none" />

            {/* Task Title Input Grid Row */}
            <div className="space-y-2">
                <label className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <span>Task Title <span className="text-rose-500">*</span></span>
                    <span className="text-[10px] font-normal text-gray-600">{title.length} / 150</span>
                </label>
                <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-purple-500 transition duration-150">📝</span>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        maxLength={150}
                        placeholder="Define clear task action item..."
                        className="
                            w-full
                            rounded-xl
                            border border-gray-800/80
                            bg-[#141423]/60
                            pl-11
                            pr-4
                            py-3.5
                            text-sm
                            text-white
                            placeholder:text-gray-600
                            outline-none
                            transition
                            duration-150
                            focus:border-purple-500/50
                            focus:ring-4
                            focus:ring-purple-500/10
                        "
                    />
                </div>
            </div>

            {/* Task Description Text Block */}
            <div className="space-y-2">
                <label className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <span>Task Context & Description</span>
                    <span className="text-[10px] font-normal text-gray-600">{description.length} / 1000</span>
                </label>
                <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={1000}
                    placeholder="Break down execution details, prerequisites, or required criteria..."
                    className="
                        w-full
                        rounded-xl
                        border border-gray-800/80
                        bg-[#141423]/60
                        px-4
                        py-3.5
                        text-sm
                        text-white
                        placeholder:text-gray-600
                        outline-none
                        transition
                        duration-150
                        focus:border-purple-500/50
                        focus:ring-4
                        focus:ring-purple-500/10
                        resize-none
                    "
                />
            </div>
            {/* Custom Interactive Status Grid Badge Row */}
            <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Operational Status</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {statusOptions.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => setStatus(opt.value)}
                            className={`
                                py-2.5
                                px-3
                                text-xs
                                font-semibold
                                rounded-xl
                                border
                                transition-all
                                duration-150
                                text-center
                                cursor-pointer
                                ${status === opt.value 
                                    ? opt.activeClass 
                                    : "border-gray-800 bg-[#141423]/30 text-gray-400 hover:border-gray-700 hover:bg-[#141423]/60"
                                }
                            `}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Custom Interactive Priority Segment Selection Bar */}
            <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Severity Priority Rating</label>
                <div className="grid grid-cols-3 gap-3">
                    {priorityOptions.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => setPriority(opt.value)}
                            className={`
                                py-2.5
                                text-xs
                                font-bold
                                rounded-xl
                                border
                                uppercase
                                tracking-wider
                                transition-all
                                duration-150
                                text-center
                                cursor-pointer
                                ${priority === opt.value 
                                    ? opt.activeClass 
                                    : "border-gray-800 bg-[#141423]/30 text-gray-400 hover:border-gray-700 hover:bg-[#141423]/60"
                                }
                            `}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Form Actions Button Control Panel */}
            <div className="pt-4 border-t border-gray-800/40">
                <button
                    type="submit"
                    className="
                        w-full
                        py-3.5
                        rounded-xl
                        text-sm
                        font-bold
                        text-white
                        bg-gradient-to-r
                        from-purple-600
                        to-blue-600
                        shadow-lg
                        shadow-purple-600/20
                        hover:from-purple-500
                        hover:to-blue-500
                        active:scale-[0.99]
                        transition-all
                        duration-150
                        cursor-pointer
                        text-center
                    "
                >
                    {initialData ? "Save Task Modifications" : "Deploy Task Instance"}
                </button>
            </div>
        </form>
    );
}
