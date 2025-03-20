"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";


export default function Hero({ t }) {
    const router = useRouter();

    const handleSignIn = () => {
        router.push("/login");
    }
  return (
    <section className="py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold text-amber-900 mb-6">
            {t.title}
          </h1>
            <h2 className="text-3xl font-semibold text-amber-800 mb-2">
                {t.subTitle}
            </h2>
          <p className="text-xl text-amber-800 mb-8">
            {t.description}
          </p>
          <button
          onClick={handleSignIn}
           className="px-8 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors">
            {t.cta}
          </button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative h-[500px]"
        >
          <Image
            src="https://images.unsplash.com/photo-1511379938547-c1f69419868d"
            alt="Music Studio"
            fill
            className="object-cover rounded-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
}
