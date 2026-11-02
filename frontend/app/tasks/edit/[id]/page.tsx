// frontend/app/tasks/edit/[id]/page.tsx

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getDateStartAndDueProject, getProject } from "@/lib/project/server";
import React from "react";
import TaskEditClient from "./TaskEditClient";
import { User } from "next-auth";

interface TaskEditPageProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ project_id?: string }>;
}

export default async function ProjectTaskEditPage({ params, searchParams }: TaskEditPageProps) {
    // 1. Server-side session verification gate
    const session = await auth();
    if (!session || !session?.accessToken || !session?.user) {
        redirect("/login");
    }

    const { id } = await params;
    const { project_id } = await searchParams;

    // 2. Query parameter structural validation gate
    if (!project_id) {
        redirect("/project?error=missing_project_context");
    }

    const currentUserId = (session.user as User).id || "";
    const project = await getProject({ project_id: project_id });
    if (!project) {
        redirect("/project?error=project_not_found");
    }

    // 3. Fetch global parent project boundaries directly from persistence layers via server actions
    const projectDates = await getDateStartAndDueProject({
        project_id,
        owner_id: currentUserId
    });

    // 4. Pass clean, non-delayed telemetry props straight down to the interactive client component
    return (
        <TaskEditClient
            id={id}
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
