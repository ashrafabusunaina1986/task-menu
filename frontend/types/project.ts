// types/project.ts

import { Role } from "./user"

export type ProjectStatus =
    | "planned"
    | "in_progress"
    | "on_hold"
    | "completed"
    | "cancelled"

    
export type ProjectPriority =
    | "low"
    | "medium"
    | "high"

export interface Project {
    _id: string
    name: string
    description: string | null
    owner_id: string | null
    owner_role: Role | null
    status: ProjectStatus
    priority: ProjectPriority
    start_date: string | null
    due_date: string | null
    created_at: string
    updated_at: string
}

export interface ProjectCreate {
    name: string
    description?: string | null
    owner_id?: string | null
    status?: ProjectStatus
    priority?: ProjectPriority
    start_date?: string | null
    due_date?: string | null
}

export interface ProjectRead {
    project_id?: string | null
    owner_id?: string | null
    status?: ProjectStatus | null
    priority?: ProjectPriority | null
}

export interface ProjectUpdate extends Partial<ProjectCreate> { }



