
import { CafeOwner, Location, Table, MenuCategory, MenuItem, MenuItemOption, Order } from "@/types/models";

// Mock data for initial development
export const mockCafeOwners: CafeOwner[] = [
  {
    id: "cafe-1",
    username: "cafe1",
    password: "cafe1",
    name: "Café Moderne",
    email: "owner@cafemoderne.com",
    createdAt: "2023-01-15T10:00:00Z",
    status: "active",
  },
  {
    id: "cafe-2",
    username: "cafe2",
    password: "cafe2",
    name: "Pizza Express",
    email: "manager@pizzaexpress.com",
    createdAt: "2023-02-20T14:30:00Z",
    status: "active",
  },
  {
    id: "cafe-3",
    username: "cafe3",
    password: "cafe3",
    name: "Sushi Spot",
    email: "contact@sushispot.com",
    createdAt: "2023-03-10T09:15:00Z",
    status: "inactive",
  },
];

export const mockLocations: Location[] = [
  {
    id: "loc-1",
    cafeId: "cafe-1",
    name: "Downtown Branch",
    address: "123 Main St, Downtown",
    createdAt: "2023-01-20T12:00:00Z",
  },
  {
    id: "loc-2",
    cafeId: "cafe-1",
    name: "Riverside Terrace",
    address: "45 River Rd, Riverside",
    createdAt: "2023-01-25T14:00:00Z",
  },
  {
    id: "loc-3",
    cafeId: "cafe-2",
    name: "Mall Location",
    address: "789 Shopping Center, Unit 12",
    createdAt: "2023-02-22T10:30:00Z",
  },
];

export const mockTables: Table[] = [
  {
    id: "table-1",
    locationId: "loc-1",
    name: "Table 1",
    qrCode: "data:image/png;base64,iVBORw0KGgoA...", // This would be actual QR code data
    qrCodeUrl: "/menu/loc-1/table-1",
    createdAt: "2023-01-21T12:30:00Z",
  },
  {
    id: "table-2",
    locationId: "loc-1",
    name: "Table 2",
    qrCode: "data:image/png;base64,iVBORw0KGgoA...", // This would be actual QR code data
    qrCodeUrl: "/menu/loc-1/table-2",
    createdAt: "2023-01-21T12:35:00Z",
  },
  {
    id: "table-3",
    locationId: "loc-2",
    name: "Window Table",
    qrCode: "data:image/png;base64,iVBORw0KGgoA...", // This would be actual QR code data
    qrCodeUrl: "/menu/loc-2/table-3",
    createdAt: "2023-01-26T09:15:00Z",
  },
];

export const mockCategories: MenuCategory[] = [
  {
    id: "cat-1",
    cafeId: "cafe-1",
    name: "Coffee",
    order: 1,
    createdAt: "2023-01-22T08:00:00Z",
  },
  {
    id: "cat-2",
    cafeId: "cafe-1",
    name: "Pastries",
    order: 2,
    createdAt: "2023-01-22T08:05:00Z",
  },
  {
    id: "cat-3",
    cafeId: "cafe-1",
    name: "Sandwiches",
    order: 3,
    createdAt: "2023-01-22T08:10:00Z",
  },
  {
    id: "cat-4",
    cafeId: "cafe-2",
    name: "Pizzas",
    order: 1,
    createdAt: "2023-02-23T11:00:00Z",
  },
];

export const mockMenuItems: MenuItem[] = [
  {
    id: "item-1",
    categoryId: "cat-1",
    name: "Espresso",
    description: "Strong coffee brewed by forcing hot water through finely-ground coffee beans",
    price: 3.50,
    weight: "30ml",
    imageUrl: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
    createdAt: "2023-01-23T08:30:00Z",
  },
  {
    id: "item-2",
    categoryId: "cat-1",
    name: "Cappuccino",
    description: "Espresso with steamed milk foam",
    price: 4.50,
    weight: "180ml",
    imageUrl: "https://images.unsplash.com/photo-1582562124811-c09040d0a901",
    createdAt: "2023-01-23T08:35:00Z",
  },
  {
    id: "item-3",
    categoryId: "cat-2",
    name: "Croissant",
    description: "Buttery, flaky pastry",
    price: 3.00,
    weight: "80g",
    imageUrl: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
    createdAt: "2023-01-23T09:00:00Z",
  },
  {
    id: "item-4",
    categoryId: "cat-4",
    name: "Margherita Pizza",
    description: "Classic pizza with tomato sauce, mozzarella, and basil",
    price: 12.99,
    imageUrl: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07",
    createdAt: "2023-02-24T12:00:00Z",
  },
];

