
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { MenuItem } from "@/types/models";
import { supabaseAdmin } from "@/integrations/supabase/admin-client";
import { useAuth } from "@/contexts/AuthContext";

export const useDeleteMenuItem = (onItemDeleted: (items: MenuItem[]) => void, menuItems: MenuItem[]) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const deleteMenuItem = useCallback(async (id: string) => {
    console.log("🗑️ DIAGNOSTIC: deleteMenuItem викликано:", id);
    console.log("🔍 DIAGNOSTIC: deleteMenuItem - поточний користувач:", user);
    
    if (!user?.id) {
      console.error("❌ DIAGNOSTIC: No user found for deleting menu item");
      toast({
        variant: "destructive",
        title: "Помилка",
        description: "Не знайдено користувача для видалення пункту меню"
      });
      return false;
    }

    try {
      // Використовуємо адміністративний клієнт для обходу RLS проблем
      console.log("🗑️ DIAGNOSTIC: Deleting menu item with id:", id);
      
      const { error } = await supabaseAdmin
        .from("menu_items")
        .delete()
        .eq("id", id);
      
      if (error) {
        console.error("❌ DIAGNOSTIC: Supabase delete error:", error);
        throw new Error(`Помилка видалення пункту меню: ${error.message}`);
      }
      
      const updatedItems = menuItems.filter(item => item.id !== id);
      console.log("✅ DIAGNOSTIC: Updated menu items after deletion:", updatedItems);
      onItemDeleted(updatedItems);
      
      toast({
        title: "Пункт меню видалено",
        description: `Пункт меню успішно видалено.`,
      });
      
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Невідома помилка');
      console.error("❌ DIAGNOSTIC: Error deleting menu item:", error);
      toast({
        variant: "destructive",
        title: "Помилка видалення пункту меню",
        description: error.message
      });
      return false;
    }
  }, [toast, menuItems, onItemDeleted, user?.id]);

  return { deleteMenuItem };
};
