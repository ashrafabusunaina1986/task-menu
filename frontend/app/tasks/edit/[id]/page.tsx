// app/tasks/edit/[id]/page.tsx
"use client";

import { useEffect, useState, use } from "react"; // تم استيراد use لفك الـ Promise آلياً في بيئة العميل
import { useRouter, useParams } from "next/navigation";
import TaskForm from "@/components/TaskForm";
import { getTask, updateTask } from "@/lib/task/task";
import { Task, UpdateTask } from "@/types/task";

interface TaskEditPageProps {
    searchParams: Promise<{
        project_id?: string;
    }>;
}

export default function EditTaskPage({ searchParams }: TaskEditPageProps) {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const id = params.id;

    // إصلاح الأمان المعماري: فك الـ searchParams الممررة بشكل مستقر وصارم لمنع أخطاء الـ Async في الـ Hooks
    const resolvedSearchParams = use(searchParams);
    const project_id = resolvedSearchParams.project_id;

    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        async function loadTask() {
            if (!project_id) {
                setError("Security checkpoint failure: Missing required parent cluster project tracking ID.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const data = await getTask(id, project_id);
                setTask(data);
            } catch (err) {
                console.error(err);
                setError("Synchronization failure: Unable to fetch target task instance variables.");
            } finally {
                setLoading(false);
            }
        }

        if (id) void loadTask();
    }, [id, project_id]);

    async function handleSubmit(data: UpdateTask) {
        if (!task || !project_id) return;

        setIsUpdating(true);
        setError(null);

        try {
            // جلب مؤمن للمعرف الموحد المتوافق مع بنية MongoDB وسيرفر الإنتاج
            const targetTaskId = task._id || (task as any)._id;

            if (!targetTaskId) {
                throw new Error("Target structural atomic token is missing.");
            }

            await updateTask(targetTaskId, data, project_id);
            router.push(`/tasks?project_id=${encodeURIComponent(project_id)}`);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "Deployment failure: Internal lifecycle mutation rejected by database host.");
            setIsUpdating(false);
        }
    }
    // واجهة تتبع التحميل وفك التشفير للبيانات
    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#08080d]">
                <div className="text-center space-y-3">
                    <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-purple-500/20 border-t-purple-500" />
                    <p className="text-xs text-zinc-500 font-medium tracking-wide">Decrypting atomic task parameters...</p>
                </div>
            </main>
        );
    }

    // واجهة الحماية والحجر في حال غياب الـ Node المطلوب بالـ Database
    if (!task || !project_id) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#08080d] p-4">
                <div className="text-center max-w-sm p-6 rounded-2xl border border-dashed border-rose-900/40 bg-rose-950/5 space-y-3">
                    <span className="text-2xl">⚠️</span>
                    <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider block">Task Node Isolation</h3>
                    <p className="text-xs text-gray-500 leading-5">The requested sub-task operational index does not match any compiled data registry inside your workspace pipeline.</p>
                    <button onClick={() => router.push("/project")} className="mt-2 text-xs font-bold text-gray-400 hover:text-white transition">Return to Pipelines</button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#08080d] relative overflow-hidden flex items-center justify-center p-4 md:p-8">

            {/* Cyberpunk Glow Background Layer Panels */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[1000px] h-[1000px] rounded-full bg-purple-600/5 blur-[220px]" />
                <div className="w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-[180px] absolute" />
            </div>

            {/* Premium Glassmorphic Card Container */}
            <div className="
                relative
                w-full 
                max-w-3xl
                rounded-[32px]
                border border-white/5
                bg-[#0d0d16]/80
                backdrop-blur-2xl
                shadow-[0_30px_90px_rgba(0,0,0,0.85)]
                p-6
                md:p-12
                transition-all
                duration-300
                hover:border-purple-500/15
            ">
                {/* Cancel Mutation Link Translucent Button control */}
                <button
                    type="button"
                    onClick={() => router.push(`/tasks?project_id=${encodeURIComponent(project_id)}`)}
                    className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-purple-400 uppercase tracking-wider mb-6 transition cursor-pointer"
                >
                    <span>←</span> Cancel Mutation
                </button>

                {/* Section Header Metadata Layout Area */}
                <div className="mb-8 border-b border-gray-900 pb-5">
                    <h1 className="
                        text-3xl 
                        md:text-4xl 
                        font-extrabold 
                        bg-gradient-to-r 
                        from-blue-400 
                        via-purple-400 
                        to-pink-400 
                        bg-clip-text 
                        text-transparent
                        tracking-tight
                    ">
                        Modify Task Instance
                    </h1>
                    <p className="text-xs text-gray-500 mt-1.5">Alter localized execution parameters, operational priorities, and synchronize state maps to database hub.</p>
                </div>

                {/* Production Inline Exception Alert Panel */}
                {error && (
                    <div className="mb-6 bg-rose-950/40 border border-rose-800 text-rose-200 p-4 rounded-xl text-sm font-medium animate-pulse">
                        ⚠️ {error}
                    </div>
                )}

                {/* Active Transaction State Loading Overlays */}
                {isUpdating ? (
                    <div className="flex flex-col justify-center items-center py-20 space-y-3">
                        <div className="animate-spin rounded-full h-9 w-9 border-t-2 border-b-2 border-purple-500"></div>
                        <p className="text-xs text-gray-500 font-medium tracking-wide">Pushing encryption packets and updating pipeline registry...</p>
                    </div>
                ) : (
                    /* The Refactored Form Integration Matrix Engine Core */
                    <div className="animate-fadeIn">
                        <TaskForm
                            initialData={task}
                            onSubmit={handleSubmit}
                        />
                    </div>
                )}
            </div>
        </main>
    );
}
