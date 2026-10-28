// components/user/UserForm.tsx
"use client";

import { CreateUser, Role, UpdateUser } from "@/types/user";
import React, { useState } from "react";
import Label from "../ui/Label";
import Input from "../ui/Input";
import { IoEye, IoEyeOff } from "react-icons/io5";

interface FormErrors {
    name?: string[];
    email?: string[];
    password?: string[];
}

interface Props<T> {
    initialData?: T;
    showRole?: boolean;
    loading?: boolean;
    disabled?: boolean;
    is_pass?: boolean;
    errors: FormErrors;
    authError?: string;
    onSubmit: (data: T) => Promise<void>;
}

export default function UserForm<T extends CreateUser | UpdateUser>({
    initialData,
    showRole = false,
    loading = false,
    disabled = false,
    is_pass = true,
    errors,
    authError = '',
    onSubmit,
}: Props<T>) {
    const [name, setName] = useState(initialData?.name ?? "");
    const [email, setEmail] = useState(initialData?.email ?? "");
    const [password, setPassword] = useState("");
    const [currentImage, setCurrentImage] = useState((initialData as UpdateUser)?.image ?? "");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [role, setRole] = useState<Role>((initialData as UpdateUser)?.role ?? "user");
    const [showPassword, setShowPassword] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const data: Record<string, unknown> = {};

        if (name.trim()) data.name = name;
        if (email.trim()) data.email = email;
        if (password.trim()) data.password = password;
        if (currentImage.trim()) data.image = currentImage;
        if (showRole) {
            data.role = role;
        }

        await onSubmit(data as T);
    }
    return (
        <form
            onSubmit={handleSubmit}
            className="
                relative
                overflow-hidden
                space-y-6 
                rounded-3xl 
                border border-white/5 
                bg-[#0d0d16]/90 
                p-6
                md:p-8 
                backdrop-blur-xl
                shadow-[0_25px_80px_rgba(0,0,0,.85)]
                w-full
                transition-all
                duration-300
            "
        >
            {/* Identity Operator Name Input */}
            <div className="space-y-1.5">
                <Label>Operator Name</Label>
                <Input
                    disabled={disabled}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Enter full identity name..."
                    className="disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-gray-900/20"
                />
                {errors.name && (
                    <p className="text-[11px] font-semibold text-rose-400 pt-0.5 animate-fadeIn">
                        ⚠️ {errors.name[0]}
                    </p>
                )}
            </div>

            {/* Core Email Input */}
            <div className="space-y-1.5">
                <Label>Dynamic Email Address</Label>
                <Input
                    disabled={disabled}
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="username@domain.cloud"
                    className="disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-gray-900/20"
                />
                {errors.email && (
                    <p className="text-[11px] font-semibold text-rose-400 pt-0.5 animate-fadeIn">
                        ⚠️ {errors.email[0]}
                    </p>
                )}
            </div>

            {/* Cryptographic Secure Password Input - رندر مشروط */}
            {is_pass && (
                <div className="space-y-1.5">
                    <Label htmlFor="password">Signature Password</Label>
                    <div className="relative group">
                        <Input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••••••"
                            autoComplete="current-password"
                            required
                            disabled={disabled}
                            className="pr-12"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(prev => !prev)}
                            className="
                                absolute
                                right-3.5
                                top-1/2
                                -translate-y-1/2
                                text-gray-500
                                transition-colors
                                hover:text-gray-300
                                cursor-pointer
                            "
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <IoEyeOff size={18} /> : <IoEye size={18} />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-[11px] font-semibold text-rose-400 pt-0.5 animate-fadeIn">
                            ⚠️ {errors.password[0]}
                        </p>
                    )}
                </div>
            )}
            {/* Metadata Profile Image Node Uploader */}
            <div className="space-y-1.5">
                <Label>Avatar Image Node</Label>
                <Input
                    type="file"
                    accept="image/*"
                    disabled={disabled}
                    onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                            setSelectedImage(file);
                        }
                    }}
                    className="file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-purple-600/10 file:text-purple-400 hover:file:bg-purple-600/20 text-xs text-gray-500 cursor-pointer pt-2.5"
                />
            </div>

            {/* Clearance Access Role Selector - رندر مشروط للمدراء الفائقين */}
            {showRole && (
                <div className="space-y-1.5">
                    <Label>Clearance System Role</Label>
                    <div className="relative">
                        <select
                            value={role}
                            disabled={disabled}
                            onChange={e => setRole(e.target.value as Role)}
                            className="
                                w-full
                                rounded-xl
                                border border-gray-800/80
                                bg-[#141423]/60
                                px-4
                                py-3.5
                                text-sm
                                text-white
                                outline-none
                                transition-all
                                duration-150
                                focus:border-purple-500/50
                                cursor-pointer
                                appearance-none
                            "
                        >
                            <option value="user">User Node</option>
                            <option value="manager">Manager Pipeline</option>
                            <option value="admin">Administrator Root</option>
                        </select>
                        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-xs">▼</div>
                    </div>
                </div>
            )}

            {/* Server Exception Error Alert Box */}
            {authError && (
                <div className="bg-rose-950/30 border border-rose-900/50 text-rose-300 p-3 rounded-xl text-xs font-semibold animate-pulse">
                    ⚠️ {authError}
                </div>
            )}

            {/* Submission Functional Button Panel Control */}
            <div className="pt-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="
                        w-full
                        py-3.5
                        rounded-xl
                        text-xs
                        font-bold
                        uppercase
                        tracking-wider
                        text-white
                        bg-purple-600
                        hover:bg-purple-700
                        active:scale-[0.99]
                        shadow-lg
                        shadow-purple-600/20
                        transition-all
                        duration-150
                        cursor-pointer
                        disabled:opacity-40
                        disabled:cursor-not-allowed
                        disabled:scale-100
                        text-center
                    "
                >
                    {loading ? "Synchronizing Payload..." : "Commit Parameter Alterations"}
                </button>
            </div>
        </form>
    );
}
