// app/project/ProjectClient.tsx
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
/**
 * The backend returns MongoDB documents containing _id.
 * The frontend uses id for project navigation and actions.
 */
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
    const [selectedStatus, setSelectedStatus] =
        useState<StatusFilter>("all");
    const [search, setSearch] = useState("");
    const [selectedOwnerRole, setSelectedOwnerRole] =
        useState<OwnerRoleFilter>("all");
    const isAdmin = user.role === 'admin'
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

            // تم الإصلاح: البحث سيعمل الآن للجميع (الآدمن والمستخدم العادي)
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
            if (project.owner_id === null) {
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

    // Navigate to the dedicated project creation page.
    function handleCreate() {
        router.push("/project/create");
    }

    // Navigate to the dedicated project editing page.
    function handleEdit(projectId: string) {
        if (!projectId) {
            setError("Project ID is missing.");
            return;
        }

        router.push(
            `/project/edit/${encodeURIComponent(projectId)}`
        );
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
            {/* Background */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-violet-700/10 blur-[140px]" />
                <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-purple-600/10 blur-[130px]" />
            </div>

            <div className="relative z-10">
                <UserHeader user={user} />

                <main className="mx-auto w-[90%] max-w-6xl py-10">
                    {/* Page heading and create action */}
                    <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                        <div>
                            <p className="mb-2 text-sm text-violet-300">
                                Workspace
                            </p>

                            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                Projects
                            </h1>

                            <p className="mt-2 text-sm text-gray-400">
                                Manage and organize your projects.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleCreate}
                            className="rounded-xl bg-violet-600 px-5 py-3 font-medium transition hover:bg-violet-500"
                        >
                            + Create Project
                        </button>
                    </div>

                    {/* Project statistics */}
                    <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                            <p className="text-sm text-gray-400">
                                Total Projects
                            </p>

                            <p className="mt-2 text-3xl font-semibold">
                                {projects.length}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                            <p className="text-sm text-gray-400">
                                In Progress
                            </p>

                            <p className="mt-2 text-3xl font-semibold text-violet-300">
                                {
                                    projects.filter(
                                        (project) =>
                                            project.status === "in_progress"
                                    ).length
                                }
                            </p>
                        </div>

                        <div className="col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:col-span-1">
                            <p className="text-sm text-gray-400">
                                Completed
                            </p>

                            <p className="mt-2 text-3xl font-semibold text-emerald-300">
                                {
                                    projects.filter(
                                        (project) =>
                                            project.status === "completed"
                                    ).length
                                }
                            </p>
                        </div>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div
                            role="alert"
                            className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
                        >
                            <span>{error}</span>

                            <button
                                type="button"
                                onClick={() => setError(null)}
                                className="shrink-0 text-white"
                            >
                                Dismiss
                            </button>
                        </div>
                    )}

                    {/* Search and view mode */}
                    <div className="mb-5 flex flex-col gap-4 md:flex-row">
                        <input
                            type="search"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search projects..."
                            aria-label="Search projects"
                            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition placeholder:text-gray-500 focus:border-violet-500"
                        />

                        <div className="flex rounded-xl border border-white/10 bg-white/[0.03] p-1">
                            <button
                                type="button"
                                onClick={() => setViewMode("card")}
                                aria-pressed={viewMode === "card"}
                                className={`rounded-lg px-4 py-2 text-sm transition ${viewMode === "card"
                                    ? "bg-violet-600 text-white"
                                    : "text-gray-400 hover:text-white"
                                    }`}
                            >
                                Cards
                            </button>

                            <button
                                type="button"
                                onClick={() => setViewMode("menu")}
                                aria-pressed={viewMode === "menu"}
                                className={`rounded-lg px-4 py-2 text-sm transition ${viewMode === "menu"
                                    ? "bg-violet-600 text-white"
                                    : "text-gray-400 hover:text-white"
                                    }`}
                            >
                                List
                            </button>
                        </div>
                    </div>

                    {/* Status filters */}
                    <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
                        {statusOptions.map((option) => {
                            const count =
                                option.value === "all"
                                    ? projects.length
                                    : projects.filter(
                                        (project) =>
                                            project.status === option.value
                                    ).length;

                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() =>
                                        setSelectedStatus(option.value)
                                    }
                                    aria-pressed={
                                        selectedStatus === option.value
                                    }
                                    className={`shrink-0 rounded-full border px-4 py-2 text-sm transition ${selectedStatus === option.value
                                        ? "border-violet-500 bg-violet-600/20 text-violet-200"
                                        : "border-white/10 text-gray-400 hover:border-white/20 hover:text-white"
                                        }`}
                                >
                                    {option.label} ({count})
                                </button>
                            );
                        })}
                    </div>

                    {/* Owner role filters — Admin only */}
                    {isAdmin && (
                        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
                            {ownerRoleOptions.map((option) => {
                                const count = projects.filter((project) => {
                                    switch (option.value) {
                                        case "all":
                                            return true;
                                        case "admin":
                                        case "manager":
                                        case "user":
                                            return (
                                                project.owner_id != null &&
                                                project.owner_role === option.value
                                            );
                                        case "no_owner":
                                            return project.owner_id == null;
                                        case "unknown":
                                            return (
                                                project.owner_id != null &&
                                                !project.owner_role
                                            );
                                    }
                                }).length;

                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() =>
                                            setSelectedOwnerRole(option.value)
                                        }
                                        aria-pressed={
                                            selectedOwnerRole === option.value
                                        }
                                        className={`shrink-0 rounded-full border px-4 py-2 text-sm transition ${selectedOwnerRole === option.value
                                            ? "border-violet-500 bg-violet-600/20 text-violet-200"
                                            : "border-white/10 text-gray-400 hover:border-white/20 hover:text-white"
                                            }`}
                                    >
                                        {option.label} ({count})
                                    </button>
                                );
                            })}
                        </div>
                    )}


                    {/* Project list */}
                    {loading ? (
                        <div className="rounded-2xl border border-white/10 bg-white/[0.02] py-20 text-center text-gray-400">
                            Loading projects...
                        </div>
                    ) : isAdmin ? (
                        projectGroups.map((group) => (
                            group.projects.length > 0 && (
                                <div key={group.title} className="mb-8">
                                    <h2 className="mb-4 text-xl font-semibold">
                                        {group.title}
                                        <span className="ml-2 text-sm text-gray-400">
                                            ({group.projects.length})
                                        </span>
                                    </h2>

                                    <ProjectList
                                        projects={group.projects}
                                        onEdit={handleEdit}
                                        onDelete={(id) => void handleDelete(id)}
                                        viewMode={viewMode}
                                    />
                                </div>
                            )
                        ))
                    ) : (
                        <ProjectList
                            projects={filteredProjects}
                            onEdit={handleEdit}
                            onDelete={(id) => void handleDelete(id)}
                            viewMode={viewMode}
                        />
                    )}


                    {!loading && filteredProjects.length > 0 && (
                        <p className="mt-5 text-sm text-gray-500">
                            Showing {filteredProjects.length} of{" "}
                            {projects.length} projects
                        </p>
                    )}
                </main>
            </div>
        </div>
    );
}
