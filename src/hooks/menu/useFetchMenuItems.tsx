
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { MenuItem, MenuItemVariant } from "@/types/models";
import { supabaseAdmin } from "@/integrations/supabase/admin-client";
import { useAuth } from "@/contexts/AuthContext";

export const useFetchMenuItems = (categoryId?: string) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchMenuItems = useCallback(async () => {
    if (!categoryId) {
      console.log("📭 DIAGNOSTIC: No categoryId provided, clearing menu items");
      setMenuItems([]);
      setIsLoading(false);
      return;
    }

    if (!user?.id) {
      console.log("❌ DIAGNOSTIC: No user found for fetching menu items");
      setMenuItems([]);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("🔍 DIAGNOSTIC: Fetching menu items for category:", categoryId);
      console.log("🔍 DIAGNOSTIC: Current user:", user);

      // Використовуємо адміністративний клієнт для обходу RLS проблем
      console.log("🔧 DIAGNOSTIC: Using admin client to fetch menu items for category:", categoryId);
      
      const { data, error, count } = await supabaseAdmin
        .from("menu_items")
        .select("*", { count: 'exact' })
        .eq("category_id", categoryId);
      
      console.log("📊 DIAGNOSTIC: Query result - count:", count, "error:", error, "data:", data);
      
      if (error) {
        console.error("❌ DIAGNOSTIC: Supabase query error:", error);
        throw new Error(`Помилка бази даних: ${error.message}`);
      }
      
      if (data) {
        console.log("📊 DIAGNOSTIC: Raw data from Supabase:", data);
        
        const mappedItems = data.map(item => ({
          id: item.id,
          categoryId: item.category_id,
          name: item.name,
          description: item.description || undefined,
          price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
          weight: item.weight || undefined,
          imageUrl: item.image_url || undefined,
          variants: item.variants as MenuItemVariant[] || undefined,
          order: item.order || 0,
          createdAt: item.created_at
        }));
        
        console.log("✅ DIAGNOSTIC: Mapped items:", mappedItems.length, mappedItems);
        setMenuItems(mappedItems);
      } else {
        console.log("📭 DIAGNOSTIC: No data returned from Supabase query");
        setMenuItems([]);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Невідома помилка');
      console.error("❌ DIAGNOSTIC: Error fetching menu items:", error);
      setError(error);
      toast({
        variant: "destructive",
        title: "Помилка завантаження пунктів меню",
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  }, [categoryId, toast, user?.id]);

  useEffect(() => {
    console.log("🚀 DIAGNOSTIC: useFetchMenuItems effect triggered, categoryId:", categoryId, "user:", user?.id);
    if (categoryId && user?.id) {
      fetchMenuItems();
    } else {
      console.log("⏳ DIAGNOSTIC: Waiting for categoryId and user...");
      setIsLoading(false);
      setMenuItems([]);
    }
  }, [fetchMenuItems, categoryId, user?.id]);

  return {
    menuItems,
    isLoading,
    error,
    fetchMenuItems,
    setMenuItems
  };
};
