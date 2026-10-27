// app/tasks/create/page.tsx

import TaskCreate from "@/components/task/create/TaskCreate";
import { redirect } from "next/navigation";
interface TaskCreatePageProps {
    searchParams: Promise<{
        project_id?: string
    }>
}

export default async function CreateTaskPage(
    { searchParams }: TaskCreatePageProps
) {
    const { project_id } = await searchParams

    if (!project_id) {
        alert("Project id is required")
        return redirect("/project")

    }
    return <TaskCreate projectId={project_id} />
}