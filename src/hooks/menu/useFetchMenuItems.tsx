import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { MenuItem, MenuItemVariant } from "@/types/models";
import { supabase } from "@/integrations/supabase/client";

export const useFetchMenuItems = (cafeId: string | null) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchMenuItems = useCallback(async () => {
    if (!cafeId) {
      console.log("[DEBUG] useFetchMenuItems: No cafeId provided");
      setMenuItems([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log("[DEBUG] useFetchMenuItems: Fetching menu items for cafeId:", cafeId);
      
      const { data, error } = await supabase
        .from("menu_items")
        .select(`
          *,
          menu_categories!inner(cafe_id)
        `)
        .eq("menu_categories.cafe_id", cafeId)
        .order("order");
      
      console.log("[DEBUG] useFetchMenuItems: Query result:", { data, error });
      
      if (error) {
        console.error("[ERROR] useFetchMenuItems: Database error:", error);
        setError(error.message);
        return;
      }
      
      if (data) {
        const mappedItems = data.map(item => ({
          id: item.id,
          categoryId: item.category_id,
          name: item.name,
          description: item.description || undefined,
          price: typeof item.price === "string" ? parseFloat(item.price) : item.price,
          weight: item.weight || undefined,
          imageUrl: item.image_url || undefined,
          variants: item.variants as MenuItemVariant[] || undefined,
          order: item.order || 0,
          createdAt: item.created_at
        }));
        
        console.log("[DEBUG] useFetchMenuItems: Mapped items:", mappedItems);
        setMenuItems(mappedItems);
      } else {
        setMenuItems([]);
      }
    } catch (err) {
      console.error("[ERROR] useFetchMenuItems: Unexpected error:", err);
      setError("Failed to fetch menu items");
      toast({
        variant: "destructive",
        title: "Error loading menu items",
        description: "Failed to fetch menu items"
      });
    } finally {
      setLoading(false);
    }
  }, [cafeId, toast]);

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  return {
    menuItems,
    loading,
    error,
    fetchMenuItems,
    setMenuItems
  };
};
