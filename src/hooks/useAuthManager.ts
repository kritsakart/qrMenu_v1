
import { AppUser } from "@/types/auth";
import { useAuthState } from "./auth/useAuthState";
import { useLoginHandler } from "./auth/useLoginHandler";
import { useLogoutHandler } from "./auth/useLogoutHandler";

// Main hook implementation
export const useAuthManager = () => {
  const { user, setUser, isLoading, setIsLoading, isAuthenticated, isSuperAdmin } = useAuthState();
  const { login } = useLoginHandler(setUser, setIsLoading);
  const { logout } = useLogoutHandler(setUser);

  return {
    user,
    loading: isLoading,
    isAuthenticated,
    isSuperAdmin,
    login,
    logout
  };
};
