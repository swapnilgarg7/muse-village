"use client";

import { motion } from "framer-motion";
import { Heart, ArrowRight, Music2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DonationSection() {
    const router = useRouter();

    return (
        <section className="py-20 sm:py-24">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative overflow-hidden bg-gradient-to-br from-amber-700 via-amber-600 to-orange-600 rounded-2xl sm:rounded-3xl px-6 sm:px-12 py-12 sm:py-16 text-center"
            >
                {/* Decorative */}
                <div className="absolute -top-20 -left-20 w-64 sm:w-80 h-64 sm:h-80 bg-amber-500/25 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -right-20 w-64 sm:w-80 h-64 sm:h-80 bg-orange-700/30 rounded-full blur-3xl" />
                <div className="absolute top-6 right-6 opacity-10">
                    <Music2 className="w-24 h-24 sm:w-32 sm:h-32 text-white" />
                </div>

                <div className="relative z-10 max-w-2xl mx-auto">
                    <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-white/20 rounded-2xl mb-6 shadow-lg backdrop-blur-sm">
                        <Heart className="w-7 h-7 sm:w-8 sm:h-8 text-white fill-white" />
                    </div>

                    <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4 leading-tight">
                        Support Muse Village
                    </h2>
                    <p className="text-amber-100 text-sm sm:text-lg leading-relaxed mb-8 sm:mb-10 max-w-xl mx-auto">
                        Muse Village is built with love for the music community. If this platform has
                        helped you find a collaborator or finish a song, consider helping us keep the music going.
                    </p>

                    <button
                        onClick={() => router.push("/donate")}
                        className="inline-flex items-center gap-2 px-7 sm:px-8 py-3.5 sm:py-4 bg-white text-amber-700 font-bold rounded-xl hover:bg-amber-50 transition-all shadow-lg text-sm sm:text-base active:scale-[0.98]"
                    >
                        Donate & Support Us
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                </div>
            </motion.div>
        </section>
    );
}
