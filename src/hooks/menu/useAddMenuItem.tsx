import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MenuItemFormState } from '@/components/menu-builder/dialogs/types';
import { MenuItem } from '@/types/models';

export const useAddMenuItem = () => {
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const addMenuItem = async (categoryId: string, formData: MenuItemFormState): Promise<MenuItem | undefined> => {
    setIsAdding(true);
    try {
      console.log('[DEBUG] useAddMenuItem: Adding menu item', { categoryId, formData });

      // Prepare the data for insertion
      const itemData = {
        category_id: categoryId,
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
        })) : null,
        order: 0 // Default order, can be updated later
      };

      const { data, error } = await supabase
        .from('menu_items')
        .insert(itemData)
        .select()
        .single();

      if (error) {
        console.error('[ERROR] useAddMenuItem: Database error:', error);
        throw error;
      }

      console.log('[DEBUG] useAddMenuItem: Menu item added successfully:', data);

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
        description: `${formData.name} has been added to your menu`
      });

      return menuItem;
    } catch (err) {
      console.error('[ERROR] useAddMenuItem: Failed to add menu item:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add menu item'
      });
      throw err;
    } finally {
      setIsAdding(false);
    }
  };

  return { addMenuItem, isAdding };
};
