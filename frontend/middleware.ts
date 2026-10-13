// middleware.ts

import { auth } from "./auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const pathname = req.nextUrl.pathname;
    const user = req.auth?.user;

    const isAuthenticated = !!user;

    // PUBLIC
    if (pathname === "/") {
        return NextResponse.next();
    }

    // GUEST ONLY
    if (
        pathname === "/login" ||
        pathname === "/register" ||
        pathname === "/verify-otp"
    ) {
        if (isAuthenticated) {
            return NextResponse.redirect(
                new URL("/", req.url)
            );
        }

        return NextResponse.next();
    }

    // USERS MANAGEMENT -> ADMIN ONLY
    if (pathname.startsWith("/users")) {
        if (!isAuthenticated) {
            return NextResponse.redirect(
                new URL("/login", req.url)
            );
        }

        if (user.role !== "admin") {
            return NextResponse.redirect(
                new URL("/", req.url)
            );
        }

        return NextResponse.next();
    }

    // AUTHENTICATION REQUIRED
    if (
        pathname.startsWith("/tasks") ||
        pathname.startsWith("/profile")
    ) {
        if (!isAuthenticated) {
            return NextResponse.redirect(
                new URL("/login", req.url)
            );
        }

        return NextResponse.next();
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        "/",
        "/login",
        "/register",
        "/verify-otp",
        "/users/:path*",
        "/tasks/:path*",
        "/profile/:path*",
    ],
};