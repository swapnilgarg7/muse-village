// src/services/userService.js
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

// Create or update user in Firestore after authentication
export const createUserProfile = async (user) => {
  if (!user) return null;
  
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  
  // If user doesn't exist in Firestore yet, create a new document
  if (!userSnap.exists()) {
    const userData = {
      displayName: user.displayName || '',
      email: user.email,
      photoURL: user.photoURL || '',
      points: 0,
      completedGigs: 0,
      createdAt: new Date()
    };
    
    await setDoc(userRef, userData);
    return { uid: user.uid, ...userData };
  }
  
  // Return existing user data
  return { uid: user.uid, ...userSnap.data() };
};

// Get user profile from Firestore
export const getUserProfile = async (userId) => {
  if (!userId) return null;
  
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return { uid: userId, ...userSnap.data() };
  }
  
  return null;
};

// Update user profile
export const updateUserProfile = async (userId, data) => {
  if (!userId) return null;
  
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    ...data,
    updatedAt: new Date()
  });
  
  // Get and return the updated profile
  return getUserProfile(userId);
};