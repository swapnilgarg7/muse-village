"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function Navbar() {
    const router = useRouter();
    const handleSignIn=()=>{
        router.push("/login");
    }

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-amber-100">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-amber-900">
          Muse Village
        </Link>
        <div className="flex items-center gap-4">
          
            <button
              onClick={handleSignIn}
              className="flex items-center gap-2 px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors"
            >
              Sign In
            </button>
          
        </div>
      </div>
    </nav>
  );
}
