import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useUpdateMenuCategoryOrder = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const updateCategoryOrder = async (categoryId: string, newOrder: number) => {
    setLoading(true);
    try {
      console.log(`[DEBUG] Updating category ${categoryId} to order ${newOrder}`);

      const { error } = await supabase
        .from('menu_categories')
        .update({ order: newOrder })
        .eq('id', categoryId);

      if (error) {
        console.error('Error updating category order:', error);
        toast({
          title: "Error",
          description: "Failed to update category order",
          variant: "destructive"
        });
        return false;
      }

      console.log(`[DEBUG] Successfully updated category ${categoryId} order to ${newOrder}`);
      return true;
    } catch (error) {
      console.error('Error updating category order:', error);
      toast({
        title: "Error", 
        description: "Failed to update category order",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const reorderCategories = async (categories: Array<{id: string, order?: number}>) => {
    setLoading(true);
    try {
      console.log('[DEBUG] Reordering categories:', categories);

      // Update all categories with new order
      const updates = categories.map((category, index) => ({
        id: category.id,
        order: index + 1
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('menu_categories')
          .update({ order: update.order })
          .eq('id', update.id);

        if (error) {
          console.error('Error updating category order:', error);
          toast({
            title: "Error",
            description: `Failed to update category order: ${error.message}`,
            variant: "destructive"
          });
          return false;
        }
      }

      toast({
        title: "Success",
        description: "Category order updated successfully"
      });
      
      return true;
    } catch (error) {
      console.error('Error reordering categories:', error);
      toast({
        title: "Error",
        description: "Failed to reorder categories",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateCategoryOrder,
    reorderCategories,
    loading
  };
}; 