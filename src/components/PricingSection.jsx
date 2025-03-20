"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Monthly",
    price: "$5",
    period: "per month",
    features: [
      "Access to all musicians",
      "Unlimited collaborations",
      "Point-based system",
    ]
  },
  {
    name: "Yearly",
    price: "$50",
    period: "per year",
    features: [
      "All monthly features",
      "Early access to new features"
    ],
    popular: true
  }
];

export default function PricingSection({ t }) {
  return (
    <section className="py-20">
      <h2 className="text-3xl font-bold text-amber-900 text-center mb-12">
        {t.title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-8 rounded-xl 
              bg-white text-amber-900
              }`}
          >
            {plan.popular && (
              <span className="inline-block px-3 py-1 text-xs font-medium bg-amber-600 text-white rounded-full mb-4">
                Most Popular
              </span>
            )}
            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className="text-sm opacity-80">{plan.period}</span>
            </div>
            <ul className="space-y-4">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center">
                  <Check className={`w-5 h-5 mr-2 text-amber-700
                    }`} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            {/* <button
              className={`mt-8 w-full py-3 rounded-lg transition-colors ${plan.popular
                ? "bg-white text-amber-700 hover:bg-amber-50"
                : "bg-amber-700 text-white hover:bg-amber-800"
                }`}
            >
              Get Started
            </button> */}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
