// app/tasks/create/page.tsx

import TaskCreate from "@/components/task/create/TaskCreate";
import { redirect } from "next/navigation";

interface TaskCreatePageProps {
    searchParams: Promise<{
        project_id?: string;
    }>;
}

export default async function CreateTaskPage({ searchParams }: TaskCreatePageProps) {
    const { project_id } = await searchParams;

    // إصلاح الأمان والإنتاج: إزالة الـ alert القاتلة التي تعطل السيرفر، واستخدام إعادة توجيه آمنة ومشفرة
    if (!project_id) {
        return redirect("/project?error=missing_project_id");
    }

    return <TaskCreate projectId={project_id} />;
}
