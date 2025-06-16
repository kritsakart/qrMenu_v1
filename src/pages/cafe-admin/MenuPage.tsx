
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useMenuPageHandlers } from "@/hooks/useMenuPageHandlers";
import { MenuPageContent } from "@/components/menu-builder/MenuPageContent";
import { MenuDialogsContainer } from "@/components/menu-builder/MenuDialogsContainer";

const MenuPage = () => {
  const { user } = useAuth();
  
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  
  // Debug logging for user state
  useEffect(() => {
    console.log("🔍 MenuPage - User state:", user);
    console.log("🔍 MenuPage - User cafeId:", user?.cafeId);
    console.log("🔍 MenuPage - Expected cafeId:", "508e061f-301a-49ca-b205-07e0d82b6b99");
    
    if (user?.cafeId) {
      const expectedCafeId = "508e061f-301a-49ca-b205-07e0d82b6b99";
      const isCorrectCafe = user.cafeId === expectedCafeId;
      console.log("🎯 MenuPage - Is correct cafe?", isCorrectCafe);
    }
  }, [user]);

  // Dialog states
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
  const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] = useState(false);
  const [isDeleteCategoryDialogOpen, setIsDeleteCategoryDialogOpen] = useState(false);
  
  const [isAddMenuItemDialogOpen, setIsAddMenuItemDialogOpen] = useState(false);
  const [isEditMenuItemDialogOpen, setIsEditMenuItemDialogOpen] = useState(false);
  const [isDeleteMenuItemDialogOpen, setIsDeleteMenuItemDialogOpen] = useState(false);
  
  // Use the custom hook for all handlers and data
  const {
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
  } = useMenuPageHandlers(selectedCategoryId);
  
  // Debug logging for categories
  useEffect(() => {
    console.log("🔍 MenuPage - Categories state:", categories);
    console.log("🔍 MenuPage - Categories count:", categories.length);
    console.log("🔍 MenuPage - Categories loading:", categoriesLoading);
    console.log("🔍 MenuPage - Categories error:", categoriesError);
    
    categories.forEach((category, index) => {
      console.log(`🔍 MenuPage - Category ${index + 1}:`, {
        id: category.id,
        name: category.name,
        cafeId: category.cafeId,
        order: category.order
      });
    });
  }, [categories, categoriesLoading, categoriesError]);
  
  // Handle category selection changes and update state
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    
    if (categories.length > 1) {
      const remainingCategories = categories.filter(cat => cat.id !== categoryId);
      if (remainingCategories.length > 0) {
        setSelectedCategoryId(remainingCategories[0].id);
      }
    } else {
      setSelectedCategoryId(null);
    }
  };
  
  // Get current category name for dialogs
  const currentCategoryName = selectedCategoryId
    ? categories.find(c => c.id === selectedCategoryId)?.name || ""
    : "";
  
  // Get items count for selected category
  const selectedCategoryItemCount = selectedCategoryId
    ? menuItems.filter(item => item.categoryId === selectedCategoryId).length
    : 0;
  
  // Check if user is authenticated
  if (!user) {
    console.log("❌ User not authenticated");
    return (
      <DashboardLayout title="Меню">
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">Будь ласка, авторизуйтесь</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!user.cafeId) {
    console.log("❌ User has no cafeId");
    return (
      <DashboardLayout title="Меню">
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">Помилка: не знайдено ID кафе</p>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout title="Меню">
      <div className="mb-6">
        <p className="text-muted-foreground">
          Створюйте та редагуйте категорії та пункти вашого меню.
        </p>
        <div className="mt-2 text-xs text-muted-foreground">
          Кафе ID: {user.cafeId} | Категорій: {categories.length} | Завантаження: {categoriesLoading ? 'Так' : 'Ні'}
        </div>
      </div>

      <MenuPageContent
        categories={categories}
        menuItems={menuItems}
        selectedCategoryId={selectedCategoryId}
        setSelectedCategoryId={setSelectedCategoryId}
        categoriesLoading={categoriesLoading}
        setSelectedMenuItem={setSelectedMenuItem}
        refreshMenuItems={refreshMenuItems}
        
        setIsAddCategoryDialogOpen={setIsAddCategoryDialogOpen}
        setIsEditCategoryDialogOpen={setIsEditCategoryDialogOpen}
        setIsDeleteCategoryDialogOpen={setIsDeleteCategoryDialogOpen}
        setIsAddMenuItemDialogOpen={setIsAddMenuItemDialogOpen}
        setIsEditMenuItemDialogOpen={setIsEditMenuItemDialogOpen}
        setIsDeleteMenuItemDialogOpen={setIsDeleteMenuItemDialogOpen}
      />

      <MenuDialogsContainer
        isAddCategoryDialogOpen={isAddCategoryDialogOpen}
        setIsAddCategoryDialogOpen={setIsAddCategoryDialogOpen}
        isEditCategoryDialogOpen={isEditCategoryDialogOpen}
        setIsEditCategoryDialogOpen={setIsEditCategoryDialogOpen}
        isDeleteCategoryDialogOpen={isDeleteCategoryDialogOpen}
        setIsDeleteCategoryDialogOpen={setIsDeleteCategoryDialogOpen}
        
        isAddMenuItemDialogOpen={isAddMenuItemDialogOpen}
        setIsAddMenuItemDialogOpen={setIsAddMenuItemDialogOpen}
        isEditMenuItemDialogOpen={isEditMenuItemDialogOpen}
        setIsEditMenuItemDialogOpen={setIsEditMenuItemDialogOpen}
        isDeleteMenuItemDialogOpen={isDeleteMenuItemDialogOpen}
        setIsDeleteMenuItemDialogOpen={setIsDeleteMenuItemDialogOpen}
        
        currentCategoryName={currentCategoryName}
        selectedCategoryItemCount={selectedCategoryItemCount}
        selectedMenuItem={selectedMenuItem}
        
        handleAddCategory={handleAddCategory}
        handleUpdateCategory={handleUpdateCategory}
        handleDeleteCategory={handleDeleteCategory}
        handleAddMenuItem={handleAddMenuItem}
        handleUpdateMenuItem={handleUpdateMenuItem}
        handleDeleteMenuItem={handleDeleteMenuItem}
      />
    </DashboardLayout>
  );
};

export default MenuPage;
