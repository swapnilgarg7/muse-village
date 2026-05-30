"use client";

import { useState } from "react";
import { Heart, Copy, Check, ArrowLeft, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

// TODO: Replace with your Revolut link (e.g. https://revolut.me/yourname)
const REVOLUT_LINK = "https://revolut.me/vesselrn9s";

const BANK_DETAILS = {
    accountHolder: "Gauranga Yoga Institute",
    iban: "G21UBBS80021043623850",
    bic: "UBBSBGSF",
    bank: "UBB - United Bulgarian bank",
    currency: "EUR",
};

function CopyField({ label, value }: { label: string; value: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(value.replace(/\s/g, ""));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-amber-50 border border-amber-100 rounded-xl px-5 py-4">
            <p className="text-xs text-amber-500 font-semibold uppercase tracking-widest mb-1">
                {label}
            </p>
            <div className="flex items-center justify-between gap-4">
                <p className="text-amber-900 font-mono font-semibold text-sm break-all">{value}</p>
                <button
                    onClick={handleCopy}
                    className="flex-shrink-0 p-2 rounded-lg hover:bg-amber-100 transition-colors text-amber-700"
                    title="Copy"
                >
                    {copied ? (
                        <Check className="w-4 h-4 text-green-600" />
                    ) : (
                        <Copy className="w-4 h-4" />
                    )}
                </button>
            </div>
        </div>
    );
}

export default function DonatePage() {
    return (
        <div className="min-h-screen bg-gradient-main">
            <main className="container mx-auto px-4 py-12 max-w-2xl">
                {/* Back link */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-900 transition-colors text-sm font-medium mb-10"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Muse Village
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-700 rounded-2xl mb-6 shadow-lg shadow-amber-200">
                            <Heart className="w-8 h-8 text-white fill-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-amber-900 mb-3">Support Muse Village</h1>
                        <p className="text-amber-700 text-lg leading-relaxed">
                            Muse Village is a passion project kept alive by the music community. Your
                            donation directly helps with server costs, new features, and keeping the
                            platform free for everyone.
                        </p>
                    </div>

                

                    {/* Revolut */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-50 mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-lg font-bold text-amber-900">Revolut</h2>
                            <span className="text-xs font-semibold px-2.5 py-1 bg-violet-100 text-violet-700 rounded-full">
                                Fastest option
                            </span>
                        </div>
                        <p className="text-amber-600 text-sm mb-5">
                            Send any amount instantly via Revolut. No fees, no fuss.
                        </p>
                        <a
                            href={REVOLUT_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-colors text-sm"
                        >
                            Open in Revolut
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>

                    {/* Bank transfer details */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-50 mb-8">
                        <h2 className="text-lg font-bold text-amber-900 mb-2">
                            International Bank Transfer
                        </h2>
                        <p className="text-amber-600 text-sm mb-5">
                            Transfer directly to our account, any amount, any currency. Use the copy
                            buttons below to grab the details.
                        </p>

                        <div className="space-y-3">
                            <CopyField label="Account Holder" value={BANK_DETAILS.accountHolder} />
                            <CopyField label="IBAN" value={BANK_DETAILS.iban} />
                            <CopyField label="BIC / SWIFT" value={BANK_DETAILS.bic} />
                            <CopyField label="Bank" value={BANK_DETAILS.bank} />
                            <CopyField label="Currency" value={BANK_DETAILS.currency} />
                        </div>
                    </div>

                    {/* Thank you note */}
                    <div className="text-center bg-amber-700 rounded-2xl px-8 py-8 text-white">
                        <p className="text-xl font-bold mb-2">Thank you for your generosity</p>
                        <p className="text-amber-100 text-sm leading-relaxed">
                            Every contribution, big or small, means the world. You&apos;re helping
                            musicians find each other and create something beautiful.
                        </p>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
