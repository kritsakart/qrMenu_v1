import { useState, useEffect } from "react";
import { AppUser } from "@/types/auth";
import { getStoredUser, setStoredUser, clearStoredUser } from "./useStoredUser";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook for managing authentication state
 */
export const useAuthState = () => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from storage on component mount
  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);

    // Додаємо слухача змін стану авторизації Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("✨ Supabase auth state changed in useAuthState:", event, session);
        if (session) {
          // Якщо є сесія, намагаємося отримати профіль користувача з таблиці cafe_owners
          const { data: profileData, error: profileError } = await supabase
            .from('cafe_owners') // Використовуємо таблицю cafe_owners
            .select('id') // Отримуємо тільки id
            .eq('id', session.user.id)
            .single();

          if (profileError && profileError.code !== 'PGRST116') { // PGRST116 означає "Row not found"
            console.error("❌ Error fetching user profile from cafe_owners:", profileError);
            clearStoredUser();
            setUser(null);
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
            setStoredUser(appUser);
            setUser(appUser);
            setIsLoading(false);
          } else {
            // Користувач не є власником кафе (або супер-адмін, або просто авторизований користувач без кафе)
            const defaultUser: AppUser = {
              id: session.user.id,
              email: session.user.email || '',
              username: session.user.email || session.user.id,
              role: 'public', // Роль за замовчуванням
              cafeId: undefined,
            };
            setStoredUser(defaultUser);
            setUser(defaultUser);
            setIsLoading(false);
          }
        } else {
          // Сесія відсутня, очищаємо дані користувача
          console.log("🔴 Supabase session cleared in useAuthState. Clearing user.");
          clearStoredUser();
          setUser(null);
          setIsLoading(false);
        }
      }
    );

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
