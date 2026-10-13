// types/task.ts

export type TaskStatus =
    | "todo"
    | "in-progress"
    | "done";


export type TaskPriority =
    | "low"
    | "medium"
    | "high";


export interface Task {
    _id: string;

    user_id: string;

    title: string;
    description: string | null;

    status: TaskStatus;
    priority: TaskPriority;

    created_at: string;
    updated_at: string;
}


export interface CreateTask {
    title: string;
    description?: string;

    status?: TaskStatus;
    priority?: TaskPriority;
}


export interface UpdateTask {
    title?: string;
    description?: string;

    status?: TaskStatus;
    priority?: TaskPriority;
}