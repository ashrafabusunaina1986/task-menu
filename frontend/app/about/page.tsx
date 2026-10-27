
// app/about/page.tsx
import { auth } from "@/auth";
import TopNavigation from "@/components/navigation/TopNavigation";
import Link from "next/link";
import React from "react";
import {
    FiCheckCircle,
    FiCode,
    FiDatabase,
    FiLayers,
    FiLock,
    FiShield,
    FiServer,
    FiZap,
    FiCpu,
    FiTerminal
} from "react-icons/fi";

const technologies = [
    {
        name: "Next.js",
        description: "Modern production React framework utilizing strict server/client encapsulation and static App Routing.",
        icon: FiCode,
        color: "text-blue-400",
        glow: "bg-blue-500/10",
        border: "border-blue-500/20"
    },
    {
        name: "FastAPI",
        description: "Asynchronous high-performance Python web server gateway interface optimized for micro-payload processing.",
        icon: FiServer,
        color: "text-emerald-400",
        glow: "bg-emerald-500/10",
        border: "border-emerald-500/20"
    },
    {
        name: "MongoDB",
        description: "NoSQL dynamic schema cluster persistent storage for structured storage of container entities and operational trees.",
        icon: FiDatabase,
        color: "text-amber-400",
        glow: "bg-amber-500/10",
        border: "border-amber-500/20"
    },
    {
        name: "JWT & OTP",
        description: "Cryptographic asymmetric signatures combined with zero-trust multi-factor identity authorization gates.",
        icon: FiLock,
        color: "text-purple-400",
        glow: "bg-purple-500/10",
        border: "border-purple-500/20"
    },
];

const features = [
    "Task management",
    "User management",
    "JWT authentication",
    "Refresh token system",
    "Role-based permissions",
    "Protected API routes",
    "Modular backend architecture",
    "Responsive user interface",
];

export default async function AboutPage() {
    const session = await auth();
    const role = session?.user?.role;

    return (
        <main className="min-h-screen bg-[#08080d] text-white overflow-hidden relative pb-16">

            {/* Ambient Background Matrix Overlays */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
                <div className="absolute -left-48 top-40 h-[600px] w-[600px] rounded-full bg-purple-600/[0.03] blur-[220px]" />
                <div className="absolute right-[-100px] top-20 h-[700px] w-[700px] rounded-full bg-blue-600/[0.03] blur-[180px]" />
            </div>

            {/* Navigation Header */}
            <div className="relative z-50">
                <TopNavigation
                    isAuthenticated={!!session}
                    role={role}
                />
            </div>
            {/* Main Center Area Panel Grid */}
            <div className="relative z-10 mx-auto max-w-7xl w-[94%] mt-6 sm:mt-10 space-y-8 animate-fadeIn">

                {/* 🛡️ Hero Section Container */}
                <section className="relative overflow-hidden rounded-[32px] border border-white/5 bg-[#0d0d16]/90 p-6 sm:p-12 shadow-[0_30px_90px_rgba(0,0,0,0.85)] backdrop-blur-xl">
                    {/* Ambient Glows */}
                    <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-purple-600/5 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-blue-600/5 blur-3xl" />

                    <div className="relative max-w-3xl space-y-4">
                        <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/[0.05] px-4 py-1.5 text-xs font-semibold text-purple-300">
                            <FiZap className="text-purple-400 animate-pulse" />
                            System Specifications
                        </div>

                        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                            Modern Task Infrastructure
                        </h1>

                        <p className="text-sm sm:text-base leading-7 text-gray-400 max-w-2xl">
                            A highly scalable production-tested workspace pipeline built with strict component abstraction, optimized O(N) filtering logic, and multi-layered credential barrier security.
                        </p>
                    </div>
                </section>

                {/* Grid Splitter for Core Features and Structural System Layers */}
                <section className="grid gap-6 lg:grid-cols-2">

                    {/* 📋 Features Dynamic Analytics Box */}
                    <div className="rounded-3xl border border-white/5 bg-[#0d0d16]/70 p-6 md:p-8 backdrop-blur-xl shadow-xl space-y-6">
                        <div className="flex items-center gap-3 border-b border-gray-900 pb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/5 border border-purple-500/20 text-purple-400">
                                <FiCheckCircle className="text-lg" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-white tracking-wide">Core Features</h2>
                                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">Pipeline Capabilities</p>
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            {features.map((feature) => (
                                <div
                                    key={feature}
                                    className="flex items-center gap-3 rounded-xl border border-gray-800/40 bg-[#141423]/40 px-4 py-3 text-xs font-semibold text-gray-300 hover:border-purple-500/20 hover:bg-[#141423]/80 transition duration-150"
                                >
                                    <span className="h-2 w-2 rounded-full bg-purple-500/80" />
                                    {feature}
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* 📐 Structural Layer Components Architecture Section - تم إغلاقه وإكماله بالكامل هندسياً */}
                    <div className="rounded-3xl border border-white/5 bg-[#0d0d16]/70 p-6 md:p-8 backdrop-blur-xl shadow-xl space-y-6">
                        <div className="flex items-center gap-3 border-b border-gray-900 pb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/5 border border-blue-500/20 text-blue-400">
                                <FiLayers className="text-lg" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-white tracking-wide">Backend Architecture</h2>
                                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">Isolated Responsibilities</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[
                                { title: "API Endpoint Routes", desc: "Validate incoming payloads securely via optimized internal schemas.", icon: "🔗" },
                                { title: "Zero-Trust Firewall Matrix", desc: "Audit connection profiles, trace failed signatures, and control block timers.", icon: "🛡️" },
                                { title: "Encapsulated Repositories", desc: "Direct database indexing strategies with isolated unidirectional operations.", icon: "⚡" }
                            ].map((layer) => (
                                <div key={layer.title} className="flex gap-4 p-3.5 rounded-xl border border-gray-800/30 bg-[#141423]/20 items-start">
                                    <span className="text-base p-1.5 bg-[#16162a] border border-gray-800 rounded-lg">{layer.icon}</span>
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-300">{layer.title}</h4>
                                        <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{layer.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 📋 Technology Matrix Segment Board */}
                <section className="space-y-4 pt-4">
                    <div className="border-b border-gray-900 pb-2 flex items-center gap-2">
                        <FiTerminal className="text-purple-400 text-sm animate-pulse" />
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Compiled Ecosystem Stack</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {technologies.map((tech) => {
                            const IconComponent = tech.icon;
                            return (
                                <div key={tech.name} className={`rounded-2xl border ${tech.border} bg-[#0d0d16]/50 p-5 space-y-3 transition-colors hover:bg-[#0d0d16] group`}>
                                    <div className={`w-10 h-10 rounded-xl ${tech.glow} ${tech.color} flex items-center justify-center border border-white/5`}>
                                        <IconComponent className="text-base" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-white tracking-wide">{tech.name}</h4>
                                        <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">{tech.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>
        </main>
    );
}
