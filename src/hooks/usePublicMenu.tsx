import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { MenuCategory, MenuItem, Location, Table, MenuItemVariant, mapSupabaseLocation, mapSupabaseTable, mapSupabaseMenuCategory, mapSupabaseMenuItem } from "@/types/models";
import { supabase } from "@/integrations/supabase/client";

export const usePublicMenu = (locationShortId: string, tableShortId?: string) => {
  const [location, setLocation] = useState<Location | null>(null);
  const [table, setTable] = useState<Table | null>(null);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const [allLocations, setAllLocations] = useState<Location[]>([]);

  // Add cache-busting mechanism
  useEffect(() => {
    // Add meta tags to prevent caching
    const addNoCacheMetaTags = () => {
      const metaTags = [
        { name: 'cache-control', content: 'no-cache, no-store, must-revalidate' },
        { name: 'pragma', content: 'no-cache' },
        { name: 'expires', content: '0' }
      ];

      metaTags.forEach(tag => {
        let meta = document.querySelector(`meta[name="${tag.name}"]`);
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('name', tag.name);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', tag.content);
      });
    };

    addNoCacheMetaTags();
  }, []);

  // Real-time підписка на зміни в menu_items для синхронізації між пристроями
  useEffect(() => {
    if (!location?.cafeId) return;

    console.log('📡 PUBLIC MENU: Setting up real-time subscription for cafe:', location.cafeId);
    
    // Підписуємося на зміни в таблиці menu_items для цього кафе
    const channel = supabase
      .channel('menu-items-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'menu_items',
          filter: `cafe_id=eq.${location.cafeId}`
        },
        (payload) => {
          console.log('📡 PUBLIC MENU: Real-time update received:', payload);
          
          // Оновлюємо локальний стан з новими даними
          setMenuItems(prevItems => {
            const updatedItems = [...prevItems];
            const itemIndex = updatedItems.findIndex(item => item.id === payload.new.id);
            
            if (itemIndex >= 0) {
                             // Оновлюємо існуючий товар
              updatedItems[itemIndex] = {
                ...updatedItems[itemIndex],
                order: payload.new.order !== undefined ? payload.new.order : updatedItems[itemIndex].order || 0
              };
              
              console.log('📦 PUBLIC MENU: Updated item order:', {
                id: payload.new.id,
                name: updatedItems[itemIndex].name,
                newOrder: payload.new.order
              });
              
              // Пересортовуємо товари в категорії
              const categoryId = updatedItems[itemIndex].categoryId;
              const categoryItems = updatedItems.filter(item => item.categoryId === categoryId);
              const otherItems = updatedItems.filter(item => item.categoryId !== categoryId);
              
              categoryItems.sort((a, b) => (a.order || 0) - (b.order || 0));
              
              return [...otherItems, ...categoryItems];
            }
            
            return prevItems;
          });
        }
      )
      .subscribe();

    return () => {
      console.log('📡 PUBLIC MENU: Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [location?.cafeId]);

  // Слухач для оновлення порядку товарів при зміні localStorage (fallback для same-tab updates)
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key && event.key.startsWith('menuItemOrder_')) {
        console.log('📡 PUBLIC MENU: localStorage change detected (fallback):', event.key);
        // Цей код залишаємо як fallback для same-tab синхронізації
        if (location?.cafeId) {
          setMenuItems(prevItems => {
            const categoryId = event.key!.replace('menuItemOrder_', '');
            const savedOrderRaw = event.newValue;
            
            if (savedOrderRaw) {
              try {
                const savedOrder = JSON.parse(savedOrderRaw) as Record<string, number>;
                console.log(`📂 PUBLIC MENU: Applying localStorage order for category ${categoryId}:`, savedOrder);
                
                // Застосовуємо новий порядок до товарів
                const updatedItems = [...prevItems];
                const categoryItems = updatedItems.filter(item => item.categoryId === categoryId);
                categoryItems.sort((a, b) => {
                  const orderA = savedOrder[a.id] ?? 999;
                  const orderB = savedOrder[b.id] ?? 999;
                  return orderA - orderB;
                });
                
                // Замінюємо товари цієї категорії відсортованими
                return updatedItems.filter(item => item.categoryId !== categoryId).concat(categoryItems);
              } catch (e) {
                console.log(`⚠️ PUBLIC MENU: Could not parse localStorage order for category ${categoryId}`);
              }
            }
            
            return prevItems;
          });
        }
      }
    };

    // Додаємо слухач для зміни localStorage
    window.addEventListener('storage', handleStorageChange);
    
    // Також додаємо слухач для кастомних подій (для зміни в тій же вкладці)
    const handleCustomStorageChange = (event: CustomEvent) => {
      handleStorageChange(event.detail);
    };
    
    window.addEventListener('localStorageChange', handleCustomStorageChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange', handleCustomStorageChange as EventListener);
    };
  }, [location?.cafeId]);

  useEffect(() => {
    const fetchMenuData = async () => {
      if (!locationShortId) {
        // console.log("🔍 PUBLIC MENU: Missing locationShortId:", { locationShortId, tableShortId });
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // console.log("🔍 PUBLIC MENU: Starting fetch for location:", locationShortId, "tableShortId from URL:", tableShortId);
        // console.log("🔍 PUBLIC MENU: Full URL:", window.location.href);

        // Try to fetch location data using short_id first, then fallback to UUID
        // console.log("🔍 PUBLIC MENU: Looking for location with short_id:", locationShortId);
        
        let locationData = null;
        let locationError = null;
        
        // First try with short_id
        const shortIdResult = await supabase
          .from('locations')
          .select('*')
          .eq('short_id', locationShortId)
          .maybeSingle();
          
        if (shortIdResult.data) {
          locationData = shortIdResult.data;
        } else {
          // Fallback to UUID search
          console.log("🔍 PUBLIC MENU: Short ID not found, trying UUID:", locationShortId);
          const uuidResult = await supabase
            .from('locations')
            .select('*')
            .eq('id', locationShortId)
            .maybeSingle();
            
          locationData = uuidResult.data;
          locationError = uuidResult.error;
        }

        // console.log("🔍 PUBLIC MENU: Raw location data from database:", locationData);
        // console.log("🔍 PUBLIC MENU: Location error if any:", locationError);

        if (locationError) {
          // console.error("❌ PUBLIC MENU: Location error:", locationError);
          throw new Error(`Помилка пошуку локації: ${locationError.message}`);
        }

        if (!locationData) {
          // console.error("❌ PUBLIC MENU: Location not found for ID:", locationShortId);
          throw new Error(`Локацію з ID ${locationShortId} не знайдено.`);
        }

        // console.log("✅ PUBLIC MENU: Location found:", locationData);
        const mappedLocation = mapSupabaseLocation(locationData);
        setLocation(mappedLocation);

        // Try to fetch table by short_id first, then fallback to UUID (optional for new format)
        let tableData = null;
        let tableError = null;
        
        if (tableShortId) {
          // First try with short_id
          const tableShortIdResult = await supabase
            .from('tables')
            .select('*')
            .eq('short_id', tableShortId)
            .eq('location_id', locationData.id)
            .maybeSingle();
            
          if (tableShortIdResult.data) {
            tableData = tableShortIdResult.data;
          } else {
            // Fallback to UUID search
            console.log("🔍 PUBLIC MENU: Table short ID not found, trying UUID:", tableShortId);
            const tableUuidResult = await supabase
              .from('tables')
              .select('*')
              .eq('id', tableShortId)
              .eq('location_id', locationData.id)
              .maybeSingle();
              
            tableData = tableUuidResult.data;
            tableError = tableUuidResult.error;
          }
          
          // console.log("🔍 PUBLIC MENU: Table lookup result:", tableData);
          if (tableError) {
            // console.error("❌ PUBLIC MENU: Error fetching table:", tableError);
          }

          const matchingTable = tableData;

          // console.log("🔍 PUBLIC MENU: Found matching table:", matchingTable);

          if (!matchingTable) {
            // For backward compatibility, we require table for old format URLs
            console.error("❌ PUBLIC MENU: Table not found for ID:", tableShortId, "in location:", locationData.id);
            throw new Error(`Table not found. The QR code may be outdated or damaged.`);
          }

          // console.log("✅ PUBLIC MENU: Table found:", matchingTable);
          const mappedTable = mapSupabaseTable(matchingTable);
          setTable(mappedTable);
        } else {
          // No table specified (new format) - this is OK for branding page
          console.log("🔍 PUBLIC MENU: No table specified (new format)");
          setTable(null);
        }

        // Fetch menu categories for this cafe with cache busting
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('menu_categories')
          .select('*')
          .eq('cafe_id', mappedLocation.cafeId)
          .order('order');

        if (categoriesError) {
          // console.error("❌ PUBLIC MENU: Categories error:", categoriesError);
          throw new Error(`Помилка завантаження категорій: ${categoriesError.message}`);
        }

        // console.log("✅ PUBLIC MENU: Categories found:", categoriesData);
        const mappedCategories = (categoriesData || []).map(cat => mapSupabaseMenuCategory(cat));
        setCategories(mappedCategories);

        // Fetch all menu items for these categories
        if (mappedCategories.length > 0) {
          const categoryIds = mappedCategories.map(cat => cat.id);
          
          // Спочатку спробуємо завантажити з сортуванням за order (з cache busting)
          let { data: itemsData, error: itemsError } = await supabase
            .from('menu_items')
            .select('*')
            .in('category_id', categoryIds)
            .order('order');
          
          // Якщо помилка через відсутність поля order, завантажуємо без сортування
          if (itemsError && itemsError.message.includes('column "order" does not exist')) {
            console.log('⚠️ PUBLIC MENU: Order column does not exist, loading without order');
            const fallbackResult = await supabase
              .from('menu_items')
              .select('*')
              .in('category_id', categoryIds)
              .order('created_at');
            
            itemsData = fallbackResult.data;
            itemsError = fallbackResult.error;
          }

          if (itemsError) {
            // console.error("❌ PUBLIC MENU: Items error:", itemsError);
            throw new Error(`Помилка завантаження страв: ${itemsError.message}`);
          }

          // console.log("✅ PUBLIC MENU: Items found:", itemsData);
          const mappedItems = (itemsData || []).map(item => ({
            ...mapSupabaseMenuItem(item),
            variants: item.variants ? (Array.isArray(item.variants) ? item.variants as MenuItemVariant[] : undefined) : undefined,
          }));
          
          console.log('📦 PUBLIC MENU: Loaded items with order from database:', 
            mappedItems.map(item => ({ name: item.name, order: item.order, categoryId: item.categoryId }))
          );
          
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
  }, [locationShortId, tableShortId, toast]);

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
