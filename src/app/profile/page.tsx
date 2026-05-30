"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { db } from "~/firebase/firebase";
import { useToastMessages } from "@/components/message/useToastMessages";
import { useAuth } from "~/firebase/auth";
import Loading from "@/components/loader/Loading";
import { PlusCircle, Briefcase, X, Calendar, Music, ChevronDown } from "lucide-react";

interface UserData {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  completedGigs: number;
  bio?: string;
}

interface Gig {
  id: string;
  title: string;
  description: string;
  createdAt: { toDate: () => Date } | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const { Success, Warn } = useToastMessages();
  const { authUser, isLoading } = useAuth();

  const [user, setUser] = useState<UserData | null>(null);
  const [userGigs, setUserGigs] = useState<Gig[]>([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const [showGigForm, setShowGigForm] = useState(false);

  const [gigTitle, setGigTitle] = useState("");
  const [gigDescription, setGigDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && !authUser) {
      router.push("/login");
      return;
    }
    if (!isLoading && authUser) {
      const fetchUserData = async () => {
        try {
          const userId = authUser.id;
          if (!userId) {
            setProfileLoading(false);
            return;
          }

          const userDoc = await getDoc(doc(db, "users", userId));
          const userData: UserData = {
            uid: userId,
            email: authUser.email || "",
            displayName: authUser.name || "",
            photoURL: authUser.photoURL || "",
            completedGigs: 0,
          };

          if (userDoc.exists()) {
            const fd = userDoc.data();
            Object.assign(userData, {
              displayName: fd.displayName || authUser.name || "",
              email: fd.email || authUser.email || "",
              photoURL: fd.photoURL || authUser.photoURL || "",
              completedGigs: fd.completedGigs || 0,
              bio: fd.bio || "",
            });
          }

          setUser(userData);
          await fetchUserGigs(userId);
        } catch (err) {
          console.error(err);
          Warn("Failed to load profile data");
        } finally {
          setProfileLoading(false);
        }
      };
      fetchUserData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, authUser]);

  const fetchUserGigs = async (userId: string) => {
    try {
      const snap = await getDocs(
        query(collection(db, "gigs"), where("userId", "==", userId), orderBy("createdAt", "desc"))
      );
      const gigs: Gig[] = [];
      snap.forEach((d) => gigs.push({ id: d.id, ...(d.data() as Omit<Gig, "id">) }));
      setUserGigs(gigs);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddGig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gigTitle || !gigDescription) {
      Warn("Please fill all the fields");
      return;
    }
    if (!authUser?.id) {
      Warn("You must be logged in to create a gig");
      return;
    }
    setSubmitting(true);
    try {
      const gigData = {
        title: gigTitle,
        description: gigDescription,
        userId: authUser.id,
        username: user?.displayName || authUser?.name || authUser?.email || "Unknown",
        createdAt: new Date(),
      };
      const ref = await addDoc(collection(db, "gigs"), gigData);
      setUserGigs([{ id: ref.id, ...(gigData as unknown as Omit<Gig, "id">) }, ...userGigs]);
      setGigTitle("");
      setGigDescription("");
      setShowGigForm(false);
      Success("Gig published!");
    } catch (err) {
      console.error(err);
      Warn("Failed to publish gig");
    } finally {
      setSubmitting(false);
    }
  };

  const getInitial = (str?: string | null) =>
    str && str.length > 0 ? str[0].toUpperCase() : "U";

  const formatDate = (val: Gig["createdAt"]) => {
    try {
      if (!val) return "";
      if (typeof (val as { toDate?: () => Date }).toDate === "function") {
        return new Date((val as { toDate: () => Date }).toDate()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      }
      return new Date(val as unknown as string).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return "";
    }
  };

  if (isLoading || profileLoading) return <Loading />;
  if (!authUser) return null;

  return (
    <section className="min-h-[calc(100vh-64px)] bg-gradient-main py-6 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-amber border border-amber-100/60 overflow-hidden mb-6">
            {/* Cover */}
            <div className="relative h-32 sm:h-40 bg-gradient-to-br from-amber-500 via-amber-600 to-orange-500 overflow-hidden">
              <div className="absolute inset-0 opacity-20"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")` }}
              />
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-amber-400/30 rounded-full" />
            </div>

            {/* Avatar */}
            <div className="px-5 sm:px-8">
              <div className="relative -mt-10 sm:-mt-12 mb-4 w-fit">
                <div className="h-20 w-20 sm:h-24 sm:w-24 bg-white rounded-full border-4 border-white overflow-hidden shadow-amber">
                  {user?.photoURL ? (
                    <Image src={user.photoURL} alt="Profile" width={96} height={96} className="object-cover w-full h-full" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-600 text-white text-2xl font-bold">
                      {getInitial(user?.displayName) || getInitial(user?.email)}
                    </div>
                  )}
                </div>
              </div>

              <div className="pb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-amber-900">
                  {user?.displayName || authUser?.name || authUser?.email || "User"}
                </h1>
                {user?.email && (
                  <p className="text-amber-500 text-sm mt-0.5">{user.email}</p>
                )}

                {/* Stats row */}
                <div className="flex gap-6 mt-5 pt-5 border-t border-amber-100">
                  <div className="text-center">
                    <span className="text-2xl font-bold text-amber-900">{userGigs.length}</span>
                    <p className="text-amber-500 text-xs mt-0.5">Gigs Posted</p>
                  </div>
                  <div className="h-8 w-px bg-amber-100 self-center" />
                  {/* <div className="text-center">
                    <span className="text-2xl font-bold text-amber-900">{user?.completedGigs || 0}</span>
                    <p className="text-amber-500 text-xs mt-0.5">Completed</p>
                  </div> */}
                </div>
              </div>
            </div>
          </div>

          {/* Gigs Section */}
          <div className="bg-white rounded-2xl shadow-amber border border-amber-100/60 overflow-hidden">
            {/* Section Header */}
            <div className="flex items-center justify-between px-5 sm:px-8 py-5 border-b border-amber-100">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-amber-600" />
                <h2 className="text-lg font-bold text-amber-900">My Gigs</h2>
              </div>
              <button
                onClick={() => setShowGigForm(!showGigForm)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
                  showGigForm
                    ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                    : "bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800 shadow-sm"
                }`}
              >
                {showGigForm ? (
                  <><X className="w-4 h-4" /> Cancel</>
                ) : (
                  <><PlusCircle className="w-4 h-4" /> Add Gig</>
                )}
              </button>
            </div>

            {/* Gig Form */}
            <AnimatePresence>
              {showGigForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="border-b border-amber-100 overflow-hidden"
                >
                  <div className="px-5 sm:px-8 py-6 bg-amber-50/60">
                    <h3 className="text-base font-semibold text-amber-900 mb-4 flex items-center gap-2">
                      <Music className="w-4 h-4 text-amber-600" />
                      Create a New Gig
                    </h3>
                    <form onSubmit={handleAddGig} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-amber-800 mb-1.5">Gig Title</label>
                        <input
                          type="text"
                          value={gigTitle}
                          onChange={(e) => setGigTitle(e.target.value)}
                          placeholder="e.g. Guitar Solo Recording, Studio Session"
                          className="w-full px-4 py-2.5 border border-amber-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm text-amber-900 placeholder-amber-300 transition-all"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-amber-800 mb-1.5">Description</label>
                        <textarea
                          value={gigDescription}
                          onChange={(e) => setGigDescription(e.target.value)}
                          placeholder="Describe what you're looking for, your style, requirements..."
                          className="w-full px-4 py-2.5 border border-amber-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent min-h-[100px] text-sm text-amber-900 placeholder-amber-300 transition-all resize-none"
                          required
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => setShowGigForm(false)}
                          className="px-5 py-2.5 border border-amber-200 text-amber-700 rounded-xl hover:bg-amber-50 transition-colors text-sm font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all font-semibold text-sm shadow-sm disabled:opacity-50 active:scale-[0.98]"
                        >
                          {submitting ? "Publishing..." : "Publish Gig"}
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Gig List */}
            <div className="px-5 sm:px-8 py-5">
              {userGigs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Music className="w-6 h-6 text-amber-400" />
                  </div>
                  <p className="text-amber-700 font-medium text-sm mb-1">No gigs posted yet</p>
                  <p className="text-amber-400 text-xs mb-4">Share your musical skills with the community</p>
                  <button
                    onClick={() => setShowGigForm(true)}
                    className="px-5 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors text-sm font-semibold active:scale-95"
                  >
                    Create Your First Gig
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {userGigs.map((gig, i) => (
                    <motion.div
                      key={gig.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="group bg-amber-50/60 border border-amber-100 rounded-xl p-4 hover:border-amber-200 hover:bg-amber-50 transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold text-amber-900 flex-1">{gig.title}</h3>
                        <ChevronDown className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      </div>
                      <p className="mt-1.5 text-amber-600 text-xs leading-relaxed line-clamp-2">{gig.description}</p>
                      <div className="mt-2.5 flex items-center gap-1 text-[11px] text-amber-400">
                        <Calendar className="w-3 h-3" />
                        {formatDate(gig.createdAt)}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
