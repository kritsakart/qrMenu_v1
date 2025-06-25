import { AppUser } from "@/types/auth";

const USER_STORAGE_KEY = "food-list-user";

/**
 * Validates if the user data has all required fields
 */
const isValidUserData = (userData: any): userData is AppUser => {
  return (
    userData &&
    typeof userData === "object" &&
    typeof userData.id === "string" &&
    typeof userData.username === "string" &&
    typeof userData.role === "string" &&
    (userData.email === undefined || typeof userData.email === "string") &&
    (userData.cafeId === undefined || typeof userData.cafeId === "string")
  );
};

/**
 * Function to get stored user from localStorage
 */
export const getStoredUser = (): AppUser | null => {
  try {
    const userString = localStorage.getItem(USER_STORAGE_KEY);
    if (!userString) {
      console.log("🔍 No user data found in localStorage");
      return null;
    }
    
    const userData = JSON.parse(userString);
    
    // Валідуємо структуру даних
    if (!isValidUserData(userData)) {
      console.warn("⚠️ Invalid user data found in localStorage, clearing it:", userData);
      clearStoredUser();
      return null;
    }
    
    // Додаткова перевірка для mock користувачів
    const isMockUser = userData.id.startsWith('admin-') || 
                      userData.id.startsWith('cafe-') ||
                      userData.email?.includes('@mock.com') ||
                      userData.username?.includes('mock');
    
    console.log("✅ Valid user data loaded from localStorage:", {
      id: userData.id,
      username: userData.username,
      role: userData.role,
      isMockUser: isMockUser
    });
    
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
    
    const isMockUser = user.id.startsWith('admin-') || 
                      user.id.startsWith('cafe-') ||
                      user.email?.includes('@mock.com') ||
                      user.username?.includes('mock');
    
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    console.log("💾 User data saved to localStorage:", {
      id: user.id,
      username: user.username,
      role: user.role,
      isMockUser: isMockUser
    });
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
