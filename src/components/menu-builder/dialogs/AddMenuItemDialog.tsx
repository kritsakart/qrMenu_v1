
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MenuItem } from "@/types/models";
import { MenuItemFormState } from "./types";

interface AddMenuItemDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddMenuItem: (formData: MenuItemFormState) => Promise<MenuItem | undefined>;
  categoryName: string;
}

export const AddMenuItemDialog = ({ 
  isOpen, 
  onOpenChange, 
  onAddMenuItem,
  categoryName
}: AddMenuItemDialogProps) => {
  const [formState, setFormState] = useState<MenuItemFormState>({
    name: "",
    description: "",
    price: "",
    weight: "",
    imageUrl: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const fieldName = name.replace('item-', '');
    setFormState(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleSubmit = async () => {
    const result = await onAddMenuItem(formState);
    if (result) {
      // Reset form and close dialog on success
      setFormState({
        name: "",
        description: "",
        price: "",
        weight: "",
        imageUrl: "",
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Menu Item</DialogTitle>
          <DialogDescription>
            Create a new menu item for {categoryName}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="item-name">Item Name</Label>
              <Input
                name="item-name"
                value={formState.name}
                onChange={handleChange}
                placeholder="Enter item name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-price">Price</Label>
              <Input
                name="item-price"
                type="number"
                step="0.01"
                value={formState.price}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="item-description">Description (Optional)</Label>
            <Textarea
              name="item-description"
              value={formState.description}
              onChange={handleChange}
              placeholder="Enter item description"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="item-weight">Weight/Size (Optional)</Label>
              <Input
                name="item-weight"
                value={formState.weight}
                onChange={handleChange}
                placeholder="e.g., 250g, 500ml"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-imageUrl">Image URL (Optional)</Label>
              <Input
                name="item-imageUrl"
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
          <Button onClick={handleSubmit}>Add Menu Item</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
