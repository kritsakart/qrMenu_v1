
import { AppUser } from "@/types/auth";
import { removeUserFromStorage } from "./useStoredUser";

/**
 * Hook for handling logout functionality
 */
export const useLogoutHandler = (setUser: (user: AppUser | null) => void) => {
  const logout = async () => {
    removeUserFromStorage();
    setUser(null);
    return Promise.resolve();
  };

  return { logout };
};
