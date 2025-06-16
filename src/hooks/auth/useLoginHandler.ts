
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
            title: "Успішний вхід",
            description: `Вітаємо, ${adminUser.username}!`,
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
            title: "Успішний вхід",
            description: `Вітаємо, ${cafeOwnerData.username}!`,
          });
          return Promise.resolve();
        } catch (fetchError) {
          console.error("Error fetching cafe owner data:", fetchError);
          throw new Error(`Помилка отримання даних користувача: ${fetchError instanceof Error ? fetchError.message : 'Невідома помилка'}`);
        }
      } 
      
      // Try mock cafe owner login if not found in database
      const mockUser = handleMockCafeOwnerLogin(username);
      if (mockUser) {
        setUser(mockUser);
        toast({
          title: "Успішний вхід у тестовому режимі",
          description: `Вітаємо, ${mockUser.username}! (використано тестові дані)`,
        });
        return Promise.resolve();
      }
      
      throw new Error(`Користувача '${username}' не знайдено`);
    } catch (error) {
      let message = "Login error";
      if (error instanceof Error) {
        message = error.message;
      }

      console.error("Login error:", error);

      toast({
        variant: "destructive",
        title: "Помилка автентифікації",
        description: message,
      });

      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { login };
};
