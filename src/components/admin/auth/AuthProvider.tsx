"use client";

import { useState, useEffect, useRef } from 'react';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import Spinner from '@/components/Spinner';

export default function AuthProvider({
  allowedEmails,
  children,
}: {
  allowedEmails: string[];
  children: (props: {
    isLoggedIn: boolean;
    allowed: boolean;
    userEmail: string | null;
    loading: boolean;
    handleGoogleLogin: () => Promise<void>;
    handleLogout: () => void;
  }) => React.ReactNode;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
      setUserEmail(user?.email || null);
      setAllowed(!!user && allowedEmails.includes(user?.email || ''));
      setChecking(false);
    });
    return () => unsubscribe();
  }, [allowedEmails]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      setIsLoggedIn(true);
    } catch (error) {
      alert('Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    auth.signOut();
    setIsLoggedIn(false);
  };

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Spinner />
      </div>
    );
  }

  return <>{children({ isLoggedIn, allowed, userEmail, loading, handleGoogleLogin, handleLogout })}</>;
}
