// app/tasks/TasksPage.tsx

import { auth } from "@/auth"
import TasksClient from "./TasksClient"
import { redirect } from "next/navigation"

export default async function TasksPage() {
    const session = await auth()

    if (!session?.accessToken) {
        redirect("/login")
    }

    return <TasksClient user={session.user} />
}