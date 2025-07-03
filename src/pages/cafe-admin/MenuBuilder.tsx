import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useAuthState } from "@/hooks/auth/useAuthState";
import { useFetchMenuCategoriesNew } from "@/hooks/menu-categories/useFetchMenuCategoriesNew";
import { useFetchMenuItems } from "@/hooks/menu/useFetchMenuItems";
import { useAddMenuCategory } from "@/hooks/menu-categories/useAddMenuCategory";
import { useUpdateMenuCategory } from "@/hooks/menu-categories/useUpdateMenuCategory";
import { useDeleteMenuCategory } from "@/hooks/menu-categories/useDeleteMenuCategory";
import { useUpdateMenuCategoryOrder } from "@/hooks/menu-categories/useUpdateMenuCategoryOrder";
import { useUpdateMenuItemOrder, useUpdateMultipleMenuItemsOrder } from "@/hooks/menu/useUpdateMenuItemOrder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash, Plus, GripVertical, ChevronDown } from "lucide-react";
import { supabaseAdmin } from "@/integrations/supabase/admin-client";

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

// Add MenuItemImage component
const MenuItemImage = ({ imageUrl, itemName }: { imageUrl?: string; itemName: string }) => {
  const [imageError, setImageError] = useState(false);
  
  if (!imageUrl || imageError) {
    return (
      <div className="w-20 h-20 bg-gray-100 flex items-center justify-center rounded border">
        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }
  
  return (
    <img
      src={imageUrl}
      alt={itemName}
      className="w-20 h-20 object-cover rounded border"
      onError={() => setImageError(true)}
      loading="lazy"
    />
  );
};

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

// Sortable Menu Item Component
const SortableMenuItem = ({ item, onEdit, onDelete, categoryName }: {
  item: any;
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
  categoryName: string;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1000 : 1,
    position: (isDragging ? 'relative' : undefined) as 'relative' | undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`menu-item-stable flex items-center justify-between p-4 border rounded-lg min-h-[80px] transition-all duration-200 ${
        isDragging 
          ? 'shadow-2xl bg-white border-blue-300 scale-[1.02]' 
          : 'bg-white hover:bg-gray-50 hover:shadow-md'
      }`}
    >
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab hover:cursor-grabbing p-2 hover:bg-gray-100 rounded-md transition-colors flex-shrink-0"
        >
          <GripVertical className="h-5 w-5 text-gray-400" />
        </div>
        
        {/* Photo */}
        <div className="flex-shrink-0">
          <MenuItemImage imageUrl={item.imageUrl} itemName={item.name} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
          <p className="text-sm text-gray-500 mt-1">
            Category: {categoryName} | Price: ${item.price}
          </p>
          {item.description && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
          )}
          {item.weight && (
            <span className="text-xs text-gray-500 bg-gray-100 rounded px-2 py-1 inline-block mt-1">
              {item.weight}
            </span>
          )}
        </div>
      </div>
      <div className="flex space-x-2 flex-shrink-0 ml-4">
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => onEdit(item)}
          className="transition-colors"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button 
          size="sm" 
          variant="destructive"
          onClick={() => onDelete(item)}
          className="transition-colors"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

