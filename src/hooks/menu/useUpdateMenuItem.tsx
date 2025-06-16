
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { MenuItem } from "@/types/models";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type UpdateMenuItemData = {
  name?: string;
  description?: string;
  price?: number;
  weight?: string;
  imageUrl?: string;
};

export const useUpdateMenuItem = (onItemUpdated: (items: MenuItem[]) => void, menuItems: MenuItem[]) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const updateMenuItem = useCallback(async (
    id: string,
    data: UpdateMenuItemData
  ) => {
    console.log("🔄 DIAGNOSTIC: updateMenuItem викликано:", { id, data });
    console.log("🔍 DIAGNOSTIC: updateMenuItem - поточний користувач:", user);
    
    if (!user?.id) {
      console.error("❌ DIAGNOSTIC: No user found for updating menu item");
      toast({
        variant: "destructive",
        title: "Помилка",
        description: "Не знайдено користувача для оновлення пункту меню"
      });
      return false;
    }

    try {
      // Set user context for RLS
      console.log("🔧 DIAGNOSTIC: Setting user context for RLS:", user.id);
      const { error: contextError } = await supabase.rpc('set_current_user_id', { user_id: user.id });
      
      if (contextError) {
        console.error("❌ DIAGNOSTIC: Error setting user context:", contextError);
        throw new Error(`Помилка встановлення контексту: ${contextError.message}`);
      }

      const updates: any = {};
      
      if (data.name !== undefined) updates.name = data.name;
      if (data.description !== undefined) updates.description = data.description || null;
      if (data.price !== undefined) updates.price = data.price; // Ensure this is a number
      if (data.weight !== undefined) updates.weight = data.weight || null;
      if (data.imageUrl !== undefined) updates.image_url = data.imageUrl || null;
      
      console.log("🔄 DIAGNOSTIC: Updating menu item with data:", { id, updates });
      
      const { error } = await supabase
        .from("menu_items")
        .update(updates)
        .eq("id", id);
      
      if (error) {
        console.error("❌ DIAGNOSTIC: Supabase update error:", error);
        throw new Error(`Помилка оновлення пункту меню: ${error.message}`);
      }
      
      const updatedItems = menuItems.map(item => 
        item.id === id 
          ? { 
              ...item, 
              ...(data.name !== undefined ? { name: data.name } : {}),
              ...(data.description !== undefined ? { description: data.description } : {}),
              ...(data.price !== undefined ? { price: data.price } : {}),
              ...(data.weight !== undefined ? { weight: data.weight } : {}),
              ...(data.imageUrl !== undefined ? { imageUrl: data.imageUrl } : {})
            }
          : item
      );
      
      console.log("✅ DIAGNOSTIC: Updated menu items:", updatedItems);
      onItemUpdated(updatedItems);
      
      toast({
        title: "Пункт меню оновлено",
        description: `Пункт меню успішно оновлено.`,
      });
      
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Невідома помилка');
      console.error("❌ DIAGNOSTIC: Error updating menu item:", error);
      toast({
        variant: "destructive",
        title: "Помилка оновлення пункту меню",
        description: error.message
      });
      return false;
    }
  }, [toast, menuItems, onItemUpdated, user?.id]);

  return { updateMenuItem };
};
