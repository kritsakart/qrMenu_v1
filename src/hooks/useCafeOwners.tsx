
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { CafeOwner } from "@/types/models";
import { supabaseAdmin } from "@/integrations/supabase/admin-client";

export const useCafeOwners = () => {
  const [owners, setOwners] = useState<CafeOwner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchCafeOwners = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Fetching cafe owners - starting query...");
      
      // Clear the current API response cache to ensure fresh data
      const { data, error } = await supabaseAdmin
        .from("cafe_owners")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Supabase query error:", error);
        throw new Error(`База даних: ${error.message}`);
      }
      
      console.log(`Retrieved data:`, data);
      
      if (!data || data.length === 0) {
        console.log("No cafe owners found in database");
        setOwners([]);
        return;
      }
      
      console.log(`Successfully retrieved ${data.length} cafe owners`);
      
      const cafeOwners: CafeOwner[] = data.map(owner => ({
        id: owner.id,
        username: owner.username,
        name: owner.name,
        email: owner.email,
        status: owner.status as "active" | "inactive",
        createdAt: owner.created_at,
        password: owner.password,
      }));
      
      setOwners(cafeOwners);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Невідома помилка завантаження');
      console.error("Error fetching cafe owners:", error);
      setError(error);
      toast({
        variant: "destructive",
        title: "Помилка завантаження",
        description: `Не вдалося завантажити дані власників: ${error.message}`
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const deleteOwner = useCallback(async (id: string) => {
    try {
      console.log(`Deleting owner with ID: ${id}`);
      
      const { error } = await supabaseAdmin
        .from("cafe_owners")
        .delete()
        .eq("id", id);
      
      if (error) {
        console.error("Supabase delete error:", error);
        throw new Error(`База даних: ${error.message}`);
      }
      
      toast({
        title: "Власника видалено",
        description: "Власника кафе успішно видалено з бази даних.",
      });
      
      // Update local state
      setOwners(prevOwners => prevOwners.filter(owner => owner.id !== id));
      
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Невідома помилка');
      console.error("Error deleting cafe owner:", error);
      toast({
        variant: "destructive",
        title: "Помилка видалення",
        description: `Не вдалося видалити власника: ${error.message}`
      });
      throw error;
    }
  }, [toast]);

  useEffect(() => {
    fetchCafeOwners();
  }, [fetchCafeOwners]);

  return {
    owners,
    isLoading,
    error,
    fetchCafeOwners,
    deleteOwner
  };
};
