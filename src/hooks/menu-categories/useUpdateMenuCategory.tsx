
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { MenuCategory } from "@/types/models";
import { supabase } from "@/integrations/supabase/client";

export const useUpdateMenuCategory = (
  onCategoriesUpdated: (updatedCategories: MenuCategory[]) => void,
  categories: MenuCategory[]
) => {
  const { toast } = useToast();

  const updateCategory = useCallback(async (id: string, name: string, order?: number) => {
    try {
      const updates: { name: string; order?: number } = { name: name.trim() };
      if (order !== undefined) updates.order = order;
      
      console.log("🔄 Updating category:", { id, updates });
      
      const { error } = await supabase
        .from("menu_categories")
        .update(updates)
        .eq("id", id);
      
      if (error) {
        console.error("❌ Supabase update error:", error);
        throw new Error(`Помилка оновлення категорії: ${error.message}`);
      }
      
      console.log("✅ Category updated successfully");
      
      const updatedCategories = categories.map(cat => 
        cat.id === id 
          ? { ...cat, name: name.trim(), ...(order !== undefined ? { order } : {}) }
          : cat
      );
      
      onCategoriesUpdated(updatedCategories);
      
      toast({
        title: "Категорію оновлено",
        description: `Категорія успішно оновлена.`,
      });
      
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Невідома помилка');
      console.error("❌ Error updating menu category:", error);
      toast({
        variant: "destructive",
        title: "Помилка оновлення категорії",
        description: error.message
      });
      return false;
    }
  }, [toast, onCategoriesUpdated, categories]);

  return { updateCategory };
};
