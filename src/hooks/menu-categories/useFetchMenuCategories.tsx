
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { MenuCategory } from "@/types/models";
import { supabaseAdmin } from "@/integrations/supabase/admin-client";
import { useAuth } from "@/contexts/AuthContext";

export const useFetchMenuCategories = () => {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  console.log("🔍 DIAGNOSTIC: useFetchMenuCategories - поточний користувач:", user);
  console.log("🔍 DIAGNOSTIC: useFetchMenuCategories - user.cafeId:", user?.cafeId);
  
  const fetchCategories = useCallback(async () => {
    if (!user?.cafeId) {
      console.log("❌ DIAGNOSTIC: No user or cafeId found, skipping category fetch. User:", user);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("🔍 DIAGNOSTIC: Fetching menu categories for cafe:", user.cafeId);
      
      // Використовуємо адміністративний клієнт - напряму фільтруємо по cafe_id
      const { data, error, count } = await supabaseAdmin
        .from("menu_categories")
        .select("*", { count: 'exact' })
        .eq("cafe_id", user.cafeId)
        .order("order", { ascending: true });
      
      console.log("📊 DIAGNOSTIC: Query result - count:", count, "error:", error, "data:", data);
      
      if (error) {
        console.error("❌ DIAGNOSTIC: Supabase query error:", error);
        throw new Error(`Помилка бази даних: ${error.message}`);
      }
      
      console.log("📊 DIAGNOSTIC: Raw data from Supabase:", data);
      
      if (data && data.length > 0) {
        const mappedCategories = data.map(category => ({
          id: category.id,
          cafeId: category.cafe_id,
          name: category.name,
          order: category.order,
          createdAt: category.created_at
        }));
        
        console.log("✅ DIAGNOSTIC: Mapped categories:", mappedCategories.length, mappedCategories);
        setCategories(mappedCategories);
      } else {
        console.log("📭 DIAGNOSTIC: No categories found in database for cafe:", user.cafeId);
        setCategories([]);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Невідома помилка');
      console.error("❌ DIAGNOSTIC: Error fetching menu categories:", error);
      setError(error);
      toast({
        variant: "destructive",
        title: "Помилка завантаження категорій",
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, user?.cafeId]);

  useEffect(() => {
    console.log("🚀 DIAGNOSTIC: useFetchMenuCategories effect triggered, user?.cafeId:", user?.cafeId);
    if (user?.cafeId) {
      fetchCategories();
    } else {
      console.log("⏳ DIAGNOSTIC: Waiting for user authentication...");
      setIsLoading(false);
    }
  }, [fetchCategories, user?.cafeId]);

  return {
    categories,
    setCategories,
    isLoading,
    error,
    fetchCategories
  };
};
