"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { db } from "~/firebase/firebase";
import Link from "next/link";
import { useToastMessages } from "@/components/message/useToastMessages";
import { useAuth } from "~/firebase/auth";
import GigDetailModal from "@/components/GigDetailModal";
import { auth as firebaseAuth } from "~/firebase/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { PlusCircle, Music, Calendar } from "lucide-react";

interface Gig {
  id: string;
  title: string;
  description: string;
  userId: string;
  username: string;
  createdAt: { toDate: () => Date } | null;
  oneTimeOnly?: boolean;
  contactInstructions?: string;
}

const gradients = [
  "from-amber-500 to-orange-500",
  "from-amber-600 to-yellow-500",
  "from-orange-500 to-amber-600",
  "from-yellow-500 to-amber-500",
  "from-amber-400 to-orange-600",
  "from-orange-400 to-amber-700",
];

function getGradient(id: string) {
  const sum = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return gradients[sum % gradients.length];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function PublicGigsPage() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);

  const { Warn } = useToastMessages();
  const { authUser } = useAuth();

  useEffect(() => {
    const unsub = onAuthStateChanged(firebaseAuth, (u) => setFirebaseUser(u));
    return () => unsub();
  }, []);

  const fetchGigs = useCallback(async () => {
    try {
      const snap = await getDocs(query(collection(db, "gigs"), orderBy("createdAt", "desc"), limit(50)));
      const list: Gig[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...(d.data() as Omit<Gig, "id">) }));
      setGigs(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchGigs(); }, [fetchGigs]);

  const handleContinueClick = (gig: Gig) => {
    if (!firebaseUser) {
      Warn("Please login to continue with this gig");
      return;
    }
    if (gig.userId === firebaseUser.uid) {
      Warn("You cannot select your own gig");
      return;
    }
    setSelectedGig(gig);
    setShowModal(true);
  };

  // authUser reference to suppress unused warning
  void authUser;

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-64px)] gap-3">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-amber-100" />
          <div className="absolute inset-0 rounded-full border-4 border-t-amber-600 animate-spin" />
        </div>
        <p className="text-amber-600 text-sm font-medium animate-pulse">Loading gigs...</p>
      </div>
    );
  }

  return (
    <section className="min-h-[calc(100vh-64px)] bg-gradient-main py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex items-end justify-between mb-8">
            <div>
              {/* <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-amber-600 text-sm font-semibold uppercase tracking-widest">Live opportunities</span>
              </div> */}
              <h1 className="text-4xl font-bold text-amber-900 leading-tight">Available Gigs</h1>
              {gigs.length > 0 && (
                <p className="text-amber-600/80 text-sm mt-1">{gigs.length} gig{gigs.length !== 1 ? "s" : ""} posted by musicians</p>
              )}
            </div>
            <Link href="/profile">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all font-semibold shadow-sm shadow-amber-200 hover:shadow-md active:scale-95 text-sm">
                <PlusCircle className="w-4 h-4" />
                Post a Gig
              </button>
            </Link>
          </div>

          {/* Grid */}
          {gigs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-24 bg-white/60 backdrop-blur rounded-3xl border border-amber-100 shadow-sm"
            >
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-4">
                <Music className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-2">No gigs yet</h3>
              <p className="text-amber-600 text-sm mb-6 max-w-xs text-center">
                Be the first to post a gig and connect with talented musicians worldwide.
              </p>
              <Link href="/profile">
                <button className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all font-semibold shadow-sm text-sm active:scale-95">
                  Create the First Gig
                </button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {gigs.map((gig, i) => (
                <motion.div
                  key={gig.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.05, 0.3) }}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-md border border-amber-50 hover:border-amber-200/60 overflow-hidden transition-all duration-300 flex flex-col"
                >
                  {/* Card Header */}
                  <div className={`bg-gradient-to-br ${getGradient(gig.id)} h-24 flex items-end p-4 relative overflow-hidden`}>
                    <div className="absolute inset-0 opacity-10"
                      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.8' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")` }}
                    />
                    <h3 className="text-white text-base font-bold leading-tight line-clamp-2 relative z-10 drop-shadow-sm">
                      {gig.title}
                    </h3>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col">
                    <p className="text-amber-700/80 text-sm leading-relaxed line-clamp-3 flex-1 mb-4">
                      {gig.description}
                    </p>

                    <div className="flex items-center gap-2 mb-4 pt-3 border-t border-amber-50">
                      <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-xs font-bold shrink-0">
                        {getInitials(gig.username || "U")}
                      </div>
                      <span className="text-sm text-amber-800 font-medium truncate">{gig.username}</span>
                      <div className="ml-auto flex items-center gap-1 text-xs text-amber-400 shrink-0">
                        <Calendar className="w-3 h-3" />
                        {gig.createdAt ? new Date(gig.createdAt.toDate()).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}
                      </div>
                    </div>

                    {firebaseUser && gig.userId === firebaseUser.uid ? (
                      <div className="w-full py-2.5 text-center text-amber-400 text-sm font-medium border border-dashed border-amber-200 rounded-xl">
                        Your Gig
                      </div>
                    ) : (
                      <button
                        onClick={() => handleContinueClick(gig)}
                        className="w-full py-2.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl hover:bg-amber-600 hover:text-white hover:border-amber-600 transition-all text-sm font-semibold active:scale-[0.98]"
                      >
                        Get in Touch
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {showModal && selectedGig && (
        <GigDetailModal
          gig={selectedGig}
          user={firebaseUser}
          onClose={() => { setShowModal(false); setSelectedGig(null); }}
          refreshGigs={fetchGigs}
        />
      )}
    </section>
  );
}
