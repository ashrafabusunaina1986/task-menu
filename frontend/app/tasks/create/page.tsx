// app/tasks/create/page.tsx

import { auth } from "@/auth";
import TaskCreate from "@/components/task/create/TaskCreate";
import { getDateStartAndDueProject, getProject } from "@/lib/project/server";
import { redirect } from "next/navigation";
import React from "react";

interface TaskCreatePageProps {
    searchParams: Promise<{
        project_id?: string;
    }>;
}

export default async function CreateTaskPage({ searchParams }: TaskCreatePageProps) {
    const session = await auth();

    // 1. Server-side Authentication Gate
    if (!session || !session?.user || !session?.accessToken) {
        redirect("/login");
    }

    const { project_id } = await searchParams;

    // 2. Structural Query Integrity Gate
    if (!project_id) {
        return redirect("/project?error=missing_project_id");
    }

    const currentUserId = (session.user as any).id || "";

    // Fetch global parent project constraints from persistence servers
    const projectDates = await getDateStartAndDueProject({
        project_id,
        owner_id: currentUserId
    });

    const project = await getProject({ project_id: project_id });
    if (!project) {
        redirect("/project?error=project_not_found");
    }

    // 3. Render client wrapper while passing the explicit persistent database project owner telemetry matrix
    return (
        <TaskCreate
            projectId={project_id}
            currentDate={{
                start: projectDates?.start_date ? projectDates.start_date : null,
                due: projectDates?.due_date ? projectDates.due_date : null
            }}
            projectOwner={{
                id: project.owner_id || "",
                role: project.owner_role || "user"
            }}
        />
    );
}
