"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "~/firebase/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth as firebaseAuth } from "~/firebase/firebase";
import { MessageSquare, User, Briefcase, LogOut, Menu, X } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { authUser, signOut } = useAuth();

  const isLanding = pathname === "/";

  const [firebaseUid, setFirebaseUid] = useState<string | null>(null);
  const [totalUnread, setTotalUnread] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(firebaseAuth, (u) => setFirebaseUid(u?.uid ?? null));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!firebaseUid) { setTotalUnread(0); return; }
    const q = query(
      collection(db, "conversations"),
      where("participants", "array-contains", firebaseUid)
    );
    const unsub = onSnapshot(q, (snap) => {
      let total = 0;
      snap.forEach((d) => {
        const data = d.data();
        total += (data.unreadCount?.[firebaseUid] as number) || 0;
      });
      setTotalUnread(total);
    }, () => {});
    return () => unsub();
  }, [firebaseUid]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navLinks = authUser && !isLanding ? [
    { href: "/dashboard", label: "Gigs", icon: Briefcase },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/messages", label: "Messages", icon: MessageSquare, badge: totalUnread },
  ] : [];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <nav className={`sticky top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl shadow-amber border-b border-amber-100/80"
          : "bg-white/80 backdrop-blur-md border-b border-amber-100/60"
      }`}>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/logo.png"
              alt="Muse Village"
              width={140}
              height={40}
              className="h-10 w-auto object-contain group-hover:opacity-90 transition-opacity"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon, badge }) => (
              <Link
                key={href}
                href={href}
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(href)
                    ? "bg-amber-100 text-amber-900"
                    : "text-amber-700 hover:bg-amber-50 hover:text-amber-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
                {badge !== undefined && badge > 0 && (
                  <span className="absolute -top-1 -right-1 h-4.5 w-4.5 min-w-[18px] h-[18px] bg-amber-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm">
                    {badge > 9 ? "9+" : badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {authUser ? (
              <button
                onClick={signOut}
                className="flex items-center gap-1.5 px-4 py-2 border border-amber-200 text-amber-700 rounded-lg hover:bg-amber-50 hover:border-amber-300 transition-all text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => router.push("/login")}
                className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all text-sm font-semibold shadow-sm shadow-amber-200 hover:shadow-amber-300 active:scale-95"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-amber-700 hover:text-amber-900 hover:bg-amber-50 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden sticky top-16 z-40 bg-white/95 backdrop-blur-xl border-b border-amber-100 shadow-amber overflow-hidden"
          >
            <div className="container mx-auto px-4 py-3 flex flex-col gap-1">
              {navLinks.map(({ href, label, icon: Icon, badge }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive(href)
                      ? "bg-amber-100 text-amber-900"
                      : "text-amber-700 hover:bg-amber-50 hover:text-amber-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                  {badge !== undefined && badge > 0 && (
                    <span className="ml-auto h-5 min-w-[20px] bg-amber-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1.5">
                      {badge > 9 ? "9+" : badge}
                    </span>
                  )}
                </Link>
              ))}

              <div className="pt-2 mt-1 border-t border-amber-100">
                {authUser ? (
                  <button
                    onClick={signOut}
                    className="w-full flex items-center gap-3 px-4 py-3 text-amber-700 hover:bg-amber-50 rounded-xl text-sm font-medium transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                ) : (
                  <button
                    onClick={() => router.push("/login")}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl text-sm font-semibold shadow-sm"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