export const mockItemOptions: MenuItemOption[] = [
  {
    id: "opt-1",
    menuItemId: "item-1",
    name: "Size",
    options: [
      { id: "size-1", name: "Single", price: 0 },
      { id: "size-2", name: "Double", price: 1.5 },
    ],
    multiSelect: false,
    required: true,
  },
  {
    id: "opt-2",
    menuItemId: "item-2",
    name: "Size",
    options: [
      { id: "size-3", name: "Small", price: 0 },
      { id: "size-4", name: "Medium", price: 1 },
      { id: "size-5", name: "Large", price: 2 },
    ],
    multiSelect: false,
    required: true,
  },
  {
    id: "opt-3",
    menuItemId: "item-2",
    name: "Milk",
    options: [
      { id: "milk-1", name: "Regular", price: 0 },
      { id: "milk-2", name: "Oat milk", price: 0.5 },
      { id: "milk-3", name: "Almond milk", price: 0.5 },
    ],
    multiSelect: false,
    required: true,
  },
  {
    id: "opt-4",
    menuItemId: "item-4",
    name: "Size",
    options: [
      { id: "size-6", name: "Regular", price: 0 },
      { id: "size-7", name: "Large", price: 4 },
    ],
    multiSelect: false,
    required: true,
  },
  {
    id: "opt-5",
    menuItemId: "item-4",
    name: "Extra toppings",
    options: [
      { id: "top-1", name: "Mushrooms", price: 1 },
      { id: "top-2", name: "Extra cheese", price: 1.5 },
      { id: "top-3", name: "Pepperoni", price: 2 },
    ],
    multiSelect: true,
    required: false,
  },
];

export const mockOrders: Order[] = [
  {
    id: "order-1",
    tableId: "table-1",
    locationId: "loc-1",
    items: [
      {
        id: "order-item-1",
        menuItemId: "item-1",
        name: "Espresso",
        price: 3.50,
        quantity: 1,
        selectedOptions: [
          { name: "Size", option: "Single", price: 0 }
        ],
      },
      {
        id: "order-item-2",
        menuItemId: "item-3",
        name: "Croissant",
        price: 3.00,
        quantity: 2,
      },
    ],
    status: "new",
    total: 9.50,
    createdAt: "2023-05-10T14:30:00Z",
    updatedAt: "2023-05-10T14:30:00Z",
  },
  {
    id: "order-2",
    tableId: "table-2",
    locationId: "loc-1",
    items: [
      {
        id: "order-item-3",
        menuItemId: "item-2",
        name: "Cappuccino",
        price: 5.50,
        quantity: 2,
        selectedOptions: [
          { name: "Size", option: "Medium", price: 1.0 },
          { name: "Milk", option: "Oat milk", price: 0.5 }
        ],
      },
    ],
    status: "in_progress",
    total: 11.00,
    createdAt: "2023-05-10T14:45:00Z",
    updatedAt: "2023-05-10T14:50:00Z",
  },
];

// Helper function to get cafe owner data
export const getCafeOwnerData = (cafeId: string) => {
  const owner = mockCafeOwners.find(owner => owner.id === cafeId);
  const locations = mockLocations.filter(location => location.cafeId === cafeId);
  
  const tables = mockLocations
    .filter(location => location.cafeId === cafeId)
    .flatMap(location => 
      mockTables.filter(table => table.locationId === location.id)
    );
  
  const categories = mockCategories.filter(category => category.cafeId === cafeId);
  
  const menuItems = categories.flatMap(category => 
    mockMenuItems.filter(item => item.categoryId === category.id)
  );
  
  const menuItemOptions = menuItems.flatMap(item => 
    mockItemOptions.filter(option => option.menuItemId === item.id)
  );
  
  // Get orders for all tables in all locations for this cafe
  const orders = mockLocations
    .filter(location => location.cafeId === cafeId)
    .flatMap(location => 
      mockOrders.filter(order => order.locationId === location.id)
    );
  
  return {
    owner,
    locations,
    tables,
    categories,
    menuItems,
    menuItemOptions,
    orders
  };
};
