
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MenuItem } from "@/types/models";

interface MenuItemFormData {
  name: string;
  description: string;
  price: string;
  weight: string;
  imageUrl: string;
}

interface AddMenuItemDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddMenuItem: (data: MenuItemFormData) => Promise<void>;
  categoryName: string;
}

export const AddMenuItemDialog = ({ 
  isOpen, 
  onOpenChange, 
  onAddMenuItem, 
  categoryName 
}: AddMenuItemDialogProps) => {
  const [formData, setFormData] = useState<MenuItemFormData>({
    name: "",
    description: "",
    price: "",
    weight: "",
    imageUrl: ""
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id.replace("item-", "")]: e.target.value });
  };
  
  const handleSubmit = async () => {
    await onAddMenuItem(formData);
    setFormData({
      name: "",
      description: "",
      price: "",
      weight: "",
      imageUrl: ""
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Додавання пункту меню</DialogTitle>
          <DialogDescription>
            Створіть новий пункт меню для категорії {categoryName}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="item-name">Назва пункту</Label>
              <Input
                id="item-name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Введіть назву пункту"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-price">Ціна</Label>
              <Input
                id="item-price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="item-description">Опис (опціонально)</Label>
            <Textarea
              id="item-description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Введіть опис пункту меню"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="item-weight">Вага/Розмір (опціонально)</Label>
              <Input
                id="item-weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="напр., 250г, 500мл"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-imageUrl">URL зображення (опціонально)</Label>
              <Input
                id="item-imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Скасувати
          </Button>
          <Button onClick={handleSubmit}>Додати пункт меню</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface EditMenuItemDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateMenuItem: (data: MenuItemFormData) => Promise<void>;
  menuItem: MenuItem | null;
}

export const EditMenuItemDialog = ({ 
  isOpen, 
  onOpenChange, 
  onUpdateMenuItem, 
  menuItem 
}: EditMenuItemDialogProps) => {
  const [formData, setFormData] = useState<MenuItemFormData>({
    name: "",
    description: "",
    price: "",
    weight: "",
    imageUrl: ""
  });
  
  useEffect(() => {
    if (menuItem) {
      setFormData({
        name: menuItem.name,
        description: menuItem.description || "",
        price: menuItem.price.toString(),
        weight: menuItem.weight || "",
        imageUrl: menuItem.imageUrl || ""
      });
    }
  }, [menuItem]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id.replace("edit-item-", "")]: e.target.value });
  };
  
  const handleSubmit = async () => {
    await onUpdateMenuItem(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Редагування пункту меню</DialogTitle>
          <DialogDescription>
            Оновіть деталі цього пункту меню.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-item-name">Назва пункту</Label>
              <Input
                id="edit-item-name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Введіть назву пункту"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-item-price">Ціна</Label>
              <Input
                id="edit-item-price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-item-description">Опис (опціонально)</Label>
            <Textarea
              id="edit-item-description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Введіть опис пункту меню"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-item-weight">Вага/Розмір (опціонально)</Label>
              <Input
                id="edit-item-weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="напр., 250г, 500мл"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-item-imageUrl">URL зображення (опціонально)</Label>
              <Input
                id="edit-item-imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Скасувати
          </Button>
          <Button onClick={handleSubmit}>Оновити пункт меню</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface DeleteMenuItemDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleteMenuItem: () => Promise<void>;
  menuItem: MenuItem | null;
}

export const DeleteMenuItemDialog = ({ 
  isOpen, 
  onOpenChange, 
  onDeleteMenuItem, 
  menuItem 
}: DeleteMenuItemDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Видалення пункту меню</DialogTitle>
          <DialogDescription>
            Ви впевнені, що хочете видалити цей пункт меню? Цю дію неможливо скасувати.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>
            <strong>Пункт:</strong> {menuItem?.name}
          </p>
          <p>
            <strong>Ціна:</strong> {menuItem?.price.toFixed(2)} грн
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Скасувати
          </Button>
          <Button variant="destructive" onClick={onDeleteMenuItem}>
            Видалити пункт
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
