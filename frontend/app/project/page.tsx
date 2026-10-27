// app/project/page.tsx
// 

import { auth } from "@/auth";
import ProjectClient from "./ProjectClient";
import { redirect } from "next/navigation";

export default async function ProjectPage() {
    const session = await auth();

    // فحص صلاحية الدخول والتوكن الأمني لحماية الحسابات الحية
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
                // إصلاح TypeScript: استخدام التقييم الآمن لمنع فشل الـ Build في السيرفر
                role: session.user?.role
            }}
        />
    );
}
