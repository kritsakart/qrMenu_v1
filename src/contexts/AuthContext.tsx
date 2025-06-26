import React, { createContext, useContext, ReactNode } from "react";
import { AppUser } from "@/types/auth";
import { useAuthState } from "@/hooks/auth/useAuthState";

interface AuthContextType {
  user: AppUser | null;
  setUser: (user: AppUser | null) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  console.log("🏗️ AuthProvider: Initializing...");
  
  const authState = useAuthState();
  
  console.log("🏗️ AuthProvider: Auth state:", {
    hasUser: !!authState.user,
    userId: authState.user?.id,
    isLoading: authState.isLoading,
    timestamp: new Date().toISOString()
  });

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Re-export the AppUser type
export type { AppUser } from "@/types/auth";
