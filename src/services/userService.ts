import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "~/firebase/firebase";

interface FirebaseUser {
  uid: string;
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
}

interface UserProfile {
  uid: string;
  displayName: string;
  email: string | null;
  photoURL: string;
  completedGigs: number;
  createdAt: Date;
  [key: string]: unknown;
}

export const createUserProfile = async (user: FirebaseUser): Promise<UserProfile | null> => {
  if (!user) return null;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const userData: Omit<UserProfile, "uid"> = {
      displayName: user.displayName || "",
      email: user.email ?? null,
      photoURL: user.photoURL || "",
      completedGigs: 0,
      createdAt: new Date(),
    };
    await setDoc(userRef, userData);
    return { uid: user.uid, ...userData } as UserProfile;
  }

  return { uid: user.uid, ...(userSnap.data() as Omit<UserProfile, "uid">) } as UserProfile;
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  if (!userId) return null;
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return { uid: userId, ...(userSnap.data() as Omit<UserProfile, "uid">) } as UserProfile;
  }
  return null;
};

export const updateUserProfile = async (
  userId: string,
  data: Partial<UserProfile>
): Promise<UserProfile | null> => {
  if (!userId) return null;
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { ...data, updatedAt: new Date() });
  return getUserProfile(userId);
};
