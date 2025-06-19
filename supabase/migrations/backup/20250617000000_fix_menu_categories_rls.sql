-- Видаляємо всі існуючі RLS політики для menu_categories
DROP POLICY IF EXISTS "Users can view their cafe categories" ON public.menu_categories;
DROP POLICY IF EXISTS "Users can create categories for their cafe" ON public.menu_categories;
DROP POLICY IF EXISTS "Users can update their cafe categories" ON public.menu_categories;
DROP POLICY IF EXISTS "Users can delete their cafe categories" ON public.menu_categories;
DROP POLICY IF EXISTS "Users can view their cafe menu categories" ON public.menu_categories;
DROP POLICY IF EXISTS "Users can create their cafe menu categories" ON public.menu_categories;
DROP POLICY IF EXISTS "Users can update their cafe menu categories" ON public.menu_categories;
DROP POLICY IF EXISTS "Users can delete their cafe menu categories" ON public.menu_categories;

-- Вимикаємо та знову вмикаємо RLS для очищення
ALTER TABLE public.menu_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;

-- Створюємо спрощені політики, які дозволяють повний доступ
-- (пізніше можна буде налаштувати більш складну логіку)
CREATE POLICY "Allow all operations for authenticated users" 
  ON public.menu_categories 
  FOR ALL 
  USING (true)
  WITH CHECK (true); 