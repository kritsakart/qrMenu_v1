import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useAddMenuCategory = () => {
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const addCategory = async (cafeId: string, name: string) => {
    setIsAdding(true);
    try {
      console.log("[DEBUG] useAddMenuCategory: Adding category", { cafeId, name });

      const { data, error } = await supabase
        .from("menu_categories")
        .insert({
          cafe_id: cafeId,
          name,
          order: 0
        })
        .select()
        .single();

      if (error) {
        console.error("[ERROR] useAddMenuCategory: Database error:", error);
        throw error;
      }

      console.log("[DEBUG] useAddMenuCategory: Category added successfully:", data);
      
      toast({
        title: "Success",
        description: "Category added successfully"
      });

      return data;
    } catch (err) {
      console.error("[ERROR] useAddMenuCategory: Failed to add category:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add category"
      });
      throw err;
    } finally {
      setIsAdding(false);
    }
  };

  return { addCategory, isAdding };
};
