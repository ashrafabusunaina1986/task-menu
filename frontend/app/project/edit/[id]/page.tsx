// app/project/edit/[id]/page.tsx

import { auth } from "@/auth";
import EditProject from "@/components/project/EditProject";
import { redirect } from "next/navigation";
import React from "react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProjectEditPage({ params }: Props) {
  const session = await auth();
  const { id } = await params;

  // 1. فحص وتأمين الاتصال عبر التوكن الأمني لـ Workora قبل رندر الواجهة
  if (!session?.accessToken) redirect("/login");
  if (!session.user) redirect("/project?error=session_missing");

  const role = session.user.role;
  const currentUserId = (session.user as any).id || (session.user as any)._id || "";

  // 2. تم إصلاح الإغلاق البرمجي وتمرير الجلسة كاملة لضمان حقن صلاحيات الآدمن لتعيين الملاك حياً
  return (
    <EditProject
      id={id}
      currentUser={{
        id: currentUserId,
        role: role || "user"
      }}
    />
  );
}
