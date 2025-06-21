-- Seed data for testing
INSERT INTO public.cafe_owners (id, email, name, username, password) VALUES 
  ('550e8400-e29b-41d4-a716-446655440000', 'owner@cafe.com', 'Test Cafe Owner', 'testowner', 'password123');

INSERT INTO public.menu_categories (id, cafe_id, name, description) VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Main Dishes', 'Delicious main courses'),
  ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Beverages', 'Hot and cold drinks');

-- Insert menu items with variants
INSERT INTO public.menu_items (id, category_id, name, description, price, weight, variants, "order") VALUES 
  (
    '550e8400-e29b-41d4-a716-446655440003', 
    '550e8400-e29b-41d4-a716-446655440001', 
    'Sandwich', 
    'Delicious sandwich with various options',
    12.99,
    '8.5 oz',
    '[
      {"id": "variant1", "name": "White Bread", "price": 0, "isDefault": true},
      {"id": "variant2", "name": "Whole Wheat", "price": 1.50, "isDefault": false},
      {"id": "variant3", "name": "Sourdough", "price": 2.00, "isDefault": false}
    ]'::jsonb,
    1
  ),
  (
    '550e8400-e29b-41d4-a716-446655440004', 
    '550e8400-e29b-41d4-a716-446655440002', 
    'Coffee', 
    'Premium coffee with size options',
    4.99,
    '12 oz',
    '[
      {"id": "variant4", "name": "Small", "price": 0, "isDefault": true},
      {"id": "variant5", "name": "Medium", "price": 1.00, "isDefault": false},
      {"id": "variant6", "name": "Large", "price": 1.50, "isDefault": false}
    ]'::jsonb,
    1
  ),
  (
    '550e8400-e29b-41d4-a716-446655440005', 
    '550e8400-e29b-41d4-a716-446655440001', 
    'Simple Burger', 
    'Basic burger without variants',
    8.99,
    '6 oz',
    NULL,
    2
  ); 