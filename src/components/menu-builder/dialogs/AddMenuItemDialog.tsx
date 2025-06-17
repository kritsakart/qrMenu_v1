import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MenuItem } from "@/types/models";
import { MenuItemFormState } from "./types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { nanoid } from "nanoid";

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
  const { toast } = useToast();
  const [formState, setFormState] = useState<MenuItemFormState>({
    name: "",
    description: "",
    price: "",
    weight: "",
    imageUrl: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const fieldName = name.replace('item-', '');
    setFormState(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    } else {
      setImageFile(null);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;

    setIsUploading(true);
    const fileExtension = imageFile.name.split('.').pop();
    const filePath = `public/${nanoid()}.${fileExtension}`;

    try {
      const { data, error } = await supabase.storage
        .from('menu-images')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error("❌ DIAGNOSTIC: Supabase image upload error:", error);
        throw new Error(`Помилка завантаження зображення: ${error.message}`);
      }

      const { data: publicUrlData } = supabase.storage
        .from('menu-images')
        .getPublicUrl(filePath);

      if (publicUrlData) {
        console.log("✅ DIAGNOSTIC: Image uploaded, public URL:", publicUrlData.publicUrl);
        return publicUrlData.publicUrl;
      }
      return null;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Невідома помилка');
      console.error("❌ DIAGNOSTIC: Error during image upload:", error);
      toast({
        variant: "destructive",
        title: "Помилка завантаження зображення",
        description: error.message
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    let imageUrlToSave: string | null = formState.imageUrl || null;

    if (imageFile) {
      imageUrlToSave = await uploadImage();
      if (!imageUrlToSave) {
        // If image upload failed, stop the process
        return;
      }
    }

    const result = await onAddMenuItem({
      ...formState,
      imageUrl: imageUrlToSave || undefined,
    });

    if (result) {
      setFormState({
        name: "",
        description: "",
        price: "",
        weight: "",
        imageUrl: "",
      });
      setImageFile(null);
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
              placeholder="Enter image URL"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="item-image-upload">Upload Image (Optional)</Label>
            <Input
              id="item-image-upload"
              name="item-image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Add Menu Item"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
