"use client";

import { motion } from "framer-motion";
import { Globe, Headphones, ShieldCheck, Zap, Users, Music } from "lucide-react";

const features = [
    {
        icon: Users,
        title: "Musician Discovery",
        description:
            "Find the perfect collaborator by browsing profiles filtered by instrument, genre, experience level, and location.",
        color: "from-amber-500 to-orange-500",
        bg: "bg-amber-50",
        iconColor: "text-amber-600",
    },
    {
        icon: Music,
        title: "All Genres Welcome",
        description:
            "From jazz and classical to hip-hop and electronic. Muse Village is home to musicians across every style.",
        color: "from-orange-500 to-amber-500",
        bg: "bg-orange-50",
        iconColor: "text-orange-600",
    },
    {
        icon: Zap,
        title: "Instant Collaboration",
        description:
            "Send and receive collab requests in seconds. No back-and-forth email chains, just direct creative connections.",
        color: "from-yellow-500 to-amber-500",
        bg: "bg-yellow-50",
        iconColor: "text-yellow-600",
    },
    {
        icon: Globe,
        title: "Worldwide Community",
        description:
            "Distance is no barrier. Connect with musicians in your city or across the globe and create without limits.",
        color: "from-amber-600 to-orange-600",
        bg: "bg-amber-50",
        iconColor: "text-amber-600",
    },
    {
        icon: ShieldCheck,
        title: "Verified Profiles",
        description:
            "Every musician signs up with a real account. Profiles are transparent so you always know who you're working with.",
        color: "from-amber-500 to-yellow-500",
        bg: "bg-yellow-50",
        iconColor: "text-yellow-600",
    },
    {
        icon: Headphones,
        title: "Built for Musicians",
        description:
            "Every feature is designed with the creative workflow in mind, from profile setup to sharing your finished track.",
        color: "from-orange-500 to-amber-600",
        bg: "bg-orange-50",
        iconColor: "text-orange-600",
    },
];

export default function Features() {
    return (
        <section className="py-20 sm:py-24">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12 sm:mb-16"
            >
                <span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                    Why us
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-amber-900">
                    Everything you need to collaborate
                </h2>
                <p className="text-amber-600/80 mt-3 max-w-md mx-auto text-sm sm:text-base">
                    Tools built around the way musicians actually work — from first hello to finished track.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {features.map((feature, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 }}
                        className="group p-6 sm:p-7 bg-white rounded-2xl shadow-sm hover:shadow-amber border border-amber-50 hover:border-amber-200/60 transition-all duration-300"
                    >
                        <div className={`w-12 h-12 ${feature.bg} group-hover:scale-110 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 shadow-sm`}>
                            <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-amber-900 mb-2">{feature.title}</h3>
                        <p className="text-amber-600/80 text-sm leading-relaxed">{feature.description}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
