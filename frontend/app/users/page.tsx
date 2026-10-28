// app/users/page.tsx

import { auth } from "@/auth";
import Users from "@/components/user/Users";
import { redirect } from "next/navigation";


export default async function ViewUsersPage() {
    const session = await auth()
    if (!session?.accessToken) redirect("/login")
    if (!session.user) redirect("/login")


    return <Users user={{ ...session.user }} />
}
