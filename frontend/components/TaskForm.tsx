// components/TaskForm.tsx
"use client";

import { CreateTask, Task, TaskPriority, TaskStatus } from "@/types/task";
import { UserForSelect } from "@/types/user";
import { getUsersForSelect } from "@/lib/user/user";
import { taskCreateSchema, taskUpdateSchema } from "@/schemas/task"; // Injected: Core security validation contracts
import React, { useState, useEffect } from "react";

interface TaskFormProps {
    initialData?: Task;
    onSubmit: (data: CreateTask & { start_date: string | null; due_date: string | null; user_id: string }) => void;
    currentDate: {
        start?: string | null;
        due?: string | null;
    };
    projectOwner: {
        id: string;
        role: string;
    };
}

export default function TaskForm({
    initialData,
    onSubmit,
    currentDate,
    projectOwner
}: TaskFormProps) {
    const [title, setTitle] = useState(initialData?.title ?? "");
    const [description, setDescription] = useState(initialData?.description ?? "");
    const [status, setStatus] = useState<TaskStatus>(initialData?.status ?? "todo");
    const [priority, setPriority] = useState<TaskPriority>(initialData?.priority ?? "low");

    const [startDate, setStartDate] = useState(initialData?.start_date?.slice(0, 10) ?? "");
    const [dueDate, setDueDate] = useState(initialData?.due_date?.slice(0, 10) ?? "");
    
    // Injected: State parameters to map field-specific validation alarms from Zod payload checks
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
    const [validationError, setValidationError] = useState<string | null>(null);

    const isPrivilegedRole = projectOwner.role?.toLowerCase() === "admin" || projectOwner.role?.toLowerCase() === "manager";

    const [assignedUserId, setAssignedUserId] = useState<string>(initialData?.user_id ?? (isPrivilegedRole ? "" : projectOwner.id));
    const [availableUsers, setAvailableUsers] = useState<UserForSelect[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(isPrivilegedRole);

    useEffect(() => {
        if (!isPrivilegedRole) return;

        async function fetchAvailableOperators() {
            try {
                setLoadingUsers(true);
                const response = await getUsersForSelect();
                const data = Array.isArray(response) ? response : (response as any)?.data || [];
                setAvailableUsers(data);
            } catch (error) {
                console.error("Failed to load active system users for assignment dropdown:", error);
            } finally {
                setLoadingUsers(false);
            }
        }
        void fetchAvailableOperators();
    }, [isPrivilegedRole]);

    useEffect(() => {
        if (!initialData?.user_id && !isPrivilegedRole) {
            setAssignedUserId(projectOwner.id);
        }
    }, [isPrivilegedRole, projectOwner.id, initialData]);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setValidationError(null);
        setFieldErrors({});

        // 🛡️ Cross-Timeline Validation Gate: Verify task bounds are strictly contained within parent project timelines
        if (startDate && dueDate) {
            const taskStart = new Date(startDate).getTime();
            const taskDue = new Date(dueDate).getTime();

            if (taskDue < taskStart) {
                setValidationError("Task delivery deadline (Due Date) cannot be chronologically earlier than its own start date.");
                return;
            }

            if (currentDate.start) {
                const projectStart = new Date(currentDate.start).getTime();
                if (taskStart < projectStart) {
                    setValidationError(`Task initialization date cannot be earlier than the global parent project start date (${currentDate.start}).`);
                    return;
                }
            }

            if (currentDate.due) {
                const projectDue = new Date(currentDate.due).getTime();
                if (taskDue > projectDue) {
                    setValidationError(`Task completion deadline cannot extend beyond the global project target delivery date (${currentDate.due}).`);
                    return;
                }
            }
        }

        const computedUserId = isPrivilegedRole ? (assignedUserId || projectOwner.id) : projectOwner.id;
        const payload = {
            title,
            description: description || null,
            status,
            priority,
            start_date: startDate || null,
            due_date: dueDate || null,
            user_id: computedUserId,
            project_id: "placeholder_verification_id" // Satisfy schema definition prior to submission wrapper logic
        };

        // ✅ FIXED: Select target Zod contract dynamically based on execution context properties
        const targetSchema = initialData ? taskUpdateSchema : taskCreateSchema;
        const resultSchema = targetSchema.safeParse(payload);

        if (!resultSchema.success) {
            const flattenedErrors = resultSchema.error.flatten();
            setFieldErrors(flattenedErrors.fieldErrors as any);
            if (flattenedErrors.formErrors.length > 0) {
                setValidationError(flattenedErrors.formErrors[0]);
            }
            return;
        }

        onSubmit({
            title,
            description: description || null,
            status,
            priority,
            start_date: startDate || null,
            due_date: dueDate || null,
            user_id: computedUserId
        } as any);
    }

    const statusOptions = [
        { value: "todo", label: "Todo", activeClass: "border-blue-500/40 bg-blue-500/10 text-blue-400" },
        { value: "in_progress", label: "In Progress", activeClass: "border-amber-500/40 bg-amber-500/10 text-amber-400" },
        { value: "done", label: "Done", activeClass: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" }
    ] as const;

    const priorityOptions = [
        { value: "low", label: "Low", activeClass: "border-gray-500/30 bg-gray-500/5 text-gray-400" },
        { value: "medium", label: "Medium", activeClass: "border-purple-500/40 bg-purple-500/10 text-purple-400" },
        { value: "high", label: "High", activeClass: "border-rose-500/40 bg-rose-500/10 text-rose-400" }
    ] as const;
    return (
        <form
            onSubmit={handleSubmit}
            className="relative overflow-hidden space-y-6 rounded-3xl border border-white/5 bg-[#0d0d16]/90 backdrop-blur-xl shadow-[0_25px_80px_rgba(0,0,0,.8)] p-6 md:p-8 w-full transition-all duration-300 hover:border-purple-500/15"
        >
            {/* Ambient Purple Backdrop Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-24 bg-purple-600/5 blur-[100px] rounded-full pointer-events-none" />

            {/* Inline Microsecond Time Validation Feedback Banner */}
            {(validationError || fieldErrors.due_date) && (
                <div className="bg-rose-950/40 border border-rose-800 text-rose-200 p-4 rounded-xl text-xs font-semibold animate-pulse tracking-wide">
                    ⚠️ Validation Guard: {validationError || fieldErrors.due_date?.[0]}
                </div>
            )}

            {/* Task Title Input */}
            <div className="space-y-1.5">
                <label className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <span>Task Title <span className="text-rose-500">*</span></span>
                    <span className="text-[10px] font-mono text-gray-600">{title.length} / 150</span>
                </label>
                <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-xs">📝</span>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Define clear task action item..."
                        className="w-full rounded-xl border border-gray-800/80 bg-[#141423]/60 pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-gray-600 outline-none transition focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10"
                    />
                </div>
                {fieldErrors.title && <p className="text-[11px] text-rose-400 font-medium mt-1">⚠️ {fieldErrors.title?.[0]}</p>}
            </div>

            {/* 👑 Privileged Assignee Selection Channel - Accessible for Admin/Managers only */}
            {isPrivilegedRole && (
                <div className="space-y-1.5 animate-fadeIn">
                    <label className="block text-xs font-bold text-purple-400 uppercase tracking-wider">
                        Assign Target Operator <span className="text-purple-500/50">[ Clearances Granted ]</span>
                    </label>
                    <div className="relative">
                        <select
                            value={assignedUserId}
                            onChange={(e) => setAssignedUserId(e.target.value)}
                            disabled={loadingUsers}
                            className="w-full rounded-xl border border-purple-500/10 bg-[#141423]/60 px-4 py-3.5 text-sm text-white outline-none transition focus:border-purple-500/50 cursor-pointer appearance-none skiptranslate"
                        >
                            <option value="">{loadingUsers ? "Synchronizing Active Clusters..." : "Select Active Executive Resource..."}</option>
                            {availableUsers.map((operator) => (
                                <option key={operator._id} value={operator._id} className="bg-[#0d0d16] text-white">
                                    {operator.name} ({operator.email})
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-purple-500 text-xs">▼</div>
                    </div>
                    {fieldErrors.user_id && <p className="text-[11px] text-rose-400 font-medium mt-1">⚠️ {fieldErrors.user_id?.[0]}</p>}
                </div>
            )}

            {/* Task Description Context Area */}
            <div className="space-y-1.5">
                <label className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <span>Task Context & Description</span>
                    <span className="text-[10px] font-mono text-gray-600">{description.length} / 1000</span>
                </label>
                <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Break down execution details, prerequisites, or required criteria..."
                    className="w-full rounded-xl border border-gray-800/80 bg-[#141423]/60 px-4 py-3.5 text-sm text-white placeholder:text-gray-600 outline-none transition focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 resize-none"
                />
                {fieldErrors.description && <p className="text-[11px] text-rose-400 font-medium mt-1">⚠️ {fieldErrors.description?.[0]}</p>}
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
                            className={`py-2.5 px-3 text-xs font-semibold rounded-xl border transition-all duration-150 text-center cursor-pointer ${status === opt.value ? opt.activeClass : "border-gray-800 bg-[#141423]/30 text-gray-400 hover:border-gray-700 hover:bg-[#141423]/60"}`}
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
                            className={`py-2.5 text-xs font-bold rounded-xl border uppercase tracking-wider transition-all duration-150 cursor-pointer ${priority === opt.value ? opt.activeClass : "border-gray-800 bg-[#141423]/30 text-gray-400 hover:border-gray-700 hover:bg-[#141423]/60"}`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Injected: Task Timeframe Scheduling Matrices Bound Loops */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Task Activation Start</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full rounded-xl border border-gray-800/80 bg-[#141423]/60 px-4 py-3.5 text-xs text-white outline-none transition focus:border-purple-500/50 uppercase font-mono cursor-pointer"
                    />
                    {fieldErrors.start_date && <p className="text-[11px] text-rose-400 font-medium mt-1">⚠️ {fieldErrors.start_date?.[0]}</p>}
                </div>
                <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Task Expiration Deadline</label>
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full rounded-xl border border-gray-800/80 bg-[#141423]/60 px-4 py-3.5 text-xs text-white outline-none transition focus:border-purple-500/50 uppercase font-mono cursor-pointer"
                    />
                </div>
            </div>

            {/* Form Submission Control Button */}
            <div className="pt-4 border-t border-gray-900/60 flex justify-end">
                <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-purple-600 hover:bg-purple-700 active:scale-[0.99] shadow-lg shadow-purple-600/20 transition duration-150 cursor-pointer text-center"
                >
                    {initialData ? "Apply Mutation Log" : "Commit New Task Unit"}
                </button>
            </div>
        </form>
    );
}
