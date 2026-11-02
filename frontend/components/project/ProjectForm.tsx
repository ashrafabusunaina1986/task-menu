
// components/project/ProjectForm.tsx
"use client";

import {
    Project,
    ProjectPriority,
    ProjectStatus,
    ProjectCreate
} from "@/types/project";
import { UserForSelect } from "@/types/user";
import { getUsersForSelect } from "@/lib/user/user";
import React, { useState, useEffect } from "react";

interface ProjectFormProps {
    initialData?: Project;
    currentUser: {
        id: string;
        role?: string | null;
    };
    onSubmit: (data: ProjectCreate & { owner_id: string | null, owner_role: string | null }) => void;
}

export default function ProjectForm({
    initialData,
    currentUser,
    onSubmit
}: ProjectFormProps) {
    const [name, setName] = useState(initialData?.name ?? "");
    const [description, setDescription] = useState(initialData?.description ?? "");
    const [status, setStatus] = useState<ProjectStatus>(initialData?.status ?? "planned");
    const [priority, setPriority] = useState<ProjectPriority>(initialData?.priority ?? "medium");
    const [startDate, setStartDate] = useState(initialData?.start_date?.slice(0, 10) ?? "");
    const [dueDate, setDueDate] = useState(initialData?.due_date?.slice(0, 10) ?? "");

    const [dateValidationError, setDateValidationError] = useState<string | null>(null);

    const isAdmin = currentUser.role?.toLowerCase() === "admin";

    const [ownerId, setOwnerId] = useState<string>("");
    const [ownerRole, setOwnerRole] = useState<string>("");
    const [owners, setOwners] = useState<UserForSelect[]>([]);
    const [loadingOwners, setLoadingOwners] = useState(false);

    // Synchronize initial data payloads or fallbacks on authentication hydration
    useEffect(() => {
        if (initialData?.owner_id) {
            setOwnerId(initialData.owner_id);
            setOwnerRole(initialData.owner_role ?? "user");
        } else {
            setOwnerId(isAdmin ? "" : currentUser.id);
            setOwnerRole(isAdmin ? "" : currentUser.role ?? "user");
        }
    }, [isAdmin, currentUser.id, currentUser.role, initialData]);

    // Fetch active registry operators from the client proxy channel
    useEffect(() => {
        if (!isAdmin) {
            setLoadingOwners(false);
            return;
        }

        async function fetchOwnersPayload() {
            try {
                setLoadingOwners(true);
                const response = await getUsersForSelect();
                const data = Array.isArray(response) ? response : (response as any)?.data || [];
                setOwners(data);
            } catch (error) {
                console.error("Failed to load secure infrastructure owners registry:", error);
            } finally {
                setLoadingOwners(false);
            }
        }
        void fetchOwnersPayload();
    }, [isAdmin]);

    // ✅ FIXED: Multi-state sync atomic handler to map both ID and Role instantly on click
    const handleOwnerChange = (selectedId: string) => {
        setOwnerId(selectedId);
        if (selectedId === "") {
            setOwnerRole("");
            return;
        }
        const selectedUser = owners.find(u => u._id === selectedId);
        setOwnerRole(selectedUser?.role || "user");
    };

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setDateValidationError(null);

        if (startDate && dueDate) {
            const startTimestamp = new Date(startDate).getTime();
            const dueTimestamp = new Date(dueDate).getTime();

            if (dueTimestamp < startTimestamp) {
                setDateValidationError("Target delivery deadline (Due Date) must be a timestamp strictly greater than or equal to the initialization start date.");
                return;
            }
        }

        onSubmit({
            name,
            description,
            status,
            priority,
            start_date: startDate || null,
            due_date: dueDate || null,
            owner_id: isAdmin ? (ownerId.trim() !== "" ? ownerId : null) : currentUser.id,
            owner_role: isAdmin ? (ownerRole.trim() !== "" ? ownerRole : null) : currentUser.role,
        } as any);
    }
    const statusOptions = [
        { value: "planned", label: "Planned", activeClass: "border-blue-500/40 bg-blue-500/10 text-blue-400" },
        { value: "in_progress", label: "In Progress", activeClass: "border-amber-500/40 bg-amber-500/10 text-amber-400" },
        { value: "on_hold", label: "On Hold", activeClass: "border-purple-500/40 bg-purple-500/10 text-purple-400" },
        { value: "completed", label: "Completed", activeClass: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" },
        { value: "cancelled", label: "Cancelled", activeClass: "border-rose-500/40 bg-rose-500/10 text-rose-400" }
    ] as const;

    const priorityOptions = [
        { value: "low", label: "Low", activeClass: "border-gray-500/30 bg-gray-500/5 text-gray-400" },
        { value: "medium", label: "Medium", activeClass: "border-purple-500/40 bg-purple-500/10 text-purple-400" },
        { value: "high", label: "High", activeClass: "border-rose-500/40 bg-rose-500/10 text-rose-400" }
    ] as const;

    return (
        <form
            onSubmit={handleSubmit}
            className="relative overflow-hidden space-y-6 rounded-3xl border border-white/5 bg-[#0d0d16]/90 backdrop-blur-xl shadow-[0_25px_80px_rgba(0,0,0,.8)] p-6 md:p-10 max-w-4xl mx-auto transition-all duration-300 hover:border-purple-500/15"
        >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-32 bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="border-b border-gray-800/60 pb-4">
                <h3 className="text-xl font-bold text-white tracking-tight">
                    {initialData ? "🔧 Modify Project Pipeline" : "🚀 Create Security Container"}
                </h3>
                <p className="text-xs text-gray-500 mt-1">Configure workspace parameters, access roles, and production timelines.</p>
            </div>

            {dateValidationError && (
                <div className="bg-rose-950/40 border border-rose-800/80 text-rose-200 p-4 rounded-xl text-xs font-semibold animate-pulse tracking-wide">
                    ⚠️ Validation Error: {dateValidationError}
                </div>
            )}

            {/* Project Name */}
            <div className="space-y-1.5">
                <label className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <span>Project Name <span className="text-rose-500">*</span></span>
                    <span className="text-[10px] font-mono text-gray-600">{name.length} / 150</span>
                </label>
                <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-xs">📁</span>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        maxLength={150}
                        placeholder="Enter an intuitive identifier name..."
                        className="w-full rounded-xl border border-gray-800/80 bg-[#141423]/60 pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-gray-600 outline-none transition focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10"
                    />
                </div>
            </div>

            {/* 👑 ADMIN DROPDOWN: Fixed structural bounds and attached dual-state sync maps */}
            {isAdmin && (
                <div className="space-y-1.5 animate-fadeIn">
                    <label className="block text-xs font-bold text-purple-400 uppercase tracking-wider">
                        Assign Project Owner <span className="text-gray-600 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                        <select
                            value={ownerId}
                            onChange={(e) => handleOwnerChange(e.target.value)}
                            disabled={loadingOwners}
                            className="w-full rounded-xl border border-purple-500/10 bg-[#141423]/60 px-4 py-3.5 text-sm text-white outline-none transition focus:border-purple-500/50 cursor-pointer appearance-none disabled:opacity-40"
                        >
                            <option value="">Leave Unassigned (No Owner Node)...</option>
                            {owners.map((owner) => (
                                <option key={owner._id} value={owner._id} className="bg-[#0d0d16] text-white">
                                    {owner.name} ({owner.email})
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-purple-500 text-xs">▼</div>
                    </div>
                </div>
            )}

            {/* Description Textarea */}
            <div className="space-y-1.5">
                <label className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <span>Detailed Metadata Description</span>
                    <span className="text-[10px] font-mono text-gray-600">{description.length} / 2000</span>
                </label>
                <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={2000}
                    placeholder="Provide contextual goals, repositories, infrastructure requirements..."
                    className="w-full rounded-xl border border-gray-800/80 bg-[#141423]/60 px-4 py-3.5 text-sm text-white placeholder:text-gray-600 outline-none transition focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 resize-none"
                />
            </div>

            {/* Flow Status Options */}
            <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Pipeline Flow Status</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
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

            {/* Risk Priority Matrix */}
            <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Risk Priority Matrix</label>
                <div className="grid grid-cols-3 gap-3">
                    {priorityOptions.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => setPriority(opt.value)}
                            className={`py-2.5 px-4 text-xs font-bold uppercase tracking-wider rounded-xl border transition-all duration-150 text-center cursor-pointer ${priority === opt.value ? opt.activeClass : "border-gray-800 bg-[#141423]/30 text-gray-400 hover:border-gray-700 hover:bg-[#141423]/60"}`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Initialization Date</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full rounded-xl border border-gray-800/80 bg-[#141423]/60 px-4 py-3.5 text-xs text-white outline-none transition focus:border-purple-500/50 uppercase font-mono cursor-pointer"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Target Delivery Deadline</label>
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full rounded-xl border border-gray-800/80 bg-[#141423]/60 px-4 py-3.5 text-xs text-white outline-none transition focus:border-purple-500/50 uppercase font-mono cursor-pointer"
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-gray-900/60 flex justify-end">
                <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-purple-600 hover:bg-purple-700 active:scale-[0.99] shadow-lg shadow-purple-600/20 transition duration-150 cursor-pointer text-center"
                >
                    {initialData ? "Save Parameter Mutations" : "Dispatch Security Pipeline"}
                </button>
            </div>
        </form>
    );
}
