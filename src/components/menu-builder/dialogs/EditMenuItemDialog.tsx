import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MenuItem } from "@/types/models";
import { MenuItemFormState, MenuItemVariantForm } from "./types";
import { useToast } from "@/hooks/use-toast";
import { supabaseAdmin } from "@/integrations/supabase/admin-client";
import { nanoid } from "nanoid";
import { Upload, X, Image as ImageIcon, Save, Plus, Trash2 } from "lucide-react";

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
  const { toast } = useToast();
  const [formState, setFormState] = useState<MenuItemFormState>({
    name: "",
    description: "",
    price: "",
    weight: "",
    weightUnit: "oz",
    imageUrl: "",
    variants: [],
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (menuItem) {
      // Парсимо weight і weightUnit із рядка
      const parseWeight = (weightStr: string | null | undefined) => {
        if (!weightStr) return { weight: "", weightUnit: "oz" };
        
        const match = weightStr.match(/^([\d.]+)\s*(oz|lb)$/i);
        if (match) {
          return { weight: match[1], weightUnit: match[2].toLowerCase() };
        }
        
        // Якщо формат не відповідає, залишаємо як є
        return { weight: weightStr, weightUnit: "oz" };
      };

      const { weight, weightUnit } = parseWeight(menuItem.weight);

      // Конвертуємо варіанти
      const variants: MenuItemVariantForm[] = (menuItem.variants || []).map(v => ({
        id: v.id,
        name: v.name,
        price: v.price.toString(),
        isDefault: v.isDefault || false
      }));

      setFormState({
        name: menuItem.name,
        description: menuItem.description || "",
        price: menuItem.price.toString(),
        weight,
        weightUnit,
        imageUrl: menuItem.imageUrl || "",
        variants,
      });
      
      setImageFile(null);
      setImagePreview(null);
      const fileInput = document.getElementById('edit-item-image-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
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

  const addVariant = () => {
    const newVariant: MenuItemVariantForm = {
      id: nanoid(),
      name: "",
      price: "0",
      isDefault: formState.variants.length === 0
    };
    setFormState(prev => ({
      ...prev,
      variants: [...prev.variants, newVariant]
    }));
  };

  const removeVariant = (variantId: string) => {
    setFormState(prev => ({
      ...prev,
      variants: prev.variants.filter(v => v.id !== variantId)
    }));
  };

  const updateVariant = (variantId: string, field: keyof MenuItemVariantForm, value: string | boolean) => {
    setFormState(prev => ({
      ...prev,
      variants: prev.variants.map(v => 
        v.id === variantId ? { ...v, [field]: value } : v
      )
    }));
  };

  const setDefaultVariant = (variantId: string) => {
    setFormState(prev => ({
      ...prev,
      variants: prev.variants.map(v => ({
        ...v,
        isDefault: v.id === variantId
      }))
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Перевірка типу файлу
      if (!file.type.startsWith('image/')) {
        toast({
          variant: "destructive",
          title: "Wrong file type",
          description: "Please select an image file"
        });
        return;
      }
      
      // Перевірка розміру файлу (максимум 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "File size should not exceed 5MB"
        });
        return;
      }
      
      setImageFile(file);
      
      // Створення превью
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Очищаємо URL поле, якщо користувач завантажує новий файл
      setFormState(prev => ({ ...prev, imageUrl: "" }));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    const fileInput = document.getElementById('edit-item-image-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;

    setIsUploading(true);
    
    try {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target?.result as string;
          console.log("✅ DIAGNOSTIC: Image converted to base64, length:", base64.length);
          resolve(base64);
        };
        reader.readAsDataURL(imageFile);
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      console.error("❌ DIAGNOSTIC: Error during image processing:", error);
      toast({
        variant: "destructive",
        title: "Image processing error",
        description: error.message
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    // Валідація обов'язкових полів
    if (!formState.name.trim()) {
      toast({
        variant: "destructive",
        title: "Validation error",
        description: "Product name is required"
      });
      return;
    }
    
    if (!formState.price || parseFloat(formState.price) <= 0) {
      toast({
        variant: "destructive",
        title: "Validation error",
        description: "Price must be greater than 0"
      });
      return;
    }

    let imageUrlToSave: string | null = formState.imageUrl.trim() || null;

    // Якщо є новий файл для завантаження, завантажуємо його
    if (imageFile) {
      imageUrlToSave = await uploadImage();
      if (!imageUrlToSave) {
        return;
      }
    }

    // Формуємо вагу з одиницею вимірювання
    const weightWithUnit = formState.weight.trim() 
      ? `${formState.weight.trim()} ${formState.weightUnit}`
      : "";

    // Конвертуємо варіанти
    const variants = formState.variants.map(v => ({
      id: v.id,
      name: v.name,
      price: parseFloat(v.price) || 0,
      isDefault: v.isDefault
    }));

    const submitData = {
      ...formState,
      weight: weightWithUnit,
      imageUrl: imageUrlToSave || undefined,
    };

    // @ts-ignore - тимчасово ігноруємо помилку типу для variants
    submitData.variants = variants;

    const result = await onUpdateMenuItem(submitData);

    if (result) {
      setImageFile(null);
      setImagePreview(null);
      const fileInput = document.getElementById('edit-item-image-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      onOpenChange(false);
    }
  };

  const currentImageUrl = imagePreview || formState.imageUrl;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Update product information.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-item-name">Product Name*</Label>
              <Input
                name="edit-item-name"
                value={formState.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-item-price">Price*</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <Input
                  name="edit-item-price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formState.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="pl-8"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-item-description">Description (optional)</Label>
            <Textarea
              name="edit-item-description"
              value={formState.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Weight/Size (optional)</Label>
            <div className="flex gap-2">
              <Input
                name="edit-item-weight"
                value={formState.weight}
                onChange={handleChange}
                placeholder="e.g., 8.5"
                className="flex-1"
              />
              <Select value={formState.weightUnit} onValueChange={(value) => setFormState(prev => ({ ...prev, weightUnit: value }))}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oz">oz</SelectItem>
                  <SelectItem value="lb">lb</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Product Variants Section */}
          <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Product Variants (optional)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addVariant}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Variant
              </Button>
            </div>
            
            {formState.variants.length > 0 && (
              <div className="space-y-3">
                {formState.variants.map((variant, index) => (
                  <div key={variant.id} className="border rounded-lg p-3 bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Variant {index + 1}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVariant(variant.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div>
                        <Label className="text-xs">Name</Label>
                        <Input
                          value={variant.name}
                          onChange={(e) => updateVariant(variant.id, 'name', e.target.value)}
                          placeholder="e.g., White Bread, Large"
                          className="h-8"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Price Adjustment</Label>
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                          <Input
                            type="number"
                            step="0.01"
                            value={variant.price}
                            onChange={(e) => updateVariant(variant.id, 'price', e.target.value)}
                            placeholder="0.00"
                            className="pl-6 h-8"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-default-${variant.id}`}
                        checked={variant.isDefault}
                        onCheckedChange={() => setDefaultVariant(variant.id)}
                      />
                      <Label htmlFor={`edit-default-${variant.id}`} className="text-xs">
                        Default variant
                      </Label>
                    </div>
                  </div>
                ))}
                <p className="text-xs text-gray-500">
                  Price adjustments are added to the base price. Use negative values for discounts.
                </p>
              </div>
            )}
          </div>
          
          {/* Секція для зображення */}
          <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
            <Label className="text-base font-medium">Product Image (optional)</Label>
            
            {/* Завантаження файлу */}
            <div className="space-y-2">
              <Label htmlFor="edit-item-image-upload" className="text-sm">Upload from device</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="edit-item-image-upload"
                  name="edit-item-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('edit-item-image-upload')?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Select
                </Button>
              </div>
              <p className="text-xs text-gray-500">Max size: 5MB. Formats: JPG, PNG, GIF</p>
            </div>
            
            {/* Превью зображення */}
            {currentImageUrl && (
              <div className="relative">
                <Label className="text-sm">Image preview</Label>
                <div className="relative inline-block mt-2">
                  <img 
                    src={currentImageUrl} 
                    alt="Preview" 
                    className="max-w-32 max-h-32 object-cover rounded border shadow-sm"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                    onClick={removeImage}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )}
            
            {/* Альтернативно: URL зображення */}
            {!imageFile && (
              <div className="space-y-2">
                <Label htmlFor="edit-item-imageUrl" className="text-sm">Or enter image URL</Label>
                <Input
                  name="edit-item-imageUrl"
                  value={formState.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isUploading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isUploading}>
            {isUploading ? (
              <>
                <Upload className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Update Product
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 