import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Auth,
  User,
  signInAnonymously,
  onAuthStateChanged,
  signOut 
} from 'firebase/auth';
import { auth } from '../config/firebase.config';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signInAnon: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function signInAnon() {
    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.error('Error signing in anonymously:', error);
    }
  }

  async function logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    signInAnon,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 