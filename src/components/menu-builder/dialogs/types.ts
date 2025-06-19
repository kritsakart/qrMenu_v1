export interface MenuItemFormState {
  name: string;
  description: string;
  price: string;
  weight: string;
  weightUnit: string;
  imageUrl: string;
  variants: MenuItemVariantForm[];
}

export interface MenuItemVariantForm {
  id: string;
  name: string;
  price: string;
  isDefault: boolean;
}
