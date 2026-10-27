
// app/tasks/TasksPage.tsx

import { auth } from "@/auth"
import { redirect } from "next/navigation"

import TasksClient from "./TasksClient"

interface TasksPageProps {
    searchParams: Promise<{
        project_id?: string
    }>
}

export default async function TasksPage({
    searchParams,
}: TasksPageProps) {
    const session = await auth()

    if (!session?.accessToken) {
        redirect("/login")
    }

    const { project_id } = await searchParams

    if (!project_id) {
        redirect("/project")
    }

    return (
        <TasksClient
            user={session.user}
            project_id={project_id}
        />
    )
}
