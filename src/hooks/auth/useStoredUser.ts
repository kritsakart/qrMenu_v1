import { AppUser } from "@/types/auth";

const USER_STORAGE_KEY = "supabase_user";

/**
 * Function to get stored user from localStorage
 */
export const getStoredUser = (): AppUser | null => {
  try {
    const user = localStorage.getItem(USER_STORAGE_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error parsing stored user data:", error);
    return null;
  }
};

/**
 * Function to save user data to localStorage
 */
export const setStoredUser = (user: AppUser) => {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch (error) {
    console.error("Error storing user data:", error);
  }
};

/**
 * Function to remove user data from localStorage
 */
export const clearStoredUser = () => {
  try {
    localStorage.removeItem(USER_STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing user data:", error);
  }
};
