
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { MenuItem } from "@/types/models";
import { supabase } from "@/integrations/supabase/client";
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

      // Set user context for RLS
      console.log("🔧 DIAGNOSTIC: Setting user context for RLS:", user.id);
      const { error: contextError } = await supabase.rpc('set_current_user_id', { user_id: user.id });
      
      if (contextError) {
        console.error("❌ DIAGNOSTIC: Error setting user context:", contextError);
        throw new Error(`Помилка встановлення контексту: ${contextError.message}`);
      }
      
      const { data, error, count } = await supabase
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
