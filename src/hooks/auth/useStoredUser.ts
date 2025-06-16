
import { AppUser } from "@/types/auth";

/**
 * Function to get stored user from localStorage
 */
export const getStoredUser = (): AppUser | null => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error("Error parsing stored user:", error);
      localStorage.removeItem("user");
    }
  }
  return null;
};

/**
 * Function to save user data to localStorage
 */
export const saveUserToStorage = (userData: AppUser): void => {
  localStorage.setItem("user", JSON.stringify(userData));
};

/**
 * Function to remove user data from localStorage
 */
export const removeUserFromStorage = (): void => {
  localStorage.removeItem("user");
};
