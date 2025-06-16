
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { MenuCategory } from "@/types/models";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useAddMenuCategory = (
  categories: MenuCategory[],
  onCategoryAdded: (category: MenuCategory) => void
) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const addCategory = useCallback(async (name: string, order?: number) => {
    console.log("🚀 DIAGNOSTIC: addCategory викликано з параметрами:", { name, order });
    console.log("🔍 DIAGNOSTIC: addCategory - поточний користувач:", user);
    console.log("🔍 DIAGNOSTIC: addCategory - user.cafeId:", user?.cafeId);
    
    if (!user?.cafeId) {
      console.error("❌ DIAGNOSTIC: No user or cafeId found for adding category");
      toast({
        variant: "destructive",
        title: "Помилка",
        description: "Не знайдено ID кафе для створення категорії"
      });
      return null;
    }
    
    try {
      const newOrder = order !== undefined ? order : categories.length + 1;
      
      console.log("🆕 DIAGNOSTIC: Adding new category:", { 
        cafe_id: user.cafeId, 
        name: name.trim(), 
        order: newOrder 
      });
      
      // Простий INSERT запит без RLS контексту
      const { data, error } = await supabase
        .from("menu_categories")
        .insert({
          cafe_id: user.cafeId,
          name: name.trim(),
          order: newOrder
        })
        .select()
        .single();
      
      if (error) {
        console.error("❌ DIAGNOSTIC: Supabase insert error:", error);
        console.error("❌ DIAGNOSTIC: Error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        
        toast({
          variant: "destructive",
          title: "Помилка створення категорії",
          description: `Помилка бази даних: ${error.message}`
        });
        return null;
      }
      
      console.log("✅ DIAGNOSTIC: Category created successfully:", data);
      
      if (data) {
        const newCategory: MenuCategory = {
          id: data.id,
          cafeId: data.cafe_id,
          name: data.name,
          order: data.order,
          createdAt: data.created_at
        };
        
        console.log("📝 DIAGNOSTIC: Adding category to local state:", newCategory);
        onCategoryAdded(newCategory);
        
        toast({
          title: "Категорію додано",
          description: `Категорія "${name}" успішно додана.`,
        });
        
        return newCategory;
      }
      return null;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Невідома помилка');
      console.error("❌ DIAGNOSTIC: Error adding menu category:", error);
      toast({
        variant: "destructive",
        title: "Помилка додавання категорії",
        description: error.message
      });
      return null;
    }
  }, [categories.length, toast, user?.cafeId, onCategoryAdded]);

  return { addCategory };
};
