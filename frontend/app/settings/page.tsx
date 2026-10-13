
// app/settings/page.tsx

import { auth } from "@/auth"
import TopNavigation from "@/components/navigation/TopNavigation"
import TokenExpiry from "@/components/settings/TokenExpiry"
import { redirect } from "next/navigation"

export default async function SettingsPage() {

    const session = await auth()

    if (!session) {
        redirect("/login")
    }

    const role = session.user.role

    return (
        <main className="min-h-screen bg-black px-4 py-10 text-white sm:px-6 lg:px-8">

            {/* Top Navigation */}
            <TopNavigation
                isAuthenticated={true}
                role={role}
            />


            {/* Settings Container */}
            <section className="mx-auto mt-10 w-[90%] max-w-6xl">

                {/* Header */}
                <div className="mb-8">

                    <h1 className="
                        text-3xl
                        font-bold
                        tracking-tight
                        text-white
                    ">
                        Settings
                    </h1>

                    <p className="
                        mt-2
                        text-gray-400
                    ">
                        Manage your account and application preferences.
                    </p>

                </div>


                {/* Settings Grid */}
                <div className="
                    grid
                    grid-cols-1
                    gap-6
                    md:grid-cols-2
                ">


                    {/* Account */}
                    <div className="
                        group
                        rounded-3xl
                        border border-white/10
                        bg-zinc-950/80
                        p-6
                        backdrop-blur-xl
                        shadow-[0_15px_50px_rgba(0,0,0,.5)]
                        transition
                        hover:-translate-y-1
                        hover:border-white/20
                    ">

                        <div className="
                            mb-5
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-2xl
                            bg-blue-600/10
                            text-xl
                        ">
                            👤
                        </div>

                        <h2 className="
                            text-xl
                            font-semibold
                            text-white
                        ">
                            Account
                        </h2>

                        <p className="
                            mt-2
                            text-sm
                            leading-6
                            text-gray-400
                        ">
                            Manage your profile, personal information,
                            and account details.
                        </p>

                        <button
                            type="button"
                            className="
                                mt-6
                                rounded-xl
                                border border-white/10
                                bg-zinc-900
                                px-4 py-2
                                text-sm
                                text-gray-300
                                transition
                                hover:bg-zinc-800
                                hover:text-white
                            "
                        >
                            Manage Account
                        </button>

                    </div>


                    {/* Security */}
                    <div className="
                        group
                        rounded-3xl
                        border border-white/10
                        bg-zinc-950/80
                        p-6
                        backdrop-blur-xl
                        shadow-[0_15px_50px_rgba(0,0,0,.5)]
                        transition
                        hover:-translate-y-1
                        hover:border-white/20
                    ">

                        <div className="
                            mb-5
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-2xl
                            bg-violet-600/10
                            text-xl
                        ">
                            🔐
                        </div>

                        <h2 className="
                            text-xl
                            font-semibold
                            text-white
                        ">
                            Security
                        </h2>

                        <p className="
                            mt-2
                            text-sm
                            leading-6
                            text-gray-400
                        ">
                            Manage your password, active sessions,
                            and account security.
                        </p>

                        <button
                            type="button"
                            className="
                                mt-6
                                rounded-xl
                                border border-white/10
                                bg-zinc-900
                                px-4 py-2
                                text-sm
                                text-gray-300
                                transition
                                hover:bg-zinc-800
                                hover:text-white
                            "
                        >
                            Security Settings
                        </button>

                    </div>


                    {/* Appearance */}
                    <div className="
                        group
                        rounded-3xl
                        border border-white/10
                        bg-zinc-950/80
                        p-6
                        backdrop-blur-xl
                        shadow-[0_15px_50px_rgba(0,0,0,.5)]
                        transition
                        hover:-translate-y-1
                        hover:border-white/20
                    ">

                        <div className="
                            mb-5
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-2xl
                            bg-pink-600/10
                            text-xl
                        ">
                            🎨
                        </div>

                        <h2 className="
                            text-xl
                            font-semibold
                            text-white
                        ">
                            Appearance
                        </h2>

                        <p className="
                            mt-2
                            text-sm
                            leading-6
                            text-gray-400
                        ">
                            Customize the appearance and layout
                            of Task Menu.
                        </p>

                        <button
                            type="button"
                            className="
                                mt-6
                                rounded-xl
                                border border-white/10
                                bg-zinc-900
                                px-4 py-2
                                text-sm
                                text-gray-300
                                transition
                                hover:bg-zinc-800
                                hover:text-white
                            "
                        >
                            Customize
                        </button>

                    </div>


                    {/* Application */}
                    <div className="
                        group
                        rounded-3xl
                        border border-white/10
                        bg-zinc-950/80
                        p-6
                        backdrop-blur-xl
                        shadow-[0_15px_50px_rgba(0,0,0,.5)]
                        transition
                        hover:-translate-y-1
                        hover:border-white/20
                    ">

                        <div className="
                            mb-5
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-2xl
                            bg-emerald-600/10
                            text-xl
                        ">
                            ⚙️
                        </div>

                        <h2 className="
                            text-xl
                            font-semibold
                            text-white
                        ">
                            Application
                        </h2>

                        <p className="
                            mt-2
                            text-sm
                            leading-6
                            text-gray-400
                        ">
                            Manage general application preferences
                            and behavior.
                        </p>

                        <button
                            type="button"
                            className="
                                mt-6
                                rounded-xl
                                border border-white/10
                                bg-zinc-900
                                px-4 py-2
                                text-sm
                                text-gray-300
                                transition
                                hover:bg-zinc-800
                                hover:text-white
                            "
                        >
                            Application Settings
                        </button>

                    </div>

                </div>

                <TokenExpiry
                    accessToken={session.accessToken}
                    refreshToken={session.refreshToken}
                />

            </section>

        </main>
    )
}

