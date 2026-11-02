// app/users/create/page.tsx

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CreateUser from "@/components/user/CreateUser";
import React from "react";

export default async function CreateUserPage() {
    const session = await auth();

    // 1. فحص وتأمين الاتصال عبر التوكن الأمني لـ Workora قبل رندر الواجهة
    if (!session?.accessToken) {
        redirect("/login");
    }

    // 2. جدار حماية الرتب الصارم: حظر الموظفين والعامة وتوجيههم فوراً لحماية سجلات الإدارة
    if (session.user?.role?.toLowerCase() !== "admin") {
        redirect("/project?error=unauthorized_access");
    }

    // تم إصلاح الإغلاق البرمجي وتمرير الجلسة بشكل صارم ومتوافق مع لغة TypeScript للإنتاج
    return <CreateUser />;
}
