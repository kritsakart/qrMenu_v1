
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
          <DialogTitle>Додавання категорії</DialogTitle>
          <DialogDescription>
            Створіть нову категорію для вашого меню.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="category-name">Назва категорії</Label>
            <Input
              id="category-name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Введіть назву категорії"
              disabled={isLoading}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Скасувати
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || !categoryName.trim()}>
            {isLoading ? "Додавання..." : "Додати категорію"}
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
          <DialogTitle>Редагування категорії</DialogTitle>
          <DialogDescription>
            Оновіть дані цієї категорії меню.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-category-name">Назва категорії</Label>
            <Input
              id="edit-category-name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Введіть назву категорії"
              disabled={isLoading}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Скасувати
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || !newCategoryName.trim()}>
            {isLoading ? "Оновлення..." : "Оновити категорію"}
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
          <DialogTitle>Видалення категорії</DialogTitle>
          <DialogDescription>
            Ви впевнені, що хочете видалити цю категорію? Всі пункти меню в цій категорії також будуть видалені.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>
            <strong>Категорія:</strong> {categoryName}
          </p>
          <p>
            <strong>Пунктів меню:</strong> {itemCount} буде видалено
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Скасувати
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? "Видалення..." : "Видалити категорію"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
