-- Add variants column to menu_items table
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT NULL;

-- Enable realtime for menu_items if not already enabled
ALTER PUBLICATION supabase_realtime ADD TABLE menu_items;

-- Sample data with variants (optional - you can run this separately)
-- UPDATE menu_items SET variants = '[
--   {"id": "1", "name": "Small", "price": 0, "isDefault": true},
--   {"id": "2", "name": "Large", "price": 3}
-- ]' WHERE name = 'Americano Coffee';

-- UPDATE menu_items SET variants = '[
--   {"id": "1", "name": "White Bread", "price": 0, "isDefault": true},
--   {"id": "2", "name": "Whole Wheat", "price": 1},
--   {"id": "3", "name": "Sourdough", "price": 2}
-- ]' WHERE name LIKE '%Sandwich%'; 