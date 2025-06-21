-- Add order column to menu_categories table
ALTER TABLE public.menu_categories 
ADD COLUMN "order" INTEGER DEFAULT 0;

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