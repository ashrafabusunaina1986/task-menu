// lib/project/project.ts

import { Project, ProjectCreate, ProjectRead, ProjectUpdate } from "@/types/project";
import { clientFetch } from "../client_api";

// ============================================
// GET ALL PROJECTS
// ============================================

export function getProjects(): Promise<{ success: boolean; data: Project[] }> {
    return clientFetch<{
        success: boolean,
        data: Project[]
    }>(
        `/project/get-projects`
    )
}

// ============================================
// GET PROJECTS BY USER
// ============================================

export function getProjectsByUser(userId: string): Promise<{ success: boolean; data: Project[] }> {
    return clientFetch<{
        success: boolean,
        data: Project[]
    }>(
        `/project/get-project-by-user?user_id=${encodeURIComponent(userId)}`
    )
}

// ===========================================
// GET PROJECT
// ===========================================

export function getProject(data: ProjectRead): Promise<{ success: boolean; data: Project | null }> {
    return clientFetch<{ success: boolean; data: Project | null }>(
        `/project/get-project`,
        {
            method: "POST",
            body: JSON.stringify(data)
        }
    )
}

// ==========================================
// CREATE PROJECT
// ==========================================

export function createProject(data: ProjectCreate): Promise<Project> {
    return clientFetch<Project>(`/project/create`, {
        method: "POST",
        body: JSON.stringify(data)
    })
}

// ========================================
// UPDATE PROJECT
// ========================================

export function updateProject(
    projectId: string,
    data: ProjectUpdate
): Promise<boolean> {
    return clientFetch<boolean>(
        `/project/update?project_id=${encodeURIComponent(projectId)}`,
        {
            method: "PUT",
            body: JSON.stringify(data)
        }
    )
}

// ======================================
// DELETE PROJECT
// ======================================

export function deleteProject(project_id: string): Promise<boolean> {
    return clientFetch<boolean>(
        `/project/delete?project_id=${encodeURIComponent(project_id)}`,
        {
            method: "DELETE"
        }
    )
}