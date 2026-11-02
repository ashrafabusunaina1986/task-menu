// app/profile/ProfilePage.tsx

import { getProfile } from "@/lib/server_api"
import ProfileClient from "./ProfileClient"
import { auth } from "@/auth"
import { redirect } from "next/navigation"


export default async function ProfilePage() {
    const session = await auth()
    if (!session || !session.user || !session.accessToken) redirect("/login")
    const user = await getProfile()

    return <ProfileClient user={user} session={session} />
}
