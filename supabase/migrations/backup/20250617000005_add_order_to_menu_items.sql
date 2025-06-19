-- Add order column to menu_items table
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0;

-- Update existing menu_items with order based on created_at
UPDATE menu_items 
SET "order" = row_number() OVER (PARTITION BY category_id ORDER BY created_at)
WHERE "order" = 0;

-- Add index for better performance when ordering
CREATE INDEX IF NOT EXISTS idx_menu_items_category_order ON menu_items(category_id, "order"); 