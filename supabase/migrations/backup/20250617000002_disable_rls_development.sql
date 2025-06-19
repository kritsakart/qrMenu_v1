-- Тимчасово відключаємо RLS для розробки
-- Це дозволить всі операції без обмежень

-- Відключаємо RLS для menu_categories
ALTER TABLE public.menu_categories DISABLE ROW LEVEL SECURITY;

-- Відключаємо RLS для menu_items  
ALTER TABLE public.menu_items DISABLE ROW LEVEL SECURITY;

-- Видаляємо всі існуючі політики для menu_categories
DROP POLICY IF EXISTS "Users can view their cafe categories" ON public.menu_categories;
DROP POLICY IF EXISTS "Users can create categories for their cafe" ON public.menu_categories;
DROP POLICY IF EXISTS "Users can update their cafe categories" ON public.menu_categories;
DROP POLICY IF EXISTS "Users can delete their cafe categories" ON public.menu_categories;
DROP POLICY IF EXISTS "Users can view their cafe menu categories" ON public.menu_categories;
DROP POLICY IF EXISTS "Users can create their cafe menu categories" ON public.menu_categories;
DROP POLICY IF EXISTS "Users can update their cafe menu categories" ON public.menu_categories;
DROP POLICY IF EXISTS "Users can delete their cafe menu categories" ON public.menu_categories;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.menu_categories;

-- Видаляємо всі існуючі політики для menu_items
DROP POLICY IF EXISTS "Cafe owners can view their menu items" ON public.menu_items;
DROP POLICY IF EXISTS "Cafe owners can create menu items in their categories" ON public.menu_items;
DROP POLICY IF EXISTS "Cafe owners can update their menu items" ON public.menu_items;
DROP POLICY IF EXISTS "Cafe owners can delete their menu items" ON public.menu_items;
DROP POLICY IF EXISTS "Allow all operations for authenticated users on menu items" ON public.menu_items; 