import React, { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useAuthState } from "@/hooks/auth/useAuthState";
import { useFetchMenuCategoriesNew } from "@/hooks/menu-categories/useFetchMenuCategoriesNew";
import { useFetchMenuItems } from "@/hooks/menu/useFetchMenuItems";
import { useAddMenuCategory } from "@/hooks/menu-categories/useAddMenuCategory";
import { useUpdateMenuCategory } from "@/hooks/menu-categories/useUpdateMenuCategory";
import { useDeleteMenuCategory } from "@/hooks/menu-categories/useDeleteMenuCategory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash, Plus } from "lucide-react";

const MenuBuilder = () => {
  console.log('[DEBUG] MenuBuilder: Component rendering...');
  
  const { toast } = useToast();
  const { user } = useAuthState();
  const cafeId = user?.id;

  // State for dialogs
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [isDeleteCategoryOpen, setIsDeleteCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [categoryName, setCategoryName] = useState("");

  // Data fetching
  const shouldFetch = Boolean(cafeId);
  
  const { 
    categories, 
    loading: categoriesLoading, 
    error: categoriesError 
  } = useFetchMenuCategoriesNew(shouldFetch ? cafeId : null);

  const { 
    menuItems, 
    loading: itemsLoading, 
    error: itemsError 
  } = useFetchMenuItems(shouldFetch ? cafeId : null);

  // CRUD hooks
  const { addCategory } = useAddMenuCategory();
  const { updateCategory } = useUpdateMenuCategory();
  const { deleteCategory } = useDeleteMenuCategory();

  console.log('[DEBUG] MenuBuilder: fetch results =', {
    categoriesCount: categories?.length || 0,
    menuItemsCount: menuItems?.length || 0,
    categoriesLoading,
    itemsLoading,
    categoriesError,
    itemsError
  });

  // Category CRUD handlers
  const handleAddCategory = async () => {
    if (!categoryName.trim() || !cafeId) return;

    try {
      await addCategory(cafeId, categoryName.trim());
      setCategoryName("");
      setIsAddCategoryOpen(false);
      // Refresh page to see updates
      window.location.reload();
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleEditCategory = async () => {
    if (!categoryName.trim() || !selectedCategory) return;

    try {
      await updateCategory(selectedCategory.id, categoryName.trim());
      setCategoryName("");
      setSelectedCategory(null);
      setIsEditCategoryOpen(false);
      // Refresh page to see updates
      window.location.reload();
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    try {
      await deleteCategory(selectedCategory.id);
      setSelectedCategory(null);
      setIsDeleteCategoryOpen(false);
      // Refresh page to see updates
      window.location.reload();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  // Dialog openers
  const openEditDialog = (category: any) => {
    setSelectedCategory(category);
    setCategoryName(category.name);
    setIsEditCategoryOpen(true);
  };

  const openDeleteDialog = (category: any) => {
    setSelectedCategory(category);
    setIsDeleteCategoryOpen(true);
  };

  return (
    <DashboardLayout title="Menu Builder">
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">Debug Info</h2>
          <div className="space-y-2">
            <p><strong>User ID:</strong> {cafeId || 'Not found'}</p>
            <p><strong>Username:</strong> {user?.username || 'Not found'}</p>
            <p><strong>Status:</strong> {user ? 'Authenticated' : 'Not authenticated'}</p>
          </div>
        </div>

        {!shouldFetch ? (
          <div className="bg-red-50 p-6 rounded-lg border border-red-200">
            <h2 className="text-lg font-semibold mb-4 text-red-800">Authentication Required</h2>
            <p className="text-red-600">Please log in to access menu builder.</p>
          </div>
        ) : (
          <>
            {/* Categories Section */}
            <div className="bg-white p-6 rounded-lg border">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">
                  Categories {categoriesLoading ? '(Loading...)' : `(${categories?.length || 0})`}
                </h2>
                <Button onClick={() => setIsAddCategoryOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </div>
              
              {categoriesError ? (
                <div className="text-red-600 p-4 bg-red-50 rounded">
                  <strong>Error:</strong> {categoriesError}
                </div>
              ) : categoriesLoading ? (
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ) : categories?.length === 0 ? (
                <p className="text-gray-500">No categories found. Create your first category!</p>
              ) : (
                <div className="space-y-2">
                  {categories?.map(category => (
                    <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{category.name}</h3>
                        <p className="text-sm text-gray-500">ID: {category.id}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => openEditDialog(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => openDeleteDialog(category)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Menu Items Section (simplified for now) */}
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-lg font-semibold mb-4">
                Menu Items {itemsLoading ? '(Loading...)' : `(${menuItems?.length || 0})`}
              </h2>
              
              {itemsError ? (
                <div className="text-red-600 p-4 bg-red-50 rounded">
                  <strong>Error:</strong> {itemsError}
                </div>
              ) : itemsLoading ? (
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ) : menuItems?.length === 0 ? (
                <p className="text-gray-500">No menu items found.</p>
              ) : (
                <div className="space-y-2">
                  {menuItems?.slice(0, 3).map(item => (
                    <div key={item.id} className="p-3 border rounded-lg">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        Category: {item.categoryId} | Price: ${item.price}
                      </p>
                    </div>
                  ))}
                  {menuItems?.length > 3 && (
                    <p className="text-sm text-gray-500">... and {menuItems.length - 3} more items</p>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {/* Add Category Dialog */}
        <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Category</DialogTitle>
              <DialogDescription>Create a new menu category.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="category-name">Category Name</Label>
                <Input
                  id="category-name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Enter category name"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCategory} disabled={!categoryName.trim()}>
                Add Category
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Category Dialog */}
        <Dialog open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>Update the category name.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category-name">Category Name</Label>
                <Input
                  id="edit-category-name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Enter category name"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditCategoryOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditCategory} disabled={!categoryName.trim()}>
                Update Category
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Category Dialog */}
        <Dialog open={isDeleteCategoryOpen} onOpenChange={setIsDeleteCategoryOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Category</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this category? All menu items in this category will also be deleted.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p><strong>Category:</strong> {selectedCategory?.name}</p>
              <p className="text-sm text-red-600 mt-2">This action cannot be undone.</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteCategoryOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteCategory}>
                Delete Category
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default MenuBuilder;
