"use client";

import { motion } from "framer-motion";
import { UserCircle, Search, Mic } from "lucide-react";

const steps = [
    {
        icon: UserCircle,
        step: "01",
        title: "Build Your Profile",
        description:
            "Sign up with Google, create your musician profile, list your instruments, genres, and what you bring to a collaboration.",
    },
    {
        icon: Search,
        step: "02",
        title: "Discover & Connect",
        description:
            "Browse musicians by genre, skill, or location. Send a collab request and start a conversation with the right person.",
    },
    {
        icon: Mic,
        step: "03",
        title: "Create Together",
        description:
            "Work in real time or async. Share tracks, ideas, and feedback in one place. Ship your music, together.",
    },
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-20 sm:py-24">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12 sm:mb-16"
            >
                <span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                    Simple process
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-amber-900">How Muse Village Works</h2>
                <p className="text-amber-600/80 mt-3 max-w-md mx-auto text-sm sm:text-base">
                    Three simple steps to your next musical collaboration.
                </p>
            </motion.div>

            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                {/* Connecting line — desktop only */}
                <div className="hidden md:block absolute top-10 left-[16.5%] right-[16.5%] h-px border-t-2 border-dashed border-amber-200 z-0" />

                {steps.map((step, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.15 }}
                        className="relative z-10 flex flex-col items-center text-center"
                    >
                        <div className="w-20 h-20 bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-amber-200/70 hover:scale-105 transition-transform duration-300">
                            <step.icon className="w-9 h-9 text-white" />
                        </div>
                        <span className="inline-block px-2.5 py-0.5 bg-amber-100 text-amber-600 text-[10px] font-bold tracking-widest uppercase rounded-full mb-3">
                            Step {step.step}
                        </span>
                        <h3 className="text-lg sm:text-xl font-bold text-amber-900 mb-3">{step.title}</h3>
                        <p className="text-amber-600/80 leading-relaxed max-w-xs text-sm sm:text-base">{step.description}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
