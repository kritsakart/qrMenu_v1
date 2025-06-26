import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MenuCategory } from "@/types/models";

interface AddCategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCategory: (name: string) => Promise<MenuCategory | undefined>;
}

export const AddCategoryDialog = ({ isOpen, onOpenChange, onAddCategory }: AddCategoryDialogProps) => {
  const [categoryName, setCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async () => {
    if (!categoryName.trim()) return;
    
    setIsLoading(true);
    try {
      const result = await onAddCategory(categoryName.trim());
      if (result) {
        setCategoryName("");
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error adding category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
          <DialogDescription>
            Create a new category for your menu.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="category-name">Category Name</Label>
            <Input
              id="category-name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter category name"
              disabled={isLoading}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || !categoryName.trim()}>
            {isLoading ? "Adding..." : "Add Category"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface EditCategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateCategory: (name: string) => Promise<boolean | undefined>;
  categoryName: string;
}

export const EditCategoryDialog = ({ isOpen, onOpenChange, onUpdateCategory, categoryName }: EditCategoryDialogProps) => {
  const [newCategoryName, setNewCategoryName] = useState(categoryName);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async () => {
    if (!newCategoryName.trim()) return;
    
    setIsLoading(true);
    try {
      const result = await onUpdateCategory(newCategoryName.trim());
      if (result) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error updating category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Update this menu category.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-category-name">Category Name</Label>
            <Input
              id="edit-category-name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter category name"
              disabled={isLoading}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || !newCategoryName.trim()}>
            {isLoading ? "Updating..." : "Update Category"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface DeleteCategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleteCategory: () => Promise<boolean | undefined>;
  categoryName: string;
  itemCount: number;
}

export const DeleteCategoryDialog = ({ 
  isOpen, 
  onOpenChange, 
  onDeleteCategory, 
  categoryName, 
  itemCount 
}: DeleteCategoryDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const result = await onDeleteCategory();
      if (result) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Category</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this category? All menu items in this category will also be deleted.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>
            <strong>Category:</strong> {categoryName}
          </p>
          <p>
            <strong>Menu items:</strong> {itemCount} will be deleted
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? "Deleting..." : "Delete Category"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
