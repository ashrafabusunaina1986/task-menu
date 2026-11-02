// components/user/CreateUser.tsx


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/user/user";
import { CreateUser as CreateUserType } from "@/types/user";
import UserForm from "./UserForm";
import UserHeader from "./UserHeader";

export default function CreateUser() {
  const router = useRouter();
  const [authError, setAuthError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string[];
    email?: string[];
    password?: string[];
  }>({});

  // معالجة وإرسال الحساب الجديد إلى خادم الـ API لـ FastAPI
  async function handleCreate(data: CreateUserType) {
    setAuthError("");
    setErrors({});
    setIsSubmitting(true);

    try {
      // تنفيذ المصادقة والحقن في قاعدة بيانات MongoDB
      await createUser(data);

      // التوجيه الفوري لقائمة الإدارة عند نجاح العملية مع إشعار بالنجاح
      router.push("/users?success=operator_provisioned");
      router.refresh();
    } catch (error) {
      console.error("Administrative provisioning exception:", error);

      // معالجة الأخطاء الاستثنائية القادمة من السيرفر وعزلها بصريًا
      setAuthError(
        error instanceof Error
          ? error.message
          : "Deployment failure: Internal lifecycle register packet rejected by backend host."
      );
      setIsSubmitting(false);
    }
  }
  return (
    <main className="min-h-screen bg-[#08080d] relative overflow-hidden flex items-center justify-center p-4 md:p-8 text-white">

      {/* Ambient Cyberpunk Fluid Glow Background Layers */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="w-[1000px] h-[1000px] rounded-full bg-purple-600/5 blur-[240px]" />
        <div className="w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-[180px] absolute" />
      </div>

      {/* Premium Glassmorphic Card Box Layout */}
      <div className="
                relative 
                z-10 
                w-full 
                max-w-xl 
                rounded-[32px] 
                border border-white/5 
                bg-[#0d0d16]/80 
                backdrop-blur-2xl 
                p-6 
                sm:p-10 
                shadow-[0_30px_90px_rgba(0,0,0,0.85)] 
                space-y-6
                transition-all
                duration-300
                hover:border-purple-500/15
            ">
        <UserHeader isBack={true} />

        {/* Section Heading Titles Layout */}
        <div className="mb-6 border-b border-gray-900 pb-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
            Provision Operator
          </h1>
          <p className="text-xs text-gray-500 mt-1">Deploy an isolated dynamic credentials container directly inside the system registry shards.</p>
        </div>

        {/* Exception Inline Failure Alert Banner */}
        {authError && (
          <div className="bg-rose-950/40 border border-rose-800 text-rose-200 p-3.5 rounded-xl text-xs font-medium animate-pulse">
            ⚠️ {authError}
          </div>
        )}

        {/* Active Transaction State Loading Overlays */}
        {isSubmitting ? (
          <div className="flex flex-col justify-center items-center py-20 space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 shadow-[0_0_15px_rgba(139,92,246,0.2)]"></div>
            <p className="text-xs text-zinc-500 font-semibold tracking-wider uppercase">Broadcasting user container allocation packets...</p>
          </div>
        ) : (
          /* The Refactored Form Matrix Integration Core */
          <div className="animate-fadeIn">
            <UserForm<CreateUserType>
              onSubmit={handleCreate}
              showRole={true} // تم التفعيل لتمكين الآدمين من تحديد الصلاحيات للأعضاء الجدد حياً
              is_pass={true}
              errors={errors}
              authError={authError}
            />
          </div>
        )}
      </div>
    </main>
  );
}
