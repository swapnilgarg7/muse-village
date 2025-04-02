"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../firebase/firebase";
// Try to import the toast message hook with a try-catch in case it's not available
let useToastMessages;
try {
  useToastMessages = require("@/components/message/useToastMessages").useToastMessages;
} catch (e) {
  // If import fails, we'll use our fallback functions
  console.warn("Could not import useToastMessages, using fallbacks");
}

export default function GigDetailModal({ gig, user, onClose, refreshGigs }) {
  // Add safety check for user
  if (!user || !user.uid) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <h2 className="text-2xl font-bold text-amber-900 mb-4">Login Required</h2>
          <p className="text-amber-800 mb-6">You need to be logged in to view this gig's details.</p>
          <div className="flex justify-between">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors"
            >
              Close
            </button>
            <Link href="/login">
              <button className="px-6 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors">
                Login
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [contactInfo, setContactInfo] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(
    gig.paymentMethod === "cash" ? "cash" : 
    gig.paymentMethod === "points" ? "points" : null
  );
  
  // Get toast functions, with fallbacks in case the hook isn't available
  const toastFunctions = useToastMessages ? useToastMessages() : {};
  const showSuccess = toastFunctions.Success || ((msg) => console.log('Success:', msg));
  const showError = toastFunctions.Error || ((msg) => console.error('Error:', msg));
  const showWarning = toastFunctions.Warn || ((msg) => console.warn('Warning:', msg));

  const handlePaymentMethodSelect = (method) => {
    setSelectedPayment(method);
  };

  const handleConfirmPayment = async () => {
    if (!selectedPayment) {
      showWarning("Please select a payment method");
      return;
    }

    setIsProcessing(true);

    try {
      // Get the gig poster's profile to access contact information
      const gigPosterRef = doc(db, "users", gig.userId);
      const gigPosterSnap = await getDoc(gigPosterRef);
      
      if (!gigPosterSnap.exists()) {
        showError("Could not find gig creator's information");
        setIsProcessing(false);
        return;
      }

      const gigPosterData = gigPosterSnap.data();
      
      // If payment is with points, handle the points transfer
      if (selectedPayment === "points") {
        // Check if user has enough points
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
          showError("User profile not found");
          setIsProcessing(false);
          return;
        }
        
        const userData = userSnap.data();
        const userPoints = userData.points || 0;
        
        if (userPoints < gig.points) {
          alert(`Not enough points. You have ${userPoints} points, but this gig requires ${gig.points} points.`);
          setIsProcessing(false);
          return;
        }
        
        try {
          // Use cloud function to handle this transaction securely
          // If you have a serverless API route set up in Next.js, use that instead
          // This is a fallback that may work with appropriate security rules:
          
          // For the buyer: deduct points
          await updateDoc(userRef, {
            points: userPoints - gig.points,
            purchases: arrayUnion({
              gigId: gig.id,
              title: gig.title,
              points: gig.points,
              date: new Date()
            })
          });
          
          // For the seller: add points
          await updateDoc(gigPosterRef, {
            points: (gigPosterData.points || 0) + gig.points,
            sales: arrayUnion({
              gigId: gig.id,
              title: gig.title,
              points: gig.points,
              buyerId: user.uid,
              date: new Date()
            })
          });
          
          showSuccess(`Successfully transferred ${gig.points} points`);
        } catch (error) {
          console.error("Points transfer error:", error);
          showError("Permission error: You may need to request the gig creator to update their profile settings, or contact support.");
          setIsProcessing(false);
          return;
        }
      } else {
        // For cash payments, just record the transaction in the current user's profile
        try {
          const userRef = doc(db, "users", user.uid);
          
          await updateDoc(userRef, {
            purchases: arrayUnion({
              gigId: gig.id,
              title: gig.title,
              price: gig.price,
              paymentType: "cash",
              date: new Date()
            })
          });
          
          // For cash payments, we attempt to update the seller's record but don't fail if it doesn't work
          try {
            await updateDoc(gigPosterRef, {
              sales: arrayUnion({
                gigId: gig.id,
                title: gig.title,
                price: gig.price,
                paymentType: "cash",
                buyerId: user.uid,
                date: new Date()
              })
            });
          } catch (sellerError) {
            console.warn("Could not update seller's records, continuing anyway:", sellerError);
            // Non-critical error, just log it and continue
          }
          
          showSuccess("Cash payment arrangement confirmed");
        } catch (error) {
          console.error("Cash payment record error:", error);
          // Still show contact info for cash payments even if recording fails
          showWarning("Could not record your purchase, but you can still contact the seller");
        }
      }
      
      // Set contact information to display to the user
      setContactInfo({
        name: gigPosterData.displayName || "Gig Creator",
        email: gigPosterData.email,
        phone: gigPosterData.phone || "No phone provided",
        additionalInfo: gig.contactInstructions || "Contact the gig creator directly to arrange the service."
      });
      
      setPaymentConfirmed(true);
      
      // Optional: Mark the gig as taken or update its status
      if (gig.oneTimeOnly) {
        try {
          const gigRef = doc(db, "gigs", gig.id);
          await updateDoc(gigRef, {
            status: "taken",
            takenBy: user.uid,
            takenAt: new Date()
          });
          
          if (refreshGigs) {
            refreshGigs();
          }
        } catch (error) {
          console.error("Error updating gig status:", error);
          // Non-critical error, continue anyway
        }
      }
      
    } catch (error) {
      console.error("Error processing payment:", error);
      showError("Failed to process payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
      >
        {!paymentConfirmed ? (
          <>
            <h2 className="text-2xl font-bold text-amber-900 mb-4">{gig.title}</h2>
            <p className="text-amber-800 mb-6">{gig.description}</p>
            
            <div className="mb-6 text-amber-800">
              <h3 className="text-lg font-semibold text-amber-800 mb-3">Payment Options</h3>
              
              {gig.paymentMethod === "both" ? (
                <div className="space-y-3">
                  <button
                    onClick={() => handlePaymentMethodSelect("cash")}
                    className={`w-full py-3 px-4 rounded-lg border ${
                      selectedPayment === "cash"
                        ? "bg-amber-100 border-amber-500"
                        : "border-gray-300 hover:bg-amber-50"
                    } transition-colors`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Pay with Cash</span>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        ${gig.price}
                      </span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => handlePaymentMethodSelect("points")}
                    className={`w-full py-3 px-4 rounded-lg border ${
                      selectedPayment === "points"
                        ? "bg-amber-100 border-amber-500"
                        : "border-gray-300 hover:bg-amber-50"
                    } transition-colors`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Pay with Points</span>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {gig.points} pts
                      </span>
                    </div>
                  </button>
                </div>
              ) : (
                <div className="bg-amber-50 p-4 rounded-lg">
                  {gig.paymentMethod === "cash" ? (
                    <p className="text-amber-800">
                      This gig requires a cash payment of <span className="font-bold">${gig.price}</span>. 
                      You'll arrange payment directly with the gig creator.
                    </p>
                  ) : (
                    <p className="text-amber-800">
                      This gig requires <span className="font-bold">{gig.points} points</span>. 
                      Points will be transferred immediately upon confirmation.
                    </p>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex justify-between mt-8">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-amber-700 text-amber-700 rounded-lg hover:bg-amber-50 transition-colors"
              >
                Cancel
              </button>
              
              <button
                onClick={handleConfirmPayment}
                disabled={isProcessing || (!selectedPayment && gig.paymentMethod === "both")}
                className={`px-6 py-2 bg-amber-700 text-white rounded-lg transition-colors ${
                  isProcessing || (!selectedPayment && gig.paymentMethod === "both")
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-amber-800"
                }`}
              >
                {isProcessing ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-amber-900">Payment Confirmed!</h2>
              <p className="text-amber-700 mt-2">
                {selectedPayment === "points" 
                  ? `${gig.points} points have been transferred.` 
                  : "Cash payment has been arranged."}
              </p>
            </div>
            
            <div className="bg-amber-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-amber-800 mb-2">Contact Information</h3>
              <p className="text-amber-700 mb-1"><span className="font-medium">Name:</span> {contactInfo.name}</p>
              <p className="text-amber-700 mb-1"><span className="font-medium">Email:</span> {contactInfo.email}</p>
              <p className="text-amber-700 mb-1"><span className="font-medium">Phone:</span> {contactInfo.phone}</p>
              
              <div className="mt-4 pt-4 border-t border-amber-200">
                <p className="text-amber-700">{contactInfo.additionalInfo}</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="w-full px-6 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors"
            >
              Close
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}