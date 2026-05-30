"use client";

import { FcGoogle } from "react-icons/fc";
import { useLogin } from "./hook/useLogin";
import { useAuth } from "~/firebase/auth";
import { useEffect } from "react";
import Loading from "@/components/loader/Loading";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Music2, Users, Globe, Zap } from "lucide-react";

const perks = [
  { icon: Users, text: "Connect with 100+ musicians globally" },
  { icon: Globe, text: "Collaborate across 120+ countries" },
  { icon: Zap, text: "Post & discover gigs instantly" },
];

const Login = () => {
  const { googleSignIn } = useLogin();
  const { authUser, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && authUser) {
      router.push("/dashboard");
    }
  }, [isLoading, authUser, router]);

  if (isLoading || (!isLoading && authUser)) return <Loading />;

  return (
    <main className="flex min-h-[calc(100vh-64px)]">
      {/* Left: Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-amber-700 via-amber-600 to-orange-500 flex-col justify-center items-center p-12 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-800/30 rounded-full blur-2xl" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-orange-600/30 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full" />

        {/* Musical note pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center max-w-md"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-8 shadow-lg">
            <Music2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 leading-tight">
            Muse Village
          </h1>
          <p className="text-amber-100 text-lg mb-10 leading-relaxed">
            Where musicians meet, collaborate, and create music that moves the world.
          </p>

          <div className="space-y-4">
            {perks.map(({ icon: Icon, text }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3 text-left"
              >
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-amber-100 text-sm">{text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gradient-to-br from-amber-50/60 to-orange-50/40">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl flex items-center justify-center shadow">
              <Music2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">Muse Village</span>
          </div>

          <div className="bg-white rounded-2xl shadow-amber-lg p-8 border border-amber-100/60">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-amber-900 mb-1.5">Welcome back</h2>
              <p className="text-amber-600 text-sm">Sign in to discover and post music gigs</p>
            </div>

            <button
              type="button"
              onClick={googleSignIn}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-6 bg-white border-2 border-amber-200 text-amber-900 rounded-xl hover:border-amber-400 hover:bg-amber-50 active:scale-[0.98] transition-all font-semibold shadow-sm group"
            >
              <FcGoogle size={22} className="shrink-0" />
              <span>Continue with Google</span>
            </button>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-amber-100" />
              <span className="text-amber-400 text-xs font-medium">OR</span>
              <div className="flex-1 h-px bg-amber-100" />
            </div>

            <div className="mt-5 p-4 bg-amber-50 rounded-xl text-center">
              <p className="text-amber-700 text-sm leading-relaxed">
                By continuing, you agree to our community guidelines and join 100+ musicians worldwide.
              </p>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-amber-500">
            Free forever. No credit card required.
          </p>
        </motion.div>
      </div>
    </main>
  );
};

export default Login;
