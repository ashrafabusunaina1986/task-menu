import Link from "next/link";
import { auth } from "@/auth";
import TopNavigation from "@/components/navigation/TopNavigation";
import {
    FiArrowRight,
    FiShield,
    FiLayers,
    FiCheckSquare,
    FiTarget,
    FiActivity,
    FiLayout,
    FiCpu,
    FiArrowUpRight
} from "react-icons/fi";

const features = [
    {
        icon: FiLayers,
        title: "Project Clusters",
        description: "Organize projects, manage strict priorities, and maintain isolated pipeline containers.",
        color: "text-blue-400",
        glow: "bg-blue-500/10",
        border: "border-blue-500/20"
    },
    {
        icon: FiCheckSquare,
        title: "Atomic Tasks",
        description: "Track system micro-tasks from initial deployment down to successful state burn-off.",
        color: "text-purple-400",
        glow: "bg-purple-500/10",
        border: "border-purple-500/20"
    },
    {
        icon: FiShield,
        title: "Zero-Trust Security",
        description: "Built with enterprise-grade token encryption, access block tracking, and OTP gates.",
        color: "text-emerald-400",
        glow: "bg-emerald-500/10",
        border: "border-emerald-500/20"
    },
];

export default async function HomePage() {
    const session = await auth();
    const role = session?.user?.role;
    const isAuthenticated = !!session?.user;

    const workspaceHref = isAuthenticated ? "/project" : "/login";

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#08080d] text-white selection:bg-purple-500/30 selection:text-purple-200">
            {/* Ambient Background Matrix Grid & Cyberpunk Glowing Radial Overlays */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
                <div className="absolute -left-48 top-40 h-[600px] w-[600px] rounded-full bg-blue-600/[0.03] blur-[160px]" />
                <div className="absolute right-[-100px] top-20 h-[700px] w-[700px] rounded-full bg-purple-600/[0.05] blur-[180px]" />
                <div className="absolute bottom-0 left-1/3 h-[450px] w-[450px] rounded-full bg-indigo-600/[0.03] blur-[150px]" />

                {/* Sub-grid infrastructure pattern lines */}
                <div
                    className="absolute inset-0 opacity-[0.015]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                />
            </div>

            {/* Navigation Header Gate */}
            <div className="relative z-50">
                <TopNavigation
                    isAuthenticated={isAuthenticated}
                    role={role}
                />
            </div>
            {/* Hero Interactive Main Segment */}
            <section className="relative z-10 mx-auto grid min-h-[calc(100--80px)] w-[94%] max-w-7xl items-center gap-12 py-16 lg:grid-cols-[1.15fr_.85fr] lg:py-24">
                <div className="space-y-7 text-left">
                    {/* Upper Dynamic Status Badge */}
                    <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/[0.05] px-4 py-1.5 text-xs font-semibold text-purple-300 backdrop-blur-md shadow-sm">
                        <span className="h-2 w-2 rounded-full bg-purple-400 shadow-[0_0_12px_#a78bfa] animate-pulse" />
                        One workspace. Better organization.
                    </div>

                    <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-white">
                        Turn your ideas into{" "}
                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            real progress.
                        </span>
                    </h1>

                    <p className="max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
                        Workora brings your projects and tasks together in one organized cloud workspace, helping you secure workflows, monitor operational velocity, and maintain focus on critical milestones.
                    </p>

                    {/* Interactive Action Call Handles */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-2">
                        <Link
                            href={workspaceHref}
                            className="group inline-flex items-center justify-center gap-2.5 rounded-xl bg-purple-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-600/20 transition-all duration-200 hover:bg-purple-700 hover:-translate-y-0.5 active:scale-[0.99]"
                        >
                            {isAuthenticated ? "Open Control Workspace" : "Initialize Account"}
                            <FiArrowRight className="text-sm transition-transform group-hover:translate-x-1" />
                        </Link>

                        <Link
                            href="/about"
                            className="inline-flex items-center justify-center rounded-xl border border-gray-800 bg-[#141423]/30 px-6 py-3.5 text-sm font-semibold text-gray-300 transition hover:border-gray-700 hover:bg-[#141423]/60 hover:text-white"
                        >
                            Discover System Goals
                        </Link>
                    </div>

                    {/* Micro-Features Metadata Ribbon */}
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                        <span className="flex items-center gap-2"><FiShield className="text-emerald-400 text-sm" /> Security-focused</span>
                        <span className="flex items-center gap-2"><FiLayers className="text-blue-400 text-sm" /> Layered Workflow</span>
                        <span className="flex items-center gap-2"><FiTarget className="text-purple-400 text-sm" /> Velocity Tracking</span>
                    </div>
                </div>

                {/* 📊 الجزء المصلح والمقفل بالكامل لوحة المعاينة التفاعلية - Premium Glassmorphic Live Overview Tracker */}
                <div className="relative mx-auto w-full max-w-xl lg:w-full animate-fadeIn">
                    <div className="absolute inset-12 rounded-full bg-purple-600/[0.03] blur-[120px] pointer-events-none" />

                    <div className="relative overflow-hidden rounded-[32px] border border-white/5 bg-[#0d0d16]/80 p-6 shadow-[0_30px_100px_rgba(0,0,0,.75)] backdrop-blur-2xl sm:p-8 space-y-6">
                        <div className="flex items-center justify-between border-b border-gray-900/60 pb-5">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-400">Environment Node</p>
                                <h2 className="mt-1 text-lg font-bold text-white tracking-tight">Your Infrastructure</h2>
                            </div>
                            <div className="flex h-10 w-11 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/5">
                                <FiActivity className="text-lg text-purple-400 animate-pulse" />
                            </div>
                        </div>

                        {/* شبكة توزيع المعطيات الصافية المغلقة */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-2xl border border-blue-500/10 bg-blue-500/[0.02] p-4 flex flex-col justify-between h-28 hover:border-blue-500/20 transition">
                                <FiLayers className="text-lg text-blue-400" />
                                <div>
                                    <p className="text-[11px] font-medium text-gray-500">Project Nodes</p>
                                    <p className="text-sm font-bold text-white mt-0.5">Highly Organized</p>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-purple-500/10 bg-purple-500/[0.02] p-4 flex flex-col justify-between h-28 hover:border-purple-500/20 transition">
                                <FiCheckSquare className="text-lg text-purple-400" />
                                <div>
                                    <p className="text-[11px] font-medium text-gray-500">Atomic Tasks</p>
                                    <p className="text-sm font-bold text-white mt-0.5">Velocity Synced</p>
                                </div>
                            </div>
                        </div>
                        {/* الجزء السفلي المكمل للوحة الاستعراض الجانبية */}
                        <div className="rounded-2xl border border-gray-800/60 bg-[#121222]/40 p-4 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-3">
                                <span className="p-2 bg-[#16162a] border border-gray-800 rounded-lg text-emerald-400"><FiCpu /></span>
                                <div>
                                    <p className="font-bold text-gray-300">Access Node Firewall</p>
                                    <p className="text-[10px] text-gray-500 mt-0.5">Token encryption gate active</p>
                                </div>
                            </div>
                            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">SECURE</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 📋 قسم مصفوفة المميزات التحليلية السفلية المطور بالكامل للعامة */}
            <section className="relative z-10 border-t border-gray-900 bg-[#0a0a10]/40 py-16 backdrop-blur-sm">
                <div className="mx-auto w-[94%] max-w-7xl space-y-10">
                    <div className="text-center max-w-xl mx-auto space-y-2">
                        <h2 className="text-xs font-bold text-purple-400 uppercase tracking-widest">[ Architectural Layers ]</h2>
                        <p className="text-2xl font-extrabold text-white tracking-tight">Everything starts with a clearer workflow.</p>
                        <p className="text-xs text-gray-500 leading-5">Keep your core software deliverables structured with modular automation tools built around micro-projects, tasks, and responsible session access rules.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {features.map((feat) => {
                            const IconComponent = feat.icon;
                            return (
                                <div 
                                    key={feat.title}
                                    className={`relative overflow-hidden rounded-2xl border ${feat.border} bg-[#0d0d16]/60 p-6 space-y-4 hover:bg-[#0d0d16] transition-all duration-200 group`}
                                >
                                    <div className={`p-3 w-11 h-10 rounded-xl ${feat.glow} flex items-center justify-center ${feat.color} border border-white/5`}>
                                        <IconComponent className="text-lg" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-base font-bold text-white tracking-wide flex items-center justify-between">
                                            {feat.title}
                                            <FiArrowUpRight className="text-gray-600 text-xs transition-colors group-hover:text-purple-400" />
                                        </h3>
                                        <p className="text-xs text-gray-400 leading-5">{feat.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </main>
    );
}
