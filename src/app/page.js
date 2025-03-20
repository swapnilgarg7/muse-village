"use client"
import { texts } from "@/constants/texts";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import PricingSection from "@/components/PricingSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-main">
      <main className="container mx-auto px-4 py-8">
        <Hero t={texts.hero} />
        <Features t={texts.features} />
        <PricingSection t={texts.pricing} />
      </main>
    </div>
  );
}
