-- Add order column to menu_categories table (only if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'menu_categories' 
        AND column_name = 'order'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.menu_categories 
        ADD COLUMN "order" INTEGER DEFAULT 0;
    END IF;
END $$;

-- Update existing categories with sequential order numbers
UPDATE public.menu_categories 
SET "order" = t.row_number 
FROM (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY cafe_id ORDER BY created_at) as row_number
  FROM public.menu_categories
) t 
WHERE public.menu_categories.id = t.id;

-- Add comment to order column
COMMENT ON COLUMN public.menu_categories."order" IS 'Display order of categories within a cafe menu'; 