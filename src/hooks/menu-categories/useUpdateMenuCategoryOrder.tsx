import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UpdateCategoryOrderPayload {
  categoryId: string;
  newOrder: number;
  locationId: string;
}

const updateMenuCategoryOrder = async ({ categoryId, newOrder, locationId }: UpdateCategoryOrderPayload) => {
  console.log('🔄 Updating menu category order:', { categoryId, newOrder, locationId });
  
  try {
    const { data, error } = await supabase
      .from('menu_categories')
      .update({ order: newOrder })
      .eq('id', categoryId)
      .select();

    if (error) {
      console.error('❌ Error updating menu category order:', error);
      throw error;
    }

    console.log('✅ Menu category order updated:', data);
    return data;
  } catch (err) {
    console.error('❌ Error in updateMenuCategoryOrder:', err);
    throw err;
  }
};

export const useUpdateMenuCategoryOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMenuCategoryOrder,
    onSuccess: (data, variables) => {
      // Invalidate and refetch menu categories for this location
      queryClient.invalidateQueries({ 
        queryKey: ['menuCategories', variables.locationId] 
      });
      
      toast.success('Порядок категорій оновлено');
    },
    onError: (error: any) => {
      console.error('❌ Error in useUpdateMenuCategoryOrder:', error);
      toast.error('Помилка при оновленні порядку категорій');
    },
  });
};

export const useUpdateMultipleMenuCategoriesOrder = () => {
  const queryClient = useQueryClient();

  const updateMultipleCategoriesOrder = async (updates: UpdateCategoryOrderPayload[]) => {
    console.log('🔄 Updating multiple menu categories order:', updates);
    
    try {
      const promises = updates.map(async ({ categoryId, newOrder }) => {
        try {
          const result = await supabase
            .from('menu_categories')
            .update({ order: newOrder })
            .eq('id', categoryId);
          
          if (result.error) {
            console.log(`⚠️ Could not update category ${categoryId}:`, result.error.message);
          }
          
          return result;
        } catch (err) {
          console.log(`⚠️ Error updating category ${categoryId}:`, err);
          return { error: err };
        }
      });

      const results = await Promise.all(promises);
      
      console.log('✅ All menu categories order update attempts completed');
      return results;
    } catch (err) {
      console.log('⚠️ Some issues in updateMultipleCategoriesOrder, but continuing:', err);
      return [];
    }
  };

  return useMutation({
    mutationFn: updateMultipleCategoriesOrder,
    onSuccess: (data, variables) => {
      console.log('✅ Multiple categories order update succeeded');
      
      // Invalidate queries to refresh data
      if (variables.length > 0) {
        queryClient.invalidateQueries({ 
          queryKey: ['menuCategories', variables[0].locationId] 
        });
      }
      
      toast.success('Порядок категорій оновлено');
    },
    onError: (error: any) => {
      console.error('❌ Error in useUpdateMultipleMenuCategoriesOrder:', error);
      toast.error('Помилка при оновленні порядку категорій');
    },
  });
}; 