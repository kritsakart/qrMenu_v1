import { supabase } from "@/integrations/supabase/client";

export const testRLSDisabled = async () => {
  try {
    console.log("🧪 Testing if RLS is disabled...");
    
    // Пробуємо виконати простий запит для тестування доступу
    const { data, error } = await supabase
      .from("menu_categories")
      .select("id")
      .limit(1);
    
    if (error) {
      console.error("❌ RLS test failed:", error);
      return { success: false, error: error.message };
    }
    
    console.log("✅ RLS test passed - database is accessible");
    return { success: true, data };
  } catch (err) {
    console.error("❌ RLS test error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
};

export const testCategoryInsert = async (cafeId: string, testName: string = "Test Category") => {
  try {
    console.log("🧪 Testing category insert...");
    
    const { data, error } = await supabase
      .from("menu_categories")
      .insert({
        cafe_id: cafeId,
        name: testName,
        order: 999
      })
      .select()
      .single();
    
    if (error) {
      console.error("❌ Category insert test failed:", error);
      return { success: false, error: error.message };
    }
    
    console.log("✅ Category insert test passed:", data);
    
    // Очищаємо тестові дані
    await supabase
      .from("menu_categories")
      .delete()
      .eq("id", data.id);
    
    return { success: true, data };
  } catch (err) {
    console.error("❌ Category insert test error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}; 