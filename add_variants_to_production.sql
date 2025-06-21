-- Add variants column to menu_items table
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT NULL;

-- Enable realtime for menu_items if not already enabled
ALTER PUBLICATION supabase_realtime ADD TABLE menu_items;

-- Update existing QR code URLs to use table IDs instead of timestamps
-- This ensures that all QR codes will work with the new system
UPDATE tables 
SET qr_code_url = '/menu/' || location_id || '/' || id
WHERE qr_code_url != '/menu/' || location_id || '/' || id;

-- Add index for better performance on public menu queries
CREATE INDEX IF NOT EXISTS idx_tables_location_id ON tables(location_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category_id ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_categories_cafe_id ON menu_categories(cafe_id);

-- Add cache-busting headers (this is handled by Vercel config, but documenting here)
-- Cache-Control: no-cache, no-store, must-revalidate
-- Pragma: no-cache  
-- Expires: 0

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