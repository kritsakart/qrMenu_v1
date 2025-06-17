import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MenuItem } from "@/types/models";
import { MenuItemFormState } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();

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

  const uploadImage = async (): Promise<string | undefined> => {
    if (!imageFile) return undefined;

    // Додаємо логування стану сесії перед завантаженням
    const { data: { session } } = await supabase.auth.getSession();
    const { data: { user } } = await supabase.auth.getUser();
    console.log("Session before upload:", session);
    console.log("User before upload:", user);

    if (!session) {
      toast({
        variant: "destructive",
        title: "Помилка автентифікації",
        description: "Користувач не автентифікований. Будь ласка, увійдіть знову.",
      });
      return undefined;
    }

    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError, data: uploadData } = await supabase.storage
      .from('menu-images')
      .upload(filePath, imageFile, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      toast({
        variant: "destructive",
        title: "Помилка завантаження зображення",
        description: uploadError.message,
      });
      console.error("Помилка завантаження зображення:", uploadError);
      return undefined;
    }

    const { data: publicUrlData } = supabase.storage
      .from('menu-images')
      .getPublicUrl(filePath);

    if (publicUrlData) {
      return publicUrlData.publicUrl;
    }
    return undefined;
  };

  const handleSubmit = async () => {
    let uploadedImageUrl: string | undefined = formState.imageUrl;

    if (imageFile) {
      uploadedImageUrl = await uploadImage();
      if (!uploadedImageUrl) {
        return;
      }
    }

    const result = await onAddMenuItem({ ...formState, imageUrl: uploadedImageUrl });
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
              <Label htmlFor="item-imageFile">Image (Optional)</Label>
              <Input
                name="item-imageFile"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>
          {formState.imageUrl && !imageFile && (
            <div className="space-y-2">
              <Label>Current Image URL</Label>
              <p className="text-sm text-gray-500 break-all">{formState.imageUrl}</p>
            </div>
          )}
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
