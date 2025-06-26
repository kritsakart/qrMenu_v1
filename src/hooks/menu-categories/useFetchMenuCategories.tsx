import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MenuCategory, mapSupabaseMenuCategory } from "@/types/models";
import { useToast } from "@/hooks/use-toast";

export const useFetchMenuCategories = (cafeId: string) => {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      if (!cafeId) {
        console.log("❌ useFetchMenuCategories: No cafeId provided");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        console.log("🔍 useFetchMenuCategories: Fetching categories for cafeId:", cafeId);
        console.log("🔍 useFetchMenuCategories: Using regular supabase client (RLS disabled)");

        const { data, error } = await supabase
          .from('menu_categories')
          .select('*')
          .eq('cafe_id', cafeId)
          .order('order');

        console.log("🔍 useFetchMenuCategories: Raw response:", { data, error });
        console.log("🔍 useFetchMenuCategories: Data length:", data?.length || 0);

        if (error) {
          console.error("❌ useFetchMenuCategories: Supabase error:", error);
          throw error;
        }

        if (!data) {
          console.log("⚠️ useFetchMenuCategories: No data returned (null)");
          setCategories([]);
          return;
        }

        if (data.length === 0) {
          console.log("⚠️ useFetchMenuCategories: Empty array returned - no categories found for this cafe");
          setCategories([]);
          return;
        }

        console.log("✅ useFetchMenuCategories: Found categories:", data.map(cat => ({
          id: cat.id,
          name: cat.name,
          cafeId: cat.cafe_id,
          order: cat.order
        })));

        const mappedCategories = data.map(mapSupabaseMenuCategory);
        console.log("✅ useFetchMenuCategories: Mapped categories:", mappedCategories);
        
        setCategories(mappedCategories);

      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        console.error("❌ useFetchMenuCategories: Error:", error);
        setError(error);
        
        toast({
          variant: "destructive",
          title: "Error loading categories",
          description: error.message
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [cafeId, toast]);

  return { categories, isLoading, error };
}; 