"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut as authSignOut, User } from "firebase/auth";
import { auth } from "./firebase";
import { useRouter } from "next/navigation";

interface AuthUser {
  id: string;
  email: string | null;
  name: string | null;
  photoURL?: string | null;
}

interface AuthUserContextType {
  authUser: AuthUser | null;
  isLoading: boolean;
  setAuthUser: (user: AuthUser | null) => void;
  SetLoading: (loading: boolean) => void;
  signOut: () => void;
}

const AuthUserContext = createContext<AuthUserContextType>({
  authUser: null,
  isLoading: true,
  setAuthUser: () => {},
  SetLoading: () => {},
  signOut: () => {},
});

function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isLoading, SetLoading] = useState(false);
  const router = useRouter();

  const clear = () => {
    setAuthUser(null);
    document.cookie = "firebaseAuth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    SetLoading(false);
  };

  const saveTokenToCookie = (token: string) => {
    document.cookie = `firebaseAuth=${token}; path=/; max-age=3600; SameSite=Strict`;
  };

  const authStateChanged = (user: User | null) => {
    SetLoading(true);
    if (!user) {
      clear();
      return;
    }
    setAuthUser({
      id: user.uid,
      email: user.email,
      name: user.displayName,
      photoURL: user.photoURL,
    });
    user.getIdToken().then((token) => {
      saveTokenToCookie(token);
    });
    SetLoading(false);
  };

  const signOut = () => {
    authSignOut(auth).then(() => clear());
    router.push("/");
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, authStateChanged);
    return () => unsubscribe();
  }, []);

  return { authUser, isLoading, setAuthUser, SetLoading, signOut };
}

export const AuthUserProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useFirebaseAuth();
  return (
    <AuthUserContext.Provider value={auth}>{children}</AuthUserContext.Provider>
  );
};

export const useAuth = () => useContext(AuthUserContext);
