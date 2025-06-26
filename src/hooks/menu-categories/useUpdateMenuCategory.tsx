import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useUpdateMenuCategory = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const updateCategory = async (categoryId: string, name: string) => {
    setIsUpdating(true);
    try {
      console.log('[DEBUG] useUpdateMenuCategory: Updating category', { categoryId, name });

      const { data, error } = await supabase
        .from('menu_categories')
        .update({ name })
        .eq('id', categoryId)
        .select()
        .single();

      if (error) {
        console.error('[ERROR] useUpdateMenuCategory: Database error:', error);
        throw error;
      }

      console.log('[DEBUG] useUpdateMenuCategory: Category updated successfully:', data);
      
      toast({
        title: 'Success',
        description: 'Category updated successfully'
      });

      return data;
    } catch (err) {
      console.error('[ERROR] useUpdateMenuCategory: Failed to update category:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update category'
      });
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateCategory, isUpdating };
};
