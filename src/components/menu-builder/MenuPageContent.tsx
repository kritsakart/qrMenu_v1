import { useState, useEffect } from "react";
import { MenuItem, MenuCategory } from "@/types/models";
import { CategoryList } from "@/components/menu-builder/CategoryList";
import { MenuItemList } from "@/components/menu-builder/MenuItemList";
import { useAuth } from "@/contexts/AuthContext";

interface MenuPageContentProps {
  categories: MenuCategory[];
  menuItems: MenuItem[];
  selectedCategoryId: string | null;
  setSelectedCategoryId: (id: string) => void;
  categoriesLoading: boolean;
  setSelectedMenuItem: (item: MenuItem | null) => void;
  refreshMenuItems: () => void;
  onReorderCategories?: (reorderedCategories: MenuCategory[]) => void;
  
  // Dialog openers
  setIsAddCategoryDialogOpen: (open: boolean) => void;
  setIsEditCategoryDialogOpen: (open: boolean) => void;
  setIsDeleteCategoryDialogOpen: (open: boolean) => void;
  setIsAddMenuItemDialogOpen: (open: boolean) => void;
  setIsEditMenuItemDialogOpen: (open: boolean) => void;
  setIsDeleteMenuItemDialogOpen: (open: boolean) => void;
}

export const MenuPageContent = ({
  categories,
  menuItems,
  selectedCategoryId,
  setSelectedCategoryId,
  categoriesLoading,
  setSelectedMenuItem,
  refreshMenuItems,
  onReorderCategories,
  
  // Dialog openers
  setIsAddCategoryDialogOpen,
  setIsEditCategoryDialogOpen,
  setIsDeleteCategoryDialogOpen,
  setIsAddMenuItemDialogOpen,
  setIsEditMenuItemDialogOpen,
  setIsDeleteMenuItemDialogOpen,
}: MenuPageContentProps) => {
  const { user } = useAuth();

  // Debug logging
  useEffect(() => {
    console.log("🔍 MenuPageContent - Current user:", user);
    console.log("🔍 MenuPageContent - Categories:", categories);
    console.log("🔍 MenuPageContent - Categories loading:", categoriesLoading);
  }, [user, categories, categoriesLoading]);
  
  // Effect to auto-select the first category
  useEffect(() => {
    if (categories.length > 0 && !selectedCategoryId) {
      console.log("🎯 Auto-selecting first category:", categories[0].id);
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId, setSelectedCategoryId]);

  // Effect to refresh menu items when selected category changes
  useEffect(() => {
    if (selectedCategoryId) {
      console.log("🔄 Refreshing menu items for category:", selectedCategoryId);
      refreshMenuItems();
    }
  }, [selectedCategoryId, refreshMenuItems]);
  
  // Helper functions for dialog operations
  const openEditCategoryDialog = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (category) {
      setSelectedCategoryId(categoryId);
      setIsEditCategoryDialogOpen(true);
    }
  };
  
  const openDeleteCategoryDialog = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setIsDeleteCategoryDialogOpen(true);
  };
  
  const openEditMenuItemDialog = (item: MenuItem) => {
    setSelectedMenuItem(item);
    setIsEditMenuItemDialogOpen(true);
  };
  
  const openDeleteMenuItemDialog = (item: MenuItem) => {
    setSelectedMenuItem(item);
    setIsDeleteMenuItemDialogOpen(true);
  };
  
  // Get current category name for dialogs
  const currentCategoryName = selectedCategoryId
    ? categories.find(c => c.id === selectedCategoryId)?.name || ""
    : "";

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Categories sidebar */}
      <div className="lg:col-span-1">
        <CategoryList
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          setSelectedCategoryId={setSelectedCategoryId}
          onAddCategory={() => setIsAddCategoryDialogOpen(true)}
          onEditCategory={openEditCategoryDialog}
          onDeleteCategory={openDeleteCategoryDialog}
          onReorderCategories={onReorderCategories}
          isLoading={categoriesLoading}
        />
      </div>

      {/* Menu items content */}
      <div className="lg:col-span-2">
        <MenuItemList
          title={currentCategoryName || "Menu Items"}
          menuItems={menuItems}
          selectedCategoryId={selectedCategoryId}
          onAddItem={() => setIsAddMenuItemDialogOpen(true)}
          onEditItem={openEditMenuItemDialog}
          onDeleteItem={openDeleteMenuItemDialog}
        />
      </div>
    </div>
  );
};
