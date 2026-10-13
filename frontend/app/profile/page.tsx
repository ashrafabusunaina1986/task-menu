// app/profile/ProfilePage.tsx

import { getProfile } from "@/lib/server_api"
import ProfileClient from "./ProfileClient"


export default async function ProfilePage() {
    const user = await getProfile()

    return <ProfileClient user={user} />
}
