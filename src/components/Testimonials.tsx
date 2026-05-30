"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
    {
        name: "Arjun Mehta",
        role: "Guitarist & Producer",
        avatar: "AM",
        color: "from-amber-500 to-orange-500",
        quote:
            "I found my current bandmates entirely through Muse Village. What started as a collab request turned into a full EP. The platform just gets what musicians need.",
    },
    {
        name: "Priya Nair",
        role: "Vocalist & Songwriter",
        avatar: "PN",
        color: "from-orange-500 to-amber-600",
        quote:
            "I was stuck on a track for weeks. Posted on Muse Village, and within two days a bassist from Bangalore reached out. We finished it in a weekend. Game changer.",
    },
    {
        name: "Leo Santos",
        role: "Jazz Drummer",
        avatar: "LS",
        color: "from-amber-600 to-yellow-500",
        quote:
            "The musician profiles here are actually detailed and useful. You can tell someone put thought into making this for real musicians, not just another social app.",
    },
];

export default function Testimonials() {
    return (
        <section className="py-20 sm:py-24">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12 sm:mb-16"
            >
                <span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                    Stories
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-amber-900">Musicians love Muse Village</h2>
                <p className="text-amber-600/80 mt-3 max-w-md mx-auto text-sm sm:text-base">
                    Real stories from real musicians who found their sound together.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
                {testimonials.map((t, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.12 }}
                        className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-amber-50 hover:border-amber-200/60 hover:shadow-amber flex flex-col gap-4 transition-all duration-300 group"
                    >
                        {/* Quote icon */}
                        <Quote className="w-6 h-6 text-amber-300 group-hover:text-amber-400 transition-colors" />

                        {/* Stars */}
                        <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, j) => (
                                <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            ))}
                        </div>

                        <p className="text-amber-800 leading-relaxed text-sm flex-1">
                            &ldquo;{t.quote}&rdquo;
                        </p>

                        <div className="flex items-center gap-3 pt-3 border-t border-amber-50">
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm`}>
                                {t.avatar}
                            </div>
                            <div>
                                <p className="font-semibold text-amber-900 text-sm">{t.name}</p>
                                <p className="text-amber-500 text-xs">{t.role}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
