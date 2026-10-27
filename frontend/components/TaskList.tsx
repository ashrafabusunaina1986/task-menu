import { Task } from "@/types/task";
import TaskCard from "./TaskCard";
import Link from "next/link";

type ViewMode = "card" | "menu";

interface TaskListProps {
    project_id: string;
    tasks: Task[];
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    viewMode: ViewMode;
}

const statuses = [
    {
        value: "todo",
        label: "To Do",
    },
    {
        value: "in_progress",
        label: "In Progress",
    },
    {
        value: "done",
        label: "Done",
    },
] as const;

export default function TaskList({
    project_id,
    tasks,
    onEdit,
    onDelete,
    viewMode
}: TaskListProps) {

    if (!tasks || tasks.length === 0) {
        return (
            <div className="text-center text-gray-500 py-10">
                No tasks found
            </div>
        );
    }
    return (
        <div className="flex flex-col gap-10">

            {statuses.map((status) => {

                const statusTasks = tasks.filter(
                    (task) => task.status === status.value
                );

                return statusTasks.length > 0 && (
                    <section key={status.value}>

                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">
                                {status.label}
                            </h2>

                            <span className="text-sm text-gray-500">
                                {statusTasks.length}
                            </span>
                        </div>

                        {statusTasks.length === 0 ? (
                            <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-6 text-center text-gray-600">
                                No {status.label.toLowerCase()} tasks
                            </div>
                        ) : viewMode === "menu" ? (

                            <div className="flex flex-col gap-3 p-2">

                                {statusTasks.map((task) => (
                                    <div
                                        key={task._id}
                                        className="
                                            flex items-center justify-between
                                            rounded-xl
                                            border border-white/10
                                            bg-zinc-900/70
                                            px-5 py-4
                                            transition
                                            hover:border-violet-500/40
                                            hover:bg-zinc-900
                                        "
                                    >
                                        <div className="min-w-0">
                                            <h3 className="font-semibold text-white truncate">
                                                <Link href={`/tasks/${task._id}?project_id=${encodeURIComponent(project_id)}`}>
                                                    {task.title}
                                                </Link>
                                            </h3>

                                            <p className="mt-1 text-sm text-gray-400 truncate">
                                                {task.description || "No description"}
                                            </p>
                                        </div>

                                        <div className="ml-4 flex items-center gap-2">
                                            <button
                                                onClick={() => onEdit(task._id)}
                                                className="
                                                    rounded-lg
                                                    border border-blue-500/20
                                                    bg-blue-500/10
                                                    px-3 py-2
                                                    text-sm text-blue-400
                                                    hover:bg-blue-500/20
                                                "
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => onDelete(task._id)}
                                                className="
                                                    rounded-lg
                                                    border border-red-500/20
                                                    bg-red-500/10
                                                    px-3 py-2
                                                    text-sm text-red-400
                                                    hover:bg-red-500/20
                                                "
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}

                            </div>

                        ) : (

                            <div
                                className="
                                    grid
                                    grid-cols-1
                                    sm:grid-cols-2
                                    lg:grid-cols-3
                                    xl:grid-cols-4
                                    gap-8
                                    p-2
                                "
                            >
                                {statusTasks.map((task) => (
                                    <TaskCard
                                        project_id={project_id}
                                        key={task._id}
                                        task={task}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                    />
                                ))}
                            </div>

                        )}

                    </section>
                );
            })}

        </div>
    );
}