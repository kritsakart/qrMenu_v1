
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Cafe owners can view their menu items" ON public.menu_items;
DROP POLICY IF EXISTS "Cafe owners can create menu items in their categories" ON public.menu_items;
DROP POLICY IF EXISTS "Cafe owners can update their menu items" ON public.menu_items;
DROP POLICY IF EXISTS "Cafe owners can delete their menu items" ON public.menu_items;

-- Create updated policies that properly handle the cafe owner context
CREATE POLICY "Cafe owners can view their menu items" ON public.menu_items
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.menu_categories mc 
    WHERE mc.id = menu_items.category_id 
    AND mc.cafe_id = current_setting('request.user_id', true)::uuid
  )
);

CREATE POLICY "Cafe owners can create menu items in their categories" ON public.menu_items
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.menu_categories mc 
    WHERE mc.id = menu_items.category_id 
    AND mc.cafe_id = current_setting('request.user_id', true)::uuid
  )
);

CREATE POLICY "Cafe owners can update their menu items" ON public.menu_items
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.menu_categories mc 
    WHERE mc.id = menu_items.category_id 
    AND mc.cafe_id = current_setting('request.user_id', true)::uuid
  )
);

CREATE POLICY "Cafe owners can delete their menu items" ON public.menu_items
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.menu_categories mc 
    WHERE mc.id = menu_items.category_id 
    AND mc.cafe_id = current_setting('request.user_id', true)::uuid
  )
);
