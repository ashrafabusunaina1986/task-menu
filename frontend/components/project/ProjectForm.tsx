
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
    const [name, setName] = useState(initialData?.name ?? "");
    const [description, setDescription] = useState(initialData?.description ?? "");
    const [status, setStatus] = useState<ProjectStatus>(initialData?.status ?? "planned");
    const [priority, setPriority] = useState<ProjectPriority>(initialData?.priority ?? "medium");
    const [startDate, setStartDate] = useState(initialData?.start_date?.slice(0, 10) ?? "");
    const [dueDate, setDueDate] = useState(initialData?.due_date?.slice(0, 10) ?? "");

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

    // مصفوفة أيقونات وتنسيقات الحالات البصرية المحسنة للمستخدم
    const statusOptions = [
        { value: "planned", label: "Planned", activeClass: "border-blue-500/40 bg-blue-500/10 text-blue-400" },
        { value: "in_progress", label: "In Progress", activeClass: "border-amber-500/40 bg-amber-500/10 text-amber-400" },
        { value: "on_hold", label: "On Hold", activeClass: "border-purple-500/40 bg-purple-500/10 text-purple-400" },
        { value: "completed", label: "Completed", activeClass: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" },
        { value: "cancelled", label: "Cancelled", activeClass: "border-rose-500/40 bg-rose-500/10 text-rose-400" }
    ] as const;

    // مصفوفة أولويات العمل المحسنة بلمسة بصرية
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
                md:p-10
                max-w-4xl
                mx-auto
                transition-all
                duration-300
                hover:border-purple-500/15
            "
        >
            {/* Ambient Purple Backdrop Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-32 bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="border-b border-gray-800/60 pb-4">
                <h3 className="text-xl font-bold text-white tracking-wide">
                    {initialData ? "🔧 Modify Project Pipeline" : "🚀 Create Security Container"}
                </h3>
                <p className="text-xs text-gray-500 mt-1">Configure workspace parameters, access roles, and production timelines.</p>
            </div>

            {/* Project Name Entry */}
            <div className="space-y-2">
                <label className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <span>Project Name <span className="text-rose-500">*</span></span>
                    <span className="text-[10px] font-normal text-gray-600">{name.length} / 150</span>
                </label>
                <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-purple-500 transition duration-150">📁</span>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        maxLength={150}
                        placeholder="Enter an intuitive identifier name..."
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

            {/* Description Textarea Area */}
            <div className="space-y-2">
                <label className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <span>Detailed Metadata Description</span>
                    <span className="text-[10px] font-normal text-gray-600">{description.length} / 2000</span>
                </label>
                <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={2000}
                    placeholder="Provide contextual goals, repositories, infrastructure requirements..."
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
            {/* Dynamic Status Badges Selector instead of traditional select drop boxes */}
            <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Pipeline Flow Status</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
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

            {/* Dynamic Priority Segment Buttons Selector */}
            <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Risk Level Priority</label>
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

            {/* Production Timestamps Timeline Fields */}
            <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Start Timestamp</label>
                    <div className="relative">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="
                                w-full
                                rounded-xl
                                border border-gray-800/80
                                bg-[#141423]/60
                                px-4
                                py-3.5
                                text-sm
                                text-white
                                outline-none
                                transition
                                duration-150
                                focus:border-purple-500/50
                            "
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Due Expiration Date</label>
                    <div className="relative">
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            min={startDate || undefined}
                            className="
                                w-full
                                rounded-xl
                                border border-gray-800/80
                                bg-[#141423]/60
                                px-4
                                py-3.5
                                text-sm
                                text-white
                                outline-none
                                transition
                                duration-150
                                focus:border-purple-500/50
                            "
                        />
                    </div>
                </div>
            </div>

            {/* Submission Interactive Form Button Control */}
            <div className="pt-4 flex gap-4 justify-end border-t border-gray-800/40">
                <button
                    type="submit"
                    className="
                        w-full
                        sm:w-auto
                        px-8
                        py-3
                        rounded-xl
                        text-sm
                        font-bold
                        text-white
                        bg-purple-600
                        hover:bg-purple-700
                        active:bg-purple-800
                        shadow-lg
                        shadow-purple-600/20
                        transition
                        duration-150
                        cursor-pointer
                        text-center
                    "
                >
                    {initialData ? "Save Pipeline Modifications" : "Deploy Active Project"}
                </button>
            </div>
        </form>
    );
}
