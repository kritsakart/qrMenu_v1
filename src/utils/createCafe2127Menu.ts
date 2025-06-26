import { supabaseAdmin } from '@/integrations/supabase/admin-client';

export const createCafe2127Menu = async () => {
  try {
    console.log("🔧 Creating menu data for cafe2127...");
    
    // Add categories
    const categoriesData = [
      { id: '7e4847b4-5ca2-4301-8497-56da40b1c001', cafe_id: '525cf9b2-6a1f-4510-a8a0-147467b8d44', name: 'Appetizers', description: 'Start your meal with our delicious appetizers', order: 1 },
      { id: '7e4847b4-5ca2-4301-8497-56da40b1c002', cafe_id: '525cf9b2-6a1f-4510-a8a0-147467b8d44', name: 'Main Dishes', description: 'Hearty and satisfying main courses', order: 2 },
      { id: '7e4847b4-5ca2-4301-8497-56da40b1c003', cafe_id: '525cf9b2-6a1f-4510-a8a0-147467b8d44', name: 'Beverages', description: 'Refreshing drinks and hot beverages', order: 3 },
      { id: '7e4847b4-5ca2-4301-8497-56da40b1c004', cafe_id: '525cf9b2-6a1f-4510-a8a0-147467b8d44', name: 'Desserts', description: 'Sweet treats to end your meal', order: 4 }
    ];

    const { data: categoriesResult, error: categoriesError } = await supabaseAdmin
      .from('menu_categories')
      .upsert(categoriesData, { onConflict: 'id' });

    if (categoriesError) {
      console.error("❌ Error creating categories:", categoriesError);
      throw categoriesError;
    }

    console.log("✅ Categories created successfully");

    // Add menu items
    const menuItemsData = [
      {
        id: '7e4847b4-5ca2-4301-8497-56da40b1c101',
        category_id: '7e4847b4-5ca2-4301-8497-56da40b1c001',
        name: 'Caesar Salad',
        description: 'Fresh romaine lettuce with Caesar dressing, croutons, and parmesan cheese',
        price: 8.99,
        weight: '6 oz',
        variants: [
          { id: 'variant1', name: 'Regular', price: 0, isDefault: true },
          { id: 'variant2', name: 'With Chicken', price: 4.00, isDefault: false },
          { id: 'variant3', name: 'With Shrimp', price: 6.00, isDefault: false }
        ],
        order: 1
      },
      {
        id: '7e4847b4-5ca2-4301-8497-56da40b1c102',
        category_id: '7e4847b4-5ca2-4301-8497-56da40b1c001',
        name: 'Chicken Wings',
        description: 'Crispy chicken wings with your choice of sauce',
        price: 10.99,
        weight: '12 oz',
        variants: [
          { id: 'variant4', name: 'Buffalo', price: 0, isDefault: true },
          { id: 'variant5', name: 'BBQ', price: 0, isDefault: false },
          { id: 'variant6', name: 'Honey Garlic', price: 1.00, isDefault: false }
        ],
        order: 2
      },
      {
        id: '7e4847b4-5ca2-4301-8497-56da40b1c201',
        category_id: '7e4847b4-5ca2-4301-8497-56da40b1c002',
        name: 'Classic Burger',
        description: 'Juicy beef patty with lettuce, tomato, onion, and our special sauce',
        price: 12.99,
        weight: '8 oz',
        variants: [
          { id: 'variant7', name: 'Regular', price: 0, isDefault: true },
          { id: 'variant8', name: 'With Cheese', price: 1.50, isDefault: false },
          { id: 'variant9', name: 'With Bacon', price: 2.50, isDefault: false },
          { id: 'variant10', name: 'Deluxe (Cheese + Bacon)', price: 3.50, isDefault: false }
        ],
        order: 1
      },
      {
        id: '7e4847b4-5ca2-4301-8497-56da40b1c202',
        category_id: '7e4847b4-5ca2-4301-8497-56da40b1c002',
        name: 'Grilled Salmon',
        description: 'Fresh Atlantic salmon grilled to perfection with lemon and herbs',
        price: 18.99,
        weight: '10 oz',
        variants: null,
        order: 2
      },
      {
        id: '7e4847b4-5ca2-4301-8497-56da40b1c203',
        category_id: '7e4847b4-5ca2-4301-8497-56da40b1c002',
        name: 'Chicken Parmesan',
        description: 'Breaded chicken breast with marinara sauce and mozzarella cheese',
        price: 15.99,
        weight: '12 oz',
        variants: null,
        order: 3
      },
      {
        id: '7e4847b4-5ca2-4301-8497-56da40b1c301',
        category_id: '7e4847b4-5ca2-4301-8497-56da40b1c003',
        name: 'Coffee',
        description: 'Premium coffee made from freshly roasted beans',
        price: 3.99,
        weight: '12 oz',
        variants: [
          { id: 'variant11', name: 'Small', price: 0, isDefault: true },
          { id: 'variant12', name: 'Medium', price: 1.00, isDefault: false },
          { id: 'variant13', name: 'Large', price: 1.50, isDefault: false }
        ],
        order: 1
      },
      {
        id: '7e4847b4-5ca2-4301-8497-56da40b1c302',
        category_id: '7e4847b4-5ca2-4301-8497-56da40b1c003',
        name: 'Fresh Orange Juice',
        description: 'Freshly squeezed orange juice',
        price: 4.99,
        weight: '16 oz',
        variants: null,
        order: 2
      },
      {
        id: '7e4847b4-5ca2-4301-8497-56da40b1c303',
        category_id: '7e4847b4-5ca2-4301-8497-56da40b1c003',
        name: 'Iced Tea',
        description: 'Refreshing iced tea with lemon',
        price: 2.99,
        weight: '20 oz',
        variants: [
          { id: 'variant14', name: 'Sweet', price: 0, isDefault: true },
          { id: 'variant15', name: 'Unsweetened', price: 0, isDefault: false },
          { id: 'variant16', name: 'Half & Half', price: 0, isDefault: false }
        ],
        order: 3
      },
      {
        id: '7e4847b4-5ca2-4301-8497-56da40b1c401',
        category_id: '7e4847b4-5ca2-4301-8497-56da40b1c004',
        name: 'Chocolate Cake',
        description: 'Rich chocolate cake with chocolate frosting',
        price: 6.99,
        weight: '4 oz',
        variants: null,
        order: 1
      },
      {
        id: '7e4847b4-5ca2-4301-8497-56da40b1c402',
        category_id: '7e4847b4-5ca2-4301-8497-56da40b1c004',
        name: 'Cheesecake',
        description: 'Classic New York style cheesecake',
        price: 7.99,
        weight: '5 oz',
        variants: [
          { id: 'variant17', name: 'Plain', price: 0, isDefault: true },
          { id: 'variant18', name: 'Strawberry', price: 1.00, isDefault: false },
          { id: 'variant19', name: 'Blueberry', price: 1.00, isDefault: false }
        ],
        order: 2
      },
      {
        id: '7e4847b4-5ca2-4301-8497-56da40b1c403',
        category_id: '7e4847b4-5ca2-4301-8497-56da40b1c004',
        name: 'Ice Cream',
        description: 'Premium ice cream served in a bowl',
        price: 4.99,
        weight: '6 oz',
        variants: [
          { id: 'variant20', name: 'Vanilla', price: 0, isDefault: true },
          { id: 'variant21', name: 'Chocolate', price: 0, isDefault: false },
          { id: 'variant22', name: 'Strawberry', price: 0, isDefault: false }
        ],
        order: 3
      }
    ];

    const { data: itemsResult, error: itemsError } = await supabaseAdmin
      .from('menu_items')
      .upsert(menuItemsData, { onConflict: 'id' });

    if (itemsError) {
      console.error("❌ Error creating menu items:", itemsError);
      throw itemsError;
    }

    console.log("✅ Menu items created successfully");

    // Verify data
    const { data: categoriesCount, error: countError1 } = await supabaseAdmin
      .from('menu_categories')
      .select('id', { count: 'exact' })
      .eq('cafe_id', '525cf9b2-6a1f-4510-a8a0-147467b8d44');

    const { data: itemsCount, error: countError2 } = await supabaseAdmin
      .from('menu_items')
      .select('id', { count: 'exact' })
      .in('category_id', ['7e4847b4-5ca2-4301-8497-56da40b1c001', '7e4847b4-5ca2-4301-8497-56da40b1c002', '7e4847b4-5ca2-4301-8497-56da40b1c003', '7e4847b4-5ca2-4301-8497-56da40b1c004']);

    console.log("📊 Created data verification:");
    console.log("Categories:", categoriesCount?.length || 0);
    console.log("Menu items:", itemsCount?.length || 0);

    return {
      success: true,
      categoriesCount: categoriesCount?.length || 0,
      itemsCount: itemsCount?.length || 0
    };

  } catch (error) {
    console.error("❌ Error creating cafe2127 menu:", error);
    return {
      success: false,
      error: error
    };
  }
}; 