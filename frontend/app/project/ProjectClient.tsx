"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
    deleteProject,
    getProjects,
    getProjectsByUser,
} from "@/lib/project/project";

import type {
    Project,
    ProjectStatus,
} from "@/types/project";

import ProjectList from "@/components/project/ProjectList";
import UserHeader from "@/components/user/UserHeader";
import { Role } from "@/types/user";

type ViewMode = "card" | "menu";
type StatusFilter = "all" | ProjectStatus;

interface ProjectClientProps {
    userId: string;
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        role?: Role | null
    };
}

type OwnerRoleFilter =
    | "all"
    | "admin"
    | "manager"
    | "user"
    | "no_owner"
    | "unknown";

const ownerRoleOptions: {
    label: string;
    value: OwnerRoleFilter;
}[] = [
        { label: "All Owners", value: "all" },
        { label: "Admin Projects", value: "admin" },
        { label: "Manager Projects", value: "manager" },
        { label: "User Projects", value: "user" },
        { label: "Without Owner", value: "no_owner" },
        { label: "Unknown Role", value: "unknown" },
    ];

type ProjectApiResponse = Project & {
    _id?: string;
    id?: string;
};

function getProjectId(project: Project): string {
    const item = project as ProjectApiResponse;
    return item.id || item._id || "";
}

const statusOptions: {
    label: string;
    value: StatusFilter;
}[] = [
        { label: "All Projects", value: "all" },
        { label: "Planned", value: "planned" },
        { label: "In Progress", value: "in_progress" },
        { label: "On Hold", value: "on_hold" },
        { label: "Completed", value: "completed" },
        { label: "Cancelled", value: "cancelled" },
    ];

