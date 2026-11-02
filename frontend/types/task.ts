// types/task.ts

export type TaskStatus =
    | "todo"
    | "in_progress"
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

    start_date: string | null
    due_date: string | null

    created_at: string;
    updated_at: string;
}


export interface CreateTask {
    title: string;
    description?: string;

    status?: TaskStatus;
    priority?: TaskPriority;
    start_date?: string
    due_date?: string
}


export interface UpdateTask extends Partial<CreateTask> { }