// components/Logout.tsx
'use client'

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Logout() {
    const router = useRouter()
    useEffect(() => {
        async function logout() {
            const res = await fetch("/api/auth/logout", {
                method: "POST"
            })
            if (res.ok) router.replace('/')
        }
        logout()
    }, [router])
    return (
        <main className="
        min-h-screen
        bg-black
        text-white
        flex
        items-center
        justify-center
        ">
            <p>Signing out...</p>
        </main>
    )
}
