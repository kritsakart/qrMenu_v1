import { useState, useEffect } from "react";
import { AppUser } from "@/types/auth";
import { getStoredUser, setStoredUser, clearStoredUser } from "./useStoredUser";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook for managing authentication state
 */
export const useAuthState = () => {
  console.log("🎯 useAuthState: Hook called!", new Date().toISOString());
  
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to check if user is a mock/local user
  const isMockUser = (user: AppUser | null): boolean => {
    if (!user) return false;
    
    console.log("🔍 isMockUser check:", {
      id: user.id,
      email: user.email,
      username: user.username,
      idStartsWithAdmin: user.id.startsWith('admin-'),
      idStartsWithCafe: user.id.startsWith('cafe-'),
      emailIncludesMock: user.email?.includes('@mock.com'),
      usernameIncludesMock: user.username?.includes('mock')
    });
    
    const isSpecialPrefix = user.id.startsWith('admin-') || user.id.startsWith('cafe-');
    const isMockEmail = user.email?.includes('@mock.com');
    const isMockUsername = user.username?.includes('mock');
    
    const result = isSpecialPrefix || isMockEmail || isMockUsername;
    
    console.log("🔍 isMockUser result:", result, "for user:", user.id);
    
    return result;
  };

  // Initialize auth state from storage on component mount
  useEffect(() => {
    console.log("🚀 Initializing auth state...");
    
    const storedUser = getStoredUser();
    if (storedUser) {
      console.log("📱 Found stored user:", storedUser);
      
      // If it's a mock user, set it immediately and don't wait for Supabase
      if (isMockUser(storedUser)) {
        console.log("✅ Mock user detected, setting immediately");
        setUser(storedUser);
        setIsLoading(false);
      } else {
        console.log("🔍 Real user detected, waiting for Supabase session");
        setUser(storedUser); // Set user but keep loading true
      }
    } else {
      console.log("❌ No stored user found");
    }

    // Додаємо слухача змін стану авторизації Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("✨ Supabase auth state changed:", event, session?.user?.id || 'no session');
        
        // Отримуємо поточного користувача з localStorage
        const currentStoredUser = getStoredUser();
        
        // КРИТИЧНО: Якщо є збережений mock користувач, НІКОЛИ не перезаписуємо його
        if (currentStoredUser && isMockUser(currentStoredUser)) {
          console.log("🔒 PRESERVING mock user, ignoring Supabase session:", currentStoredUser.id);
          setUser(currentStoredUser);
          setIsLoading(false);
          return; // ВАЖЛИВО: повертаємося раніше, не обробляємо Supabase сесію
        }
        
        if (session) {
          console.log("🔑 Processing Supabase session for user:", session.user.id);
          
          // Якщо є сесія, намагаємося отримати профіль користувача з таблиці cafe_owners
          const { data: profileData, error: profileError } = await supabase
            .from('cafe_owners')
            .select('id')
            .eq('id', session.user.id)
            .single();

          if (profileError && profileError.code !== 'PGRST116') {
            console.error("❌ Error fetching user profile from cafe_owners:", profileError);
            // Не очищаємо localStorage користувача, можливо це mock user
            if (currentStoredUser && currentStoredUser.id !== session.user.id) {
              console.log("🔄 Different user session detected, updating...");
              clearStoredUser();
              setUser(null);
            }
            setIsLoading(false);
            return;
          }

          if (profileData) {
            // Користувач є власником кафе
            const appUser: AppUser = {
              id: session.user.id,
              email: session.user.email || '',
              username: session.user.email || session.user.id,
              role: 'cafe_owner',
              cafeId: profileData.id,
            };
            console.log("✅ Setting cafe owner user:", appUser.id);
            setStoredUser(appUser);
            setUser(appUser);
            setIsLoading(false);
          } else {
            // Користувач не є власником кафе
            const defaultUser: AppUser = {
              id: session.user.id,
              email: session.user.email || '',
              username: session.user.email || session.user.id,
              role: 'public',
              cafeId: undefined,
            };
            console.log("✅ Setting public user:", defaultUser.id);
            setStoredUser(defaultUser);
            setUser(defaultUser);
            setIsLoading(false);
          }
        } else {
          console.log("❌ No Supabase session");
          
          // Сесія відсутня - перевіряємо чи є збережений користувач
          if (currentStoredUser) {
            console.log("🔍 No session but found stored user:", currentStoredUser.id);
            
            // Якщо це mock user, ОБОВ'ЯЗКОВО залишаємо його
            if (isMockUser(currentStoredUser)) {
              console.log("🔒 PRESERVING mock user after session loss:", currentStoredUser.id);
              setUser(currentStoredUser);
              setIsLoading(false);
              return;
            }
            
            // Якщо це був справжній Supabase користувач, очищаємо його
            console.log("🔴 Real user session lost, clearing user");
            clearStoredUser();
            setUser(null);
          } else {
            console.log("❌ No session and no stored user");
            setUser(null);
          }
          setIsLoading(false);
        }
      }
    );

    // Для випадку, коли немає збереженого користувача, встановлюємо isLoading в false через короткий час
    if (!storedUser) {
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 1000); // Даємо Supabase 1 секунду на ініціалізацію
      
      return () => {
        clearTimeout(timeout);
        subscription.unsubscribe();
      };
    }

    // Очистка підписки при розмонтуванні компонента
    return () => {
      subscription.unsubscribe();
    };
  }, []); // Пустий масив залежностей, щоб ефект запускався лише раз при монтуванні

  return {
    user,
    setUser,
    isLoading,
    setIsLoading,
    isAuthenticated: !!user,
    isSuperAdmin: user?.role === "super_admin"
  };
};
