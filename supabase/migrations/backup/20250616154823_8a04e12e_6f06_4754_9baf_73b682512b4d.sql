
-- Створюємо функцію для встановлення контексту поточного користувача
CREATE OR REPLACE FUNCTION public.set_current_user_id(user_id UUID)
RETURNS VOID AS $$
BEGIN
  PERFORM set_config('app.current_user_id', user_id::text, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Надаємо права на виконання цієї функції
GRANT EXECUTE ON FUNCTION public.set_current_user_id TO authenticated;
