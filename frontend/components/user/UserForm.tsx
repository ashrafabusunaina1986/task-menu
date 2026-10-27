// components/user/UserForm.tsx

"use client"

import { CreateUser, Role, UpdateUser } from "@/types/user"
import { useState } from "react"
import Label from "../ui/Label"
import Input from "../ui/Input"
import Select from "../ui/Select"
import Button from "../ui/Button"
import { IoEye, IoEyeOff } from "react-icons/io5"

interface FormErrors {
    name?: string[]
    email?: string[]
    password?: string[]
}

interface Props<T> {
    initialData?: T

    showRole?: boolean
    loading?: boolean
    disabled?: boolean
    is_pass?: boolean

    errors: FormErrors
    authError?: string

    onSubmit: (
        data: T
    ) => Promise<void>
}


export default function UserForm<T extends CreateUser | UpdateUser>(
    {
        initialData,
        showRole = false,
        loading = false,
        disabled = false,
        is_pass = true,
        errors,
        authError = '',
        onSubmit,
    }: Props<T>
) {
    const [name, setName] = useState(
        initialData?.name ?? ""
    )
    const [email, setEmail] = useState(
        initialData?.email ?? ""
    )
    const [password, setPassword] = useState("")


    const [currentImage, setCurrentImage] = useState(
        (initialData as UpdateUser)?.image ?? ""
    )

    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const [role, setRole] = useState<Role>(
        (initialData as UpdateUser)?.role ?? "user"
    )
    const [showPassword, setShowPassword] = useState(false)

    async function handleSubmit(
        e: React.FormEvent<HTMLFormElement>
    ) {
        e.preventDefault()

        const data: Record<string, unknown> = {}

        if (name.trim()) data.name = name
        if (email.trim()) data.email = email

        if (password.trim()) data.password = password
        if (currentImage.trim()) data.image = currentImage
        if (showRole) {

            data.role = role
        }

        await onSubmit(
            data as T
        )
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="
            space-y-6 rounded-3xl border border-white/10 bg-zinc-950/90
            p-8 backdrop-blur-xl
            "
        >
            <div>
                <Label>Name</Label>

                <Input
                    disabled={disabled}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="disabled:bg-slate-700 disabled:cursor-not-allowed"
                />
                {
                    errors.name && (
                        <p className="mt-1 text-sm text-red-400 whitespace-normal">
                            {errors.name[0]}
                        </p>
                    )
                }
            </div>

            <div>
                <Label>Email</Label>

                <Input
                    disabled={disabled}
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="disabled:bg-slate-700 disabled:cursor-not-allowed"
                />
                {
                    errors.email && (
                        <p className="mt-1 text-sm text-red-400 whitespace-normal">
                            {errors.email[0]}
                        </p>
                    )
                }
            </div>

            {/* Password */}
            {is_pass ? <div>

                <Label htmlFor="password">Password</Label>

                <div className="relative">
                    <Input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="************"
                        autoComplete="current-password"
                        required
                        className="pr-12"
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword(prev => !prev)}
                        className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                text-gray-400
                transition
                hover:text-white
            "
                        aria-label={
                            showPassword
                                ? "Hide password"
                                : "Show password"
                        }
                    >
                        {showPassword ? (
                            <IoEyeOff size={20} />
                        ) : (
                            <IoEye size={20} />
                        )}
                    </button>
                </div>
                {
                    errors.password && (
                        <p className="mt-1 text-sm text-red-400 whitespace-normal">
                            {errors.password[0]}
                        </p>
                    )
                }
            </div> : ""}



            <div>
                <Label>Image</Label>

                <Input type="file"
                    accept="image/*"
                    onChange={e => {
                        const file = e.target.files?.[0]
                        if (file) {
                            setSelectedImage(file)
                        }
                    }}
                />
            </div>
            {showRole && (

                <div>
                    <Label>Role</Label>

                    <Select
                        value={role}
                        onChange={e => setRole(e.target.value as Role)}
                    >

                        <option value="user">User</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                    </Select>
                </div>


            )}

            <div>
                {
                    authError &&
                    <p
                        className="mt-1   text-sm text-red-400"
                    >
                        {authError}
                    </p>
                }
            </div>

            <Button
                type="submit"
                className="w-full"
                disabled={loading}
            >
                {loading ? "Saving..." : "Save"}
            </Button>
        </form>
    )
}
