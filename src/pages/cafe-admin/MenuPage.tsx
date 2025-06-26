import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const MenuPage = () => {
  const { user } = useAuth();
  const cafeId = user?.cafeId || "";
  
  console.log("🚀 MenuPage STARTED! User:", user);
  console.log("🔍 CafeId:", cafeId);
  
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Завантаження категорій
  const loadCategories = async () => {
    if (!cafeId) {
      console.log("❌ No cafeId provided, stopping");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log("🔍 === ПОЧАТОК ЗАВАНТАЖЕННЯ КАТЕГОРІЙ ===");
      console.log("🔍 Loading categories for cafeId:", cafeId);
      console.log("🔍 User object:", user);
      console.log("🔍 Using supabase client (same as QR menu)");

      // Спочатку перевіримо чи взагалі підключення працює
      console.log("🧪 Testing basic supabase connection...");
      const testResult = await supabase.from('cafe_owners').select('count', { count: 'exact', head: true });
      console.log("🧪 Test connection result:", testResult);

      // Тепер завантажуємо категорії точно так само як QR меню
      console.log("🔍 Executing query: supabase.from('menu_categories').select('*').eq('cafe_id', '" + cafeId + "').order('order')");
      
      const { data, error } = await supabase
        .from('menu_categories')
        .select('*')
        .eq('cafe_id', cafeId)
        .order('order');

      console.log("🔍 === РЕЗУЛЬТАТ ЗАПИТУ КАТЕГОРІЙ ===");
      console.log("🔍 Categories response data:", data);
      console.log("🔍 Categories response error:", error);
      console.log("🔍 Data type:", typeof data);
      console.log("🔍 Data length:", data?.length);
      
      if (data) {
        console.log("🔍 First category (if exists):", data[0]);
        data.forEach((cat, index) => {
          console.log(`🔍 Category ${index + 1}: ID=${cat.id}, name=${cat.name}, cafe_id=${cat.cafe_id}`);
        });
      }

      if (error) {
        console.error("❌ Error loading categories:", error);
        console.error("❌ Error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        setError(error.message);
        return;
      }

      console.log("✅ Found categories:", data?.length || 0);
      setCategories(data || []);
      console.log("🔍 === КІНЕЦЬ ЗАВАНТАЖЕННЯ КАТЕГОРІЙ ===");

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      console.error("❌ Catch block error:", err);
      console.error("❌ Error loading categories:", errorMsg);
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Додавання категорії
  const handleAddCategory = async () => {
    if (!newCategoryName.trim() || !cafeId) return;
    
    try {
      console.log("🚀 Adding category:", newCategoryName);
      
      const { data, error } = await supabase
        .from("menu_categories")
        .insert({
          cafe_id: cafeId,
          name: newCategoryName.trim(),
          description: null,
          order: categories.length + 1
        })
        .select()
        .single();
      
      if (error) {
        console.error("❌ Error adding category:", error);
        alert(`Помилка: ${error.message}`);
        return;
      }
      
      console.log("✅ Category added:", data);
      setNewCategoryName("");
      
      // Оновлюємо список
      loadCategories();
      
    } catch (err) {
      console.error("❌ Error adding category:", err);
      alert("Помилка при додаванні категорії");
    }
  };
  
  // Завантажуємо категорії при зміні cafeId
  useEffect(() => {
    loadCategories();
  }, [cafeId]);
  
  console.log("📊 Categories state:", { categories, isLoading, error });
  
  // Check if user is authenticated
  if (!user) {
    return (
      <DashboardLayout title="Меню">
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">Будь ласка, авторизуйтесь</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!user.cafeId) {
    return (
      <DashboardLayout title="Меню">
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">Помилка: не знайдено ID кафе</p>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout title="Меню">
      <div className="mb-6">
        <div className="bg-blue-100 p-4 rounded-lg mb-4">
          <h2 className="text-lg font-bold text-blue-800">🔍 ДІАГНОСТИКА</h2>
          <p><strong>Кафе ID:</strong> {user.cafeId}</p>
          <p><strong>Категорій знайдено:</strong> {categories.length}</p>
          <p><strong>Завантаження:</strong> {isLoading ? 'Так' : 'Ні'}</p>
          <p><strong>Помилка:</strong> {error || 'Немає'}</p>
          <p><strong>Статус:</strong> {categories.length > 0 ? '✅ Знайдені категорії' : '❌ Категорії не знайдені'}</p>
        </div>
        
        <p className="text-muted-foreground mb-4">
          Створюйте та редагуйте категорії та пункти вашого меню.
        </p>
        
        {/* Форма додавання категорії */}
        <div className="bg-white p-4 border rounded-lg mb-4">
          <h3 className="font-semibold mb-3">Додати нову категорію</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Назва категорії"
              className="flex-1 px-3 py-2 border rounded-md"
              onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
            />
            <Button 
              onClick={handleAddCategory}
              disabled={!newCategoryName.trim() || isLoading}
              className="bg-blue-600 text-white"
            >
              Додати
            </Button>
          </div>
        </div>
        
        {/* Показати знайдені категорії */}
        {!isLoading && categories.length > 0 && (
          <div className="mt-4 p-4 border rounded-lg bg-green-50">
            <h3 className="font-semibold text-green-800 mb-2">✅ Знайдені категорії:</h3>
            <ul className="space-y-2">
              {categories.map((cat, index) => (
                <li key={cat.id} className="p-2 bg-white rounded border">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{index + 1}. {cat.name}</span>
                    <span className="text-sm text-gray-500">ID: {cat.id}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {!isLoading && categories.length === 0 && !error && (
          <div className="mt-4 p-4 border border-dashed border-gray-300 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Для цього кафе ще не створено категорій меню
            </p>
          </div>
        )}
        
        {isLoading && (
          <div className="mt-4 p-4 border rounded-lg text-center">
            <p className="text-muted-foreground">Завантаження категорій...</p>
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-4 border rounded-lg bg-red-50 text-center">
            <p className="text-red-600">Помилка: {error}</p>
            <Button onClick={loadCategories} className="mt-2">
              Спробувати знову
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MenuPage;
