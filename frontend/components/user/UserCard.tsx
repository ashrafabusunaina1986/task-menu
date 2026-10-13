// components/user/UserCard.tsx

import { User } from "@/types/user";
import Link from "next/link";

interface Props {
    user: User
}


export default function UserCard({ user }: Props) {
    return (
        <div
            className="
        group
        rounded-3xl
        border border-white/10
        bg-zinc-950/80
        backdrop-blur-xl
        p-8
        shadow-[0_20px_60px_rgba(0,0,0,0.6)]
        transition-all
        hover:scale-[1.03]
        hover:border-violet-500/40
        duration-300"
        >
            {/* Avatar */}

            <div
                className="
                mb-6
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-2xl
                bg-zinc-900
                border border-white/10
                text-4xl
                shadow-[0_0_35px_rgba(139,92,246,0.35)
                "
            >
                👤
            </div>

            <h2
                className="
                text-2xl
                font-bold
                bg-gradient-to-r
                from-blue-500
                to-violet-500
                bg-clip-text
                text-transparent
                "
            >
                {user.name}
            </h2>

            {/* Email */}
            <div className="overflow-hidden">
                <p className="mt-3 text-gray-400 text-sm lg:text-lg break-all">
                    {user.email}
                </p>
            </div>


            {/* Role */}

            <div
                className="
                mt-5
                inline-flex
                rounded-xl
                border border-white/10
                bg-zinc-900
                px-4 py2 text-sm text-violet-400
                "
            >
                {user.role}
            </div>

            {/* Action */}

            <div className="mt-8 flex gap-3">

                <Link href={`/users/${user._id}`}
                    className="
                flex-1 rounded-xl
                bg-gradient-to-r from-blue-600 to-violet-600
                px-4 py-3
                text-center font-semibold text-white
                transition hover:scale-105
                "
                >
                    View
                </Link>

                {
                    user.email !== "ashrafabusunaina1986@gmail.com" ?
                        <Link
                            href={`/users/edit/${user._id}`}
                            className="
                                flex-1
                                rounded-xl
                                border border-white/10
                                bg-zinc-900 px-4 py-3 text-center text-gray-300
                                transition hover:bg-zinc-800
                                "
                        >
                            Edit
                        </Link> :
                        <button
                            type="button"
                            className="
                                    flex-1
                                    rounded-xl
                                    border border-white/10
                                    bg-zinc-900 px-4 py-3 text-center text-gray-300
                                    transition hover:bg-zinc-800
                                    disabled:bg-slate-500 disabled:cursor-not-allowed
                                    "
                            disabled
                        >
                            Edit
                        </button>
                }
            </div>
        </div>
    )
}
