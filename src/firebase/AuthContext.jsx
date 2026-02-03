import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "./firebase";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (!u) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        const snap = await getDoc(doc(db, "users", u.uid));
        setProfile(snap.exists() ? snap.data() : null);
      } catch {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  async function register({ email, password, name = "", address = "" }) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", cred.user.uid), {
      uid: cred.user.uid,
      email: cred.user.email,
      name,
      address,
      createdAt: serverTimestamp(),
    });
    return cred.user;
  }

  async function login({ email, password }) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  }

  async function logout() {
    await signOut(auth);
  }

  async function refreshProfile() {
    if (!auth.currentUser) return null;
    const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
    const data = snap.exists() ? snap.data() : null;
    setProfile(data);
    return data;
  }

  async function updateProfileDoc(partial) {
    if (!auth.currentUser) throw new Error("Not authenticated");
    await updateDoc(doc(db, "users", auth.currentUser.uid), partial);
    await refreshProfile();
  }

  async function deleteAccountAndData() {
    const u = auth.currentUser;
    if (!u) throw new Error("Not authenticated");

    await deleteDoc(doc(db, "users", u.uid));

    await deleteUser(u);
  }

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      register,
      login,
      logout,
      refreshProfile,
      updateProfileDoc,
      deleteAccountAndData,
    }),
    [user, profile, loading],
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
