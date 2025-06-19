
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { MenuItem, MenuCategory } from "@/types/models";
import { useMenuCategories } from "@/hooks/menu-categories";
import { useMenuItems } from "@/hooks/useMenuItems";
import { type MenuItemFormState } from "@/components/menu-builder/dialogs/MenuItemDialogs";

export const useMenuPageHandlers = (selectedCategoryId: string | null) => {
  const { toast } = useToast();
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  
  const { 
    categories, 
    isLoading: categoriesLoading, 
    error: categoriesError,
    addCategory,
    updateCategory,
    deleteCategory
  } = useMenuCategories();
  
  const { 
    menuItems, 
    isLoading: menuItemsLoading,
    error: menuItemsError,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    refreshMenuItems
  } = useMenuItems(selectedCategoryId || undefined);

  // Category handlers
  const handleAddCategory = async (name: string): Promise<MenuCategory | undefined> => {
    console.log("🔍 DIAGNOSTIC: handleAddCategory викликано з параметром:", name);
    
    if (name.trim() === "") {
      console.log("❌ DIAGNOSTIC: Порожня назва категорії");
      toast({
        variant: "destructive",
        title: "Помилка",
        description: "Назва категорії не може бути порожньою",
      });
      return undefined;
    }
    
    try {
      console.log("🚀 DIAGNOSTIC: handleAddCategory - Спроба додавання категорії:", name);
      console.log("🔍 DIAGNOSTIC: Стан addCategory функції:", typeof addCategory);
      
      const category = await addCategory(name);
      
      if (category) {
        console.log("✅ DIAGNOSTIC: handleAddCategory - Категорію успішно додано:", category);
        return category;
      } else {
        console.log("❌ DIAGNOSTIC: handleAddCategory - Не вдалось створити категорію (повернулось null/undefined)");
        toast({
          variant: "destructive",
          title: "Помилка додавання категорії",
          description: "Не вдалось створити категорію",
        });
        return undefined;
      }
    } catch (err) {
      console.error("❌ DIAGNOSTIC: handleAddCategory - Помилка при додаванні категорії:", err);
      const errorMessage = err instanceof Error ? err.message : "Невідома помилка";
      toast({
        variant: "destructive",
        title: "Помилка додавання категорії",
        description: errorMessage,
      });
      return undefined;
    }
  };
  
  const handleUpdateCategory = async (name: string): Promise<boolean | undefined> => {
    if (!selectedCategoryId) {
      console.log("❌ DIAGNOSTIC: handleUpdateCategory - selectedCategoryId відсутній");
      return undefined;
    }
    
    if (name.trim() === "") {
      toast({
        variant: "destructive",
        title: "Помилка",
        description: "Назва категорії не може бути порожньою",
      });
      return false;
    }
    
    try {
      console.log("Оновлення категорії:", { id: selectedCategoryId, name });
      const success = await updateCategory(selectedCategoryId, name);
      if (success) {
        toast({
          title: "Категорію оновлено",
          description: `Категорія успішно оновлена.`,
        });
      }
      return success;
    } catch (err) {
      console.error("Помилка при оновленні категорії:", err);
      toast({
        variant: "destructive",
        title: "Помилка оновлення категорії",
        description: err instanceof Error ? err.message : "Невідома помилка",
      });
      return false;
    }
  };
  
  const handleDeleteCategory = async (): Promise<boolean | undefined> => {
    if (!selectedCategoryId) {
      console.log("❌ DIAGNOSTIC: handleDeleteCategory - selectedCategoryId відсутній");
      return undefined;
    }
    
    try {
      console.log("Видалення категорії:", selectedCategoryId);
      const success = await deleteCategory(selectedCategoryId);
      if (success) {
        toast({
          title: "Категорію видалено",
          description: `Категорія успішно видалена.`,
        });
      }
      return success;
    } catch (err) {
      console.error("Помилка при видаленні категорії:", err);
      toast({
        variant: "destructive",
        title: "Помилка видалення категорії",
        description: err instanceof Error ? err.message : "Невідома помилка",
      });
      return false;
    }
  };
  
  // MenuItem handlers
  const handleAddMenuItem = async (formData: MenuItemFormState): Promise<MenuItem | undefined> => {
    console.log("🎯 DIAGNOSTIC: handleAddMenuItem - selectedCategoryId:", selectedCategoryId);
    console.log("🎯 DIAGNOSTIC: handleAddMenuItem - formData:", formData);
    
    if (!selectedCategoryId || selectedCategoryId.trim() === '') {
      console.error("❌ DIAGNOSTIC: handleAddMenuItem - selectedCategoryId порожній або відсутній:", selectedCategoryId);
      toast({
        variant: "destructive",
        title: "Помилка",
        description: "Необхідно вибрати категорію для додавання пункту меню",
      });
      return undefined;
    }
    
    if (formData.name.trim() === "") {
      toast({
        variant: "destructive",
        title: "Помилка",
        description: "Назва пункту меню не може бути порожньою",
      });
      return undefined;
    }
    
    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      toast({
        variant: "destructive",
        title: "Помилка",
        description: "Ціна повинна бути додатним числом",
      });
      return undefined;
    }
    
    try {
      console.log("🚀 DIAGNOSTIC: handleAddMenuItem - спроба додавання пункту меню:", {
        categoryId: selectedCategoryId,
        name: formData.name,
        price: price,
        description: formData.description.trim() || undefined,
        weight: formData.weight.trim() || undefined,
        imageUrl: formData.imageUrl.trim() || undefined,
      });
      
      // Конвертуємо варіанти з форми в правильний формат
      const variants = formData.variants ? formData.variants.map(v => ({
        id: v.id,
        name: v.name,
        price: parseFloat(v.price) || 0,
        isDefault: v.isDefault
      })) : undefined;

      const menuItem = await addMenuItem(selectedCategoryId, {
        name: formData.name,
        description: formData.description.trim() || undefined,
        price: price,
        weight: formData.weight.trim() || undefined,
        imageUrl: formData.imageUrl.trim() || undefined,
        variants: variants,
      });
      
      if (menuItem) {
        console.log("✅ DIAGNOSTIC: handleAddMenuItem - пункт меню успішно додано:", menuItem);
        return menuItem;
      } else {
        console.log("❌ DIAGNOSTIC: handleAddMenuItem - не вдалось додати пункт меню");
        return undefined;
      }
    } catch (err) {
      console.error("❌ DIAGNOSTIC: handleAddMenuItem - помилка при додаванні пункту меню:", err);
      toast({
        variant: "destructive",
        title: "Помилка додавання пункту меню",
        description: err instanceof Error ? err.message : "Невідома помилка",
      });
      return undefined;
    }
  };
  
  const handleUpdateMenuItem = async (formData: MenuItemFormState): Promise<boolean | undefined> => {
    if (!selectedMenuItem) return undefined;
    
    if (formData.name.trim() === "") {
      toast({
        variant: "destructive",
        title: "Помилка",
        description: "Назва пункту меню не може бути порожньою",
      });
      return undefined;
    }
    
    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      toast({
        variant: "destructive",
        title: "Помилка",
        description: "Ціна повинна бути додатним числом",
      });
      return undefined;
    }
    
    // Конвертуємо варіанти з форми в правильний формат
    const variants = formData.variants ? formData.variants.map(v => ({
      id: v.id,
      name: v.name,
      price: parseFloat(v.price) || 0,
      isDefault: v.isDefault
    })) : undefined;

    const success = await updateMenuItem(selectedMenuItem.id, {
      name: formData.name,
      description: formData.description.trim() || undefined,
      price: price,
      weight: formData.weight.trim() || undefined,
      imageUrl: formData.imageUrl.trim() || undefined,
      variants: variants,
    });
    
    return success;
  };
  
  const handleDeleteMenuItem = async (): Promise<boolean | undefined> => {
    if (!selectedMenuItem) return undefined;
    
    const success = await deleteMenuItem(selectedMenuItem.id);
    return success;
  };

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
    
    handleAddMenuItem,
    handleUpdateMenuItem,
    handleDeleteMenuItem,
  };
};
