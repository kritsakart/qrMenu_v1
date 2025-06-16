
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MenuItem } from "@/types/models";
import { MenuItemFormState } from "./types";

interface EditMenuItemDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateMenuItem: (formData: MenuItemFormState) => Promise<boolean | undefined>;
  menuItem: MenuItem | null;
}

export const EditMenuItemDialog = ({ 
  isOpen, 
  onOpenChange, 
  onUpdateMenuItem,
  menuItem
}: EditMenuItemDialogProps) => {
  const [formState, setFormState] = useState<MenuItemFormState>({
    name: "",
    description: "",
    price: "",
    weight: "",
    imageUrl: "",
  });

  useEffect(() => {
    if (menuItem) {
      setFormState({
        name: menuItem.name,
        description: menuItem.description || "",
        price: menuItem.price.toString(),
        weight: menuItem.weight || "",
        imageUrl: menuItem.imageUrl || "",
      });
    }
  }, [menuItem]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const fieldName = name.replace('edit-item-', '');
    setFormState(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleSubmit = async () => {
    const result = await onUpdateMenuItem(formState);
    if (result) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Menu Item</DialogTitle>
          <DialogDescription>
            Update this menu item's details.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-item-name">Item Name</Label>
              <Input
                name="edit-item-name"
                value={formState.name}
                onChange={handleChange}
                placeholder="Enter item name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-item-price">Price</Label>
              <Input
                name="edit-item-price"
                type="number"
                step="0.01"
                value={formState.price}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-item-description">Description (Optional)</Label>
            <Textarea
              name="edit-item-description"
              value={formState.description}
              onChange={handleChange}
              placeholder="Enter item description"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-item-weight">Weight/Size (Optional)</Label>
              <Input
                name="edit-item-weight"
                value={formState.weight}
                onChange={handleChange}
                placeholder="e.g., 250g, 500ml"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-item-imageUrl">Image URL (Optional)</Label>
              <Input
                name="edit-item-imageUrl"
                value={formState.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Update Menu Item</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
