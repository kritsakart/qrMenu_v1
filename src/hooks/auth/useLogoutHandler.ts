import { AppUser } from "@/types/auth";
import { clearStoredUser } from "./useStoredUser";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook for handling logout functionality
 */
export const useLogoutHandler = (setUser: (user: AppUser | null) => void) => {
  const logout = async () => {
    try {
      console.log("🚪 Logging out user...");
      
      // Очищаємо localStorage
      clearStoredUser();
      
      // Очищаємо локальний стан
      setUser(null);
      
      // Очищаємо Supabase сесію якщо вона існує
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.warn("⚠️ Error signing out from Supabase:", error.message);
        // Не кидаємо помилку, оскільки локальний стан вже очищений
      } else {
        console.log("✅ Successfully signed out from Supabase");
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error("❌ Error during logout:", error);
      // Все одно очищаємо локальний стан навіть якщо є помилка
      clearStoredUser();
      setUser(null);
      return Promise.resolve();
    }
  };

  return { logout };
};
