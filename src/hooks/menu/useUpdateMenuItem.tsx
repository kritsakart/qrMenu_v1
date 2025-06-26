import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MenuItemFormState } from '@/components/menu-builder/dialogs/types';
import { MenuItem } from '@/types/models';

export const useUpdateMenuItem = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const updateMenuItem = async (itemId: string, formData: MenuItemFormState): Promise<MenuItem | undefined> => {
    setIsUpdating(true);
    try {
      console.log('[DEBUG] useUpdateMenuItem: Updating menu item', { itemId, formData });

      // Prepare the data for update
      const itemData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        price: parseFloat(formData.price) || 0,
        weight: formData.weight.trim() ? `${formData.weight.trim()} ${formData.weightUnit}` : null,
        image_url: formData.imageUrl.trim() || null,
        variants: formData.variants.length > 0 ? formData.variants.map(v => ({
          id: v.id,
          name: v.name,
          price: parseFloat(v.price) || 0,
          isDefault: v.isDefault
        })) : null
      };

      const { data, error } = await supabase
        .from('menu_items')
        .update(itemData)
        .eq('id', itemId)
        .select()
        .single();

      if (error) {
        console.error('[ERROR] useUpdateMenuItem: Database error:', error);
        throw error;
      }

      console.log('[DEBUG] useUpdateMenuItem: Menu item updated successfully:', data);

      // Map back to MenuItem format
      const menuItem: MenuItem = {
        id: data.id,
        categoryId: data.category_id,
        name: data.name,
        description: data.description,
        price: data.price,
        weight: data.weight,
        imageUrl: data.image_url,
        variants: data.variants as any, // JSON data from database
        order: data.order,
        createdAt: data.created_at
      };
      
      toast({
        title: 'Success',
        description: `${formData.name} has been updated`
      });

      return menuItem;
    } catch (err) {
      console.error('[ERROR] useUpdateMenuItem: Failed to update menu item:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update menu item'
      });
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateMenuItem, isUpdating };
};
