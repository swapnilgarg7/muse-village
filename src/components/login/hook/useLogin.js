import { useRouter } from "next/navigation";
import { useToastMessages } from "@/components/message/useToastMessages";
import { loginSchema } from "../schema/loginSchema";
import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../../firebase/firebase";

const provider = new GoogleAuthProvider();

export const useLogin = () => {
  const router = useRouter();
  const { Success, Warn } = useToastMessages();
  
  const initialValues = {
    email: "",
    password: "",
  };

  const handleNavigate = (url) => {
    router.push(`/${url}`);
  };

  const handleGoogleSignUp = async () => {
    try {
      // First authenticate with Google
      const result = await signInWithPopup(auth, provider);
      console.log("Google sign in successful, user:", result.user);
      
      // Navigate to dashboard immediately after authentication
      Success("Successfully signed in!");
      handleNavigate("dashboard");
      
      // Then try to create/update user in Firestore
      try {
        const userId = result.user.uid;
        
        // Reference to the user document in Firestore
        const userRef = doc(db, "users", userId);
        
        // Check if user document already exists
        const userDoc = await getDoc(userRef);
        
        if (!userDoc.exists()) {
          // Create new user document if it doesn't exist
          await setDoc(userRef, {
            displayName: result.user.displayName || '',
            email: result.user.email,
            photoURL: result.user.photoURL || '',
            points: 0,
            completedGigs: 0,
            createdAt: new Date()
          });
          console.log("New user created in Firestore:", userId);
        } else {
          console.log("User already exists in Firestore");
        }
      } catch (firestoreError) {
        // Log Firestore error but don't prevent navigation
        console.error("Error creating user in Firestore (non-blocking):", firestoreError);
      }
    } catch (authError) {
      console.error("Error during Google sign in:", authError);
      Warn("Something Wrong with authentication :(");
    }
  };

  return {
    initialValues,
    schema: loginSchema,
    handleNavigate,
    googleSignIn: handleGoogleSignUp,
  };
};