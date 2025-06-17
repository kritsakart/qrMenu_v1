
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { MenuItem } from "@/types/models";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type AddMenuItemData = {
  name: string;
  description?: string;
  price: number;
  weight?: string;
  imageUrl?: string;
};

export const useAddMenuItem = (onItemAdded: (item: MenuItem) => void) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const addMenuItem = useCallback(async (
    categoryId: string,
    data: AddMenuItemData
  ) => {
    console.log("🚀 DIAGNOSTIC: addMenuItem викликано з параметрами:", { categoryId, data });
    console.log("🔍 DIAGNOSTIC: addMenuItem - поточний користувач:", user);
    
    if (!user?.id) {
      console.error("❌ DIAGNOSTIC: No user found for adding menu item");
      toast({
        variant: "destructive",
        title: "Помилка",
        description: "Не знайдено користувача для створення пункту меню"
      });
      return null;
    }

    if (!categoryId || categoryId.trim() === '') {
      console.error("❌ DIAGNOSTIC: Invalid categoryId:", categoryId);
      toast({
        variant: "destructive",
        title: "Помилка",
        description: "Некоректний ID категорії"
      });
      return null;
    }

    try {
      console.log("🔧 DIAGNOSTIC: Adding menu item to category:", categoryId);
      
      console.log("🔧 DIAGNOSTIC: Proceeding directly to insert without category check");
      
      // Create a properly formatted object for Supabase insert
      const itemData = {
        category_id: categoryId,
        name: data.name.trim(),
        description: (data.description && data.description.trim() !== '') ? data.description.trim() : null,
        price: Number(data.price),
        weight: (data.weight && data.weight.trim() !== '') ? data.weight.trim() : null,
        image_url: (data.imageUrl && data.imageUrl.trim() !== '') ? data.imageUrl.trim() : null
      };

      console.log("📤 DIAGNOSTIC: Final itemData object:", itemData);
      console.log("📤 DIAGNOSTIC: itemData keys and types:", Object.keys(itemData).map(key => ({
        key,
        value: itemData[key as keyof typeof itemData],
        type: typeof itemData[key as keyof typeof itemData]
      })));

      // Використовуємо стандартний клієнт (RLS відключено)
      const { error: insertError, data: insertData } = await supabase
        .from("menu_items")
        .insert(itemData)
        .select()
        .single();

      if (insertError) {
        console.error("❌ DIAGNOSTIC: Supabase RPC error:", insertError);
        console.error("❌ DIAGNOSTIC: Error details:", {
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint,
          code: insertError.code
        });
        throw new Error(`Помилка додавання пункту меню: ${insertError.message}`);
      }

      if (insertData) {
        console.log("✅ DIAGNOSTIC: Data returned from insert:", insertData);
        
        const newItem: MenuItem = {
          id: insertData.id,
          categoryId: insertData.category_id,
          name: insertData.name,
          description: insertData.description || undefined,
          price: typeof insertData.price === 'string' ? parseFloat(insertData.price) : insertData.price,
          weight: insertData.weight || undefined,
          imageUrl: insertData.image_url || undefined,
          createdAt: insertData.created_at
        };

        console.log("📝 DIAGNOSTIC: Adding item to local state:", newItem);
        onItemAdded(newItem);

        toast({
          title: "Пункт меню додано",
          description: `"${data.name}" успішно додано до меню.`,
        });

        return newItem;
      }
      
      return null;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Невідома помилка');
      console.error("❌ DIAGNOSTIC: Error adding menu item:", error);
      toast({
        variant: "destructive",
        title: "Помилка додавання пункту меню",
        description: error.message
      });
      return null;
    }
  }, [toast, user?.id, onItemAdded]);

  return { addMenuItem };
};
