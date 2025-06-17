import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MenuItem } from "@/types/models";
import { MenuItemFormState } from "./types";
import { useToast } from "@/hooks/use-toast";
import { supabaseAdmin } from "@/integrations/supabase/admin-client";
import { nanoid } from "nanoid";
import { Upload, X, Image as ImageIcon, Save } from "lucide-react";

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
    imageUrl: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (menuItem) {
      setFormState({
        name: menuItem.name,
        description: menuItem.description || "",
        price: menuItem.price.toString(),
        weight: menuItem.weight || "",
        imageUrl: menuItem.imageUrl || "",
      });
      // Очищаємо стан файлів при зміні товару
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Перевірка типу файлу
      if (!file.type.startsWith('image/')) {
        toast({
          variant: "destructive",
          title: "Неправильний тип файлу",
          description: "Будь ласка, виберіть файл зображення"
        });
        return;
      }
      
      // Перевірка розміру файлу (максимум 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Файл занадто великий",
          description: "Розмір файлу не повинен перевищувати 5MB"
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
      // Тимчасове рішення: конвертуємо файл в base64 для демонстрації
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
      const error = err instanceof Error ? err : new Error('Невідома помилка');
      console.error("❌ DIAGNOSTIC: Error during image processing:", error);
      toast({
        variant: "destructive",
        title: "Помилка обробки зображення",
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
        title: "Помилка валідації",
        description: "Назва товару є обов'язковою"
      });
      return;
    }
    
    if (!formState.price || parseFloat(formState.price) <= 0) {
      toast({
        variant: "destructive",
        title: "Помилка валідації",
        description: "Ціна повинна бути більше 0"
      });
      return;
    }

    let imageUrlToSave: string | null = formState.imageUrl.trim() || null;

    // Якщо є новий файл для завантаження, завантажуємо його
    if (imageFile) {
      imageUrlToSave = await uploadImage();
      if (!imageUrlToSave) {
        return; // Якщо завантаження не вдалося, зупиняємо процес
      }
    }

    const result = await onUpdateMenuItem({
      ...formState,
      imageUrl: imageUrlToSave || undefined,
    });

    if (result) {
      // Очищаємо стан файлів після успішного оновлення
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
          <DialogTitle>Редагувати товар</DialogTitle>
          <DialogDescription>
            Оновити інформацію про товар.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-item-name">Назва товару*</Label>
              <Input
                name="edit-item-name"
                value={formState.name}
                onChange={handleChange}
                placeholder="Введіть назву товару"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-item-price">Ціна*</Label>
              <Input
                name="edit-item-price"
                type="number"
                step="0.01"
                min="0"
                value={formState.price}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-item-description">Опис (опціонально)</Label>
            <Textarea
              name="edit-item-description"
              value={formState.description}
              onChange={handleChange}
              placeholder="Введіть опис товару"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-item-weight">Вага/Розмір (опціонально)</Label>
            <Input
              name="edit-item-weight"
              value={formState.weight}
              onChange={handleChange}
              placeholder="наприклад: 250г, 500мл"
            />
          </div>
          
          {/* Секція для зображення */}
          <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
            <Label className="text-base font-medium">Зображення товару (опціонально)</Label>
            
            {/* Поточне зображення */}
            {currentImageUrl && (
              <div className="relative">
                <Label className="text-sm">
                  {imagePreview ? "Нове зображення (превью)" : "Поточне зображення"}
                </Label>
                <div className="relative inline-block mt-2">
                  <img 
                    src={currentImageUrl} 
                    alt="Preview" 
                    className="max-w-48 max-h-48 object-cover rounded border shadow-sm"
                  />
                  {imagePreview && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                      onClick={removeImage}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
            )}
            
            {/* Завантаження нового файлу */}
            <div className="space-y-2">
              <Label htmlFor="edit-item-image-upload" className="text-sm">
                {currentImageUrl ? "Замінити зображення" : "Завантажити з пристрою"}
              </Label>
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
                  Вибрати
                </Button>
              </div>
              <p className="text-xs text-gray-500">Максимальний розмір: 5MB. Формати: JPG, PNG, GIF</p>
            </div>
            
            {/* Альтернативно: URL зображення */}
            {!imageFile && (
              <div className="space-y-2">
                <Label htmlFor="edit-item-imageUrl" className="text-sm">
                  {currentImageUrl ? "Або змінити URL зображення" : "Або введіть URL зображення"}
                </Label>
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
            Скасувати
          </Button>
          <Button onClick={handleSubmit} disabled={isUploading}>
            {isUploading ? (
              <>
                <Upload className="w-4 h-4 mr-2 animate-spin" />
                Завантаження...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Зберегти зміни
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
