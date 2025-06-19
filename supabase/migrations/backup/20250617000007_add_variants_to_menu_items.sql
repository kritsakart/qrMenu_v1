-- Add variants field to menu_items table
ALTER TABLE public.menu_items ADD COLUMN variants JSONB DEFAULT NULL;

-- Add comment to the column for clarity
COMMENT ON COLUMN public.menu_items.variants IS 'JSON array of item variants with fields: id, name, price (price adjustment), isDefault'; 