
import { CredentialsSignin, NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { decodeJwt } from "jose"

import { Role } from "./types/user"
import { cookies, headers } from "next/headers"


// ===============================================
// REFRESH ACCESS TOKEN
// ===============================================

async function refreshAccessToken(token: any) {

    try {

        const response = await fetch(
            `${process.env.API_URL_SERVER}/auth/refresh`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },

                body: JSON.stringify({
                    refresh_token: token.refreshToken,
                }),

                cache: "no-store",
            }
        )


        const data = await response.json()


        if (!response.ok) {

            throw new Error(
                data?.detail ??
                "Failed to refresh access token"
            )
        }


        const accessToken = data.access_token

        const payload = decodeJwt(accessToken)


        return {
            ...token,

            accessToken,

            accessTokenExpires:
                payload.exp
                    ? payload.exp * 1000
                    : Date.now() + 15 * 60 * 1000,

            error: undefined,
        }

    } catch (error) {

        console.error(
            "REFRESH TOKEN ERROR:",
            error
        )

        return {
            ...token,
            error: "RefreshAccessTokenError",
        }
    }
}



// ===============================================
// AUTH CONFIG
// ===============================================

export default {

    providers: [

        // =========================================
        // GOOGLE
        // =========================================

        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),


        // =========================================
        // CREDENTIALS
        //
        // OTP ONLY
        // =========================================

        Credentials({

            name: "Credentials",

            credentials: {

                user_id: {
                    label: "User",
                    type: "email",
                },

                otp: {
                    label: "OTP",
                    type: "text",
                },
            },


            // =====================================
            // AUTHORIZE OTP
            // =====================================
            async authorize(credentials) {

                if (
                    !credentials?.user_id ||
                    !credentials?.otp
                ) {
                    console.log(
                        "AUTH OTP: missing credentials"
                    )

                    return null
                }

                const user_id =
                    String(credentials.user_id)

                const otp =
                    String(credentials.otp)


                // ===========================================
                // DEVICE ID
                // ===========================================

                const cookieStore = await cookies()

                const deviceId =
                    cookieStore.get(
                        "device_id"
                    )?.value

                if (!deviceId) {

                    console.error(
                        "AUTH OTP: device_id is missing"
                    )

                    return null
                }


                // ===========================================
                // CLIENT IP
                // ===========================================

                const headerStore = await headers()

                const ipId =
                    headerStore.get(
                        "CF-Connecting-IP"
                    )

                if (!ipId) {

                    console.error(
                        "AUTH OTP: client IP is missing"
                    )

                    return null
                }


                // ===========================================
                // VERIFY LOGIN
                // ===========================================

                const response = await fetch(
                    `${process.env.API_URL_SERVER}/auth/verify-login`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            "Accept":
                                "application/json",

                            "X-Device-ID":
                                deviceId,

                            "CF-Connecting-IP":
                                ipId,
                        },

                        body: JSON.stringify({
                            user_id,
                            otp,
                        }),

                        cache: "no-store",
                    }
                )


                const text =
                    await response.text()


                console.log(
                    "VERIFY OTP STATUS:",
                    response.status
                )


                if (!response.ok) {

                    console.error(
                        "VERIFY OTP FAILED:",
                        text
                    )

                    let data: any

                    try {
                        data = JSON.parse(text)
                    } catch {
                        return null
                    }


                    if (data?.detail?.blocked) {

                        throw new CredentialsSignin(
                            JSON.stringify({
                                blocked: true,
                                reason: data.detail.reason,
                                blocked_until: data.detail.blocked_until,
                            })
                        )
                    }


                    return null
                }


                // ===========================================
                // RESPONSE
                // ===========================================

                let data: any

                try {

                    data =
                        JSON.parse(text)

                } catch {

                    console.error(
                        "VERIFY OTP: invalid JSON response"
                    )

                    return null
                }               


                if (
                    !data?.access_token ||
                    !data?.refresh_token ||
                    !data?.user
                ) {

                    console.error(
                        "VERIFY OTP: incomplete response"
                    )

                    return null
                }


                // ===========================================
                // ACCESS TOKEN
                // ===========================================

                const accessToken =
                    data.access_token

                const accessPayload =
                    decodeJwt(accessToken)


                // ===========================================
                // NEXTAUTH USER
                // ===========================================

                return {

                    id:
                        data.user._id,

                    name:
                        data.user.name,

                    email:
                        data.user.email,

                    role:
                        data.user.role,

                    image:
                        data.user.image,

                    accessToken,

                    refreshToken:
                        data.refresh_token,

                    sessionId:
                        data.session_id,

                    accessTokenExpires:
                        accessPayload.exp
                            ? accessPayload.exp * 1000
                            : Date.now() +
                            15 * 60 * 1000,
                }
            },
        }),
    ],


    // ===============================================
    // PAGES
    // ===============================================

    pages: {
        signIn: "/login",
    },


    // ===============================================
    // SESSION
    // ===============================================

    session: {
        strategy: "jwt",
    },


    // ===============================================
    // CALLBACKS
    // ===============================================

    callbacks: {

        // =========================================
        // SIGN IN
        // =========================================

        signIn: async ({
            user,
            account,
        }) => {

            // =========================================
            // GOOGLE LOGIN
            // =========================================

            if (
                account?.provider === "google" &&
                account.id_token
            ) {

                console.log(
                    "GOOGLE LOGIN -> BACKEND"
                )

                const response =
                    await fetch(
                        `${process.env.API_URL_SERVER}/auth/google`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "Accept":
                                    "application/json",
                            },

                            body: JSON.stringify({
                                id_token:
                                    account.id_token,
                            }),

                            cache: "no-store",
                        }
                    )

                const data =
                    await response.json()

                console.log({
                    "GOOGLE BACKEND STATUS":
                        response.status,
                })

                // =====================================
                // BACKEND LOGIN FAILED
                // =====================================

                if (!response.ok) {

                    console.error({
                        "GOOGLE BACKEND LOGIN FAILED":
                            data?.detail,
                    })

                    return false
                }

                // =====================================
                // SAVE BACKEND DATA FOR JWT CALLBACK
                // =====================================

                user.id =
                    data.user._id

                user.name =
                    data.user.name

                user.email =
                    data.user.email

                user.image =
                    data.user.image

                    ; (user as any).role =
                        data.user.role

                    ; (user as any).accessToken =
                        data.access_token

                    ; (user as any).refreshToken =
                        data.refresh_token

                    ; (user as any).sessionId =
                        data.session_id

                const accessPayload =
                    decodeJwt(
                        data.access_token
                    )

                    ; (user as any).accessTokenExpires =
                        accessPayload.exp
                            ? accessPayload.exp * 1000
                            : Date.now() +
                            15 * 60 * 1000

                return true
            }

            // =========================================
            // OTHER PROVIDERS
            // =========================================

            return true
        },

        // =========================================
        // AUTHORIZATION
        // =========================================

        authorized: ({ auth }) => {

            return !!auth?.user
        },


        // =========================================
        // JWT
        // =========================================

        async jwt({
            token,
            user,
            account,
        }) {


            // =====================================
            // NEW LOGIN
            // =====================================

            if (user) {

                // =================================
                // CREDENTIALS / OTP LOGIN
                // =================================

                token.id =
                    user.id

                token.name =
                    user.name

                token.email =
                    user.email

                token.picture =
                    user.image

                token.role =
                    user.role

                token.accessToken =
                    user.accessToken

                token.refreshToken =
                    user.refreshToken

                token.sessionId =
                    user.sessionId

                token.accessTokenExpires =
                    user.accessTokenExpires


                return token
            }


            // =====================================
            // NO ACCESS TOKEN
            // =====================================

            if (!token.accessToken) {

                return token
            }


            // =====================================
            // ACCESS TOKEN STILL VALID
            // =====================================

            if (
                token.accessTokenExpires &&
                Date.now() <
                Number(token.accessTokenExpires)
            ) {

                return token
            }


            // =====================================
            // NO REFRESH TOKEN
            // =====================================

            if (!token.refreshToken) {

                return token
            }


            // =====================================
            // REFRESH TOKEN
            // =====================================

            console.log(
                "ACCESS TOKEN EXPIRED → REFRESHING"
            )


            return await refreshAccessToken(token)
        },


        // =========================================
        // SESSION
        // =========================================

        async session({
            session,
            token,
        }) {

            session.user.id =
                token.id as string

            session.user.name =
                token.name as string

            session.user.email =
                token.email as string

            session.user.image =
                token.picture as string

            session.user.role =
                token.role as Role


            session.accessToken =
                token.accessToken as string

            session.refreshToken =
                token.refreshToken as string

            session.sessionId =
                token.sessionId as string


            return session
        },
    },

} satisfies NextAuthConfig