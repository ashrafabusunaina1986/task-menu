// app/users/page.tsx

import { auth } from "@/auth";
import Users from "@/components/user/Users";


export default async function ViewUsersPage() {
    const session = await auth()
    const user = session?.user

    return <Users user={user} />
}
