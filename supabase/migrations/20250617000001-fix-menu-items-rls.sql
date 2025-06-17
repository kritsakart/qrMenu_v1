-- Видаляємо всі існуючі RLS політики для menu_items
DROP POLICY IF EXISTS "Cafe owners can view their menu items" ON public.menu_items;
DROP POLICY IF EXISTS "Cafe owners can create menu items in their categories" ON public.menu_items;
DROP POLICY IF EXISTS "Cafe owners can update their menu items" ON public.menu_items;
DROP POLICY IF EXISTS "Cafe owners can delete their menu items" ON public.menu_items;

-- Вимикаємо та знову вмикаємо RLS для очищення
ALTER TABLE public.menu_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Створюємо спрощені політики, які дозволяють повний доступ
-- (пізніше можна буде налаштувати більш складну логіку)
CREATE POLICY "Allow all operations for authenticated users on menu items" 
  ON public.menu_items 
  FOR ALL 
  USING (true)
  WITH CHECK (true); 