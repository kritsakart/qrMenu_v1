import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { MenuCategory, MenuItem, Location, Table } from "@/types/models";
import { supabase } from "@/integrations/supabase/client";

export const usePublicMenu = (locationId: string, tableId: string) => {
  const [location, setLocation] = useState<Location | null>(null);
  const [table, setTable] = useState<Table | null>(null);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const [allLocations, setAllLocations] = useState<any[]>([]);

  useEffect(() => {
    const fetchMenuData = async () => {
      if (!locationId || !tableId) {
        // console.log("🔍 PUBLIC MENU: Missing locationId or tableId:", { locationId, tableId });
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // console.log("🔍 PUBLIC MENU: Starting fetch for location:", locationId, "tableId from URL:", tableId);
        // console.log("🔍 PUBLIC MENU: Full URL:", window.location.href);

        // Remove initial fetch for all locations as it can be a performance bottleneck
        // console.log("🔍 PUBLIC MENU: Checking all locations in database...");
        // const { data: allLocations, error: allLocationsError } = await supabase
        //   .from('locations')
        //   .select('*');
        
        // console.log("🔍 PUBLIC MENU: All locations in database:", allLocations?.map(loc => ({
        //   id: loc.id,
        //   name: loc.name,
        //   cafe_id: loc.cafe_id
        // })));
        // if (allLocationsError) {
        //   console.error("❌ PUBLIC MENU: Error fetching all locations:", allLocationsError);
        // }

        // setAllLocations(allLocations || []);

        // Fetch location data
        // console.log("🔍 PUBLIC MENU: Looking for specific location:", locationId);
        // console.log("🔍 PUBLIC MENU: SQL Query:", `SELECT * FROM locations WHERE id = '${locationId}'`);
        
        const { data: locationData, error: locationError } = await supabase
          .from('locations')
          .select('*')
          .eq('id', locationId)
          .maybeSingle();

        // console.log("🔍 PUBLIC MENU: Raw location data from database:", locationData);
        // console.log("🔍 PUBLIC MENU: Location error if any:", locationError);

        if (locationError) {
          // console.error("❌ PUBLIC MENU: Location error:", locationError);
          throw new Error(`Помилка пошуку локації: ${locationError.message}`);
        }

        if (!locationData) {
          // console.error("❌ PUBLIC MENU: Location not found for ID:", locationId);
          // console.log("🔍 PUBLIC MENU: Available locations:", allLocations?.map(l => ({ 
          //   id: l.id, 
          //   name: l.name,
          //   cafe_id: l.cafe_id 
          // })));
          throw new Error(`Локацію з ID ${locationId} не знайдено.`);
        }

        // console.log("✅ PUBLIC MENU: Location found:", locationData);
        setLocation({
          id: locationData.id,
          cafeId: locationData.cafe_id,
          name: locationData.name,
          address: locationData.address,
          createdAt: locationData.created_at
        });

        // Fetch all tables for this location
        const { data: allTables, error: allTablesError } = await supabase
          .from('tables')
          .select('id, name, location_id, qr_code, qr_code_url, created_at')
          .eq('location_id', locationId);
        
        // console.log("🔍 PUBLIC MENU: All tables for location:", allTables);
        if (allTablesError) {
          // console.error("❌ PUBLIC MENU: Error fetching tables for location:", allTablesError);
        }

        // Find table by matching the tableId (timestamp) with the qr_code_url
        // The tableId in URL is the timestamp part from qr_code_url like `/menu/${locationId}/${tableId}`
        const matchingTable = allTables?.find(table => {
          // Extract timestamp from qr_code_url
          const urlParts = table.qr_code_url?.split('/');
          const timestampFromUrl = urlParts?.[urlParts.length - 1];
          // console.log("🔍 PUBLIC MENU: Comparing tableId:", tableId, "with timestamp from URL:", timestampFromUrl, "for table:", table.name);
          return timestampFromUrl === tableId;
        });

        // console.log("🔍 PUBLIC MENU: Found matching table:", matchingTable);

        if (!matchingTable) {
          // console.error("❌ PUBLIC MENU: Table not found for timestamp:", tableId, "in location:", locationId);
          // console.log("🔍 PUBLIC MENU: Available tables with their URLs:", allTables?.map(t => ({ 
          //   name: t.name, 
          //   qr_code_url: t.qr_code_url,
          //   extractedTimestamp: t.qr_code_url?.split('/').pop()
          // })));
          throw new Error(`Столик не знайдено. Можливо QR-код застарів або пошкоджений.`);
        }

        // console.log("✅ PUBLIC MENU: Table found:", matchingTable);
        setTable({
          id: matchingTable.id,
          locationId: matchingTable.location_id,
          name: matchingTable.name,
          qrCode: matchingTable.qr_code,
          qrCodeUrl: matchingTable.qr_code_url,
          createdAt: matchingTable.created_at
        });

        // Fetch menu categories for this cafe
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('menu_categories')
          .select('*')
          .eq('cafe_id', locationData.cafe_id)
          .order('order');

        if (categoriesError) {
          // console.error("❌ PUBLIC MENU: Categories error:", categoriesError);
          throw new Error(`Помилка завантаження категорій: ${categoriesError.message}`);
        }

        // console.log("✅ PUBLIC MENU: Categories found:", categoriesData);
        const mappedCategories = (categoriesData || []).map(cat => ({
          id: cat.id,
          cafeId: cat.cafe_id,
          name: cat.name,
          order: cat.order,
          createdAt: cat.created_at
        }));
        setCategories(mappedCategories);

        // Fetch all menu items for these categories
        if (mappedCategories.length > 0) {
          const categoryIds = mappedCategories.map(cat => cat.id);
          const { data: itemsData, error: itemsError } = await supabase
            .from('menu_items')
            .select('*')
            .in('category_id', categoryIds);

          if (itemsError) {
            // console.error("❌ PUBLIC MENU: Items error:", itemsError);
            throw new Error(`Помилка завантаження страв: ${itemsError.message}`);
          }

          // console.log("✅ PUBLIC MENU: Items found:", itemsData);
          const mappedItems = (itemsData || []).map(item => ({
            id: item.id,
            categoryId: item.category_id,
            name: item.name,
            description: item.description || undefined,
            price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
            weight: item.weight || undefined,
            imageUrl: item.image_url || undefined,
            createdAt: item.created_at
          }));
          setMenuItems(mappedItems);
        } else {
          // console.log("🔍 PUBLIC MENU: No categories found, setting empty menu items");
          setMenuItems([]);
        }
      } catch (err) {
        // console.error("❌ PUBLIC MENU: Error fetching data:", err);
        const error = err instanceof Error ? err : new Error('Невідома помилка');
        setError(error);
        toast({
          variant: "destructive",
          title: "Помилка завантаження меню",
          description: error.message
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuData();
  }, [locationId, tableId, toast]);

  return {
    location,
    table,
    categories,
    menuItems,
    isLoading,
    error,
    allLocations
  };
};
