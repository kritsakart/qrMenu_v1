import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, X, Upload, Image as ImageIcon } from 'lucide-react';
import { supabaseAdmin } from '@/integrations/supabase/admin-client';
import { toast } from 'sonner';
import type { Location, PromoImage } from '@/types/models';

interface LocationBrandingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  location: Location | null;
  onUpdate: (updatedLocation: Location) => void;
}

const LocationBrandingDialog: React.FC<LocationBrandingDialogProps> = ({
  isOpen,
  onClose,
  location,
  onUpdate,
}) => {
  const [coverImage, setCoverImage] = useState<string>('');
  const [logoImage, setLogoImage] = useState<string>('');
  const [promoImages, setPromoImages] = useState<PromoImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (location) {
      setCoverImage(location.coverImage || '');
      setLogoImage(location.logoImage || '');
      setPromoImages(location.promoImages || []);
    }
  }, [location]);

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleCoverImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        // Перевірка розміру файлу (максимум 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error('File size must be less than 5MB');
          return;
        }
        
        // Перевірка типу файлу
        if (!file.type.startsWith('image/')) {
          toast.error('Please select an image file');
          return;
        }

        const base64 = await convertFileToBase64(file);
        setCoverImage(base64);
        toast.success('Cover image uploaded successfully');
      } catch (error) {
        console.error('Error uploading cover image:', error);
        toast.error('Failed to upload cover image');
      }
    }
  };

  const handleLogoImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        // Перевірка розміру файлу (максимум 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error('File size must be less than 5MB');
          return;
        }
        
        // Перевірка типу файлу
        if (!file.type.startsWith('image/')) {
          toast.error('Please select an image file');
          return;
        }

        const base64 = await convertFileToBase64(file);
        setLogoImage(base64);
        toast.success('Logo image uploaded successfully');
      } catch (error) {
        console.error('Error uploading logo image:', error);
        toast.error('Failed to upload logo image');
      }
    }
  };

  const handlePromoImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        // Перевірка розміру файлу (максимум 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error('File size must be less than 5MB');
          return;
        }
        
        // Перевірка типу файлу
        if (!file.type.startsWith('image/')) {
          toast.error('Please select an image file');
          return;
        }

        const base64 = await convertFileToBase64(file);
        const updatedPromoImages = [...promoImages];
        updatedPromoImages[index] = { ...updatedPromoImages[index], url: base64 };
        setPromoImages(updatedPromoImages);
        toast.success('Promo image uploaded successfully');
      } catch (error) {
        console.error('Error uploading promo image:', error);
        toast.error('Failed to upload promo image');
      }
    }
  };

  const addPromoImage = () => {
    setPromoImages([...promoImages, { url: '', title: '' }]);
  };

  const removePromoImage = (index: number) => {
    setPromoImages(promoImages.filter((_, i) => i !== index));
  };

  const updatePromoImageTitle = (index: number, title: string) => {
    const updatedPromoImages = [...promoImages];
    updatedPromoImages[index] = { ...updatedPromoImages[index], title };
    setPromoImages(updatedPromoImages);
  };

  const handleSave = async () => {
    if (!location) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabaseAdmin
        .from('locations')
        .update({
          cover_image: coverImage || null,
          logo_image: logoImage || null,
          promo_images: promoImages.filter(img => img.url) // Видаляємо порожні зображення
        })
        .eq('id', location.id)
        .select()
        .single();

      if (error) throw error;

      // Оновлюємо локальний стан
      const updatedLocation: Location = {
        ...location,
        coverImage: data.cover_image,
        logoImage: data.logo_image,
        promoImages: (data.promo_images as PromoImage[]) || []
      };

      onUpdate(updatedLocation);
      toast.success('Branding updated successfully');
      onClose();
    } catch (error) {
      console.error('Error saving branding:', error);
      toast.error('Failed to save branding');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Скидаємо зміни при закритті
    if (location) {
      setCoverImage(location.coverImage || '');
      setLogoImage(location.logoImage || '');
      setPromoImages(location.promoImages || []);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Location Branding - {location?.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Size Guidelines */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h4 className="font-semibold text-blue-800 mb-2">📏 Image Size Guidelines</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li><strong>Cover Image:</strong> 800x600px (4:3 ratio) - Main background image</li>
                <li><strong>Logo Image:</strong> 200x200px (1:1 ratio) - Logo/avatar in circle</li>
                <li><strong>Promo Images:</strong> 800x400px (2:1 ratio) - Slideshow images</li>
                <li><strong>File Size:</strong> Maximum 5MB per image</li>
                <li><strong>Format:</strong> JPG, PNG, WebP supported</li>
              </ul>
            </CardContent>
          </Card>

          {/* Cover Image Section */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Cover Image</Label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cover-upload" className="cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Click to upload cover image</p>
                    <p className="text-xs text-gray-500 mt-1">800x600px recommended</p>
                  </div>
                </Label>
                <input
                  id="cover-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageUpload}
                  className="hidden"
                />
              </div>

              {coverImage && (
                <div className="relative">
                  <img
                    src={coverImage}
                    alt="Cover preview"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setCoverImage('')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Logo Image Section */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Logo Image</Label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="logo-upload" className="cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Click to upload logo image</p>
                    <p className="text-xs text-gray-500 mt-1">200x200px recommended</p>
                  </div>
                </Label>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoImageUpload}
                  className="hidden"
                />
              </div>

              {logoImage && (
                <div className="relative">
                  <img
                    src={logoImage}
                    alt="Logo preview"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setLogoImage('')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Promo Images Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Promotional Images</Label>
              <Button onClick={addPromoImage} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Image
              </Button>
            </div>

            <div className="space-y-4">
              {promoImages.map((promo, index) => (
                <Card key={index} className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                    <div>
                      <Label htmlFor={`promo-upload-${index}`} className="cursor-pointer">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                          {promo.url ? (
                            <img
                              src={promo.url}
                              alt={`Promo ${index + 1}`}
                              className="w-full h-24 object-cover rounded"
                            />
                          ) : (
                            <>
                              <ImageIcon className="mx-auto h-8 w-8 text-gray-400 mb-1" />
                              <p className="text-xs text-gray-600">Upload image</p>
                            </>
                          )}
                        </div>
                      </Label>
                      <input
                        id={`promo-upload-${index}`}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePromoImageUpload(e, index)}
                        className="hidden"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`promo-title-${index}`}>Title (Optional)</Label>
                      <Input
                        id={`promo-title-${index}`}
                        value={promo.title || ''}
                        onChange={(e) => updatePromoImageTitle(index, e.target.value)}
                        placeholder="Image title or description"
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removePromoImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

              {promoImages.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <ImageIcon className="mx-auto h-12 w-12 mb-2" />
                  <p>No promotional images added yet</p>
                  <p className="text-sm">Click "Add Image" to start building your slideshow</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LocationBrandingDialog; 