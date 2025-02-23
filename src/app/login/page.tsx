"use client"

import Image from "next/image";
import { signIn } from "next-auth/react";

export default function LoginPage() {
    async function handleGoogleSignIn() {
        try {
            await signIn("google", { callbackUrl: "/dashboard" });
        } catch (error) {
            console.error("Google sign in error:", error);
        }
    }
    return (
        <div>
            {/* Google Sign In */}
            <button
                type="button"
                onClick={handleGoogleSignIn}
                className="flex w-full items-center justify-center rounded-md border border-gray-300 py-4 text-gray-700 shadow-sm hover:bg-gray-100"
            >
                <Image
                    src={"/google.png"}
                    alt="Google"
                    width={20}
                    height={20}
                    className="mr-2"
                />
                Log In with Google
            </button>
        </div>
    );
}