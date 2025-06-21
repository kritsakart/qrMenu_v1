import { useCallback } from "react";
import { MenuCategory } from "@/types/models";
import { useFetchMenuCategories } from "./useFetchMenuCategories";
import { useAddMenuCategory } from "./useAddMenuCategory";
import { useUpdateMenuCategory } from "./useUpdateMenuCategory";
import { useDeleteMenuCategory } from "./useDeleteMenuCategory";
import { useUpdateMenuCategoryOrder, useUpdateMultipleMenuCategoriesOrder } from "./useUpdateMenuCategoryOrder";

export { 
  useFetchMenuCategories, 
  useAddMenuCategory, 
  useUpdateMenuCategory, 
  useDeleteMenuCategory,
  useUpdateMenuCategoryOrder,
  useUpdateMultipleMenuCategoriesOrder
};
export type { MenuCategoryData } from "./types";

// Main hook that composes all the individual hooks
export const useMenuCategories = () => {
  const { categories, setCategories, isLoading, error, fetchCategories } = useFetchMenuCategories();
  
  const handleCategoryAdded = useCallback((newCategory: MenuCategory) => {
    console.log("Adding new category to categories:", newCategory);
    setCategories(prev => {
      const updated = [...prev, newCategory].sort((a, b) => a.order - b.order);
      console.log("📋 DIAGNOSTIC: Updated categories list:", updated);
      return updated;
    });
  }, [setCategories]);
  
  const handleCategoriesUpdated = useCallback((updatedCategories: MenuCategory[]) => {
    console.log("Updating categories:", updatedCategories);
    setCategories(updatedCategories);
  }, [setCategories]);
  
  const { addCategory } = useAddMenuCategory(categories, handleCategoryAdded);
  const { updateCategory } = useUpdateMenuCategory(handleCategoriesUpdated, categories);
  const { deleteCategory } = useDeleteMenuCategory(handleCategoriesUpdated, categories);
  const updateCategoryOrderMutation = useUpdateMultipleMenuCategoriesOrder();

  const updateCategoriesOrder = useCallback((reorderedCategories: MenuCategory[], locationId: string) => {
    console.log("🔄 Updating categories order locally:", reorderedCategories);
    
    // Оновлюємо локальний стан негайно
    setCategories(reorderedCategories);
    
    // Підготовка оновлень для бази даних
    const updates = reorderedCategories.map((category, index) => ({
      categoryId: category.id,
      newOrder: index + 1,
      locationId
    }));
    
    // Оновлюємо порядок в базі даних
    updateCategoryOrderMutation.mutate(updates);
  }, [setCategories, updateCategoryOrderMutation]);

  return {
    categories,
    isLoading,
    error,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    updateCategoriesOrder
  };
};
