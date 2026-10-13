// app/tasks/[id]/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";

import { getTask } from "@/lib/server_api";
import { Task } from "@/types/task";
import LocalDate from "@/components/date/LocalDate";

interface TaskPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function TaskPage({
    params,
}: TaskPageProps) {

    const { id } = await params;

    let task: Task;

    try {
        task = await getTask(id);
    } catch (error) {
        console.error(error);
        notFound();
    }

    return (
        <main className="min-h-screen bg-black relative overflow-hidden py-10">

            {/* Background Glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[900px] h-[900px] rounded-full bg-violet-700/15 blur-[220px]" />
            </div>

            <div
                className="
                    relative
                    max-w-4xl
                    mx-auto
                    rounded-3xl
                    border border-white/10
                    bg-zinc-950/90
                    backdrop-blur-xl
                    shadow-[0_25px_80px_rgba(0,0,0,.8)]
                    p-10
                "
            >
                <h1
                    className="
                        text-5xl
                        font-extrabold
                        mb-10
                        bg-gradient-to-r
                        from-blue-500
                        to-violet-500
                        bg-clip-text
                        text-transparent
                    "
                >
                    Task Details
                </h1>

                <div className="space-y-8">

                    <div className="border-b border-white/10 pb-4">
                        <h2 className="text-sm uppercase tracking-wider text-gray-400">
                            Title
                        </h2>

                        <p className="mt-2 text-2xl font-semibold text-white">
                            {task.title}
                        </p>
                    </div>

                    <div className="border-b border-white/10 pb-4">
                        <h2 className="text-sm uppercase tracking-wider text-gray-400">
                            Description
                        </h2>

                        <p className="mt-2 text-gray-300 leading-7">
                            {task.description || "No description"}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">

                        <div className="rounded-xl bg-zinc-900 border border-white/10 p-5">
                            <h2 className="text-sm text-gray-400 mb-2">
                                Status
                            </h2>

                            <span className="inline-block rounded-full bg-blue-600/20 border border-blue-500/30 px-4 py-2 text-blue-300 font-medium">
                                {task.status}
                            </span>
                        </div>

                        <div className="rounded-xl bg-zinc-900 border border-white/10 p-5">
                            <h2 className="text-sm text-gray-400 mb-2">
                                Priority
                            </h2>

                            <span className="inline-block rounded-full bg-violet-600/20 border border-violet-500/30 px-4 py-2 text-violet-300 font-medium">
                                {task.priority}
                            </span>
                        </div>

                    </div>

                    <div className="grid md:grid-cols-2 gap-6">

                        <div className="rounded-xl bg-zinc-900 border border-white/10 p-5">
                            <h2 className="text-sm text-gray-400">
                                Created At
                            </h2>

                            <p className="mt-2 text-white">
                                {<LocalDate date={task.created_at} />}
                            </p>
                        </div>

                        <div className="rounded-xl bg-zinc-900 border border-white/10 p-5">
                            <h2 className="text-sm text-gray-400">
                                Updated At
                            </h2>

                            <p className="mt-2 text-white">
                                {<LocalDate date={task.updated_at} />}
                            </p>
                        </div>

                    </div>

                </div>

                <div className="mt-10 flex flex-wrap gap-4">

                    <Link
                        href={`/tasks/edit/${task._id}`}
                        className="
                            px-6
                            py-3
                            rounded-xl
                            font-semibold
                            text-white
                            bg-gradient-to-r
                            from-blue-600
                            to-violet-600
                            shadow-[0_0_25px_rgba(99,102,241,.5)]
                            hover:scale-105
                            transition
                        "
                    >
                        Edit Task
                    </Link>

                    <Link
                        href="/tasks"
                        className="
                            px-6
                            py-3
                            rounded-xl
                            border
                            border-white/10
                            bg-zinc-900
                            text-gray-200
                            hover:bg-zinc-800
                            transition
                        "
                    >
                        Back
                    </Link>

                </div>

            </div>

        </main>
    );
}