// components/user/UserList.tsx

import { User } from "@/types/user"
import UserCard from "./UserCard"

interface Props {
    users: User[]
}

export default function UserList({ users }: Props) {

    return (
        <section className="p-10 mx-auto w-[95%]">

            {/* Header */}
            <div className="mb-6 flex items-end justify-between">

                <div>
                    <h2 className="text-xl font-semibold tracking-tight text-white">
                        Users
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage and view registered users
                    </p>
                </div>

                <div
                    className="
                    rounded-full
                    border border-white/10
                    bg-white/[0.03]
                    px-3 py-1.5
                    text-xs font-medium
                    text-gray-400
                    "
                >
                    {users.length} {users.length === 1 ? "user" : "users"}
                </div>

            </div>


            {/* Empty State */}
            {users.length === 0 ? (

                <div
                    className="
                    flex min-h-[280px]
                    flex-col items-center justify-center
                    rounded-3xl
                    border border-dashed border-white/10
                    bg-zinc-950/60
                    px-6 py-12
                    text-center
                    "
                >

                    <div
                        className="
                        mb-5 flex h-16 w-16
                        items-center justify-center
                        rounded-2xl
                        border border-white/10
                        bg-white/[0.03]
                        "
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className="h-7 w-7 text-gray-500"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 19a4 4 0 0 0-8 0m4-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7 8a4 4 0 0 0-3-3.87m1-4.13a3 3 0 1 0 0-6"
                            />
                        </svg>
                    </div>

                    <h3 className="text-base font-semibold text-white">
                        No users found
                    </h3>

                    <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
                        There are currently no users to display.
                    </p>

                </div>

            ) : (

                /* Users Grid */
                <div
                    className="
                    grid grid-cols-1 gap-5
                    sm:grid-cols-2
                    xl:grid-cols-3
                    2xl:grid-cols-4
                    "
                >

                    {users.map((user) => (

                        <div
                            key={user._id}
                            className="
                            min-w-0
                            transition-transform duration-200
                            hover:-translate-y-1
                            "
                        >
                            <UserCard user={user} />
                        </div>

                    ))}

                </div>

            )}

        </section>
    )
}