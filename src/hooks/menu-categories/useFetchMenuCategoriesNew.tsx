import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MenuCategory, mapSupabaseMenuCategory } from "@/types/models";

export const useFetchMenuCategoriesNew = (cafeId: string | null) => {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cafeId) {
      console.log('[DEBUG] useFetchMenuCategoriesNew: No cafeId provided');
      setLoading(false);
      return;
    }

    const fetchCategories = async () => {
      try {
        console.log('[DEBUG] useFetchMenuCategoriesNew: Fetching categories for cafeId:', cafeId);
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('menu_categories')
          .select('*')
          .eq('cafe_id', cafeId)
          .order('order');

        if (error) {
          console.error('[ERROR] useFetchMenuCategoriesNew: Database error:', error);
          setError(error.message);
          return;
        }

        console.log('[DEBUG] useFetchMenuCategoriesNew: Fetched categories:', data);
        const mappedCategories = data ? data.map(mapSupabaseMenuCategory) : [];
        setCategories(mappedCategories);
      } catch (err) {
        console.error('[ERROR] useFetchMenuCategoriesNew: Unexpected error:', err);
        setError('Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [cafeId]);

  const refetch = () => {
    if (cafeId) {
      setLoading(true);
      // Re-trigger the effect by updating cafeId dependency
    }
  };

  return { categories, loading, error, refetch };
}; 