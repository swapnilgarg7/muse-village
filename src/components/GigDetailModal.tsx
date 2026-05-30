"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "~/firebase/firebase";
import { useToastMessages } from "@/components/message/useToastMessages";
import { User } from "firebase/auth";
import { X, MessageSquare, Music, ArrowRight, LogIn } from "lucide-react";

interface Gig {
  id: string;
  title: string;
  description: string;
  userId: string;
  username: string;
  contactInstructions?: string;
}

interface Props {
  gig: Gig;
  user: User | null;
  onClose: () => void;
  refreshGigs: () => void;
}

export default function GigDetailModal({ gig, user, onClose }: Props) {
  const router = useRouter();
  const { Error: ShowError } = useToastMessages();
  const [isLoading, setIsLoading] = useState(false);

  if (!user || !user.uid || user.uid === gig.userId) {
    return (
      <AnimatePresence>
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="bg-white rounded-2xl shadow-2xl w-full sm:max-w-md p-6 sm:p-8"
          >
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-7 h-7 text-amber-600" />
              </div>
              <h2 className="text-xl font-bold text-amber-900 mb-2">Sign in required</h2>
              <p className="text-amber-600 text-sm">You need to be logged in to connect with this musician.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 border border-amber-200 text-amber-700 rounded-xl hover:bg-amber-50 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <Link href="/login" className="flex-1">
                <button className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all text-sm font-semibold">
                  Sign In
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  }

  const handleGetInTouch = async () => {
    setIsLoading(true);
    try {
      const convId = [user.uid, gig.userId].sort().join("_");
      const convRef = doc(db, "conversations", convId);
      const convSnap = await getDoc(convRef);

      if (!convSnap.exists()) {
        const [currentUserSnap, gigPosterSnap] = await Promise.all([
          getDoc(doc(db, "users", user.uid)),
          getDoc(doc(db, "users", gig.userId)),
        ]);
        const currentData = currentUserSnap.data() || {};
        const posterData = gigPosterSnap.data() || {};

        await setDoc(convRef, {
          participants: [user.uid, gig.userId],
          participantNames: {
            [user.uid]: currentData.displayName || user.displayName || user.email || "You",
            [gig.userId]: posterData.displayName || gig.username || "Musician",
          },
          participantEmails: {
            [user.uid]: currentData.email || user.email || "",
            [gig.userId]: posterData.email || "",
          },
          gigId: gig.id,
          gigTitle: gig.title,
          lastMessage: "",
          lastMessageAt: null,
          createdAt: new Date(),
          unreadCount: { [user.uid]: 0, [gig.userId]: 0 },
        });
      }

      router.push(`/messages?c=${convId}`);
    } catch (err) {
      console.error(err);
      ShowError("Failed to open conversation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.96 }}
        transition={{ duration: 0.25 }}
        className="bg-white rounded-2xl shadow-2xl w-full sm:max-w-md overflow-hidden"
      >
        {/* Modal Header */}
        <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-amber-100 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
              <Music className="w-5 h-5 text-amber-600" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-amber-900 leading-tight">{gig.title}</h2>
              <p className="text-amber-500 text-xs mt-0.5">By {gig.username}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-amber-400 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-5 sm:px-6 py-5">
          <p className="text-amber-700 text-sm leading-relaxed mb-5">{gig.description}</p>

          <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100 mb-5">
            <MessageSquare className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-amber-600 text-xs sm:text-sm leading-relaxed">
              Clicking &ldquo;Get in Touch&rdquo; will open a private message thread so you can discuss and collaborate directly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-amber-200 text-amber-700 rounded-xl hover:bg-amber-50 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleGetInTouch}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Opening...
                </>
              ) : (
                <>
                  Get in Touch
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
