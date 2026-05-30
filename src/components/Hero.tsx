"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Music2, ArrowRight, Star } from "lucide-react";

interface HeroProps {
    t: {
        title: string;
        subTitle: string;
        description: string;
        cta: string;
    };
}

export default function Hero({ t }: HeroProps) {
    return (
        <section className="py-16 sm:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Left: Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="order-2 lg:order-1"
                >
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100 text-amber-800 rounded-full text-xs sm:text-sm font-semibold mb-6 border border-amber-200/60"
                    >
                        <Music2 className="w-3.5 h-3.5" />
                        Open for all musicians worldwide
                    </motion.div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-amber-900 leading-tight mb-4">
                        {t.title}
                    </h1>
                    <p className="text-xl sm:text-2xl font-semibold text-amber-700 mb-4">{t.subTitle}</p>
                    <p className="text-base sm:text-lg text-amber-700/80 mb-8 sm:mb-10 max-w-lg leading-relaxed">
                        {t.description}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <Link
                            href="/login"
                            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl text-sm sm:text-base font-semibold hover:from-amber-700 hover:to-amber-800 transition-all shadow-md shadow-amber-200 hover:shadow-amber-300 active:scale-[0.98]"
                        >
                            {t.cta}
                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Link>
                        <a
                            href="#how-it-works"
                            className="inline-flex items-center justify-center px-7 py-3.5 border-2 border-amber-300 text-amber-700 rounded-xl text-sm sm:text-base font-semibold hover:bg-amber-50 hover:border-amber-400 transition-all"
                        >
                            See How It Works
                        </a>
                    </div>

                    {/* Social proof */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-8 flex items-center gap-3"
                    >
                        <div className="flex -space-x-2">
                            {["AM", "PN", "LS", "RK"].map((initials, i) => (
                                <div
                                    key={i}
                                    className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold"
                                >
                                    {initials}
                                </div>
                            ))}
                        </div>
                        <div>
                            <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                                ))}
                            </div>
                            <p className="text-xs text-amber-600 mt-0.5">Loved by 100+ musicians</p>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Right: Image */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="relative h-72 sm:h-[400px] lg:h-[480px] order-1 lg:order-2"
                >
                    <Image
                        src="https://images.unsplash.com/photo-1511379938547-c1f69419868d"
                        alt="Music Studio"
                        fill
                        className="object-cover rounded-2xl sm:rounded-3xl shadow-2xl"
                        priority
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-t from-amber-900/20 to-transparent" />

                    {/* Floating badge - top right */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="absolute -top-4 -right-2 sm:-top-6 sm:-right-6 bg-white rounded-2xl shadow-xl px-4 py-3 border border-amber-100"
                    >
                        <p className="text-[10px] sm:text-xs text-amber-500 font-medium mb-0.5">Genres covered</p>
                        <p className="text-xl sm:text-2xl font-bold text-amber-900">50+</p>
                    </motion.div>

                    {/* Floating badge - bottom left */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="absolute -bottom-4 -left-2 sm:-bottom-6 sm:-left-6 bg-white rounded-2xl shadow-xl px-4 py-3 border border-amber-100"
                    >
                        <p className="text-[10px] sm:text-xs text-amber-500 font-medium mb-0.5">Countries</p>
                        <p className="text-xl sm:text-2xl font-bold text-amber-900">120+</p>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
