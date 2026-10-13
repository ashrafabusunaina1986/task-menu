// app/not-found.tsx

import Link from "next/link";

export default function NotFound() {
    return (
        <main className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <h1 className="text-6xl font-bold">
                    404
                </h1>

                <p className="mt-4 text-gray-500">
                    Page not found.
                </p>

                <Link
                    href="/"
                    className="mt-6 
                    inline-block 
                    rounded-md 
                    bg-black 
                    px-5 py-2 
                    text-white"
                >
                    Go to Home
                </Link>
            </div>
        </main>
    );
}