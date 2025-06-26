-- Create menu data for cafe ID: 525cf9b2-6a1f-4510-a8a0-14a7467b8d44
-- This will add categories and menu items for the cafe that has working QR codes but empty admin menu

-- Insert menu categories
INSERT INTO public.menu_categories (id, cafe_id, name, description, "order") VALUES 
  (
    '11111111-1111-1111-1111-111111111111', 
    '525cf9b2-6a1f-4510-a8a0-14a7467b8d44', 
    'Appetizers', 
    'Start your meal with our delicious appetizers',
    1
  ),
  (
    '22222222-2222-2222-2222-222222222222', 
    '525cf9b2-6a1f-4510-a8a0-14a7467b8d44', 
    'Main Dishes', 
    'Hearty and satisfying main courses',
    2
  ),
  (
    '33333333-3333-3333-3333-333333333333', 
    '525cf9b2-6a1f-4510-a8a0-14a7467b8d44', 
    'Beverages', 
    'Refreshing drinks and hot beverages',
    3
  ),
  (
    '44444444-4444-4444-4444-444444444444', 
    '525cf9b2-6a1f-4510-a8a0-14a7467b8d44', 
    'Desserts', 
    'Sweet treats to end your meal',
    4
  ) ON CONFLICT (id) DO NOTHING;

-- Insert menu items
INSERT INTO public.menu_items (id, category_id, name, description, price, weight, variants, "order") VALUES 
  -- Appetizers
  (
    'a1111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'Caesar Salad',
    'Fresh romaine lettuce with parmesan cheese and croutons',
    8.99,
    '10 oz',
    '[{"id": "v1", "name": "Regular", "price": 0, "isDefault": true}, {"id": "v2", "name": "With Chicken", "price": 3.00, "isDefault": false}]'::jsonb,
    1
  ),
  (
    'a2222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'Garlic Bread',
    'Toasted bread with garlic butter and herbs',
    5.99,
    '6 pieces',
    NULL,
    2
  ),
  (
    'a3333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    'Buffalo Wings',
    'Spicy chicken wings with blue cheese dip',
    12.99,
    '12 pieces',
    '[{"id": "v3", "name": "Mild", "price": 0, "isDefault": true}, {"id": "v4", "name": "Hot", "price": 0, "isDefault": false}, {"id": "v5", "name": "Extra Hot", "price": 1.00, "isDefault": false}]'::jsonb,
    3
  ),
  
  -- Main Dishes
  (
    'b1111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    'Grilled Chicken',
    'Tender grilled chicken breast with seasonal vegetables',
    16.99,
    '8 oz',
    '[{"id": "v6", "name": "Regular", "price": 0, "isDefault": true}, {"id": "v7", "name": "BBQ Sauce", "price": 1.00, "isDefault": false}]'::jsonb,
    1
  ),
  (
    'b2222222-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-222222222222',
    'Beef Burger',
    'Juicy beef burger with lettuce, tomato, and fries',
    14.99,
    '12 oz',
    '[{"id": "v8", "name": "Regular", "price": 0, "isDefault": true}, {"id": "v9", "name": "With Cheese", "price": 2.00, "isDefault": false}, {"id": "v10", "name": "Double Patty", "price": 4.00, "isDefault": false}]'::jsonb,
    2
  ),
  (
    'b3333333-3333-3333-3333-333333333333',
    '22222222-2222-2222-2222-222222222222',
    'Pasta Carbonara',
    'Creamy pasta with bacon and parmesan cheese',
    13.99,
    '14 oz',
    NULL,
    3
  ),
  (
    'b4444444-4444-4444-4444-444444444444',
    '22222222-2222-2222-2222-222222222222',
    'Fish & Chips',
    'Fresh fish fillet with crispy fries and tartar sauce',
    15.99,
    '10 oz',
    '[{"id": "v11", "name": "Cod", "price": 0, "isDefault": true}, {"id": "v12", "name": "Salmon", "price": 3.00, "isDefault": false}]'::jsonb,
    4
  ),
  
  -- Beverages
  (
    'c1111111-1111-1111-1111-111111111111',
    '33333333-3333-3333-3333-333333333333',
    'Coffee',
    'Freshly brewed coffee',
    3.99,
    '12 oz',
    '[{"id": "v13", "name": "Regular", "price": 0, "isDefault": true}, {"id": "v14", "name": "Decaf", "price": 0, "isDefault": false}, {"id": "v15", "name": "Large", "price": 1.00, "isDefault": false}]'::jsonb,
    1
  ),
  (
    'c2222222-2222-2222-2222-222222222222',
    '33333333-3333-3333-3333-333333333333',
    'Fresh Orange Juice',
    'Freshly squeezed orange juice',
    4.99,
    '16 oz',
    NULL,
    2
  ),
  (
    'c3333333-3333-3333-3333-333333333333',
    '33333333-3333-3333-3333-333333333333',
    'Iced Tea',
    'Refreshing iced tea with lemon',
    2.99,
    '20 oz',
    '[{"id": "v16", "name": "Sweet", "price": 0, "isDefault": true}, {"id": "v17", "name": "Unsweetened", "price": 0, "isDefault": false}]'::jsonb,
    3
  ),
  
  -- Desserts
  (
    'd1111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444444',
    'Chocolate Cake',
    'Rich chocolate cake with chocolate frosting',
    6.99,
    '4 oz',
    NULL,
    1
  ),
  (
    'd2222222-2222-2222-2222-222222222222',
    '44444444-4444-4444-4444-444444444444',
    'Cheesecake',
    'Classic New York style cheesecake',
    7.99,
    '5 oz',
    '[{"id": "v18", "name": "Plain", "price": 0, "isDefault": true}, {"id": "v19", "name": "Strawberry", "price": 1.00, "isDefault": false}, {"id": "v20", "name": "Blueberry", "price": 1.00, "isDefault": false}]'::jsonb,
    2
  ),
  (
    'd3333333-3333-3333-3333-333333333333',
    '44444444-4444-4444-4444-444444444444',
    'Ice Cream',
    'Premium ice cream served in a bowl',
    4.99,
    '6 oz',
    '[{"id": "v21", "name": "Vanilla", "price": 0, "isDefault": true}, {"id": "v22", "name": "Chocolate", "price": 0, "isDefault": false}, {"id": "v23", "name": "Strawberry", "price": 0, "isDefault": false}]'::jsonb,
    3
  ) ON CONFLICT (id) DO NOTHING;

-- Verify the data was inserted
SELECT 
  'Categories created:' as info,
  COUNT(*) as count
FROM menu_categories 
WHERE cafe_id = '525cf9b2-6a1f-4510-a8a0-14a7467b8d44';

SELECT 
  'Menu items created:' as info,
  COUNT(*) as count
FROM menu_items mi
JOIN menu_categories mc ON mi.category_id = mc.id
WHERE mc.cafe_id = '525cf9b2-6a1f-4510-a8a0-14a7467b8d44'; 