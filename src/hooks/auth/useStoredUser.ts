import { AppUser } from "@/types/auth";

const USER_STORAGE_KEY = "supabase_user";

/**
 * Function to validate user data structure
 */
const isValidUserData = (data: any): data is AppUser => {
  return (
    data &&
    typeof data === 'object' &&
    typeof data.id === 'string' &&
    typeof data.email === 'string' &&
    typeof data.username === 'string' &&
    ['super_admin', 'cafe_owner', 'public'].includes(data.role) &&
    (data.cafeId === undefined || typeof data.cafeId === 'string')
  );
};

/**
 * Function to get stored user from localStorage
 */
export const getStoredUser = (): AppUser | null => {
  try {
    const userString = localStorage.getItem(USER_STORAGE_KEY);
    if (!userString) {
      return null;
    }
    
    const userData = JSON.parse(userString);
    
    // Валідуємо структуру даних
    if (!isValidUserData(userData)) {
      console.warn("⚠️ Invalid user data found in localStorage, clearing it");
      clearStoredUser();
      return null;
    }
    
    console.log("✅ Valid user data loaded from localStorage:", userData);
    return userData;
  } catch (error) {
    console.error("❌ Error parsing stored user data:", error);
    clearStoredUser(); // Очищаємо пошкоджені дані
    return null;
  }
};

/**
 * Function to save user data to localStorage
 */
export const setStoredUser = (user: AppUser) => {
  try {
    if (!isValidUserData(user)) {
      console.error("❌ Attempting to store invalid user data:", user);
      return;
    }
    
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    console.log("💾 User data saved to localStorage:", user);
  } catch (error) {
    console.error("❌ Error storing user data:", error);
  }
};

/**
 * Function to remove user data from localStorage
 */
export const clearStoredUser = () => {
  try {
    localStorage.removeItem(USER_STORAGE_KEY);
    console.log("🗑️ User data cleared from localStorage");
  } catch (error) {
    console.error("❌ Error clearing user data:", error);
  }
};
