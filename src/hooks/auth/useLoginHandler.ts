import { useToast } from "@/hooks/use-toast";
import { AppUser } from "@/types/auth";
import { handleAdminLogin } from "./useAdminAuth";
import { checkCafeOwnerExists, fetchCafeOwnerData } from "./useDatabaseAuth";
import { handleMockCafeOwnerLogin } from "./useMockCafeOwnerAuth";

/**
 * Hook for handling login functionality
 */
export const useLoginHandler = (setUser: (user: AppUser | null) => void, setIsLoading: (isLoading: boolean) => void) => {
  const { toast } = useToast();

  const login = async (username: string, password?: string) => {
    try {
      setIsLoading(true);
      console.log("Login attempt:", { username, hasPassword: !!password });
      
      // Reset debug info
      (window as any).loginDebugInfo = {};
      
      // For debugging - log the raw input value
      console.log("Raw input value:", username);
      
      // Try admin login first if password is provided
      if (password) {
        const adminUser = await handleAdminLogin(username, password);
        if (adminUser) {
          setUser(adminUser);
          toast({
            title: "Login Successful",
            description: `Welcome, ${adminUser.username}!`,
          });
          return Promise.resolve();
        }
      }

      // Try database login for cafe owners without multiple attempts
      let cafeOwnerExists = null;
      
      // Спробуємо один раз підключитись до бази
      console.log("Attempting to find user in database...");      
      cafeOwnerExists = await checkCafeOwnerExists(username);
      
      // If user exists in database, fetch full data and login
      if (cafeOwnerExists) {
        try {
          console.log("User found in database, fetching complete data");
          const cafeOwnerData = await fetchCafeOwnerData(cafeOwnerExists.id);
          
          setUser(cafeOwnerData);
          toast({
            title: "Login Successful",
            description: `Welcome, ${cafeOwnerData.username}!`,
          });
          return Promise.resolve();
        } catch (fetchError) {
          console.error("Error fetching cafe owner data:", fetchError);
          throw new Error(`Database user data fetch error: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}`);
        }
      } 
      
      // Try mock cafe owner login if not found in database
      const mockUser = handleMockCafeOwnerLogin(username);
      if (mockUser) {
        setUser(mockUser);
        toast({
          title: "Test Mode Login Successful",
          description: `Welcome, ${mockUser.username}! (using test data)`,
        });
        return Promise.resolve();
      }
      
      throw new Error(`User '${username}' not found`);
    } catch (error) {
      let message = "Login error";
      if (error instanceof Error) {
        message = error.message;
      }

      console.error("Login error:", error);

      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: message,
      });

      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { login };
};
