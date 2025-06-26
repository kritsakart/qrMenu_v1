import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { MenuItem, MenuCategory } from "@/types/models";
import { useFetchMenuCategories } from "@/hooks/menu-categories/useFetchMenuCategories";
import { useFetchMenuItems } from "@/hooks/menu/useFetchMenuItems";
import { useAddMenuCategory } from "@/hooks/menu-categories/useAddMenuCategory";
import { useUpdateMenuCategory } from "@/hooks/menu-categories/useUpdateMenuCategory";
import { useDeleteMenuCategory } from "@/hooks/menu-categories/useDeleteMenuCategory";
import { useUpdateMenuCategoryOrder } from "@/hooks/menu-categories/useUpdateMenuCategoryOrder";
import { useAddMenuItem } from "@/hooks/menu/useAddMenuItem";
import { useUpdateMenuItem } from "@/hooks/menu/useUpdateMenuItem";
import { useDeleteMenuItem } from "@/hooks/menu/useDeleteMenuItem";
import { useAuth } from "@/contexts/AuthContext";
import { type MenuItemFormState } from "@/components/menu-builder/dialogs/MenuItemDialogs";

export const useMenuPageHandlers = (selectedCategoryId: string | null) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const cafeId = user?.cafeId || "";
  
  // Debug logging for user state
  console.log("🔍 useMenuPageHandlers - User:", user);
  console.log("🔍 useMenuPageHandlers - CafeId:", cafeId);
  
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);

  // Fetch data using the updated hook signature
  const { 
    categories, 
    isLoading: categoriesLoading, 
    error: categoriesError 
  } = useFetchMenuCategories(cafeId);

  const { 
    menuItems, 
    isLoading: menuItemsLoading, 
    error: menuItemsError,
    refetch: refreshMenuItems 
  } = useFetchMenuItems(selectedCategoryId);

  // Category operations
  const { addCategory } = useAddMenuCategory();
  const { updateCategory } = useUpdateMenuCategory();
  const { deleteCategory } = useDeleteMenuCategory();
  const { updateCategoryOrder } = useUpdateMenuCategoryOrder();

  // Menu item operations
  const { addMenuItem } = useAddMenuItem();
  const { updateMenuItem } = useUpdateMenuItem();
  const { deleteMenuItem } = useDeleteMenuItem();

  const handleAddCategory = useCallback(async (categoryData: Omit<MenuCategory, 'id' | 'createdAt'>) => {
    if (!cafeId) {
      console.error("No cafeId available for adding category");
      return;
    }
    
    console.log("🔧 Adding category with cafeId:", cafeId);
    await addCategory({ ...categoryData, cafeId });
  }, [addCategory, cafeId]);

  const handleUpdateCategory = useCallback(async (categoryId: string, updates: Partial<MenuCategory>) => {
    await updateCategory(categoryId, updates);
  }, [updateCategory]);

  const handleDeleteCategory = useCallback(async (categoryId: string) => {
    await deleteCategory(categoryId);
  }, [deleteCategory]);

  const handleReorderCategories = useCallback(async (reorderedCategories: MenuCategory[]) => {
    await updateCategoryOrder(reorderedCategories);
  }, [updateCategoryOrder]);

  const handleAddMenuItem = useCallback(async (itemData: Omit<MenuItem, 'id' | 'createdAt'>) => {
    await addMenuItem(itemData);
  }, [addMenuItem]);

  const handleUpdateMenuItem = useCallback(async (itemId: string, updates: Partial<MenuItem>) => {
    await updateMenuItem(itemId, updates);
  }, [updateMenuItem]);

  const handleDeleteMenuItem = useCallback(async (itemId: string) => {
    await deleteMenuItem(itemId);
  }, [deleteMenuItem]);

  return {
    categories,
    menuItems,
    selectedMenuItem,
    setSelectedMenuItem,
    categoriesLoading,
    menuItemsLoading,
    categoriesError,
    menuItemsError,
    refreshMenuItems,
    handleAddCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    handleReorderCategories,
    handleAddMenuItem,
    handleUpdateMenuItem,
    handleDeleteMenuItem,
  };
};
