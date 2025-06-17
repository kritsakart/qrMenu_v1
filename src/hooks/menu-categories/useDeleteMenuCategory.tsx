
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { MenuCategory } from "@/types/models";
import { supabaseAdmin } from "@/integrations/supabase/admin-client";

export const useDeleteMenuCategory = (
  onCategoriesUpdated: (updatedCategories: MenuCategory[]) => void,
  categories: MenuCategory[]
) => {
  const { toast } = useToast();

  const deleteCategory = useCallback(async (id: string) => {
    try {
      console.log("🗑️ Deleting category:", id);
      
      const { error } = await supabaseAdmin
        .from("menu_categories")
        .delete()
        .eq("id", id);
      
      if (error) {
        console.error("❌ Supabase delete error:", error);
        throw new Error(`Помилка видалення категорії: ${error.message}`);
      }
      
      console.log("✅ Category deleted successfully");
      
      const updatedCategories = categories.filter(cat => cat.id !== id);
      onCategoriesUpdated(updatedCategories);
      
      toast({
        title: "Категорію видалено",
        description: `Категорія успішно видалена.`,
      });
      
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Невідома помилка');
      console.error("❌ Error deleting menu category:", error);
      toast({
        variant: "destructive",
        title: "Помилка видалення категорії",
        description: error.message
      });
      return false;
    }
  }, [toast, onCategoriesUpdated, categories]);

  return { deleteCategory };
};
