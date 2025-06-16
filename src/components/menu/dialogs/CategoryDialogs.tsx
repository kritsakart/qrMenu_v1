
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MenuCategory } from "@/types/models";

interface AddCategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCategory: (name: string) => Promise<void>;
}

export const AddCategoryDialog = ({ isOpen, onOpenChange, onAddCategory }: AddCategoryDialogProps) => {
  const [categoryName, setCategoryName] = useState("");
  
  const handleSubmit = async () => {
    await onAddCategory(categoryName);
    setCategoryName("");
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
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Скасувати
          </Button>
          <Button onClick={handleSubmit}>Додати категорію</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface EditCategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateCategory: (name: string) => Promise<void>;
  initialName: string;
}

export const EditCategoryDialog = ({ isOpen, onOpenChange, onUpdateCategory, initialName }: EditCategoryDialogProps) => {
  const [categoryName, setCategoryName] = useState(initialName);
  
  const handleSubmit = async () => {
    await onUpdateCategory(categoryName);
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
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Введіть назву категорії"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Скасувати
          </Button>
          <Button onClick={handleSubmit}>Оновити категорію</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface DeleteCategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleteCategory: () => Promise<void>;
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Скасувати
          </Button>
          <Button variant="destructive" onClick={onDeleteCategory}>
            Видалити категорію
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
