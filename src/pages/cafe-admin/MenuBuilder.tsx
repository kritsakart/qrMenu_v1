import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useAuthState } from "@/hooks/auth/useAuthState";
import { useFetchMenuCategoriesNew } from "@/hooks/menu-categories/useFetchMenuCategoriesNew";
import { useFetchMenuItems } from "@/hooks/menu/useFetchMenuItems";
import { useAddMenuCategory } from "@/hooks/menu-categories/useAddMenuCategory";
import { useUpdateMenuCategory } from "@/hooks/menu-categories/useUpdateMenuCategory";
import { useDeleteMenuCategory } from "@/hooks/menu-categories/useDeleteMenuCategory";
import { useUpdateMenuCategoryOrder } from "@/hooks/menu-categories/useUpdateMenuCategoryOrder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash, Plus, GripVertical, ChevronDown } from "lucide-react";

// DnD Kit imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable Category Item Component
const SortableCategoryItem = ({ category, onEdit, onDelete, isSelected, onSelect }: {
  category: any;
  onEdit: (category: any) => void;
  onDelete: (category: any) => void;
  isSelected: boolean;
  onSelect: (category: any) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-3 border rounded-lg transition-colors cursor-pointer ${
        isDragging ? 'shadow-lg' : ''
      } ${
        isSelected 
          ? 'bg-blue-50 border-blue-300 shadow-sm' 
          : 'bg-white hover:bg-gray-50'
      }`}
      onClick={() => onSelect(category)}
    >
      <div className="flex items-center space-x-3">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab hover:cursor-grabbing p-1 hover:bg-gray-100 rounded"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>
        <div>
          <h3 className={`font-medium ${isSelected ? 'text-blue-700' : ''}`}>
            {category.name}
          </h3>
          <p className="text-sm text-gray-500">Order: {category.order || 'No order'}</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button 
          size="sm" 
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(category);
          }}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button 
          size="sm" 
          variant="destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(category);
          }}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

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
  
  // State for active category selection
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  // State for debug panel
  const [isDebugExpanded, setIsDebugExpanded] = useState(false);

  // Local state for optimistic updates
  const [localCategories, setLocalCategories] = useState<any[]>([]);
  const [isReordering, setIsReordering] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

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
  const { reorderCategories } = useUpdateMenuCategoryOrder();

  // Drag and Drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Initialize local categories only once from server data
  useEffect(() => {
    if (categories && categories.length > 0 && !hasInitialized) {
      console.log('[DEBUG] Initial load - setting categories from server:', categories);
      setLocalCategories(categories);
      setHasInitialized(true);
    }
  }, [categories, hasInitialized]);

  console.log('[DEBUG] MenuBuilder: fetch results =', {
    categoriesCount: categories?.length || 0,
    localCategoriesCount: localCategories?.length || 0,
    menuItemsCount: menuItems?.length || 0,
    categoriesLoading,
    itemsLoading,
    categoriesError,
    itemsError,
    isReordering,
    hasInitialized
  });

  // Sort categories by order
  const sortedCategories = localCategories ? [...localCategories].sort((a, b) => {
    const orderA = a.order || 999;
    const orderB = b.order || 999;
    return orderA - orderB;
  }) : [];

  // Filter menu items by active category
  const filteredMenuItems = activeCategoryId 
    ? menuItems?.filter(item => item.categoryId === activeCategoryId) || []
    : menuItems || [];

  // Handler for category selection
  const handleCategorySelect = (category: any) => {
    setActiveCategoryId(category.id === activeCategoryId ? null : category.id);
  };

  // Drag and Drop handler - PURE optimistic updates
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = sortedCategories.findIndex((item) => item.id === active.id);
      const newIndex = sortedCategories.findIndex((item) => item.id === over?.id);

      // Optimistically update the local state immediately
      const reorderedCategories = arrayMove(sortedCategories, oldIndex, newIndex);
      
      // Update order values for proper sorting
      const categoriesWithNewOrder = reorderedCategories.map((category, index) => ({
        ...category,
        order: index + 1
      }));
      
      console.log('[DEBUG] Drag end - OPTIMISTIC UPDATE with new order values:', {
        oldIndex,
        newIndex,
        oldOrder: sortedCategories.map(c => ({ id: c.id, name: c.name, order: c.order })),
        newOrder: categoriesWithNewOrder.map(c => ({ id: c.id, name: c.name, order: c.order }))
      });

      // Update local state immediately for smooth UX - NO SERVER SYNC
      setLocalCategories(categoriesWithNewOrder);
      setIsReordering(true);

      // Update the order in the database silently in background
      try {
        await reorderCategories(categoriesWithNewOrder);
        console.log('[DEBUG] Database update successful (background)');
      } catch (error) {
        console.error('[DEBUG] Database update failed, but keeping optimistic state');
      } finally {
        // Always keep the optimistic state regardless of server response
        setIsReordering(false);
      }
    }
  };

  // Category CRUD handlers - optimistic updates
  const handleAddCategory = async () => {
    if (!categoryName.trim() || !cafeId) return;

    const tempId = `temp-${Date.now()}`;
    const newCategory = {
      id: tempId,
      name: categoryName.trim(),
      cafe_id: cafeId,
      order: localCategories.length + 1
    };

    try {
      // Optimistically add to local state
      setLocalCategories(prev => [...prev, newCategory]);
      setCategoryName("");
      setIsAddCategoryOpen(false);

      // Try to save to server
      await addCategory(cafeId, categoryName.trim());
      console.log('[DEBUG] Category added successfully');
      
      // For new items, we might want to refresh after some time to get the real ID
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error('Error adding category:', error);
      // Remove from local state if server failed
      setLocalCategories(prev => prev.filter(cat => cat.id !== tempId));
    }
  };

  const handleEditCategory = async () => {
    if (!categoryName.trim() || !selectedCategory) return;

    const oldName = selectedCategory.name;

    try {
      // Optimistically update local state
      setLocalCategories(prev => 
        prev.map(cat => 
          cat.id === selectedCategory.id 
            ? { ...cat, name: categoryName.trim() }
            : cat
        )
      );
      
      setCategoryName("");
      setSelectedCategory(null);
      setIsEditCategoryOpen(false);

      // Try to save to server
      await updateCategory(selectedCategory.id, categoryName.trim());
      console.log('[DEBUG] Category updated successfully');
    } catch (error) {
      console.error('Error updating category:', error);
      // Revert local state if server failed
      setLocalCategories(prev => 
        prev.map(cat => 
          cat.id === selectedCategory.id 
            ? { ...cat, name: oldName }
            : cat
        )
      );
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    const categoryToDelete = selectedCategory;

    try {
      // Optimistically remove from local state
      setLocalCategories(prev => prev.filter(cat => cat.id !== selectedCategory.id));
      setSelectedCategory(null);
      setIsDeleteCategoryOpen(false);

      // Try to delete from server
      await deleteCategory(selectedCategory.id);
      console.log('[DEBUG] Category deleted successfully');
    } catch (error) {
      console.error('Error deleting category:', error);
      // Restore local state if server failed
      setLocalCategories(prev => [...prev, categoryToDelete]);
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
          <div 
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setIsDebugExpanded(!isDebugExpanded)}
          >
            <h2 className="text-lg font-semibold">Debug Info</h2>
            <ChevronDown 
              className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                isDebugExpanded ? 'transform rotate-180' : ''
              }`}
            />
          </div>
          
          {isDebugExpanded && (
            <div className="space-y-2 mt-4">
              <p><strong>User ID:</strong> {cafeId || 'Not found'}</p>
              <p><strong>Username:</strong> {user?.username || 'Not found'}</p>
              <p><strong>Status:</strong> {user ? 'Authenticated' : 'Not authenticated'}</p>
              <p><strong>Is Reordering:</strong> {isReordering ? 'Yes' : 'No'}</p>
              <p><strong>Has Initialized:</strong> {hasInitialized ? 'Yes' : 'No'}</p>
              <p><strong>Using Local State:</strong> Yes (No server sync on drag)</p>
              <p><strong>Active Category:</strong> {activeCategoryId ? 
                `${sortedCategories.find(c => c.id === activeCategoryId)?.name || 'Unknown'} (${activeCategoryId})` : 
                'None'
              }</p>
              <p><strong>Filtered Items:</strong> {filteredMenuItems?.length || 0} / {menuItems?.length || 0}</p>
            </div>
          )}
        </div>

        {!shouldFetch ? (
          <div className="bg-red-50 p-6 rounded-lg border border-red-200">
            <h2 className="text-lg font-semibold mb-4 text-red-800">Authentication Required</h2>
            <p className="text-red-600">Please log in to access menu builder.</p>
          </div>
        ) : (
          <>
            {/* Main content with two columns */}
            <div className="flex gap-6">
              {/* Categories Section with Drag & Drop - 35% width */}
              <div className="w-[35%] bg-white p-6 rounded-lg border">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">
                    Categories {categoriesLoading && !hasInitialized ? '(Loading...)' : `(${localCategories?.length || 0})`}
                    {isReordering && <span className="text-blue-600 ml-2">(Updating...)</span>}
                  </h2>
                  <Button onClick={() => setIsAddCategoryOpen(true)} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
                
                {categoriesError ? (
                  <div className="text-red-600 p-4 bg-red-50 rounded">
                    <strong>Error:</strong> {categoriesError}
                  </div>
                ) : (categoriesLoading && !hasInitialized) ? (
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ) : sortedCategories?.length === 0 ? (
                  <p className="text-gray-500 text-sm">No categories found. Create your first category!</p>
                ) : (
                  <DndContext 
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext 
                      items={sortedCategories.map(c => c.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-2">
                        {sortedCategories.map(category => (
                          <SortableCategoryItem
                            key={category.id}
                            category={category}
                            onEdit={openEditDialog}
                            onDelete={openDeleteDialog}
                            isSelected={category.id === activeCategoryId}
                            onSelect={handleCategorySelect}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </div>

              {/* Menu Items Section - 65% width */}
              <div className="flex-1 bg-white p-6 rounded-lg border">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">
                      Menu Items {itemsLoading ? '(Loading...)' : `(${filteredMenuItems?.length || 0})`}
                    </h2>
                    {activeCategoryId && (
                      <p className="text-sm text-blue-600 mt-1">
                        Showing items from: {sortedCategories.find(c => c.id === activeCategoryId)?.name || 'Unknown'}
                        <button 
                          onClick={() => setActiveCategoryId(null)}
                          className="ml-2 text-gray-500 hover:text-gray-700"
                        >
                          (show all)
                        </button>
                      </p>
                    )}
                  </div>
                </div>
                
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
                ) : filteredMenuItems?.length === 0 ? (
                  <p className="text-gray-500">
                    {activeCategoryId 
                      ? 'No menu items found in this category.' 
                      : 'No menu items found.'
                    }
                  </p>
                ) : (
                  <div className="space-y-2">
                    {filteredMenuItems?.map(item => (
                      <div key={item.id} className="p-3 border rounded-lg">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          Category: {sortedCategories.find(c => c.id === item.categoryId)?.name || item.categoryId} | Price: ${item.price}
                        </p>
                        {item.description && (
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
