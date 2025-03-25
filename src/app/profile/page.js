"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy,
  doc,
  getDoc
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { auth, db } from "../../../firebase/firebase";
import { useToastMessages } from "@/components/message/useToastMessages";
import { useAuth } from "../../../firebase/auth";
import Loading from "@/components/Loading";

export default function ProfilePage() {
  const router = useRouter();
  const { Success, Warn } = useToastMessages();
  const { authUser, isLoading } = useAuth();
  
  const [user, setUser] = useState(null);
  const [userGigs, setUserGigs] = useState([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const [showGigForm, setShowGigForm] = useState(false);
  
  // New gig form state
  const [gigTitle, setGigTitle] = useState("");
  const [gigDescription, setGigDescription] = useState("");
  const [gigPrice, setGigPrice] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("both"); // "cash", "points", "both"

  useEffect(() => {
    // Redirect if not authenticated
    if (!isLoading && !authUser) {
      router.push("/login");
      return;
    }

    // Load user data and gigs when authenticated
    if (!isLoading && authUser) {
      const fetchUserData = async () => {
        try {
          console.log("Auth user:", authUser);
          
          // Get proper user ID - your auth object uses 'id' instead of 'uid'
          const userId = authUser.id;
          
          if (!userId) {
            console.error("No user ID found in auth object");
            Warn("User ID not found");
            setProfileLoading(false);
            return;
          }
          
          // Get user profile from Firestore
          const userRef = doc(db, "users", userId);
          const userDoc = await getDoc(userRef);
          
          let userData = {
            uid: userId,
            id: userId,
            email: authUser.email || "",
            displayName: authUser.name || "", // Note: using 'name' instead of 'displayName'
            photoURL: authUser.photoURL || "",
            points: 0,
            completedGigs: 0
          };
          
          if (userDoc.exists()) {
            // Merge Firestore data with auth data
            const firestoreData = userDoc.data();
            
            userData = {
              ...userData,
              ...firestoreData,
              // Ensure these fields exist
              displayName: firestoreData.displayName || authUser.name || "",
              email: firestoreData.email || authUser.email || "",
              photoURL: firestoreData.photoURL || authUser.photoURL || "",
              points: firestoreData.points || 0,
              completedGigs: firestoreData.completedGigs || 0,
              bio: firestoreData.bio || ""
            };
          } else {
            console.log("User document doesn't exist in Firestore, using auth data only");
          }
          
          setUser(userData);
          
          // Fetch user's gigs
          await fetchUserGigs(userId);
          
          setProfileLoading(false);
        } catch (error) {
          console.error("Error fetching user data:", error);
          Warn("Failed to load profile data");
          setProfileLoading(false);
        }
      };
      
      fetchUserData();
    }
  }, [isLoading, authUser, router, Warn]);

  const fetchUserGigs = async (userId) => {
    try {
      if (!userId) {
        console.error("No user ID provided for fetching gigs");
        return;
      }
      
      const gigsQuery = query(
        collection(db, "gigs"), 
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );
      
      const gigSnap = await getDocs(gigsQuery);
      const gigs = [];
      
      gigSnap.forEach((doc) => {
        gigs.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setUserGigs(gigs);
    } catch (error) {
      console.error("Error fetching gigs:", error);
    }
  };

  const handleAddGig = async (e) => {
    e.preventDefault();
    
    if (!gigTitle || !gigDescription || !gigPrice) {
      Warn("Please fill all the fields");
      return;
    }
    
    try {
      if (!authUser || !authUser.id) {
        Warn("You must be logged in to create a gig");
        return;
      }
      
      const price = parseFloat(gigPrice);
      
      if (isNaN(price) || price <= 0) {
        Warn("Please enter a valid price");
        return;
      }
      
      // Create gig object
      const gigData = {
        title: gigTitle,
        description: gigDescription,
        price: price,
        points: price, // 1 point = $1
        paymentMethod: paymentMethod,
        userId: authUser.id, // Use id instead of uid
        username: user?.displayName || authUser?.name || authUser?.email || "Unknown user",
        createdAt: new Date()
      };
      
      // Add to Firestore
      const docRef = await addDoc(collection(db, "gigs"), gigData);
      
      // Add to local state
      setUserGigs([
        {
          id: docRef.id,
          ...gigData
        },
        ...userGigs
      ]);
      
      // Reset form
      setGigTitle("");
      setGigDescription("");
      setGigPrice("");
      setPaymentMethod("both");
      setShowGigForm(false);
      
      Success("Gig added successfully!");
    } catch (error) {
      console.error("Error adding gig:", error);
      Warn("Failed to add gig. Please try again.");
    }
  };

  // Safely get the first character of a string
  const getInitial = (str) => {
    if (str && typeof str === 'string' && str.length > 0) {
      return str[0].toUpperCase();
    }
    return "U"; // Default if string is empty or undefined
  };

  // Safely format date
  const formatDate = (dateValue) => {
    try {
      if (!dateValue) return "";
      
      // Handle Firestore Timestamp objects
      if (dateValue && typeof dateValue.toDate === 'function') {
        return new Date(dateValue.toDate()).toLocaleDateString();
      }
      
      // Handle Date objects or strings
      return new Date(dateValue).toLocaleDateString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  if (isLoading || profileLoading) {
    return <Loading />;
  }

  if (!authUser) {
    return null; // Will redirect to login
  }

  return (
    <section className="py-12 px-4 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        {/* Profile Header */}
        <div className="relative h-48 bg-gradient-to-r from-amber-500 to-amber-700">
          <div className="absolute bottom-0 left-0 transform translate-y-1/2 ml-8">
            <div className="h-24 w-24 bg-white rounded-full border-4 border-white overflow-hidden">
              {user?.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt="Profile"
                  width={96}
                  height={96}
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-amber-200 text-amber-800 text-2xl font-bold">
                  {getInitial(user?.displayName) || getInitial(user?.email) || "U"}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Profile Info */}
        <div className="pt-16 px-8 pb-8">
          <h1 className="text-3xl font-bold text-amber-900">
            {user?.displayName || authUser?.name || authUser?.email || "User"}
          </h1>
          
          {/* Profile Stats */}
          <div className="flex gap-6 mt-6 border-b border-amber-100 pb-6">
            <div>
              <span className="text-amber-900 font-bold text-xl">{userGigs.length}</span>
              <p className="text-amber-600">Gigs</p>
            </div>
            <div>
              <span className="text-amber-900 font-bold text-xl">{user?.completedGigs || 0}</span>
              <p className="text-amber-600">Completed</p>
            </div>
            <div>
              <span className="text-amber-900 font-bold text-xl">{user?.points || 0}</span>
              <p className="text-amber-600">Points</p>
            </div>
          </div>
          
          {/* Add Gig Button */}
          <div className="mt-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-amber-900">My Gigs</h2>
            <button
              onClick={() => setShowGigForm(!showGigForm)}
              className="px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors flex items-center"
            >
              {showGigForm ? "Cancel" : "+ Add New Gig"}
            </button>
          </div>
          
          {/* Add Gig Form */}
          {showGigForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 bg-amber-50 rounded-lg p-6"
            >
              <h3 className="text-xl font-semibold text-amber-900 mb-4">Create a New Gig</h3>
              <form onSubmit={handleAddGig}>
                <div className="mb-4">
                  <label htmlFor="gigTitle" className="block text-amber-800 mb-2">Title</label>
                  <input
                    type="text"
                    id="gigTitle"
                    value={gigTitle}
                    onChange={(e) => setGigTitle(e.target.value)}
                    placeholder="e.g. Guitar Solo"
                    className="w-full p-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="gigDescription" className="block text-amber-800 mb-2">Description</label>
                  <textarea
                    id="gigDescription"
                    value={gigDescription}
                    onChange={(e) => setGigDescription(e.target.value)}
                    placeholder="e.g. I will perform guitar solo for your song"
                    className="w-full p-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[100px]"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="gigPrice" className="block text-amber-800 mb-2">Price ($)</label>
                  <input
                    type="number"
                    id="gigPrice"
                    value={gigPrice}
                    onChange={(e) => setGigPrice(e.target.value)}
                    placeholder="e.g. 50"
                    min="1"
                    step="0.01"
                    className="w-full p-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-amber-800 mb-2">Payment Method</label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={paymentMethod === "cash"}
                        onChange={() => setPaymentMethod("cash")}
                        className="mr-2"
                      />
                      Cash Only
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="points"
                        checked={paymentMethod === "points"}
                        onChange={() => setPaymentMethod("points")}
                        className="mr-2"
                      />
                      Points Only ({gigPrice || 0} points)
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="both"
                        checked={paymentMethod === "both"}
                        onChange={() => setPaymentMethod("both")}
                        className="mr-2"
                      />
                      Both
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors"
                  >
                    Publish Gig
                  </button>
                </div>
              </form>
            </motion.div>
          )}
          
          {/* User Gigs */}
          <div className="mt-6 space-y-6">
            {userGigs.length === 0 ? (
              <div className="text-center py-12 bg-amber-50 rounded-lg">
                <p className="text-amber-700">You haven't created any gigs yet.</p>
                <button
                  onClick={() => setShowGigForm(true)}
                  className="mt-4 px-6 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors"
                >
                  Create Your First Gig
                </button>
              </div>
            ) : (
              userGigs.map((gig) => (
                <motion.div
                  key={gig.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white border border-amber-100 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between">
                    <h3 className="text-xl font-semibold text-amber-900">{gig.title}</h3>
                    <div className="flex items-center">
                      {(gig.paymentMethod === "cash" || gig.paymentMethod === "both") && (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mr-2">
                          ${gig.price}
                        </span>
                      )}
                      
                      {(gig.paymentMethod === "points" || gig.paymentMethod === "both") && (
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          {gig.points} pts
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="mt-2 text-amber-700">{gig.description}</p>
                  
                  <div className="mt-4 text-sm text-amber-500">
                    {formatDate(gig.createdAt)}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}