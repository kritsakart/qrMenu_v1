-- Restore demo data for Food List application

-- Insert demo location
INSERT INTO public.locations (id, cafe_id, name, address, short_id, cover_image, promo_images) VALUES 
  (
    '7e4847b4-5ca2-4301-8497-56da40b1a527', 
    '7e4847b4-5ca2-4301-8497-56da40b1a526', 
    'Demo Restaurant', 
    '123 Main Street, City, State 12345',
    'demo123',
    NULL,
    '[]'::jsonb
  ) ON CONFLICT (id) DO NOTHING;

-- Insert demo tables
INSERT INTO public.tables (id, location_id, name, short_id, qr_code_url) VALUES 
  (
    '7e4847b4-5ca2-4301-8497-56da40b1a528', 
    '7e4847b4-5ca2-4301-8497-56da40b1a527', 
    'Table 1', 
    'tbl001',
    '/demo123/tbl001'
  ),
  (
    '7e4847b4-5ca2-4301-8497-56da40b1a529', 
    '7e4847b4-5ca2-4301-8497-56da40b1a527', 
    'Table 2', 
    'tbl002',
    '/demo123/tbl002'
  ),
  (
    '7e4847b4-5ca2-4301-8497-56da40b1a530', 
    '7e4847b4-5ca2-4301-8497-56da40b1a527', 
    'Table 3', 
    'tbl003',
    '/demo123/tbl003'
  ) ON CONFLICT (id) DO NOTHING;

-- Insert demo menu categories
INSERT INTO public.menu_categories (id, cafe_id, name, description, "order") VALUES 
  (
    '7e4847b4-5ca2-4301-8497-56da40b1a531', 
    '7e4847b4-5ca2-4301-8497-56da40b1a526', 
    'Appetizers', 
    'Start your meal with our delicious appetizers',
    1
  ),
  (
    '7e4847b4-5ca2-4301-8497-56da40b1a532', 
    '7e4847b4-5ca2-4301-8497-56da40b1a526', 
    'Main Dishes', 
    'Hearty and satisfying main courses',
    2
  ),
  (
    '7e4847b4-5ca2-4301-8497-56da40b1a533', 
    '7e4847b4-5ca2-4301-8497-56da40b1a526', 
    'Beverages', 
    'Refreshing drinks and hot beverages',
    3
  ),
  (
    '7e4847b4-5ca2-4301-8497-56da40b1a534', 
    '7e4847b4-5ca2-4301-8497-56da40b1a526', 
    'Desserts', 
    'Sweet treats to end your meal',
    4
  ) ON CONFLICT (id) DO NOTHING;

-- Insert demo menu items
INSERT INTO public.menu_items (id, category_id, name, description, price, weight, variants, "order", photo) VALUES 
  (
    '7e4847b4-5ca2-4301-8497-56da40b1a535', 
    '7e4847b4-5ca2-4301-8497-56da40b1a531', 
    'Caesar Salad', 
    'Fresh romaine lettuce with Caesar dressing, croutons, and parmesan cheese',
    8.99,
    '6 oz',
    '[
      {"id": "variant1", "name": "Regular", "price": 0, "isDefault": true},
      {"id": "variant2", "name": "With Chicken", "price": 4.00, "isDefault": false},
      {"id": "variant3", "name": "With Shrimp", "price": 6.00, "isDefault": false}
    ]'::jsonb,
    1,
    NULL
  ),
  (
    '7e4847b4-5ca2-4301-8497-56da40b1a536', 
    '7e4847b4-5ca2-4301-8497-56da40b1a532', 
    'Classic Burger', 
    'Juicy beef patty with lettuce, tomato, onion, and our special sauce',
    12.99,
    '8 oz',
    '[
      {"id": "variant4", "name": "Regular", "price": 0, "isDefault": true},
      {"id": "variant5", "name": "With Cheese", "price": 1.50, "isDefault": false},
      {"id": "variant6", "name": "With Bacon", "price": 2.50, "isDefault": false},
      {"id": "variant7", "name": "Deluxe (Cheese + Bacon)", "price": 3.50, "isDefault": false}
    ]'::jsonb,
    1,
    NULL
  ),
  (
    '7e4847b4-5ca2-4301-8497-56da40b1a537', 
    '7e4847b4-5ca2-4301-8497-56da40b1a532', 
    'Grilled Salmon', 
    'Fresh Atlantic salmon grilled to perfection with lemon and herbs',
    18.99,
    '10 oz',
    NULL,
    2,
    NULL
  ),
  (
    '7e4847b4-5ca2-4301-8497-56da40b1a538', 
    '7e4847b4-5ca2-4301-8497-56da40b1a533', 
    'Coffee', 
    'Premium coffee made from freshly roasted beans',
    $3.99,
    '12 oz',
    '[
      {"id": "variant8", "name": "Small", "price": 0, "isDefault": true},
      {"id": "variant9", "name": "Medium", "price": 1.00, "isDefault": false},
      {"id": "variant10", "name": "Large", "price": 1.50, "isDefault": false}
    ]'::jsonb,
    1,
    NULL
  ),
  (
    '7e4847b4-5ca2-4301-8497-56da40b1a539', 
    '7e4847b4-5ca2-4301-8497-56da40b1a533', 
    'Fresh Orange Juice', 
    'Freshly squeezed orange juice',
    $4.99,
    '16 oz',
    NULL,
    2,
    NULL
  ),
  (
    '7e4847b4-5ca2-4301-8497-56da40b1a540', 
    '7e4847b4-5ca2-4301-8497-56da40b1a534', 
    'Chocolate Cake', 
    'Rich chocolate cake with chocolate frosting',
    $6.99,
    '4 oz',
    NULL,
    1,
    NULL
  ) ON CONFLICT (id) DO NOTHING;

-- Show results
SELECT 'Locations restored:' as message, COUNT(*) as count FROM public.locations WHERE cafe_id = '7e4847b4-5ca2-4301-8497-56da40b1a526';
SELECT 'Tables restored:' as message, COUNT(*) as count FROM public.tables WHERE location_id = '7e4847b4-5ca2-4301-8497-56da40b1a527';
SELECT 'Categories restored:' as message, COUNT(*) as count FROM public.menu_categories WHERE cafe_id = '7e4847b4-5ca2-4301-8497-56da40b1a526';
SELECT 'Menu items restored:' as message, COUNT(*) as count FROM public.menu_items WHERE category_id IN (SELECT id FROM public.menu_categories WHERE cafe_id = '7e4847b4-5ca2-4301-8497-56da40b1a526'); 