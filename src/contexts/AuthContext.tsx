import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User,
  signInAnonymously,
  onAuthStateChanged,
  signOut 
} from 'firebase/auth';
import { auth } from '../config/firebase.config';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
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
  const [error, setError] = useState<string | null>(null);

  async function signInAnon() {
    try {
      console.log('Attempting anonymous sign in...');
      const result = await signInAnonymously(auth);
      if (!result.user) {
        console.error('No user returned from signInAnonymously');
        throw new Error('Failed to create anonymous user');
      }
      console.log('Anonymous sign in successful:', result.user);
    } catch (error: any) {
      console.error('Detailed error during anonymous sign in:', {
        code: error.code,
        message: error.message,
        fullError: error
      });
      throw error;
    }
  }

  async function logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
        setLoading(false);
      }, (error) => {
        console.error('Auth state change error:', error);
        setError(error.message);
        setLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Auth initialization error:', error);
      setError('Failed to initialize authentication');
      setLoading(false);
    }
  }, []);

  const value = {
    currentUser,
    loading,
    error,
    signInAnon,
    logout
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 