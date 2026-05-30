"use client";

import { Music2, Heart } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t border-amber-100 py-10 sm:py-12 mt-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                {/* Logo */}
                <div className="flex items-center gap-2 text-amber-900 font-bold text-lg">
                    <div className="w-7 h-7 bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg flex items-center justify-center">
                        <Music2 className="w-4 h-4 text-white" />
                    </div>
                    Muse Village
                </div>

                {/* Copyright */}
                <p className="text-amber-500 text-sm flex items-center gap-1.5 order-last sm:order-none">
                    Made with <Heart className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> for musicians worldwide
                </p>

                {/* Links */}
                <div className="flex items-center gap-5 sm:gap-6 text-sm">
                    <Link href="/donate" className="text-amber-600 hover:text-amber-900 transition-colors font-medium">
                        Support Us
                    </Link>
                    <Link href="/dashboard" className="text-amber-600 hover:text-amber-900 transition-colors font-medium">
                        Dashboard
                    </Link>
                    <Link href="/login" className="text-amber-600 hover:text-amber-900 transition-colors font-medium">
                        Sign In
                    </Link>
                </div>
            </div>

            <div className="mt-6 pt-6 border-t border-amber-50 text-center">
                <p className="text-amber-400 text-xs">
                    © {new Date().getFullYear()} Muse Village. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
