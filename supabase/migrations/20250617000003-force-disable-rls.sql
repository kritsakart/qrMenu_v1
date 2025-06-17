-- ПРИНУДОВЕ ВІДКЛЮЧЕННЯ RLS ДЛЯ РОЗРОБКИ
-- Цей файл призначений для розробки - НЕ використовувати в продакшені!

-- 1. Відключаємо RLS для всіх таблиць
ALTER TABLE IF EXISTS public.menu_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.menu_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.cafe_owners DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.tables DISABLE ROW LEVEL SECURITY;

-- 2. Видаляємо ВСІ політики з menu_categories
DO $$ 
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'menu_categories' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.menu_categories', policy_record.policyname);
    END LOOP;
END $$;

-- 3. Видаляємо ВСІ політики з menu_items
DO $$ 
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'menu_items' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.menu_items', policy_record.policyname);
    END LOOP;
END $$;

-- 4. Надаємо повні права anon користувачу на ці таблиці
GRANT ALL ON public.menu_categories TO anon;
GRANT ALL ON public.menu_items TO anon;
GRANT ALL ON public.cafe_owners TO anon;
GRANT ALL ON public.tables TO anon;

-- 5. Надаємо права на використання sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;

-- 6. Створюємо простий тест для перевірки доступу
CREATE OR REPLACE FUNCTION public.test_rls_disabled()
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
    -- Простий тест - якщо функція виконується, значить доступ є
    RETURN 'RLS успішно відключено';
END;
$$;

GRANT EXECUTE ON FUNCTION public.test_rls_disabled() TO anon;
GRANT EXECUTE ON FUNCTION public.test_rls_disabled() TO authenticated; 