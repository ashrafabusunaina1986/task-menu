// app/users/[id]/page.tsx

import { getUser } from "@/lib/server_api";
import UserHeader from "@/components/user/UserHeader";
import LocalDate from "@/components/date/LocalDate";

interface Props {
    params: Promise<{ id: string }>
}

export default async function ViewUserPage({ params }: Props) {

    const { id } = await params

    const user = await getUser(id)
    console.log({
        raw: user.updated_at,
        parsed: new Date(user.updated_at),
        iso: new Date(user.updated_at).toISOString(),
        local: new Date(user.updated_at).toLocaleString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    })
    return (
        <main className="min-h-screen bg-black relative overflow-hidden py-10">

            {/* Background Glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[900px] h-[900px] rounded-full bg-violet-700/15 blur-[220px]" />
            </div>

            {/* User Header */}
            <UserHeader
                isBack={true}
            />

            {/* User Profile */}
            <div
                className="
                    relative
                    w-[90%]
                    max-w-5xl
                    mx-auto
                    rounded-[32px]
                    border border-white/10
                    bg-zinc-950/90
                    backdrop-blur-xl
                    shadow-[0_25px_80px_rgba(0,0,0,.8)]
                    p-8 md:p-12
                "
            >

                {/* Header */}
                <div className="flex flex-col items-center text-center">

                    {/* Avatar */}
                    {user.image ? (
                        <img
                            src={user.image}
                            alt={user.name}
                            className="
                                h-28
                                w-28
                                rounded-full
                                object-cover
                                border border-white/10
                                shadow-[0_0_40px_rgba(99,102,241,.4)]
                            "
                        />
                    ) : (
                        <div
                            className="
                                flex
                                h-28
                                w-28
                                items-center
                                justify-center
                                rounded-full
                                bg-gradient-to-r
                                from-blue-600
                                to-violet-600
                                text-5xl
                                font-bold
                                text-white
                                shadow-[0_0_40px_rgba(99,102,241,.4)]
                            "
                        >
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                    )}

                    {/* Name */}
                    <h1
                        className="
                            mt-6
                            text-5xl
                            font-extrabold
                            bg-gradient-to-r
                            from-blue-500
                            to-violet-500
                            bg-clip-text
                            text-transparent
                        "
                    >
                        {user.name}
                    </h1>

                    <p className="mt-2 text-gray-400">
                        {user.email}
                    </p>

                </div>


                {/* Divider */}
                <div className="relative my-10 flex justify-center">

                    <div
                        className="
                            h-px
                            w-full
                            bg-gradient-to-r
                            from-transparent
                            via-violet-500
                            to-transparent
                        "
                    />

                    <div
                        className="
                            absolute
                            -top-[4px]
                            h-2
                            w-2
                            rounded-full
                            bg-violet-500
                            shadow-[0_0_20px_#8b5cf6]
                        "
                    />

                </div>


                {/* User Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <Info
                        label="User ID"
                        value={user._id}
                    />

                    <Info
                        label="Name"
                        value={user.name}
                    />

                    <Info
                        label="Email"
                        value={user.email}
                    />

                    <Info
                        label="Role"
                        value={user.role}
                    />

                    <StatusInfo
                        label="Account Status"
                        value={user.is_active}
                        trueText="Active"
                        falseText="Inactive"
                    />

                    <StatusInfo
                        label="Verification"
                        value={user.is_verified}
                        trueText="Verified"
                        falseText="Not Verified"
                    />

                    <Info
                        label="Created At"
                        value={<LocalDate date={user.created_at} />}
                    />

                    <Info
                        label="Last Updated"
                        value={<LocalDate date={user.updated_at} />}
                    />

                </div>

            </div>

        </main>
    )
}


function Info({
    label,
    value,
}: {
    label: string
    value: React.ReactNode
}) {
    return (
        <div
            className="
                rounded-2xl
                border border-white/10
                bg-zinc-900/70
                px-6
                py-5
            "
        >
            <p className="text-sm text-gray-500">
                {label}
            </p>

            <p className="mt-2 break-all text-lg font-semibold text-white">
                {value}
            </p>
        </div>
    )
}


function StatusInfo({
    label,
    value,
    trueText,
    falseText,
}: {
    label: string
    value: boolean
    trueText: string
    falseText: string
}) {
    return (
        <div
            className="
                rounded-2xl
                border border-white/10
                bg-zinc-900/70
                px-6
                py-5
            "
        >
            <p className="text-sm text-gray-500">
                {label}
            </p>

            <div className="mt-2 flex items-center gap-3">

                <span
                    className={`
                        h-3
                        w-3
                        rounded-full
                        ${value
                            ? "bg-green-500 shadow-[0_0_12px_#22c55e]"
                            : "bg-red-500 shadow-[0_0_12px_#ef4444]"
                        }
                    `}
                />

                <span className="text-lg font-semibold text-white">
                    {value ? trueText : falseText}
                </span>

            </div>
        </div>
    )
}


