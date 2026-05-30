"use client";
import { texts } from "~/constants/texts";
import Hero from "~/components/Hero";
import StatsBar from "~/components/StatsBar";
import HowItWorks from "~/components/HowItWorks";
import Features from "~/components/Features";
import Testimonials from "~/components/Testimonials";
import DonationSection from "~/components/DonationSection";
import Footer from "~/components/Footer";

export default function Home() {
    return (
        <div className="min-h-screen bg-mesh">
            <main className="container mx-auto px-4 sm:px-6">
                <Hero t={texts.hero} />
                <StatsBar />
                <HowItWorks />
                <Features />
                <DonationSection />
                <Footer />
            </main>
        </div>
    );
}
