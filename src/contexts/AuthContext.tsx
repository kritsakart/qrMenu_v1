
import { createContext, useContext } from "react";
import { useAuthManager } from "@/hooks/useAuthManager";
import { AuthContextType, AuthProviderProps } from "@/types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuthManager();

  return (
    <AuthContext.Provider value={auth}>
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
