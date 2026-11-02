

// frontend/components/footer/Footer.tsx

import { auth } from '@/auth';
import Link from 'next/link';

export default async function Footer() {
    // 1. Retrieve the active server-side authentication state payload
    const session = await auth();
    const isAuthenticated = !!session;
    
    // Evaluate operational administrative clearance bounds live
    const isPrivileged = session?.user?.role?.toLowerCase() === 'admin' || session?.user?.role?.toLowerCase() === 'manager';

    return (
        <footer className="relative w-full z-40 bg-[#06060a]/90 backdrop-blur-md border-t border-white/5 py-12 mt-20 text-gray-500 overflow-hidden">
            {/* Ambient dynamic radial backdrop neon reflection glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-purple-600/[0.02] blur-[100px] rounded-full pointer-events-none" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                {/* Brand Cluster Block */}
                <div className="space-y-3 col-span-1 md:col-span-2">
                    <h3 className="text-sm font-extrabold text-white tracking-wider uppercase bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Workora Cloud System
                    </h3>
                    <p className="text-xs text-gray-400 max-w-sm leading-5">
                        High-velocity microservice orchestration and task lifecycle tracking framework designed for secure, distributed corporate clusters.
                    </p>
                </div>

                {/* Core Pipeline Navigation Matrix Links */}
                <div className="space-y-3">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Workspace Links
                    </h4>
                    <ul className="space-y-2 text-xs font-semibold">
                        <li>
                            <Link href="/" className="hover:text-purple-400 transition duration-150 block">
                                Core Engine Home
                            </Link>
                        </li>
                        {isAuthenticated && (
                            <>
                                <li>
                                    <Link href="/project" className="hover:text-purple-400 transition duration-150 block">
                                        Project Pipelines
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/profile" className="hover:text-purple-400 transition duration-150 block">
                                        Operator Profile
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>

                {/* Privileged Management Metrics - Conditional RBAC Rendering */}
                <div className="space-y-3">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        System Control
                    </h4>
                    <ul className="space-y-2 text-xs font-semibold">
                        {isPrivileged ? (
                            <>
                                <li>
                                    <Link href="/users" className="text-purple-400 hover:text-purple-300 transition duration-150 block flex items-center gap-1.5">
                                        <span className="h-1 w-1 rounded-full bg-purple-500 animate-ping" />
                                        User Directory
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/project/create" className="hover:text-purple-400 transition duration-150 block">
                                        Deploy Container
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <li>
                                <span className="text-[11px] text-gray-600 italic block">
                                    Standard Clearance Active
                                </span>
                            </li>
                        )}
                    </ul>
                </div>
            </div>

            {/* Sub-Footer Intellectual Property Registry Line */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-t border-white/[0.03] pt-6 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10 text-[11px] font-mono">
                <p>&copy; {new Date().getFullYear()} Workora Infrastructure Shards. All legal privileges reserved.</p>
                <div className="flex gap-4 text-gray-600">
                    <span className="text-purple-500/40">Node Status: Active</span>
                </div>
            </div>
        </footer>
    );
}
