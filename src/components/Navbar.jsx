"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useAuth } from "../../firebase/auth";
import { useRouter } from "next/navigation";
const Navbar = () => {
  const router = useRouter();

  const { authUser, isLoading, signOut } = useAuth();
  useEffect(() => {
    if (!isLoading && !authUser) {
      router.push("/");
    }
  }, [isLoading, authUser]);

  const handleSignIn = () => {
    router.push("/login");
  }
  const handleProfile = () => {
    router.push("/profile");
  };


  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-amber-100">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="text-2xl font-bold text-amber-900">
          Muse Village
        </Link>
        <div className="flex items-center gap-4">
          
            {!authUser && (      
                <Link href="/login" className="flex items-center gap-2 px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors">
                  Register
                </Link>
            )}
            {authUser && (      
                <Link href="/profile" className="flex items-center gap-2 px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors">
                  Profile
                </Link>
            )}
            {authUser && (      
                <button
                className="flex items-center gap-2 px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors"
                onClick={()=>{
                  signOut();
                }}
              >
                Logout
              </button>
            )}
        </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
