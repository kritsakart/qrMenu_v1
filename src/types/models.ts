
// Базові типи для наших моделей даних

export type CafeOwner = {
  id: string;
  username: string;
  password?: string; // Буде використовуватися тільки для мокових даних
  name: string;
  email: string;
  createdAt: string;
  status: "active" | "inactive";
};

export type Location = {
  id: string;
  cafeId: string;
  name: string;
  address: string;
  createdAt: string;
};

export type Table = {
  id: string;
  locationId: string;
  name: string; // наприклад, "Стіл 1", "Місце біля бару 3"
  qrCode: string; // URL до зображення QR-коду або дані
  qrCodeUrl: string; // URL, на який вказує QR-код
  createdAt: string;
};

export type MenuCategory = {
  id: string;
  cafeId: string;
  name: string;
  order: number;
  createdAt: string;
};

export type MenuItem = {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  weight?: string;
  imageUrl?: string;
  order: number;
  createdAt: string;
};

export type MenuItemOption = {
  id: string;
  menuItemId: string;
  name: string; // наприклад, "Розмір", "Добавки"
  options: {
    id: string;
    name: string; // наприклад, "Малий", "Середній", "Великий"
    price: number; // Додаткова ціна за цю опцію
  }[];
  multiSelect: boolean; // Чи можна вибрати кілька опцій
  required: boolean; // Чи потрібно обов'язково вибрати опцію
};

export type OrderStatus = "new" | "in_progress" | "served" | "paid";

export type OrderItem = {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  selectedOptions?: {
    name: string;
    option: string;
    price: number;
  }[];
};

export type Order = {
  id: string;
  tableId: string;
  locationId: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  createdAt: string;
  updatedAt: string;
};

// Функція для конвертації даних з Supabase у формат наших моделей
export const mapSupabaseLocation = (location: any): Location => ({
  id: location.id,
  cafeId: location.cafe_id,
  name: location.name,
  address: location.address,
  createdAt: location.created_at
});

export const mapSupabaseTable = (table: any): Table => ({
  id: table.id,
  locationId: table.location_id,
  name: table.name,
  qrCode: table.qr_code,
  qrCodeUrl: table.qr_code_url,
  createdAt: table.created_at
});

export const mapSupabaseMenuCategory = (category: any): MenuCategory => ({
  id: category.id,
  cafeId: category.cafe_id,
  name: category.name,
  order: category.order,
  createdAt: category.created_at
});

export const mapSupabaseMenuItem = (item: any): MenuItem => ({
  id: item.id,
  categoryId: item.category_id,
  name: item.name,
  description: item.description,
  price: item.price,
  weight: item.weight,
  imageUrl: item.image_url,
  order: item.order || 0,
  createdAt: item.created_at
});

export const mapSupabaseMenuItemOption = (option: any): MenuItemOption => ({
  id: option.id,
  menuItemId: option.menu_item_id,
  name: option.name,
  options: option.options,
  multiSelect: option.multi_select,
  required: option.required
});
