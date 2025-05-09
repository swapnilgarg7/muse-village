"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { db } from "../../firebase/firebase";
// Try to import the toast message hook with a try-catch in case it's not available
let useToastMessages;
try {
  useToastMessages = require("@/components/message/useToastMessages").useToastMessages;
} catch (e) {
  // If import fails, we'll use our fallback functions
  console.warn("Could not import useToastMessages, using fallbacks");
}
import Link from "next/link";
// Keep using AuthContext but add fallback handling
import { useAuth } from "@/context/AuthContext"; // Import your auth context
import { auth } from "../../firebase/firebase"; // Fallback direct import
import GigDetailModal from "@/components/GigDetailModal"; // Import the modal component we just created

export default function PublicGigsPage() {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGig, setSelectedGig] = useState(null);
  const [showModal, setShowModal] = useState(false);
  // Get toast functions, with fallbacks in case the hook isn't available
  const toastFunctions = useToastMessages ? useToastMessages() : {};
  const showWarning = toastFunctions.Warn || ((msg) => console.warn('Warning:', msg));
  // Try the context first, but have a fallback
  const [user, setUser] = useState(null);
  const authContext = typeof useAuth === 'function' ? useAuth() : null;
  
  useEffect(() => {
    // If context works, use it
    if (authContext && authContext.user !== undefined) {
      setUser(authContext.user);
      return;
    }
    
    // Otherwise, use direct Firebase auth
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    
    return () => unsubscribe();
  }, [authContext]);

  const fetchGigs = useCallback(async () => {
    try {
      const gigsQuery = query(
        collection(db, "gigs"),
        orderBy("createdAt", "desc"),
        limit(50)
      );
      
      const gigSnap = await getDocs(gigsQuery);
      const gigsList = [];
      
      gigSnap.forEach((doc) => {
        gigsList.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setGigs(gigsList);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching gigs:", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGigs();
  }, [fetchGigs]);

  const handleContinueClick = (gig) => {
    if (!user) {
      // Redirect to login page if user is not logged in
      showWarning("Please login to continue with this gig");
      return;
    }
    
    // Prevent users from selecting their own gigs
    if (gig.userId === user.uid) {
      showWarning("You cannot select your own gig");
      return;
    }
    
    setSelectedGig(gig);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedGig(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-700"></div>
      </div>
    );
  }

  return (
    <section className="py-12 px-4 max-w-6xl mx-auto mt-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-amber-900 mb-8">Available Gigs</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gigs.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-amber-50 rounded-lg">
              <p className="text-amber-700">No gigs available right now.</p>
              <Link href="/profile">
                <button className="mt-4 px-6 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors">
                  Create Your First Gig
                </button>
              </Link>
            </div>
          ) : (
            gigs.map((gig) => (
              <motion.div
                key={gig.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="bg-gradient-to-r from-amber-400 to-amber-600 h-32 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">{gig.title}</span>
                </div>
                <div className="p-6">
                  <p className="text-amber-700 mb-4">{gig.description}</p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      {gig.paymentMethod === "cash" || gig.paymentMethod === "both" ? (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mr-2">
                          ${gig.price}
                        </span>
                      ) : null}
                      
                      {gig.paymentMethod === "points" || gig.paymentMethod === "both" ? (
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          {gig.points} pts
                        </span>
                      ) : null}
                    </div>
                  </div>
                  
                  <div className="flex items-center text-amber-800">
                    <span className="font-medium">By: </span>
                    <span className="ml-1">{gig.username}</span>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-amber-100 flex justify-between items-center">
                    <span className="text-sm text-amber-500">
                      {gig.createdAt && new Date(gig.createdAt.toDate()).toLocaleDateString()}
                    </span>
                    <button 
                      onClick={() => handleContinueClick(gig)} 
                      className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
      
      {/* Render the modal when showModal is true */}
      {showModal && selectedGig && (
        <GigDetailModal 
          gig={selectedGig} 
          user={user} 
          onClose={handleCloseModal} 
          refreshGigs={fetchGigs}
        />
      )}
    </section>
  );
}