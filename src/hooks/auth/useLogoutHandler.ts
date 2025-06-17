import { AppUser } from "@/types/auth";
import { clearStoredUser } from "./useStoredUser";

/**
 * Hook for handling logout functionality
 */
export const useLogoutHandler = (setUser: (user: AppUser | null) => void) => {
  const logout = async () => {
    clearStoredUser();
    setUser(null);
    return Promise.resolve();
  };

  return { logout };
};
