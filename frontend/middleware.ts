// middleware.ts

import { auth } from "./auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const pathname = req.nextUrl.pathname;
    const user = req.auth?.user;
    const isAuthenticated = !!user;

    // 1. PUBLIC ROUTE SECURITY EXCLUSION GATE
    if (pathname === "/") {
        return NextResponse.next();
    }

    // 2. GUEST ONLY ACCESS CONTROL GATE (Login, Register, and Onboarding OTP)
    if (
        pathname === "/login" ||
        pathname === "/register" ||
        pathname === "/verify-otp"
    ) {
        if (isAuthenticated) {
            // Re-route active token holders back to the baseline home layout panel
            return NextResponse.redirect(new URL("/", req.url));
        }
        return NextResponse.next();
    }

    // 3. CORPORATE IDENTITY GATE: ADMIN ROLE REQUIRING ELEVATED SYSTEM CLEARANCE
    if (pathname.startsWith("/users")) {
        if (!isAuthenticated) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        if (user.role !== "admin") {
            // Drop anomalous operator back to baseline view if the global permission role parameter is insufficient
            return NextResponse.redirect(new URL("/", req.url));
        }

        return NextResponse.next();
    }

    // 4. ABSOLUTE AUTHENTICATION REQUIREMENT GATE
    //✅ FIXED: Injected and wired the global project container route path explicitly under the absolute security boundary check
    if (
        pathname.startsWith("/tasks") ||
        pathname.startsWith("/project") ||
        pathname.startsWith("/profile")
    ) {
        if (!isAuthenticated) {
            // Intercept unauthenticated sniffing requests and securely deploy a redirect payload to the onboarding node
            return NextResponse.redirect(new URL("/login", req.url));
        }

        return NextResponse.next();
    }

    return NextResponse.next();
});

export const config = {
    /*
     * ✅ RE-ENGINEERED MATCHER CORE BOUNDARY MAPPING FRAMEWORK:
     * Extracted guest paths entirely out of the matcher registry matrix to safely destroy cyclic recursive hydration loops.
     * Utilizes direct prefix matching optimization sequences to guard secure dashboard cluster nodes exclusively.
     */
    matcher: [
        "/",
        "/users/:path*",
        "/tasks/:path*",
        "/project/:path*",// Injected: Absolute directory path coverage loop for project mutations
        "/profile/:path*",
    ],
};
