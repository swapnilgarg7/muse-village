import { useRouter } from "next/navigation";
import { useToastMessages } from "@/components/message/useToastMessages";
import { loginSchema } from "../schema/loginSchema";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "~/firebase/firebase";

const provider = new GoogleAuthProvider();

export const useLogin = () => {
  const router = useRouter();
  const { Success, Warn } = useToastMessages();

  const initialValues = { email: "", password: "" };

  const handleNavigate = (url: string) => router.push(`/${url}`);

  const googleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      Success("Successfully signed in!");
      handleNavigate("dashboard");

      try {
        const userRef = doc(db, "users", result.user.uid);
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
          await setDoc(userRef, {
            displayName: result.user.displayName || "",
            email: result.user.email,
            photoURL: result.user.photoURL || "",
            completedGigs: 0,
            createdAt: new Date(),
          });
        }
      } catch (err) {
        console.error("Firestore error (non-blocking):", err);
      }
    } catch (err) {
      console.error("Google sign in error:", err);
      Warn("Something went wrong with authentication :(");
    }
  };

  return { initialValues, schema: loginSchema, handleNavigate, googleSignIn };
};
