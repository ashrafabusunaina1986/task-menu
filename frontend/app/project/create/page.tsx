// frontend/app/project/create/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CreateProject from "@/components/project/CreateProject";
export default async function CreateProjectPage() {
    const session = await auth();

    // جدار حماية السيرفر الصارم: طرد فوري غير مصرح له قبل رندر المكونات
    if (!session?.accessToken) {
        redirect("/login");
    }
    return <CreateProject currentUser={{
        id: session.user.id,
        role: session.user.role
    }} />;
}
