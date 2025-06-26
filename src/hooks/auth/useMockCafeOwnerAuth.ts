import { AppUser } from "@/types/auth";
import { mockCafeOwners } from "@/data/mockData";
import { setStoredUser } from "./useStoredUser";

/**
 * Function to handle mock cafe owner login
 */
export const handleMockCafeOwnerLogin = (username: string): AppUser | null => {
  // Check mock cafe owners (if no database connection)
  console.log("Checking mock cafe owners for:", username);
  console.log("Available mock cafe owners:", mockCafeOwners);
  
  // Use case-insensitive comparison for username
  const cafeOwner = mockCafeOwners.find(
    (u) => u.username.toLowerCase() === username.toLowerCase()
  );

  if (cafeOwner) {
    console.log("Mock cafe owner found:", cafeOwner);
    
    // Store debug info for mock data check
    (window as any).loginDebugInfo = {
      ...(window as any).loginDebugInfo || {},
      mockDataCheck: {
        found: true,
        userData: {
          id: cafeOwner.id,
          username: cafeOwner.username,
          status: cafeOwner.status,
        }
      }
    };
    
    const userData: AppUser = {
      id: cafeOwner.id,
      username: cafeOwner.username,
      role: "cafe_owner",
      cafeId: cafeOwner.id,
      email: `${cafeOwner.username}@mock.com`, // Автоматично генерований email для mock користувачів
    };

    setStoredUser(userData);
    return userData;
  }
  
  // Store debug info for mock data check if not found
  (window as any).loginDebugInfo = {
    ...(window as any).loginDebugInfo || {},
    mockDataCheck: {
      found: false,
      message: `User "${username}" not found in mock data`,
      availableMockUsers: mockCafeOwners.map(owner => owner.username)
    }
  };
  
  return null;
};
