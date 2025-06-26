import { AppUser } from "@/types/auth";

const USER_STORAGE_KEY = "food-list-user";

// Test localStorage availability
(() => {
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    console.log("✅ localStorage is available");
  } catch (e) {
    console.error("❌ localStorage is NOT available:", e);
  }
})();

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
      console.log("🔍 getStoredUser: No user data found in localStorage");
      return null;
    }
    
    console.log("🔍 getStoredUser: Raw data from localStorage:", userString);
    const userData = JSON.parse(userString);
    
    // Валідуємо структуру даних
    if (!isValidUserData(userData)) {
      console.warn("⚠️ getStoredUser: Invalid user data found, clearing:", userData);
      clearStoredUser();
      return null;
    }
    
    // Додаткова перевірка для mock користувачів
    const isMockUser = userData.id.startsWith('admin-') || 
                      userData.id.startsWith('cafe-') ||
                      userData.email?.includes('@mock.com') ||
                      userData.username?.includes('mock');
    
    console.log("✅ getStoredUser: Valid user data loaded:", {
      id: userData.id,
      username: userData.username,
      role: userData.role,
      isMockUser: isMockUser,
      timestamp: new Date().toISOString()
    });
    
    return userData;
  } catch (error) {
    console.error("❌ getStoredUser: Error parsing stored user data:", error);
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
      console.error("❌ setStoredUser: Attempting to store invalid user data:", user);
      return;
    }
    
    const isMockUser = user.id.startsWith('admin-') || 
                      user.id.startsWith('cafe-') ||
                      user.email?.includes('@mock.com') ||
                      user.username?.includes('mock');
    
    const userString = JSON.stringify(user);
    localStorage.setItem(USER_STORAGE_KEY, userString);
    
    console.log("💾 setStoredUser: User data saved to localStorage:", {
      id: user.id,
      username: user.username,
      role: user.role,
      isMockUser: isMockUser,
      dataSize: userString.length,
      timestamp: new Date().toISOString()
    });
    
    // Перевіряємо, що дані справді збереглися
    const verification = localStorage.getItem(USER_STORAGE_KEY);
    if (verification === userString) {
      console.log("✅ setStoredUser: Verification passed - data successfully stored");
    } else {
      console.error("❌ setStoredUser: Verification failed - data not stored properly");
    }
  } catch (error) {
    console.error("❌ setStoredUser: Error storing user data:", error);
  }
};

/**
 * Function to remove user data from localStorage
 */
export const clearStoredUser = () => {
  try {
    const existingData = localStorage.getItem(USER_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    
    console.log("🗑️ clearStoredUser: User data cleared from localStorage", {
      hadData: !!existingData,
      clearedData: existingData ? JSON.parse(existingData) : null,
      timestamp: new Date().toISOString()
    });
    
    // Перевіряємо, що дані справді видалилися
    const verification = localStorage.getItem(USER_STORAGE_KEY);
    if (verification === null) {
      console.log("✅ clearStoredUser: Verification passed - data successfully cleared");
    } else {
      console.error("❌ clearStoredUser: Verification failed - data still exists:", verification);
    }
  } catch (error) {
    console.error("❌ clearStoredUser: Error clearing user data:", error);
  }
};
