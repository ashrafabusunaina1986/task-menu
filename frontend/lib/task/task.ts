// lib/task/task.ts

import { CreateTask, Task } from "@/types/task";
import { clientFetch } from "../client_api";

// ===============================================
// GET ALL TASKS
// ===============================================

export function getTasks() {
    return clientFetch<Task[]>("/tasks");
}

// ===============================================
// GET TASK
// ===============================================

export function getTask(id: string) {
    return clientFetch<Task>(`/tasks/${id}`);
}

// ===============================================
// CREATE TASK
// ===============================================

export function createTask(data: CreateTask) {
    return clientFetch<{ message: string; id: string }>("/tasks", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

// ===============================================
// UPDATE TASK
// ===============================================

export function updateTask(
    id: string,
    data: Partial<CreateTask>
) {
    return clientFetch<{ message: string }>(`/tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

// ===============================================
// DELETE TASK
// ===============================================

export function deleteTask(id: string) {
    return clientFetch<{ message: string }>(`/tasks/${id}`, {
        method: "DELETE",
    });
}