
// app/settings/page.tsx
import { auth } from "@/auth";
import TopNavigation from "@/components/navigation/TopNavigation";
import TokenExpiry from "@/components/settings/TokenExpiry";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
    const session = await auth();

    // جدار حماية صارم: عزل الجلسات غير المصرح بها وإعادتها فوراً لبوابة الدخول
    if (!session || !session.accessToken) {
        redirect("/login");
    }

    const role = session.user?.role;
    const accessToken = session.accessToken;
    const refreshToken = (session as any).refreshToken || ""; // جلب توكن التجديد لتمريره للوحة التتبع الإحصائية
    return (
        <main className="min-h-screen bg-[#08080d] px-4 py-10 text-white sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Premium Cyberpunk Ambient Glow Layers */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
                <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-blue-700/5 blur-[150px]" />
                <div className="absolute -right-20 top-40 h-[500px] w-[500px] rounded-full bg-purple-700/10 blur-[180px]" />
            </div>

            {/* Top Navigation Panel Component */}
            <div className="relative z-50">
                <TopNavigation
                    isAuthenticated={true}
                    role={role}
                />
            </div>

            {/* Central Operational Settings Container */}
            <section className="relative z-10 mx-auto mt-10 w-[94%] max-w-7xl space-y-8 animate-fadeIn">
                {/* Section Header Labels */}
                <div className="border-b border-gray-900 pb-5">
                    <h1 className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-3xl sm:text-4xl font-extrabold text-transparent tracking-tight">
                        Control Center Settings
                    </h1>
                    <p className="mt-2 text-xs text-gray-500 sm:text-sm max-w-xl">
                        Configure architecture preferences, calibrate infrastructure parameters, and monitor live telemetry.
                    </p>
                </div>

                {/* Core Preferences Config Cards Grid Layout */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

                    {/* Module 1: Account Management Card */}
                    <div className="group rounded-2xl border border-white/5 bg-[#0d0d16]/80 p-6 shadow-xl transition-all duration-200 hover:-translate-y-1 hover:border-purple-500/20 flex flex-col justify-between items-start">
                        <div className="space-y-4">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-lg select-none">👤</div>
                            <h2 className="text-base font-bold text-white tracking-wide">Account Control</h2>
                            <p className="text-xs text-gray-500 leading-5">Manage platform profile, personal information registry, and dynamic account variables mapping.</p>
                        </div>
                        <button type="button" className="mt-6 w-full sm:w-auto rounded-xl border border-gray-800 bg-[#141423]/40 px-4 py-2 text-xs font-bold text-gray-400 transition hover:bg-gray-800 hover:text-white cursor-pointer">
                            Manage Account
                        </button>
                    </div>

                    {/* Module 2: Security Configuration Card */}
                    <div className="group rounded-2xl border border-white/5 bg-[#0d0d16]/80 p-6 shadow-xl transition-all duration-200 hover:-translate-y-1 hover:border-purple-500/20 flex flex-col justify-between items-start">
                        <div className="space-y-4">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-lg select-none">🔐</div>
                            <h2 className="text-base font-bold text-white tracking-wide">Security Policies</h2>
                            <p className="text-xs text-gray-500 leading-5">Calibrate signature token passwords, isolate active device session logs, and establish protection barriers.</p>
                        </div>
                        <button type="button" className="mt-6 w-full sm:w-auto rounded-xl border border-gray-800 bg-[#141423]/40 px-4 py-2 text-xs font-bold text-gray-400 transition hover:bg-gray-800 hover:text-white cursor-pointer">
                            Security Settings
                        </button>
                    </div>

                    {/* Module 3: Appearance Calibrations Card - تم إصلاحه وإكمال إنقاذ الجزء المقطوع بالكامل */}
                    <div className="group rounded-2xl border border-white/5 bg-[#0d0d16]/80 p-6 shadow-xl transition-all duration-200 hover:-translate-y-1 hover:border-purple-500/20 flex flex-col justify-between items-start">
                        <div className="space-y-4">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-500/10 border border-pink-500/20 text-lg select-none">🎨</div>
                            <h2 className="text-base font-bold text-white tracking-wide">Visual Appearance</h2>
                            <p className="text-xs text-gray-500 leading-5">Customize UI theme matrix density layers, adjust glassmorphic properties, and toggle dashboard styles.</p>
                        </div>
                        <button type="button" className="mt-6 w-full sm:w-auto rounded-xl border border-gray-800 bg-[#141423]/40 px-4 py-2 text-xs font-bold text-gray-400 transition hover:bg-gray-800 hover:text-white cursor-pointer">
                            Adjust Themes
                        </button>
                    </div>
                </div>
                {/* 📊 حقن لوحة المراقبة التليمتري التفاعلية المصلحة للتوكنات حياً في بيئة الإنتاج */}
                <div className="pt-4">
                    <TokenExpiry
                        accessToken={accessToken}
                        refreshToken={refreshToken}
                    />
                </div>
            </section>
        </main>
    );
}
