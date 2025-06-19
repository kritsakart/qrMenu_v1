
-- Enable RLS on menu_items table
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Create policy to allow cafe owners to select menu items for their categories
CREATE POLICY "Cafe owners can view their menu items" ON public.menu_items
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.menu_categories mc 
    WHERE mc.id = menu_items.category_id 
    AND mc.cafe_id = (
      SELECT id FROM public.cafe_owners 
      WHERE id = current_setting('request.user_id', true)::uuid
    )
  )
);

-- Create policy to allow cafe owners to insert menu items for their categories
CREATE POLICY "Cafe owners can create menu items in their categories" ON public.menu_items
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.menu_categories mc 
    WHERE mc.id = menu_items.category_id 
    AND mc.cafe_id = (
      SELECT id FROM public.cafe_owners 
      WHERE id = current_setting('request.user_id', true)::uuid
    )
  )
);

-- Create policy to allow cafe owners to update their menu items
CREATE POLICY "Cafe owners can update their menu items" ON public.menu_items
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.menu_categories mc 
    WHERE mc.id = menu_items.category_id 
    AND mc.cafe_id = (
      SELECT id FROM public.cafe_owners 
      WHERE id = current_setting('request.user_id', true)::uuid
    )
  )
);

-- Create policy to allow cafe owners to delete their menu items
CREATE POLICY "Cafe owners can delete their menu items" ON public.menu_items
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.menu_categories mc 
    WHERE mc.id = menu_items.category_id 
    AND mc.cafe_id = (
      SELECT id FROM public.cafe_owners 
      WHERE id = current_setting('request.user_id', true)::uuid
    )
  )
);
