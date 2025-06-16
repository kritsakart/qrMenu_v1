import { MenuItem, MenuCategory } from "@/types/models";
import { 
  AddCategoryDialog, 
  EditCategoryDialog, 
  DeleteCategoryDialog 
} from "@/components/menu-builder/dialogs/CategoryDialogs";
import { 
  AddMenuItemDialog, 
  EditMenuItemDialog, 
  DeleteMenuItemDialog,
  type MenuItemFormState
} from "@/components/menu-builder/dialogs/MenuItemDialogs";

interface MenuItemFormData {
  name: string;
  description: string;
  price: string;
  weight: string;
  imageUrl: string;
}

interface MenuDialogsContainerProps {
  // Dialog states
  isAddCategoryDialogOpen: boolean;
  setIsAddCategoryDialogOpen: (open: boolean) => void;
  isEditCategoryDialogOpen: boolean;
  setIsEditCategoryDialogOpen: (open: boolean) => void;
  isDeleteCategoryDialogOpen: boolean;
  setIsDeleteCategoryDialogOpen: (open: boolean) => void;
  
  isAddMenuItemDialogOpen: boolean;
  setIsAddMenuItemDialogOpen: (open: boolean) => void;
  isEditMenuItemDialogOpen: boolean;
  setIsEditMenuItemDialogOpen: (open: boolean) => void;
  isDeleteMenuItemDialogOpen: boolean;
  setIsDeleteMenuItemDialogOpen: (open: boolean) => void;
  
  // Data
  currentCategoryName: string;
  selectedCategoryItemCount: number;
  selectedMenuItem: MenuItem | null;
  
  // Handlers
  handleAddCategory: (name: string) => Promise<MenuCategory | undefined>;
  handleUpdateCategory: (name: string) => Promise<boolean | undefined>;
  handleDeleteCategory: () => Promise<boolean | undefined>;
  handleAddMenuItem: (formData: MenuItemFormState) => Promise<MenuItem | undefined>;
  handleUpdateMenuItem: (formData: MenuItemFormState) => Promise<boolean | undefined>;
  handleDeleteMenuItem: () => Promise<boolean | undefined>;
}

export const MenuDialogsContainer = ({
  // Dialog states
  isAddCategoryDialogOpen,
  setIsAddCategoryDialogOpen,
  isEditCategoryDialogOpen,
  setIsEditCategoryDialogOpen,
  isDeleteCategoryDialogOpen,
  setIsDeleteCategoryDialogOpen,
  
  isAddMenuItemDialogOpen,
  setIsAddMenuItemDialogOpen,
  isEditMenuItemDialogOpen,
  setIsEditMenuItemDialogOpen,
  isDeleteMenuItemDialogOpen,
  setIsDeleteMenuItemDialogOpen,
  
  // Data
  currentCategoryName,
  selectedCategoryItemCount,
  selectedMenuItem,
  
  // Handlers
  handleAddCategory,
  handleUpdateCategory,
  handleDeleteCategory,
  handleAddMenuItem,
  handleUpdateMenuItem,
  handleDeleteMenuItem,
}: MenuDialogsContainerProps) => {

  return (
    <>
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
    </>
  );
};
