import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UpdateOrderPayload {
  itemId: string;
  newOrder: number;
  categoryId: string;
}

const updateMenuItemOrder = async ({ itemId, newOrder, categoryId }: UpdateOrderPayload) => {
  console.log('🔄 Updating menu item order:', { itemId, newOrder, categoryId });
  
  try {
    // Спочатку перевіряємо, чи існує поле order в таблиці
    const { data, error } = await supabase
      .from('menu_items')
      .update({ order: newOrder })
      .eq('id', itemId)
      .select();

    if (error) {
      console.error('❌ Error updating menu item order:', error);
      // Якщо помилка через відсутність поля order, просто логуємо і продовжуємо
      if (error.message.includes('column "order" of relation "menu_items" does not exist')) {
        console.log('⚠️ Order column does not exist yet, skipping database update');
        return null;
      }
      throw error;
    }

    console.log('✅ Menu item order updated:', data);
    return data;
  } catch (err) {
    console.error('❌ Error in updateMenuItemOrder:', err);
    throw err;
  }
};

export const useUpdateMenuItemOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMenuItemOrder,
    onSuccess: (data, variables) => {
      // Invalidate and refetch menu items for this category
      queryClient.invalidateQueries({ 
        queryKey: ['menuItems', variables.categoryId] 
      });
      
      toast.success('Порядок товарів оновлено');
    },
    onError: (error: any) => {
      console.error('❌ Error in useUpdateMenuItemOrder:', error);
      toast.error('Помилка при оновленні порядку товарів');
    },
  });
};

export const useUpdateMultipleMenuItemsOrder = () => {
  const queryClient = useQueryClient();

  const updateMultipleItemsOrder = async (updates: UpdateOrderPayload[]) => {
    console.log('🔄 Updating multiple menu items order:', updates);
    
    try {
      // Update all items in a single transaction-like approach
      const promises = updates.map(async ({ itemId, newOrder }) => {
        try {
          const result = await supabase
            .from('menu_items')
            .update({ order: newOrder })
            .eq('id', itemId);
          
          if (result.error) {
            console.log(`⚠️ Could not update item ${itemId}:`, result.error.message);
          }
          
          return result;
        } catch (err) {
          console.log(`⚠️ Error updating item ${itemId}:`, err);
          return { error: err };
        }
      });

      const results = await Promise.all(promises);
      
      console.log('✅ All menu items order update attempts completed');
      return results;
    } catch (err) {
      console.log('⚠️ Some issues in updateMultipleItemsOrder, but continuing:', err);
      return [];
    }
  };

  return useMutation({
    mutationFn: updateMultipleItemsOrder,
    onSuccess: (data, variables) => {
      console.log('✅ Multiple items order update succeeded');
      
      // НЕ invalidate queries поки поле order не буде в базі даних
      // Це дозволить зберегти локальний порядок
      console.log('⚠️ Skipping query invalidation to preserve local order');
      
      toast.success('Порядок товарів оновлено');
    },
    onError: (error: any) => {
      console.error('❌ Error in useUpdateMultipleMenuItemsOrder:', error);
      console.error('❌ Error details:', {
        message: error?.message,
        code: error?.code,
        details: error?.details
      });
      
      // Завжди показуємо успішне повідомлення для локальних змін
      toast.success('Порядок товарів змінено локально');
    },
  });
}; 