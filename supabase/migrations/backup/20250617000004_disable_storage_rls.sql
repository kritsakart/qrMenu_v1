-- Відключаємо RLS для Storage objects
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Видаляємо всі існуючі політики для storage.objects
DROP POLICY IF EXISTS "Public menu images access 1xs2w12_0" ON storage.objects;
DROP POLICY IF EXISTS "Public menu images upload 1xs2w12_0" ON storage.objects;
DROP POLICY IF EXISTS "Public menu images update 1xs2w12_0" ON storage.objects;
DROP POLICY IF EXISTS "Public menu images delete 1xs2w12_0" ON storage.objects;

-- Видаляємо всі інші політики, які можуть існувати
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'storage' AND tablename = 'objects'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON storage.objects';
    END LOOP;
END $$;

-- Надаємо повні права anon користувачам на storage.objects
GRANT ALL ON storage.objects TO anon;
GRANT ALL ON storage.buckets TO anon;

-- Створюємо bucket якщо він не існує
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO UPDATE SET
  public = true;

-- Створюємо функцію для перевірки bucket permissions (якщо потрібно)
CREATE OR REPLACE FUNCTION storage.can_access_bucket(bucket_id text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Дозволяємо доступ до всіх buckets
    RETURN true;
END;
$$; 