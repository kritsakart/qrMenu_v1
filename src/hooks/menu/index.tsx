
import { useState, useCallback } from "react";
import { MenuItem } from "@/types/models";
import { useFetchMenuItems } from "./useFetchMenuItems";
import { useAddMenuItem, AddMenuItemData } from "./useAddMenuItem";
import { useUpdateMenuItem, UpdateMenuItemData } from "./useUpdateMenuItem";
import { useDeleteMenuItem } from "./useDeleteMenuItem";
import { useUpdateMenuItemOrder, useUpdateMultipleMenuItemsOrder } from "./useUpdateMenuItemOrder";

export {
  useFetchMenuItems,
  useAddMenuItem,
  useUpdateMenuItem,
  useDeleteMenuItem,
  useUpdateMenuItemOrder,
  useUpdateMultipleMenuItemsOrder,
  type AddMenuItemData,
  type UpdateMenuItemData
};

// Main hook that composes all the individual hooks
export const useMenuItems = (categoryId?: string) => {
  const { menuItems, isLoading, error, fetchMenuItems, setMenuItems } = useFetchMenuItems(categoryId);
  
  const handleItemAdded = useCallback((newItem: MenuItem) => {
    console.log("Adding new item to menu items:", newItem);
    setMenuItems(prev => [...prev, newItem]);
  }, [setMenuItems]);
  
  const handleItemsUpdated = useCallback((updatedItems: MenuItem[]) => {
    console.log("Updating menu items:", updatedItems);
    setMenuItems(updatedItems);
  }, [setMenuItems]);
  
  const { addMenuItem } = useAddMenuItem(handleItemAdded);
  const { updateMenuItem } = useUpdateMenuItem(handleItemsUpdated, menuItems);
  const { deleteMenuItem } = useDeleteMenuItem(handleItemsUpdated, menuItems);

  // Force a re-fetch when category changes
  const refreshMenuItems = useCallback(() => {
    if (categoryId) {
      console.log("Forcing menu items refresh for category:", categoryId);
      fetchMenuItems();
    }
  }, [categoryId, fetchMenuItems]);

  return {
    menuItems,
    isLoading,
    error,
    fetchMenuItems,
    refreshMenuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem
  };
};
