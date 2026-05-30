"use client";

import { motion } from "framer-motion";
import { Users, Music, Headphones, Globe } from "lucide-react";

const stats = [
    { value: "100+", label: "Musicians", icon: Users },
    { value: "50+", label: "Genres", icon: Music },
    { value: "10K+", label: "Collaborations", icon: Headphones },
    { value: "120+", label: "Countries", icon: Globe },
];

export default function StatsBar() {
    return (
        <section className="py-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 }}
                        className="bg-white/80 backdrop-blur rounded-2xl px-5 py-5 text-center shadow-sm border border-amber-100 hover:border-amber-200 hover:shadow-amber transition-all duration-300 group"
                    >
                        <div className="w-9 h-9 bg-amber-100 group-hover:bg-amber-200 rounded-xl flex items-center justify-center mx-auto mb-3 transition-colors">
                            <stat.icon className="w-4.5 h-4.5 text-amber-600 w-[18px] h-[18px]" />
                        </div>
                        <p className="text-2xl sm:text-3xl font-bold text-amber-900 mb-1">{stat.value}</p>
                        <p className="text-xs sm:text-sm text-amber-500 font-medium">{stat.label}</p>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}
