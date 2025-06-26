-- Add menu categories for cafe2127
INSERT INTO public.menu_categories (id, cafe_id, name, description, "order") VALUES 
  ('7e4847b4-5ca2-4301-8497-56da40b1c001', '525cf9b2-6a1f-4510-a8a0-147467b8d44', 'Appetizers', 'Start your meal with our delicious appetizers', 1),
  ('7e4847b4-5ca2-4301-8497-56da40b1c002', '525cf9b2-6a1f-4510-a8a0-147467b8d44', 'Main Dishes', 'Hearty and satisfying main courses', 2),
  ('7e4847b4-5ca2-4301-8497-56da40b1c003', '525cf9b2-6a1f-4510-a8a0-147467b8d44', 'Beverages', 'Refreshing drinks and hot beverages', 3),
  ('7e4847b4-5ca2-4301-8497-56da40b1c004', '525cf9b2-6a1f-4510-a8a0-147467b8d44', 'Desserts', 'Sweet treats to end your meal', 4)
ON CONFLICT (id) DO NOTHING;

-- Add menu items for cafe2127
INSERT INTO public.menu_items (id, category_id, name, description, price, weight, variants, "order") VALUES 
  (
    '7e4847b4-5ca2-4301-8497-56da40b1c101', 
    '7e4847b4-5ca2-4301-8497-56da40b1c001', 
    'Caesar Salad', 
    'Fresh romaine lettuce with Caesar dressing, croutons, and parmesan cheese',
    8.99,
    '6 oz',
    '[
      {"id": "variant1", "name": "Regular", "price": 0, "isDefault": true},
      {"id": "variant2", "name": "With Chicken", "price": 4.00, "isDefault": false},
      {"id": "variant3", "name": "With Shrimp", "price": 6.00, "isDefault": false}
    ]'::jsonb,
    1
  ),
  (
    '7e4847b4-5ca2-4301-8497-56da40b1c102', 
    '7e4847b4-5ca2-4301-8497-56da40b1c001', 
    'Chicken Wings', 
    'Crispy chicken wings with your choice of sauce',
    10.99,
    '12 oz',
    '[
      {"id": "variant4", "name": "Buffalo", "price": 0, "isDefault": true},
      {"id": "variant5", "name": "BBQ", "price": 0, "isDefault": false},
      {"id": "variant6", "name": "Honey Garlic", "price": 1.00, "isDefault": false}
    ]'::jsonb,
    2
  ),
  (
    '7e4847b4-5ca2-4301-8497-56da40b1c201', 
    '7e4847b4-5ca2-4301-8497-56da40b1c002', 
    'Classic Burger', 
    'Juicy beef patty with lettuce, tomato, onion, and our special sauce',
    12.99,
    '8 oz',
    '[
      {"id": "variant7", "name": "Regular", "price": 0, "isDefault": true},
      {"id": "variant8", "name": "With Cheese", "price": 1.50, "isDefault": false},
      {"id": "variant9", "name": "With Bacon", "price": 2.50, "isDefault": false},
      {"id": "variant10", "name": "Deluxe (Cheese + Bacon)", "price": 3.50, "isDefault": false}
    ]'::jsonb,
    1
  ),
  (
    '7e4847b4-5ca2-4301-8497-56da40b1c202', 
    '7e4847b4-5ca2-4301-8497-56da40b1c002', 
    'Grilled Salmon', 
    'Fresh Atlantic salmon grilled to perfection with lemon and herbs',
    18.99,
    '10 oz',
    NULL,
    2
  ),
  (
    '7e4847b4-5ca2-4301-8497-56da40b1c203', 
    '7e4847b4-5ca2-4301-8497-56da40b1c002', 
    'Chicken Parmesan', 
    'Breaded chicken breast with marinara sauce and mozzarella cheese',
    15.99,
    '12 oz',
    NULL,
    3
  ),
  (
    '7e4847b4-5ca2-4301-8497-56da40b1c301', 
    '7e4847b4-5ca2-4301-8497-56da40b1c003', 
    'Coffee', 
    'Premium coffee made from freshly roasted beans',
    3.99,
    '12 oz',
    '[
      {"id": "variant11", "name": "Small", "price": 0, "isDefault": true},
      {"id": "variant12", "name": "Medium", "price": 1.00, "isDefault": false},
      {"id": "variant13", "name": "Large", "price": 1.50, "isDefault": false}
    ]'::jsonb,
    1
  ),
  (
    '7e4847b4-5ca2-4301-8497-56da40b1c302', 
    '7e4847b4-5ca2-4301-8497-56da40b1c003', 
    'Fresh Orange Juice', 
    'Freshly squeezed orange juice',
    4.99,
    '16 oz',
    NULL,
    2
  ),
  (
    '7e4847b4-5ca2-4301-8497-56da40b1c303', 
    '7e4847b4-5ca2-4301-8497-56da40b1c003', 
    'Iced Tea', 
    'Refreshing iced tea with lemon',
    2.99,
    '20 oz',
    '[
      {"id": "variant14", "name": "Sweet", "price": 0, "isDefault": true},
      {"id": "variant15", "name": "Unsweetened", "price": 0, "isDefault": false},
      {"id": "variant16", "name": "Half & Half", "price": 0, "isDefault": false}
    ]'::jsonb,
    3
  ),
  (
    '7e4847b4-5ca2-4301-8497-56da40b1c401', 
    '7e4847b4-5ca2-4301-8497-56da40b1c004', 
    'Chocolate Cake', 
    'Rich chocolate cake with chocolate frosting',
    6.99,
    '4 oz',
    NULL,
    1
  ),
  (
    '7e4847b4-5ca2-4301-8497-56da40b1c402', 
    '7e4847b4-5ca2-4301-8497-56da40b1c004', 
    'Cheesecake', 
    'Classic New York style cheesecake',
    7.99,
    '5 oz',
    '[
      {"id": "variant17", "name": "Plain", "price": 0, "isDefault": true},
      {"id": "variant18", "name": "Strawberry", "price": 1.00, "isDefault": false},
      {"id": "variant19", "name": "Blueberry", "price": 1.00, "isDefault": false}
    ]'::jsonb,
    2
  ),
  (
    '7e4847b4-5ca2-4301-8497-56da40b1c403', 
    '7e4847b4-5ca2-4301-8497-56da40b1c004', 
    'Ice Cream', 
    'Premium ice cream served in a bowl',
    4.99,
    '6 oz',
    '[
      {"id": "variant20", "name": "Vanilla", "price": 0, "isDefault": true},
      {"id": "variant21", "name": "Chocolate", "price": 0, "isDefault": false},
      {"id": "variant22", "name": "Strawberry", "price": 0, "isDefault": false}
    ]'::jsonb,
    3
  )
ON CONFLICT (id) DO NOTHING;

-- Verify data was inserted
SELECT 'Categories for cafe2127:' as message, COUNT(*) as count FROM public.menu_categories WHERE cafe_id = '525cf9b2-6a1f-4510-a8a0-147467b8d44';
SELECT 'Menu items for cafe2127:' as message, COUNT(*) as count FROM public.menu_items WHERE category_id IN (SELECT id FROM public.menu_categories WHERE cafe_id = '525cf9b2-6a1f-4510-a8a0-147467b8d44'); 