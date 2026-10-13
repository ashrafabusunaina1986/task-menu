// types/user.ts

export type Role =
    "admin" | "manager" | "user";


export interface User {
    _id: string

    name: string
    email: string

    image?: string

    role: Role

    is_active: boolean
    is_verified: boolean

    created_at: string
    updated_at: string
}


export interface CreateUser {
    name: string
    email: string
    password: string
    image?:string
}


export interface UpdateUser {
    name?: string
    email?: string
    password?: string
    image?: string
    role?: Role
}