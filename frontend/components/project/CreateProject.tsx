// components/project/CreateProject.tsx

// frontend/components/project/CreateProject.tsx
"use client";

import ProjectForm from "@/components/project/ProjectForm";
import TopNavigation from "@/components/navigation/TopNavigation";
import { ProjectCreate } from "@/types/project";
import { createProject } from "@/lib/project/project"; // استدعاء دالة الـ Client API الصافية المتوافقة تماماً
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface CreateProjectProps {
    currentUser: {
        id: string
        role: string | "user"
    }
}

export default function CreateProject({ currentUser }: CreateProjectProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);



    // دالة المعالجة التفاعلية الصافية للعميل (Client-Side Operational Handler)
    async function handleCreateProject(data: ProjectCreate & { owner_id: string | null, owner_role: string | null }) {
        setIsSubmitting(true);
        setError(null);

        try {
            // إرسال كبسولة حزمة المشروع مباشرة متطابقة مع توكنات العميل والـ Proxy لـ Next.js
            await createProject(data);

            // التوجيه الفوري للوحة القيادة عند نجاح الحقن في قاعدة البيانات مع تصفية المسارات حياً
            router.push("/project?success=pipeline_dispatched");
            router.refresh();
        } catch (err) {
            console.error("Critical: Client-side project deployment failure:", err);
            setError(err instanceof Error ? err.message : "Deployment failure: Internal lifecycle packet rejected by host.");
            setIsSubmitting(false);
        }
    }


    return (
        <main className="min-h-screen bg-[#08080d] px-4 py-10 text-white sm:px-6 lg:px-8 relative overflow-hidden w-full flex flex-col items-center justify-center">
            {/* Cyberpunk Fluid Glow Background Layers */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-purple-600/[0.02] blur-[180px]" />
            </div>


            <div className="relative z-50 w-full max-w-4xl mb-4">
                <TopNavigation isAuthenticated={true} role={currentUser.role} />
            </div>


            <section className="relative z-10 w-full max-w-4xl animate-fadeIn space-y-4">
                {/* لوحة إشعار الاستثناءات المباشرة حياً بالواجهة */}
                {error && (
                    <div className="bg-rose-950/40 border border-rose-800 text-rose-200 p-4 rounded-xl text-xs font-semibold animate-pulse max-w-4xl mx-auto">
                        ⚠️ Dynamic Pipeline Exception: {error}
                    </div>
                )}

                {/* استدعاء استمارة المشاريع المحدثة وتغذيتها ببيانات جلسة العمين الصافية المحمية */}

                <ProjectForm
                    onSubmit={handleCreateProject}
                    currentUser={{
                        id: currentUser.id || "",
                        role: currentUser.role
                    }}
                />

            </section>
        </main>
    );
}