export default function ProjectClient({
    userId,
    user,
}: ProjectClientProps) {
    const router = useRouter();

    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [viewMode, setViewMode] = useState<ViewMode>("card");
    const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("all");
    const [search, setSearch] = useState("");
    const [selectedOwnerRole, setSelectedOwnerRole] = useState<OwnerRoleFilter>("all");

    const isAdmin = user.role === 'admin';

    const loadProjects = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = user.role !== "admin"
                ? await getProjectsByUser(userId)
                : await getProjects();

            const normalizedProjects: Project[] = response.data.map(
                (item: ProjectApiResponse) => ({
                    ...item,
                    id: item.id || item._id || "",
                })
            );

            setProjects(normalizedProjects);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load projects.");
        } finally {
            setLoading(false);
        }
    }, [userId, user.role]);

    useEffect(() => {
        void loadProjects();
    }, [loadProjects]);

    const filteredProjects = useMemo(() => {
        const query = search.trim().toLowerCase();

        return projects.filter((project) => {
            const matchesStatus =
                selectedStatus === "all" ||
                project.status === selectedStatus;

            const matchesSearch =
                query === "" ||
                project.name.toLowerCase().includes(query) ||
                (project.description ?? "").toLowerCase().includes(query);

            let matchesOwnerRole = true;

            if (isAdmin) {
                switch (selectedOwnerRole) {
                    case "admin":
                    case "manager":
                    case "user":
                        matchesOwnerRole =
                            project.owner_id != null &&
                            project.owner_role === selectedOwnerRole;
                        break;

                    case "no_owner":
                        matchesOwnerRole = project.owner_id == null;
                        break;

                    case "unknown":
                        matchesOwnerRole =
                            project.owner_id != null &&
                            !project.owner_role;
                        break;
                }
            }

            return matchesStatus && matchesSearch && matchesOwnerRole;
        });
    }, [projects, selectedStatus, selectedOwnerRole, search, isAdmin]);

    const projectGroups = useMemo(() => {
        if (!isAdmin) return [];

        const groups: Record<string, Project[]> = {
            "Admin Projects": [],
            "Manager Projects": [],
            "User Projects": [],
            "Projects Without Owner": [],
            "Unknown Owner Role": []
        };

        filteredProjects.forEach((project) => {
            if (project.owner_id == null) {
                groups["Projects Without Owner"].push(project);
            } else if (!project.owner_role) {
                groups["Unknown Owner Role"].push(project);
            } else if (project.owner_role === "admin") {
                groups["Admin Projects"].push(project);
            } else if (project.owner_role === "manager") {
                groups["Manager Projects"].push(project);
            } else if (project.owner_role === "user") {
                groups["User Projects"].push(project);
            }
        });

        return Object.entries(groups).map(([title, projectsList]) => ({
            title,
            projects: projectsList,
        }));
    }, [isAdmin, filteredProjects]);

    function handleCreate() {
        router.push("/project/create");
    }

    function handleEdit(projectId: string) {
        if (!projectId) {
            setError("Project ID is missing.");
            return;
        }
        router.push(`/project/edit/${encodeURIComponent(projectId)}`);
    }

    async function handleDelete(projectId: string) {
        if (!projectId) {
            setError("Project ID is missing.");
            return;
        }

        const project = projects.find(
            (item) => getProjectId(item) === projectId
        );

        if (!project) {
            setError("Project not found.");
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to delete "${project.name}"?`
        );

        if (!confirmed) return;

        setError(null);

        try {
            const deleted = await deleteProject(projectId);

            if (!deleted) {
                throw new Error("Failed to delete project.");
            }

            setProjects((current) =>
                current.filter(
                    (item) => getProjectId(item) !== projectId
                )
            );
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to delete project."
            );
        }
    }
    return (
        <div className="min-h-screen bg-[#08080d] text-white">
            {/* Background Animations */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-violet-700/10 blur-[140px]" />
                <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-purple-600/10 blur-[130px]" />
            </div>

            <div className="relative z-10">
                <UserHeader user={user} />

                {/* هيكل التحكم والتصفية والفلترة التفاعلية للمشاريع */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-[#11111a] p-4 rounded-xl border border-gray-800/60 shadow-xl">
                        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                            <input
                                type="text"
                                placeholder="Search projects by name..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="bg-[#161622] border border-gray-700/70 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-purple-500 w-full sm:w-64 text-white placeholder-gray-500 transition"
                            />

                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value as StatusFilter)}
                                className="bg-[#161622] border border-gray-700/70 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500 text-gray-300 cursor-pointer"
                            >
                                {statusOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value} className="bg-[#11111a]">{opt.label}</option>
                                ))}
                            </select>

                            {isAdmin && (
                                <select
                                    value={selectedOwnerRole}
                                    onChange={(e) => setSelectedOwnerRole(e.target.value as OwnerRoleFilter)}
                                    className="bg-[#161622] border border-gray-700/70 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500 text-gray-300 cursor-pointer"
                                >
                                    {ownerRoleOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value} className="bg-[#11111a]">{opt.label}</option>
                                    ))}
                                </select>
                            )}
                        </div>

                        <div className="flex gap-4 w-full sm:w-auto justify-between sm:justify-end items-center">
                            <div className="bg-[#161622] p-1 rounded-lg flex border border-gray-700/60">
                                <button
                                    onClick={() => setViewMode("card")}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${viewMode === "card" ? "bg-purple-600 text-white shadow-md" : "text-gray-400 hover:text-white"}`}
                                >
                                    Cards
                                </button>
                                <button
                                    onClick={() => setViewMode("menu")}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${viewMode === "menu" ? "bg-purple-600 text-white shadow-md" : "text-gray-400 hover:text-white"}`}
                                >
                                    List
                                </button>
                            </div>

                            <button
                                onClick={handleCreate}
                                className="bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-purple-600/20 transition duration-150"
                            >
                                + Create Project
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-950/40 border border-red-800 text-red-200 p-4 rounded-xl text-sm font-medium animate-pulse">
                            {error}
                        </div>
                    )}

                    {/* رندر قوائم المشاريع بناءً على الصلاحيات والأدوار المخصصة */}
                    {loading ? (
                        <div className="flex justify-center items-center py-24">
                            <div className="animate-spin rounded-full h-9 w-9 border-t-2 border-b-2 border-purple-500"></div>
                        </div>
                    ) : !isAdmin ? (
                        <ProjectList
                            projects={filteredProjects}
                            viewMode={viewMode}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ) : (
                        <div className="space-y-8">
                            {projectGroups.map((group) => (
                                group.projects.length > 0 && (
                                    <div key={group.title} className="space-y-4">
                                        <h3 className="text-md font-bold text-gray-400 flex items-center gap-2 uppercase tracking-wider">
                                            <span className="h-2 w-2 rounded-full bg-purple-500 shadow-md shadow-purple-500/50"></span>
                                            {group.title} ({group.projects.length})
                                        </h3>
                                        <ProjectList
                                            projects={group.projects}
                                            viewMode={viewMode}
                                            onEdit={handleEdit}
                                            onDelete={handleDelete}
                                        />
                                    </div>
                                )
                            ))}
                            {filteredProjects.length === 0 && (
                                <div className="text-center py-20 text-gray-500 text-sm border border-dashed border-gray-800 rounded-2xl bg-[#0b0b12]">
                                    No infrastructure projects match your selected filter criteria.
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
