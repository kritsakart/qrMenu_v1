import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useDeleteMenuItem = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const deleteMenuItem = async (itemId: string, itemName: string) => {
    setIsDeleting(true);
    try {
      console.log('[DEBUG] useDeleteMenuItem: Deleting menu item', { itemId });

      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', itemId);

      if (error) {
        console.error('[ERROR] useDeleteMenuItem: Database error:', error);
        throw error;
      }

      console.log('[DEBUG] useDeleteMenuItem: Menu item deleted successfully');
      
      toast({
        title: 'Success',
        description: `${itemName} has been deleted from your menu`
      });

      return true;
    } catch (err) {
      console.error('[ERROR] useDeleteMenuItem: Failed to delete menu item:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete menu item'
      });
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteMenuItem, isDeleting };
};
