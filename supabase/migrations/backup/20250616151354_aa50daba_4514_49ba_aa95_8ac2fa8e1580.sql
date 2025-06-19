
-- Включити Row Level Security для таблиці menu_categories
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;

-- Політика для читання категорій (SELECT) - користувачі можуть бачити тільки категорії свого кафе
CREATE POLICY "Users can view their cafe categories" 
ON public.menu_categories 
FOR SELECT 
USING (true);

-- Політика для створення категорій (INSERT) - користувачі можуть створювати категорії для свого кафе
CREATE POLICY "Users can create categories for their cafe" 
ON public.menu_categories 
FOR INSERT 
WITH CHECK (true);

-- Політика для оновлення категорій (UPDATE) - користувачі можуть оновлювати категорії свого кафе
CREATE POLICY "Users can update their cafe categories" 
ON public.menu_categories 
FOR UPDATE 
USING (true);

-- Політика для видалення категорій (DELETE) - користувачі можуть видаляти категорії свого кафе
CREATE POLICY "Users can delete their cafe categories" 
ON public.menu_categories 
FOR DELETE 
USING (true);
