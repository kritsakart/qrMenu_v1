
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { MenuCategory, MenuItem, MenuItemOption } from "@/types/models";
import { getCafeOwnerData } from "@/data/mockData";

// Import the extracted components
import { CategoryList } from "@/components/menu-builder/CategoryList";
import { MenuItemList } from "@/components/menu-builder/MenuItemList";
import { 
  AddCategoryDialog, 
  EditCategoryDialog, 
  DeleteCategoryDialog 
} from "@/components/menu-builder/dialogs/CategoryDialogs";
import { 
  AddMenuItemDialog, 
  EditMenuItemDialog, 
  DeleteMenuItemDialog 
} from "@/components/menu-builder/dialogs/MenuItemDialogs";

const MenuBuilder = () => {
  const { user } = useAuth();
  const cafeId = user?.cafeId || "cafe-1";
  const cafeData = getCafeOwnerData(cafeId);
  const { toast } = useToast();
  
  // State for categories
  const [categories, setCategories] = useState<MenuCategory[]>(cafeData.categories);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({ name: "" });
  
  // State for menu items
  const [menuItems, setMenuItems] = useState<MenuItem[]>(cafeData.menuItems);
  const [menuItemOptions, setMenuItemOptions] = useState<MenuItemOption[]>(cafeData.menuItemOptions);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [newMenuItem, setNewMenuItem] = useState<{
    name: string;
    description: string;
    price: string;
    weight: string;
    imageUrl: string;
  }>({
    name: "",
    description: "",
    price: "",
    weight: "",
    imageUrl: "",
  });
  
  // Dialog open/close states
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
  const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] = useState(false);
  const [isDeleteCategoryDialogOpen, setIsDeleteCategoryDialogOpen] = useState(false);
  const [isAddMenuItemDialogOpen, setIsAddMenuItemDialogOpen] = useState(false);
  const [isEditMenuItemDialogOpen, setIsEditMenuItemDialogOpen] = useState(false);
  const [isDeleteMenuItemDialogOpen, setIsDeleteMenuItemDialogOpen] = useState(false);

  // Set the first category as selected by default
  useEffect(() => {
    if (categories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);
  
  // Category CRUD operations
  const handleAddCategory = async (name: string): Promise<MenuCategory | undefined> => {
    const newCategoryObj: MenuCategory = {
      id: `cat-${Date.now()}`,
      cafeId,
      name: name,
      order: categories.length + 1,
      createdAt: new Date().toISOString(),
    };
    
    setCategories([...categories, newCategoryObj]);
    setNewCategory({ name: "" });
    setSelectedCategoryId(newCategoryObj.id);
    
    toast({
      title: "Category added",
      description: `${name} has been added to your menu.`,
    });
    
    return newCategoryObj;
  };
  
  const handleUpdateCategory = async (name: string): Promise<boolean | undefined> => {
    if (!selectedCategoryId) return false;
    
    setCategories(
      categories.map(cat => 
        cat.id === selectedCategoryId 
          ? { ...cat, name: name }
          : cat
      )
    );
    
    toast({
      title: "Category updated",
      description: `Category has been updated successfully.`,
    });
    
    return true;
  };
  
  const handleDeleteCategory = async (): Promise<boolean | undefined> => {
    if (!selectedCategoryId) return false;
    
    // Remove the category and its menu items
    const updatedCategories = categories.filter(cat => cat.id !== selectedCategoryId);
    const updatedMenuItems = menuItems.filter(item => item.categoryId !== selectedCategoryId);
    
    setCategories(updatedCategories);
    setMenuItems(updatedMenuItems);
    
    // Select another category if available
    if (updatedCategories.length > 0) {
      setSelectedCategoryId(updatedCategories[0].id);
    } else {
      setSelectedCategoryId(null);
    }
    
    toast({
      title: "Category deleted",
      description: `Category and all its menu items have been deleted.`,
      variant: "destructive",
    });
    
    return true;
  };
  
  // MenuItem CRUD operations
  const handleAddMenuItem = async (formData: {
    name: string;
    description: string;
    price: string;
    weight: string;
    imageUrl: string;
  }): Promise<MenuItem | undefined> => {
    if (!selectedCategoryId) return undefined;
    
    const menuItem: MenuItem = {
      id: `item-${Date.now()}`,
      categoryId: selectedCategoryId,
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price) || 0,
      weight: formData.weight,
      imageUrl: formData.imageUrl || undefined,
      createdAt: new Date().toISOString(),
    };
    
    setMenuItems([...menuItems, menuItem]);
    
    toast({
      title: "Menu item added",
      description: `${formData.name} has been added to your menu.`,
    });
    
    return menuItem;
  };
  
  const handleUpdateMenuItem = async (formData: {
    name: string;
    description: string;
    price: string;
    weight: string;
    imageUrl: string;
  }): Promise<boolean | undefined> => {
    if (!selectedMenuItem) return false;
    
    const updatedMenuItem: MenuItem = {
      ...selectedMenuItem,
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price) || 0,
      weight: formData.weight,
      imageUrl: formData.imageUrl || undefined,
    };
    
    setMenuItems(
      menuItems.map(item => 
        item.id === selectedMenuItem.id ? updatedMenuItem : item
      )
    );
    
    toast({
      title: "Menu item updated",
      description: `${updatedMenuItem.name} has been updated successfully.`,
    });
    
    return true;
  };
  
  const handleDeleteMenuItem = async (): Promise<boolean | undefined> => {
    if (!selectedMenuItem) return false;
    
    setMenuItems(menuItems.filter(item => item.id !== selectedMenuItem.id));
    
    toast({
      title: "Menu item deleted",
      description: `${selectedMenuItem.name} has been deleted from your menu.`,
      variant: "destructive",
    });
    
    return true;
  };
  
  // Helper functions for dialog operations
  const openEditCategoryDialog = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (category) {
      setNewCategory({ name: category.name });
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
    setNewMenuItem({
      name: item.name,
      description: item.description || "",
      price: item.price.toString(),
      weight: item.weight || "",
      imageUrl: item.imageUrl || "",
    });
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
  
  // Get items count for selected category
  const selectedCategoryItemCount = selectedCategoryId
    ? menuItems.filter(item => item.categoryId === selectedCategoryId).length
    : 0;

  return (
    <DashboardLayout title="Menu Builder">
      <div className="mb-6">
        <p className="text-muted-foreground">
          Create and manage your menu categories and items.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories sidebar */}
        <CategoryList
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          setSelectedCategoryId={setSelectedCategoryId}
          onAddCategory={() => setIsAddCategoryDialogOpen(true)}
          onEditCategory={openEditCategoryDialog}
          onDeleteCategory={openDeleteCategoryDialog}
        />

        {/* Menu items content */}
        <MenuItemList
          title={currentCategoryName || "Menu Items"}
          menuItems={menuItems}
          selectedCategoryId={selectedCategoryId}
          onAddItem={() => setIsAddMenuItemDialogOpen(true)}
          onEditItem={openEditMenuItemDialog}
          onDeleteItem={openDeleteMenuItemDialog}
        />
      </div>

      {/* Category Dialogs */}
      <AddCategoryDialog
        isOpen={isAddCategoryDialogOpen}
        onOpenChange={setIsAddCategoryDialogOpen}
        onAddCategory={handleAddCategory}
      />

      <EditCategoryDialog
        isOpen={isEditCategoryDialogOpen}
        onOpenChange={setIsEditCategoryDialogOpen}
        onUpdateCategory={handleUpdateCategory}
        categoryName={currentCategoryName}
      />

      <DeleteCategoryDialog
        isOpen={isDeleteCategoryDialogOpen}
        onOpenChange={setIsDeleteCategoryDialogOpen}
        onDeleteCategory={handleDeleteCategory}
        categoryName={currentCategoryName}
        itemCount={selectedCategoryItemCount}
      />

      {/* Menu Item Dialogs */}
      <AddMenuItemDialog
        isOpen={isAddMenuItemDialogOpen}
        onOpenChange={setIsAddMenuItemDialogOpen}
        onAddMenuItem={handleAddMenuItem}
        categoryName={currentCategoryName}
      />

      <EditMenuItemDialog
        isOpen={isEditMenuItemDialogOpen}
        onOpenChange={setIsEditMenuItemDialogOpen}
        onUpdateMenuItem={handleUpdateMenuItem}
        menuItem={selectedMenuItem}
      />

      <DeleteMenuItemDialog
        isOpen={isDeleteMenuItemDialogOpen}
        onOpenChange={setIsDeleteMenuItemDialogOpen}
        onDeleteMenuItem={handleDeleteMenuItem}
        menuItem={selectedMenuItem}
      />
    </DashboardLayout>
  );
};

export default MenuBuilder;
