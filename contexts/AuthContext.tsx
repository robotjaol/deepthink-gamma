

import React, { createContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { User } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => void;
  sendPasswordResetEmail: (email: string) => Promise<boolean>;
  getToken: () => Promise<string | null>;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => false,
  signup: async () => false,
  logout: () => {},
  updateUserProfile: () => {},
  sendPasswordResetEmail: async () => false,
  getToken: async () => null,
});

interface AuthProviderProps {
  children: ReactNode;
}

const DUMMY_USER: User = {
    id: '1',
    name: 'Alex Johnson',
    email: 'user@deepthink.com',
    profilePictureUrl: 'https://picsum.photos/id/1005/200/200',
    hobbies: ['Chess', 'Reading', 'Hiking'],
    contacts: {
        instagram: '@alexj',
        twitter: '@alexj_tweets',
    },
};

const DUMMY_JWT = 'dummy.jwt.token'; // Used to simulate a real auth token for function calls

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, pass: string): Promise<boolean> => {
    // Dummy hardcoded login
    if (email === 'user@deepthink.com' && pass === 'password') {
      setUser(DUMMY_USER);
      return true;
    }
    return false;
  }, []);

  const signup = useCallback(async (name: string, email: string, pass: string): Promise<boolean> => {
    // Dummy signup logic
    console.log("Signing up with:", { name, email, pass });
    // In a real app, you'd call your backend here.
    // For now, we'll just log them in with the dummy user after "signing up".
    setUser({ ...DUMMY_USER, name, email });
    return true;
  }, []);


  const logout = useCallback(() => {
    setUser(null);
  }, []);
  
  const updateUserProfile = useCallback((data: Partial<User>) => {
    setUser(currentUser => {
      if (!currentUser) return null;
      // Deep merge contacts if they exist
      const newContacts = data.contacts ? { ...currentUser.contacts, ...data.contacts } : currentUser.contacts;
      return { ...currentUser, ...data, contacts: newContacts };
    });
  }, []);

  const sendPasswordResetEmail = useCallback(async (email: string): Promise<boolean> => {
    // Dummy implementation
    console.log(`Password reset link sent to: ${email}`);
    // In a real app, this would trigger a backend service (e.g., Supabase Auth).
    return true;
  }, []);

  const getToken = useCallback(async (): Promise<string | null> => {
    // In a real Supabase app, this would be:
    // const { data: { session } } = await supabase.auth.getSession();
    // return session?.access_token || null;
    return user ? DUMMY_JWT : null;
  }, [user]);

  const value = useMemo(() => ({
    isAuthenticated: !!user,
    user,
    login,
    signup,
    logout,
    updateUserProfile,
    sendPasswordResetEmail,
    getToken
  }), [user, login, signup, logout, updateUserProfile, sendPasswordResetEmail, getToken]);


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};