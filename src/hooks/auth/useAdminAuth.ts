
import { AppUser } from "@/types/auth";
import { saveUserToStorage } from "./useStoredUser";
import { supabase } from "@/integrations/supabase/client";

/**
 * Function to handle admin login
 */
export const handleAdminLogin = async (username: string, password: string): Promise<AppUser | null> => {
  // Admin login check (case-insensitive)
  if (username.toLowerCase() === "admin" && password === "admin") {
    console.log("Admin login detected, creating admin user");
    
    try {
      // Try to sign in to Supabase with admin credentials
      const { data, error } = await supabase.auth.signInWithPassword({
        email: "admin@example.com",
        password: "admin"
      });
      
      if (error) {
        console.log("Admin Supabase login failed, creating a session-less admin user");
        // Fallback to session-less admin user for testing
        const userData: AppUser = {
          id: "admin-1",
          username: "admin",
          role: "super_admin",
        };

        saveUserToStorage(userData);
        return userData;
      }
      
      // Create admin user with Supabase session
      const userData: AppUser = {
        id: data.user?.id || "admin-1",
        username: "admin",
        role: "super_admin",
      };

      saveUserToStorage(userData);
      return userData;
    } catch (error) {
      console.error("Error in admin authentication:", error);
      
      // Fallback to session-less admin user for testing
      const userData: AppUser = {
        id: "admin-1",
        username: "admin",
        role: "super_admin",
      };

      saveUserToStorage(userData);
      return userData;
    }
  }
  return null;
};
