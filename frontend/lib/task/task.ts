// lib/task/task.ts

import { CreateTask, Task } from "@/types/task";
import { clientFetch } from "../client_api";

// ===============================================
// GET ALL TASKS
// ===============================================

export function getTasks(project_id: string) {
    return clientFetch<Task[]>(
        `/tasks?project_id=${encodeURIComponent(project_id)}`
    );
}

// ===============================================
// GET TASK
// ===============================================

export function getTask(task_id: string, project_id: string) {
    return clientFetch<Task>(`/tasks/${task_id}?project_id=${encodeURIComponent(project_id)}`);
}

// ===============================================
// CREATE TASK
// ===============================================

export function createTask(data: CreateTask, project_id: string) {
    return clientFetch<{ message: string; id: string }>(`/tasks`, {
        method: "POST",
        body: JSON.stringify({ ...data, project_id }),
    });
}

// ===============================================
// UPDATE TASK
// ===============================================

export function updateTask(
    id: string,
    data: Partial<CreateTask>,
    project_id: string
) {
    return clientFetch<{ message: string }>(`/tasks/${id}?project_id=${encodeURIComponent(project_id)}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

// ===============================================
// DELETE TASK
// ===============================================

export function deleteTask(id: string, project_id: string) {
    return clientFetch<{ message: string }>(`/tasks/${id}?project_id=${encodeURIComponent(project_id)}`, {
        method: "DELETE",
    });
}