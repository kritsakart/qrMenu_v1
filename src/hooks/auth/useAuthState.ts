
import { useState, useEffect } from "react";
import { AppUser } from "@/types/auth";
import { getStoredUser } from "./useStoredUser";

/**
 * Hook for managing authentication state
 */
export const useAuthState = () => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from storage on component mount
  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  return {
    user,
    setUser,
    isLoading,
    setIsLoading,
    isAuthenticated: !!user,
    isSuperAdmin: user?.role === "super_admin"
  };
};
