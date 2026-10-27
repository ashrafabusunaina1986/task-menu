import { auth } from "@/auth";
import { redirect } from "next/navigation";
import TasksClient from "./TasksClient";

interface TasksPageProps {
    searchParams: Promise<{
        project_id?: string;
    }>;
}

export default async function TasksPage({
    searchParams,
}: TasksPageProps) {
    const session = await auth();

    // فحص وتأمين الاتصال عبر التوكن الأمني لـ Workora قبل جلب الحزم
    if (!session?.accessToken) {
        redirect("/login");
    }

    const { project_id } = await searchParams;

    if (!project_id) {
        redirect("/project");
    }

    return (
        <TasksClient
            project_id={project_id}
            // إصلاح TypeScript: تفكيك وتمرير الخصائص بشكل صريح وآمن لضمان التوافق المطلق مع واجهة الـ Props
            user={{
                name: session.user?.name,
                email: session.user?.email,
                image: session.user?.image,
            }}
        />
    );
}
