
-- Перевіримо та додамо RLS політики для таблиці menu_categories
-- Спочатку увімкнемо RLS для таблиці (якщо ще не увімкнено)
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;

-- Політика для читання категорій (користувач може бачити категорії свого кафе)
CREATE POLICY "Users can view their cafe menu categories" 
  ON public.menu_categories 
  FOR SELECT 
  USING (
    cafe_id IN (
      SELECT id FROM public.cafe_owners 
      WHERE id = (current_setting('app.current_user_id', true))::uuid
    )
  );

-- Політика для створення категорій (користувач може створювати категорії для свого кафе)
CREATE POLICY "Users can create their cafe menu categories" 
  ON public.menu_categories 
  FOR INSERT 
  WITH CHECK (
    cafe_id IN (
      SELECT id FROM public.cafe_owners 
      WHERE id = (current_setting('app.current_user_id', true))::uuid
    )
  );

-- Політика для оновлення категорій
CREATE POLICY "Users can update their cafe menu categories" 
  ON public.menu_categories 
  FOR UPDATE 
  USING (
    cafe_id IN (
      SELECT id FROM public.cafe_owners 
      WHERE id = (current_setting('app.current_user_id', true))::uuid
    )
  );

-- Політика для видалення категорій
CREATE POLICY "Users can delete their cafe menu categories" 
  ON public.menu_categories 
  FOR DELETE 
  USING (
    cafe_id IN (
      SELECT id FROM public.cafe_owners 
      WHERE id = (current_setting('app.current_user_id', true))::uuid
    )
  );
