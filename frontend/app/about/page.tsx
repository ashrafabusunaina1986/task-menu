
// app/about/page.tsx

import { auth } from "@/auth";
import TopNavigation from "@/components/navigation/TopNavigation";
import Link from "next/link";
import React from "react"
import {
    FiCheckCircle,
    FiCode,
    FiDatabase,
    FiLayers,
    FiLock,
    FiShield,
    FiServer,
    FiZap,
} from "react-icons/fi"

const technologies = [
    {
        name: "Next.js",
        description: "Modern React framework for the frontend.",
        icon: FiCode,
    },
    {
        name: "FastAPI",
        description: "High-performance Python backend API.",
        icon: FiServer,
    },
    {
        name: "MongoDB",
        description: "Flexible database for application data.",
        icon: FiDatabase,
    },
    {
        name: "JWT",
        description: "Access and refresh token authentication.",
        icon: FiLock,
    },
]

const features = [
    "Task management",
    "User management",
    "JWT authentication",
    "Refresh token system",
    "Role-based permissions",
    "Protected API routes",
    "Modular backend architecture",
    "Responsive user interface",
]

export default async function AboutPage() {

    const session = await auth();

    const role = session?.user?.role;
    return (
        <main className="min-h-screen bg-black px-4 py-10 text-white sm:px-6 lg:px-8">


            {/* Top Navigation */}
            <TopNavigation
                isAuthenticated={!!session}
                role={role}
            />
            <div className="mx-auto max-w-6xl space-y-8">

                {/* Hero */}
                <section
                    className="
                        relative overflow-hidden
                        rounded-3xl
                        border border-white/10
                        bg-zinc-950/80
                        p-8
                        shadow-[0_20px_80px_rgba(0,0,0,.5)]
                        backdrop-blur-xl
                        sm:p-12
                    "
                >

                    {/* Background glow */}
                    <div
                        className="
                            pointer-events-none
                            absolute -right-32 -top-32
                            h-80 w-80
                            rounded-full
                            bg-violet-600/20
                            blur-3xl
                        "
                    />

                    <div
                        className="
                            pointer-events-none
                            absolute -bottom-32 -left-32
                            h-80 w-80
                            rounded-full
                            bg-blue-600/10
                            blur-3xl
                        "
                    />

                    <div className="relative max-w-3xl">

                        <div
                            className="
                                mb-5 inline-flex items-center gap-2
                                rounded-full
                                border border-violet-500/20
                                bg-violet-500/10
                                px-4 py-2
                                text-sm text-violet-300
                            "
                        >
                            <FiZap className="text-violet-400" />

                            Task Menu
                        </div>

                        <h1
                            className="
                                text-4xl font-bold tracking-tight
                                sm:text-5xl
                            "
                        >
                            Modern Task Management
                        </h1>

                        <p
                            className="
                                mt-5 max-w-2xl
                                text-base leading-7
                                text-gray-400
                                sm:text-lg
                            "
                        >
                            A full-stack task management system built with
                            modern technologies, modular architecture,
                            authentication, authorization, and a
                            security-first approach.
                        </p>

                    </div>

                </section>


                {/* Features + Architecture */}
                <section className="grid gap-8 lg:grid-cols-2">

                    {/* Features */}
                    <div
                        className="
                            rounded-3xl
                            border border-white/10
                            bg-zinc-950/80
                            p-7
                            backdrop-blur-xl
                            shadow-[0_15px_50px_rgba(0,0,0,.4)]
                        "
                    >

                        <div className="mb-6 flex items-center gap-3">

                            <div
                                className="
                                    flex h-11 w-11 items-center justify-center
                                    rounded-xl
                                    bg-violet-600/10
                                    text-violet-400
                                "
                            >
                                <FiCheckCircle size={21} />
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold">
                                    Features
                                </h2>

                                <p className="text-sm text-gray-500">
                                    Core capabilities
                                </p>
                            </div>

                        </div>


                        <div className="grid gap-3 sm:grid-cols-2">

                            {features.map((feature) => (

                                <div
                                    key={feature}
                                    className="
                                        flex items-center gap-3
                                        rounded-xl
                                        border border-white/5
                                        bg-white/[0.02]
                                        px-4 py-3
                                        text-sm text-gray-300
                                        transition
                                        hover:border-violet-500/20
                                        hover:bg-white/[0.04]
                                    "
                                >

                                    <FiCheckCircle
                                        className="shrink-0 text-violet-500"
                                    />

                                    {feature}

                                </div>

                            ))}

                        </div>

                    </div>


                    {/* Architecture */}
                    <div
                        className="
                            rounded-3xl
                            border border-white/10
                            bg-zinc-950/80
                            p-7
                            backdrop-blur-xl
                            shadow-[0_15px_50px_rgba(0,0,0,.4)]
                        "
                    >

                        <div className="mb-6 flex items-center gap-3">

                            <div
                                className="
                                    flex h-11 w-11 items-center justify-center
                                    rounded-xl
                                    bg-blue-500/10
                                    text-blue-400
                                "
                            >
                                <FiLayers size={21} />
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold">
                                    Architecture
                                </h2>

                                <p className="text-sm text-gray-500">
                                    Modular system design
                                </p>
                            </div>

                        </div>


                        <div className="space-y-3">

                            {[
                                "Presentation Layer",
                                "Application Layer",
                                "Security Layer",
                                "Domain Layer",
                                "Infrastructure Layer",
                                "Shared Components",
                            ].map((layer, index) => (

                                <div
                                    key={layer}
                                    className="
                                        flex items-center gap-4
                                        rounded-xl
                                        border border-white/5
                                        bg-white/[0.02]
                                        px-4 py-3
                                    "
                                >

                                    <span
                                        className="
                                            flex h-7 w-7 shrink-0
                                            items-center justify-center
                                            rounded-lg
                                            bg-blue-500/10
                                            text-xs font-semibold
                                            text-blue-400
                                        "
                                    >
                                        {index + 1}
                                    </span>

                                    <span className="text-sm text-gray-300">
                                        {layer}
                                    </span>

                                </div>

                            ))}

                        </div>

                    </div>

                </section>


                {/* Technology Stack */}
                <section
                    className="
                        rounded-3xl
                        border border-white/10
                        bg-zinc-950/80
                        p-7
                        backdrop-blur-xl
                        shadow-[0_15px_50px_rgba(0,0,0,.4)]
                        sm:p-8
                    "
                >

                    <div className="mb-7 flex items-center gap-3">

                        <div
                            className="
                                flex h-11 w-11 items-center justify-center
                                rounded-xl
                                bg-emerald-500/10
                                text-emerald-400
                            "
                        >
                            <FiCode size={21} />
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold">
                                Technology Stack
                            </h2>

                            <p className="text-sm text-gray-500">
                                Technologies powering the application
                            </p>
                        </div>

                    </div>


                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                        {technologies.map((technology) => {

                            const Icon = technology.icon

                            return (
                                <div
                                    key={technology.name}
                                    className="
                                        group
                                        rounded-2xl
                                        border border-white/10
                                        bg-black/30
                                        p-5
                                        transition
                                        duration-300
                                        hover:-translate-y-1
                                        hover:border-violet-500/30
                                        hover:bg-white/[0.03]
                                    "
                                >

                                    <div
                                        className="
                                            mb-4 flex h-10 w-10
                                            items-center justify-center
                                            rounded-xl
                                            bg-violet-600/10
                                            text-violet-400
                                            transition
                                            group-hover:bg-violet-600/20
                                        "
                                    >
                                        <Icon size={20} />
                                    </div>

                                    <h3 className="font-semibold text-white">
                                        {technology.name}
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-gray-500">
                                        {technology.description}
                                    </p>

                                </div>
                            )

                        })}

                    </div>

                </section>


                {/* Security */}
                <section
                    className="
                        relative overflow-hidden
                        rounded-3xl
                        border border-red-500/10
                        bg-zinc-950/80
                        p-7
                        backdrop-blur-xl
                        shadow-[0_15px_50px_rgba(0,0,0,.4)]
                        sm:p-8
                    "
                >

                    <div
                        className="
                            pointer-events-none
                            absolute -right-20 -top-20
                            h-60 w-60
                            rounded-full
                            bg-red-500/5
                            blur-3xl
                        "
                    />

                    <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">

                        <div
                            className="
                                flex h-14 w-14 shrink-0
                                items-center justify-center
                                rounded-2xl
                                bg-red-500/10
                                text-red-400
                            "
                        >
                            <FiShield size={26} />
                        </div>

                        <div>

                            <h2 className="text-xl font-semibold">
                                Security First
                            </h2>

                            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-400">
                                Authentication and authorization are treated
                                as core parts of the architecture. The system
                                uses short-lived access tokens, refresh tokens,
                                protected endpoints, roles, and permissions
                                to control access to application resources.
                            </p>

                        </div>

                    </div>

                </section>


                {/* Footer */}
                <section className="pb-6 text-center">

                    <p className="text-sm text-gray-500">
                        Task Menu
                    </p>

                    <p className="mt-2 text-xs text-gray-600">
                        Built with Next.js, FastAPI, MongoDB and a modular
                        security architecture.
                    </p>

                </section>

            </div>

        </main>
    )
}
