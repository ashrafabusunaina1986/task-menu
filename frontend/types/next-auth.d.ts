// types/next-auth.d.ts

import { DefaultSession } from "next-auth"
import { Role } from "./user"

declare module "next-auth" {

    interface Session {
        accessToken: string
        refreshToken: string
        sessionId: string

        user: DefaultSession["user"] & {
            id: string
            role: Role
        }
    }

    interface User {
        id: string
        role: string

        accessToken: string
        refreshToken: string
        sessionId: string

        accessTokenExpires: number
    }
}

declare module "next-auth/jwt" {

    interface JWT {
        id: string
        role: string

        accessToken: string
        refreshToken: string
        sessionId: string

        accessTokenExpires: number

        error?: string
    }
}