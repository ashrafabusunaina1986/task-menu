// components/user/EditUser.tsx
"use client"

import { getUser, updateUser } from "@/lib/user/user"
import { UpdateUser, User } from "@/types/user"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import UserForm from "./UserForm"
import UserHeader from "./UserHeader"


interface Props {
    id: string
}
export default function EditUser({ id }: Props) {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [errors, setErrors] = useState<{
        name?: string[],
        email?: string[],
        password?: string[]
    }>({})
    useEffect(() => { getUser(id).then(setUser) }, [id])

    async function handleUpdate(data: UpdateUser) {
        await updateUser(id, data)
        router.push("/users")
    }

    if (!user) {
        return (
            <div className="text-white">Loading...</div>
        )
    }
    return (
        <main
            className="
        min-h-screen bg-black flex flex-col
        items-center justify-center p-6
        "
        >
            <UserHeader
                isBack={true}
            />
            <div
                className="w-full max-w-xl"
            >

                <h1
                    className="
            mb-8 text-4xl font-bold text-white
            "
                >

                    Edit User
                </h1>
                <UserForm<UpdateUser>
                    initialData={user}
                    showRole
                    onSubmit={handleUpdate}
                    disabled
                    is_pass={false}
                    errors={errors}
                />
            </div>

        </main>
    )
}
