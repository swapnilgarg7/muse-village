"use client";

import { motion } from "framer-motion";
import { Music, Users, Award, DollarSign } from "lucide-react";

const features = [
  {
    icon: Music,
    title: "Diverse Musical Talents",
    description: "Connect with musicians across all genres and instruments.",
  },
  {
    icon: Users,
    title: "Easy Collaboration",
    description: "Work seamlessly with musicians worldwide on your projects.",
  },
  {
    icon: Award,
    title: "Quality Assured",
    description: "Verified musicians with professional experience.",
  },
  {
    icon: DollarSign,
    title: "Fair Compensation",
    description: "Transparent pricing and point-based collaboration system.",
  },
];

export default function Features({ t }) {
  return (
    <section className="py-20">
      <h2 className="text-3xl font-bold text-amber-900 text-center mb-12">
        {t.title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <feature.icon className="w-8 h-8 text-amber-700 mb-4" />
            <h3 className="text-xl font-semibold text-amber-900 mb-2">
              {feature.title}
            </h3>
            <p className="text-amber-700">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
