"use client";
import { createContext, useContext, useEffect, useState } from "react";

import { onAuthStateChanged, signOut as authSignOut } from "firebase/auth";
import { auth } from "./firebase";

const AuthUserContext = createContext({
  authUser: null,
  isLoading: true,
});

export default function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState(null);
  const [isLoading, SetLoading] = useState(false);

  const clear = () => {
    setAuthUser(null);
    document.cookie = "firebaseAuth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    SetLoading(false);
  };

  const saveTokenToCookie = (token) => {
    document.cookie = `firebaseAuth=${token}; path=/; max-age=3600; SameSite=Strict`;
  }

  const authStateChanged = (user) => {
    SetLoading(true);
    if (!user) {
      clear();
      return;
    }
    setAuthUser({
      id: user.uid,
      email: user.email,
      name: user.displayName,
    });
    user.getIdToken().then(token => {
      saveTokenToCookie(token);
    });
    SetLoading(false);
  };

  const signOut = () => {
    authSignOut(auth).then(() => clear());
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, authStateChanged);
    return unsubscribe;
  }, []);

  return {
    authUser,
    isLoading,
    setAuthUser,
    SetLoading,
    signOut,
  };
}

export const AuthUserProvider = ({ children }) => {
  const auth = useFirebaseAuth();
  return (
    <AuthUserContext.Provider value={auth}>{children}</AuthUserContext.Provider>
  );
};

export const useAuth = () => useContext(AuthUserContext);
