import React, { createContext, useContext, ReactNode } from "react";
import { AppUser } from "@/types/auth";
import { useAuthState } from "@/hooks/auth/useAuthState";
import { useLoginHandler } from "@/hooks/auth/useLoginHandler";
import { useLogoutHandler } from "@/hooks/auth/useLogoutHandler";

interface AuthContextType {
  user: AppUser | null;
  setUser: (user: AppUser | null) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  login: (username: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean; // alias for isLoading for backward compatibility
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  console.log("🏗️ AuthProvider: Initializing...");
  
  const authState = useAuthState();
  const { login } = useLoginHandler(authState.setUser, authState.setIsLoading);
  const { logout } = useLogoutHandler(authState.setUser);
  
  console.log("🏗️ AuthProvider: Auth state:", {
    hasUser: !!authState.user,
    userId: authState.user?.id,
    isLoading: authState.isLoading,
    timestamp: new Date().toISOString()
  });

  const contextValue: AuthContextType = {
    ...authState,
    login,
    logout,
    loading: authState.isLoading, // alias for backward compatibility
  };

  return (
    <AuthContext.Provider value={contextValue}>
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
