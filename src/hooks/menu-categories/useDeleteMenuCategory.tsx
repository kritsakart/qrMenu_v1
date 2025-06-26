import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useDeleteMenuCategory = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const deleteCategory = async (categoryId: string) => {
    setIsDeleting(true);
    try {
      console.log('[DEBUG] useDeleteMenuCategory: Deleting category', { categoryId });

      // First delete all menu items in this category
      const { error: itemsError } = await supabase
        .from('menu_items')
        .delete()
        .eq('category_id', categoryId);

      if (itemsError) {
        console.error('[ERROR] useDeleteMenuCategory: Error deleting menu items:', itemsError);
        throw itemsError;
      }

      // Then delete the category
      const { error: categoryError } = await supabase
        .from('menu_categories')
        .delete()
        .eq('id', categoryId);

      if (categoryError) {
        console.error('[ERROR] useDeleteMenuCategory: Error deleting category:', categoryError);
        throw categoryError;
      }

      console.log('[DEBUG] useDeleteMenuCategory: Category and items deleted successfully');
      
      toast({
        title: 'Success',
        description: 'Category and all menu items deleted successfully'
      });

      return true;
    } catch (err) {
      console.error('[ERROR] useDeleteMenuCategory: Failed to delete category:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete category'
      });
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteCategory, isDeleting };
};
