
import { supabaseAdmin } from "@/integrations/supabase/admin-client";
import { CafeOwner } from "@/types/models";

export const fetchCafeOwners = async (): Promise<CafeOwner[]> => {
  try {
    console.log("Встановлення з'єднання з базою даних через адміністративний клієнт...");
    
    // Перевірка підключення до бази даних
    const connectionCheck = await supabaseAdmin.from("cafe_owners").select("count", { count: "exact", head: true });
    
    if (connectionCheck.error) {
      console.error("Помилка перевірки підключення:", connectionCheck.error);
      throw new Error(`Помилка підключення до бази даних: ${connectionCheck.error.message}`);
    }
    
    console.log(`Підключення до бази даних успішне. Кількість записів: ${connectionCheck.count || 0}`);
    
    // Завантаження всіх власників кафе
    const { data, error, status } = await supabaseAdmin
      .from("cafe_owners")
      .select("*")
      .order("created_at", { ascending: false });
    
    console.log("Статус запиту:", status);
    // Logging the actual query is not possible due to protected properties
    console.log("Спроба отримання власників кафе з таблиці cafe_owners");
    
    if (error) {
      console.error("Помилка завантаження власників кафе:", error);
      throw new Error(`Не вдалося отримати дані власників: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      console.log("Власників кафе не знайдено в базі даних");
      return [];
    }
    
    console.log(`Отримано ${data.length} власників кафе з бази даних:`, data);
    
    const cafeOwners: CafeOwner[] = data.map(owner => ({
      id: owner.id,
      username: owner.username,
      name: owner.name,
      email: owner.email,
      status: owner.status as "active" | "inactive",
      createdAt: owner.created_at,
      password: owner.password,
    }));
    
    return cafeOwners;
  } catch (err) {
    console.error("Помилка у функції fetchCafeOwners:", err);
    throw err;
  }
};