import { EditMenuItemDialog } from "@/components/menu-builder/dialogs/EditMenuItemDialog";
import { AddMenuItemDialog } from "@/components/menu-builder/dialogs/AddMenuItemDialog";

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

  // Local state for menu items drag & drop
  const [localMenuItems, setLocalMenuItems] = useState<any[]>([]);
  const [hasMenuItemsInitialized, setHasMenuItemsInitialized] = useState(false);

  // State for EditMenuItemDialog
  const [isEditMenuItemOpen, setIsEditMenuItemOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState(null);

  // State for Add Menu Item Dialog
  const [isAddMenuItemOpen, setIsAddMenuItemOpen] = useState(false);

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
  const updateMenuItemOrderMutation = useUpdateMenuItemOrder();
  const updateMultipleMenuItemsOrderMutation = useUpdateMultipleMenuItemsOrder();

  // Drag and Drop sensors with improved stability
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Requires 8px movement before starting drag
      },
    }),
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

  // Initialize local menu items only once from server data
  useEffect(() => {
    if (menuItems && menuItems.length > 0 && !hasMenuItemsInitialized) {
      console.log('[DEBUG] Initial load - setting menu items from server:', menuItems);
      setLocalMenuItems(menuItems);
      setHasMenuItemsInitialized(true);
    }
  }, [menuItems, hasMenuItemsInitialized]);

  // Sort categories by order
  const sortedCategories = localCategories ? [...localCategories].sort((a, b) => {
    const orderA = a.order !== undefined ? a.order : 9999;
    const orderB = b.order !== undefined ? b.order : 9999;
    return orderA - orderB;
  }) : [];

  // Filter menu items by active category
  const filteredMenuItems = activeCategoryId 
    ? localMenuItems?.filter(item => item.categoryId === activeCategoryId).sort((a, b) => {
        const orderA = a.order !== undefined ? a.order : 9999;
        const orderB = b.order !== undefined ? b.order : 9999;
        return orderA - orderB;
      }) || []
    : localMenuItems?.sort((a, b) => {
        const orderA = a.order !== undefined ? a.order : 9999;
        const orderB = b.order !== undefined ? b.order : 9999;
        return orderA - orderB;
      }) || [];

  // Handler for category selection
  const handleCategorySelect = (category: any) => {
    setActiveCategoryId(category.id === activeCategoryId ? null : category.id);
  };

  console.log('[DEBUG] MenuBuilder: fetch results =', {
    categoriesCount: categories?.length || 0,
    localCategoriesCount: localCategories?.length || 0,
    menuItemsCount: menuItems?.length || 0,
    localMenuItemsCount: localMenuItems?.length || 0,
    filteredMenuItemsCount: filteredMenuItems?.length || 0,
    categoriesLoading,
    itemsLoading,
    categoriesError,
    itemsError,
    isReordering,
    hasInitialized,
    hasMenuItemsInitialized,
    activeCategoryId,
    filteredMenuItemsOrder: filteredMenuItems?.map(i => ({ id: i.id, name: i.name, order: i.order }))
  });

  // Handler for category selection
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = sortedCategories.findIndex((item) => item.id === active.id);
      const newIndex = sortedCategories.findIndex((item) => item.id === over?.id);

      // Optimistically update the local state immediately
      const reorderedItems = arrayMove(sortedCategories, oldIndex, newIndex);
      
      // Update order values for proper sorting
      const itemsWithNewOrder = reorderedItems.map((item, index) => ({
        ...item,
        order: index + 1
      }));
      
      console.log('[DEBUG] Category drag end - OPTIMISTIC UPDATE:', {
        oldIndex,
        newIndex,
        oldOrder: sortedCategories.map(i => ({ id: i.id, name: i.name, order: i.order })),
        newOrder: itemsWithNewOrder.map(i => ({ id: i.id, name: i.name, order: i.order }))
      });

      // Update local state immediately for smooth UX
      const updatedLocalItems = localCategories.map(item => {
        const reorderedItem = itemsWithNewOrder.find(r => r.id === item.id);
        return reorderedItem || item;
      });
      
      setLocalCategories(updatedLocalItems);
      setIsReordering(true);

      // Update the order in the database silently in background
      try {
        const updates = itemsWithNewOrder.map(item => ({
          id: item.id,
          order: item.order
        }));
        
        reorderCategories(updates);
        console.log('[DEBUG] Categories database update successful (background)');
      } catch (error) {
        console.error('[DEBUG] Categories database update failed, but keeping optimistic state');
      } finally {
        setIsReordering(false);
      }
    }
  };

  // Handler for menu items drag & drop
  const handleMenuItemDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id && activeCategoryId) {
      // Використовуємо відсортовані filteredMenuItems замість необроблених localMenuItems
      const currentItems = filteredMenuItems;
      const oldIndex = currentItems.findIndex((item) => item.id === active.id);
      const newIndex = currentItems.findIndex((item) => item.id === over?.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        console.log('[DEBUG] Menu Item drag end - START REORDER:', {
          categoryId: activeCategoryId,
          oldIndex,
          newIndex,
          itemName: currentItems[oldIndex]?.name,
          currentItemsOrder: currentItems.map(i => ({ id: i.id, name: i.name, order: i.order }))
        });

        // Reorder items within the category
        const reorderedItems = arrayMove(currentItems, oldIndex, newIndex);
        
        // Update order values with more predictable ordering
        const itemsWithNewOrder = reorderedItems.map((item, index) => ({
          ...item,
          order: index + 1
        }));

        console.log('[DEBUG] Menu Item drag end - AFTER REORDER:', {
          reorderedItemsOrder: itemsWithNewOrder.map(i => ({ id: i.id, name: i.name, order: i.order }))
        });

        // Update local state immediately for smooth UX
        const updatedLocalItems = localMenuItems.map(item => {
          if (item.categoryId === activeCategoryId) {
            const reorderedItem = itemsWithNewOrder.find(r => r.id === item.id);
            return reorderedItem || item;
          }
          return item;
        });
        
        // Apply the update in a single setState call to avoid flickering
        setLocalMenuItems(updatedLocalItems);

        console.log('[DEBUG] Menu Item drag end - LOCAL STATE UPDATED:', {
          newOrder: itemsWithNewOrder.map(i => ({ id: i.id, name: i.name, order: i.order })),
          fullLocalState: updatedLocalItems.filter(i => i.categoryId === activeCategoryId).map(i => ({ id: i.id, name: i.name, order: i.order }))
        });

        // Update the order in the database silently in background
        // Use the batch update mutation to avoid query invalidation conflicts
        setTimeout(() => {
          const updates = itemsWithNewOrder.map(item => ({
            itemId: item.id,
            newOrder: item.order,
            categoryId: activeCategoryId
          }));
          
          updateMultipleMenuItemsOrderMutation.mutate(updates, {
            onError: (error) => {
              console.warn('[DEBUG] Failed to update menu items order (batch):', error);
              // Don't revert local state to maintain smooth UX
            },
            onSuccess: () => {
              console.log('[DEBUG] Successfully updated menu items order (batch)');
            }
          });
        }, 0);
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

  // Function to open EditMenuItemDialog
  const openEditMenuItemDialog = (item) => {
    setEditingMenuItem(item);
    setIsEditMenuItemOpen(true);
  };

  // Function to handle updating a menu item
  const handleUpdateMenuItem = async (formData): Promise<boolean> => {
    try {
      const itemId = editingMenuItem?.id;
      if (!itemId) return false;

      // Оновлення у Supabase
      const { error } = await supabaseAdmin
        .from("menu_items")
        .update({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          weight: formData.weight ? `${formData.weight} ${formData.weightUnit}` : null,
          image_url: formData.imageUrl || null,
          variants: formData.variants, // якщо поле є у базі як JSONB
        })
        .eq("id", itemId);

      if (error) {
        // TODO: Додати toast про помилку
        return false;
      }

      // Оновлення локального стану
      setLocalMenuItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, ...formData, price: parseFloat(formData.price) } : item
        )
      );
      setIsEditMenuItemOpen(false);
      setEditingMenuItem(null);

      return true;
    } catch (e) {
      // TODO: Додати toast про помилку
      return false;
    }
  };

  // Додаю функцію для додавання продукту
  const handleAddMenuItem = async (formData) => {
    try {
      if (!activeCategoryId) return;
      // Додаємо у Supabase
      const { data, error } = await supabaseAdmin
        .from("menu_items")
        .insert({
          category_id: activeCategoryId,
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          weight: formData.weight ? `${formData.weight} ${formData.weightUnit}` : null,
          image_url: formData.imageUrl || null,
          variants: formData.variants,
          order: filteredMenuItems.length + 1,
        })
        .select()
        .single();
      if (error) {
        // TODO: toast про помилку
        return undefined;
      }
      // Мапимо дані у формат MenuItem
      const newItem = {
        id: data.id,
        categoryId: data.category_id,
        name: data.name,
        description: data.description,
        price: data.price,
        weight: data.weight,
        imageUrl: data.image_url,
        order: data.order,
        createdAt: data.created_at,
        variants: data.variants,
      };
      setLocalMenuItems((prev) => [...prev, newItem]);
      setIsAddMenuItemOpen(false);
      return newItem;
    } catch (e) {
      // TODO: toast про помилку
      return undefined;
    }
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
              <p><strong>Has Menu Items Initialized:</strong> {hasMenuItemsInitialized ? 'Yes' : 'No'}</p>
              <p><strong>Using Local State:</strong> Yes (No server sync on drag)</p>
              <p><strong>Active Category:</strong> {activeCategoryId ? 
                `${sortedCategories.find(c => c.id === activeCategoryId)?.name || 'Unknown'} (${activeCategoryId})` : 
                'None'
              }</p>
              <p><strong>Server Items:</strong> {menuItems?.length || 0}</p>
              <p><strong>Local Items:</strong> {localMenuItems?.length || 0}</p>
              <p><strong>Filtered Items:</strong> {filteredMenuItems?.length || 0}</p>
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
                  <Button onClick={() => setIsAddMenuItemOpen(true)} size="sm" disabled={!activeCategoryId}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
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
                ) : activeCategoryId ? (
                  <div className="drag-container">
                    <DndContext 
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleMenuItemDragEnd}
                    >
                      <SortableContext 
                        items={filteredMenuItems.map(item => item.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="drag-list max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                          {filteredMenuItems?.map(item => (
                            <SortableMenuItem
                              key={item.id}
                              item={item}
                              onEdit={openEditMenuItemDialog}
                              onDelete={openDeleteDialog}
                              categoryName={sortedCategories.find(c => c.id === item.categoryId)?.name || item.categoryId}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-blue-600 mb-4">
                      Select a category to enable drag & drop reordering of menu items
                    </p>
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

        {/* EditMenuItemDialog */}
        <EditMenuItemDialog
          isOpen={isEditMenuItemOpen}
          onOpenChange={(open) => {
            setIsEditMenuItemOpen(open);
            if (!open) setEditingMenuItem(null);
          }}
          onUpdateMenuItem={handleUpdateMenuItem}
          menuItem={editingMenuItem}
        />

        {/* AddMenuItemDialog */}
        <AddMenuItemDialog
          isOpen={isAddMenuItemOpen}
          onOpenChange={setIsAddMenuItemOpen}
          onAddMenuItem={handleAddMenuItem}
          categoryName={sortedCategories.find(c => c.id === activeCategoryId)?.name || ''}
        />
      </div>
    </DashboardLayout>
  );
};

export default MenuBuilder;
