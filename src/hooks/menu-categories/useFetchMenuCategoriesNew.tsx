import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';

export const useFetchMenuCategoriesNew = (cafeId: string | null) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!cafeId) {
      console.log('[DEBUG] useFetchMenuCategoriesNew: No cafeId provided');
      return;
    }

    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log(`[DEBUG] useFetchMenuCategoriesNew: Fetching categories for cafe ${cafeId}`);
        
        const { data, error } = await supabase
          .from('menu_categories')
          .select('*')
          .eq('cafe_id', cafeId)
          .order('order', { ascending: true });

        if (error) {
          console.error('Error fetching categories:', error);
          setError(error.message);
          toast({
            title: "Error",
            description: "Failed to fetch categories",
            variant: "destructive"
          });
          return;
        }

        console.log('[DEBUG] useFetchMenuCategoriesNew: Categories fetched successfully:', data);
        setCategories(data || []);
      } catch (err) {
        console.error('Error in fetchCategories:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        toast({
          title: "Error",
          description: "Failed to fetch categories",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [cafeId, toast]);

  return {
    categories,
    loading,
    error
  };
}; 