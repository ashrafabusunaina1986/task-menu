// components/user/Users.tsx

"use client"

import { getUsers } from '@/lib/user/user'
import { User } from '@/types/user'
import { useEffect, useState } from 'react'
import UserList from './UserList'
import { useRouter } from 'next/navigation'
import UserHeader from './UserHeader'
interface Props {
    user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    } | null;
}

export default function Users({ user }: Props) {
    const [users, setUsers] = useState<User[]>([])
    const router = useRouter()

    async function handleLogout() {
        const res = await fetch("/api/auth/logout", {
            method: "POST",
        });

        if (res.ok) {
            router.push("/login");
            router.refresh();
        }
    }

    useEffect(() => {
        getUsers().then(setUsers)
    }, [])
    return (
        <main
            className='
         min-h-screen bg-slate-900
         '
        >
            <UserHeader
                user={user}
                logout={handleLogout}
                home
            />
            <UserList users={users} />
        </main>
    )
}
