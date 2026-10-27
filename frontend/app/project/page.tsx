// app/project/page.tsx

import { auth } from "@/auth";
import ProjectClient from "./ProjectClient";
import { redirect } from "next/navigation";

export default async function ProjectPage() {
    const session = await auth();

    if (!session?.accessToken) {
        redirect("/login");
    }

    const userId = session.user?.id;

    if (!userId) {
        redirect("/login");
    }

    return (
        <ProjectClient

            userId={userId}
            user={{
                name: session.user?.name,
                email: session.user?.email,
                image: session.user?.image,
                role: session.user.role
            }}
        />
    );
}