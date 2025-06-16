
import { useMenuItems } from "./menu";

// Re-export everything from the refactored module
export { 
  useMenuItems,
  useFetchMenuItems, 
  useAddMenuItem, 
  useUpdateMenuItem, 
  useDeleteMenuItem 
} from "./menu";

// The contents of this file are now moved to the new modular structure
// This file remains as a compatibility layer to avoid breaking existing imports
