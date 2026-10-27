import Link from "next/link";
import { auth } from "@/auth";
import TopNavigation from "@/components/navigation/TopNavigation";
import {
    FiArrowRight,
    FiShield,
    FiLayers,
    FiCheckSquare,
    FiUsers,
    FiTarget,
    FiActivity,
} from "react-icons/fi";

const features = [
    {
        icon: FiLayers,
        title: "Project Management",
        description:
            "Organize projects, manage priorities, and keep your work structured in one place.",
        color: "text-blue-400",
        glow: "bg-blue-500/10",
    },
    {
        icon: FiCheckSquare,
        title: "Task Management",
        description:
            "Track tasks from planning to completion and maintain a clear view of your progress.",
        color: "text-violet-400",
        glow: "bg-violet-500/10",
    },
    {
        icon: FiShield,
        title: "Security First",
        description:
            "Built with authentication, authorization, and access control as core principles.",
        color: "text-emerald-400",
        glow: "bg-emerald-500/10",
    },
];

export default async function HomePage() {
    const session = await auth();
    const role = session?.user?.role;
    const isAuthenticated = !!session?.user;

    const workspaceHref = isAuthenticated ? "/project" : "/login";

    return (
        <main className="relative min-h-screen overflow-hidden bg-black text-white">
            {/* Background effects */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -left-48 top-40 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[160px]" />
                <div className="absolute right-[-100px] top-20 h-[600px] w-[600px] rounded-full bg-violet-600/15 blur-[180px]" />
                <div className="absolute bottom-0 left-1/3 h-[350px] w-[350px] rounded-full bg-indigo-600/10 blur-[150px]" />

                <div
                    className="absolute inset-0 opacity-[0.035]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }}
                />
            </div>

            <div className="relative z-20">
                <TopNavigation
                    isAuthenticated={isAuthenticated}
                    role={role}
                />
            </div>

            {/* Hero */}
            <section className="relative mx-auto grid min-h-[650px] w-[92%] max-w-7xl items-center gap-14 py-20 lg:grid-cols-[1.1fr_.9fr] lg:py-28">
                <div className="relative z-10">
                    <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/[0.07] px-4 py-2 text-sm text-violet-300">
                        <span className="h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_12px_#a78bfa]" />
                        One workspace. Better organization.
                    </div>

                    <h1 className="max-w-3xl text-5xl font-extrabold leading-[1.12] tracking-tight sm:text-6xl lg:text-7xl">
                        Turn your ideas into{" "}
                        <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-500 bg-clip-text text-transparent">
                            real progress.
                        </span>
                    </h1>

                    <p className="mt-7 max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg">
                        Workora brings your projects and tasks together in
                        one organized workspace, helping you manage your work,
                        track progress, and stay focused on what matters.
                    </p>

                    <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                        <Link
                            href={workspaceHref}
                            className="group inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-7 py-4 font-semibold text-white shadow-[0_0_35px_rgba(99,102,241,.2)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_0_45px_rgba(99,102,241,.35)]"
                        >
                            {isAuthenticated ? "Open Workspace" : "Get Started"}
                            <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                        </Link>

                        <Link
                            href="/about"
                            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-7 py-4 font-medium text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
                        >
                            Discover Workora
                        </Link>
                    </div>

                    <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-zinc-500">
                        <span className="flex items-center gap-2">
                            <FiShield className="text-emerald-400" />
                            Security-focused
                        </span>
                        <span className="flex items-center gap-2">
                            <FiLayers className="text-blue-400" />
                            Organized workflow
                        </span>
                        <span className="flex items-center gap-2">
                            <FiTarget className="text-violet-400" />
                            Progress tracking
                        </span>
                    </div>
                </div>

                {/* Workspace preview */}
                <div className="relative mx-auto w-full max-w-xl">
                    <div className="absolute inset-8 rounded-full bg-violet-600/20 blur-[100px]" />

                    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/90 p-5 shadow-[0_30px_100px_rgba(0,0,0,.6)] backdrop-blur-2xl sm:p-7">
                        <div className="flex items-center justify-between border-b border-white/[0.08] pb-5">
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-violet-400">
                                    Workspace
                                </p>
                                <h2 className="mt-2 text-xl font-bold">
                                    Your Overview
                                </h2>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10">
                                <FiActivity className="text-xl text-violet-300" />
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <div className="rounded-2xl border border-blue-500/15 bg-blue-500/[0.06] p-4">
                                <FiLayers className="text-xl text-blue-400" />
                                <p className="mt-5 text-sm text-zinc-400">
                                    Projects
                                </p>
                                <p className="mt-1 text-lg font-semibold">
                                    Organized
                                </p>
                            </div>

                            <div className="rounded-2xl border border-violet-500/15 bg-violet-500/[0.06] p-4">
                                <FiCheckSquare className="text-xl text-violet-400" />
                                <p className="mt-5 text-sm text-zinc-400">
                                    Tasks
                                </p>
                                <p className="mt-1 text-lg font-semibold">
                                    Track progress
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="font-semibold">
                                        Built around your workflow
                                    </p>
                                    <p className="mt-1 text-sm text-zinc-500">
                                        Plan, organize, and review.
                                    </p>
                                </div>
                                <FiTarget className="shrink-0 text-2xl text-emerald-400" />
                            </div>

                            <div className="mt-5 space-y-3">
                                {[
                                    {
                                        label: "Plan your projects",
                                        width: "w-full",
                                        color: "bg-blue-500",
                                    },
                                    {
                                        label: "Manage daily tasks",
                                        width: "w-4/5",
                                        color: "bg-violet-500",
                                    },
                                    {
                                        label: "Review your progress",
                                        width: "w-3/5",
                                        color: "bg-emerald-500",
                                    },
                                ].map((item) => (
                                    <div key={item.label}>
                                        <p className="mb-2 text-xs text-zinc-400">
                                            {item.label}
                                        </p>
                                        <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                                            <div
                                                className={`h-full rounded-full ${item.width} ${item.color} opacity-80`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-5 flex items-center gap-3 rounded-xl border border-emerald-500/15 bg-emerald-500/[0.04] p-4">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                                <FiShield className="text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-zinc-200">
                                    Security matters
                                </p>
                                <p className="mt-1 text-xs text-zinc-500">
                                    Access control is part of the platform.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="relative border-t border-white/[0.06] bg-zinc-950/50 py-20 sm:py-24">
                <div className="mx-auto w-[92%] max-w-7xl">
                    <div className="mx-auto max-w-2xl text-center">
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-400">
                            What you can do
                        </p>
                        <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
                            Everything starts with a{" "}
                            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                                clearer workflow.
                            </span>
                        </h2>
                        <p className="mt-5 leading-7 text-zinc-400">
                            Keep your work structured with tools designed
                            around projects, tasks, and responsible access.
                        </p>
                    </div>

                    <div className="mt-14 grid gap-5 md:grid-cols-3">
                        {features.map((feature) => {
                            const Icon = feature.icon;

                            return (
                                <article
                                    key={feature.title}
                                    className="group rounded-2xl border border-white/[0.08] bg-white/[0.02] p-7 transition duration-300 hover:-translate-y-1 hover:border-violet-500/25 hover:bg-white/[0.035]"
                                >
                                    <div
                                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.glow}`}
                                    >
                                        <Icon className={`text-2xl ${feature.color}`} />
                                    </div>

                                    <h3 className="mt-6 text-xl font-bold">
                                        {feature.title}
                                    </h3>

                                    <p className="mt-3 leading-7 text-zinc-400">
                                        {feature.description}
                                    </p>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Workflow section */}
            <section className="relative py-20 sm:py-24">
                <div className="mx-auto grid w-[92%] max-w-7xl items-center gap-12 lg:grid-cols-2">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
                            A simpler way to work
                        </p>

                        <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
                            From planning to completion,{" "}
                            <span className="text-violet-400">
                                stay in control.
                            </span>
                        </h2>

                        <p className="mt-5 max-w-xl leading-8 text-zinc-400">
                            Keep project information organized, break work
                            into manageable tasks, and see what needs your
                            attention next. Workora is designed to give your
                            workflow a clear structure.
                        </p>

                        <Link
                            href={workspaceHref}
                            className="group mt-8 inline-flex items-center gap-3 font-semibold text-violet-300 transition hover:text-violet-200"
                        >
                            {isAuthenticated ? "Go to your projects" : "Start using Workora"}
                            <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                number: "01",
                                title: "Create a project",
                                description:
                                    "Define the work you want to organize.",
                                color: "text-blue-400",
                            },
                            {
                                number: "02",
                                title: "Organize your tasks",
                                description:
                                    "Break work into clear, manageable steps.",
                                color: "text-violet-400",
                            },
                            {
                                number: "03",
                                title: "Track progress",
                                description:
                                    "Review statuses and keep your work moving.",
                                color: "text-emerald-400",
                            },
                        ].map((step) => (
                            <div
                                key={step.number}
                                className="flex gap-5 rounded-2xl border border-white/[0.08] bg-zinc-950/70 p-5 transition hover:border-white/15 sm:p-6"
                            >
                                <span className={`pt-1 text-sm font-bold ${step.color}`}>
                                    {step.number}
                                </span>
                                <div>
                                    <h3 className="font-semibold text-zinc-100">
                                        {step.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-6 text-zinc-500">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to action */}
            <section className="relative px-4 pb-20 sm:pb-28">
                <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-blue-950/50 via-zinc-950 to-violet-950/50 px-6 py-14 text-center sm:px-12 sm:py-20">
                    <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-96 -translate-x-1/2 rounded-full bg-violet-600/15 blur-[100px]" />

                    <div className="relative">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10">
                            <FiUsers className="text-2xl text-violet-300" />
                        </div>

                        <h2 className="mt-6 text-3xl font-bold sm:text-4xl">
                            Ready to organize your work?
                        </h2>

                        <p className="mx-auto mt-4 max-w-xl leading-7 text-zinc-400">
                            Bring your projects and tasks into one workspace
                            and take the next step toward a more organized workflow.
                        </p>

                        <Link
                            href={workspaceHref}
                            className="mt-8 inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-7 py-4 font-semibold text-white transition hover:-translate-y-1 hover:shadow-[0_0_35px_rgba(139,92,246,.3)]"
                        >
                            {isAuthenticated ? "Open Workora" : "Get Started"}
                            <FiArrowRight />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative border-t border-white/[0.08] bg-zinc-950/80">
                <div className="mx-auto flex w-[92%] max-w-7xl flex-col gap-4 py-7 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
                    <Link
                        href="/"
                        className="w-fit bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-lg font-bold text-transparent"
                    >
                        Workora
                    </Link>

                    <p>
                        Projects, tasks, and a more organized workflow.
                    </p>

                    <Link
                        href="/about"
                        className="w-fit transition hover:text-white"
                    >
                        About Us
                    </Link>
                </div>
            </footer>
        </main>
    );
}
