import { supabaseAdmin } from '@/integrations/supabase/admin-client';

export const createMenuForCafe = async (cafeId: string) => {
  try {
    console.log("🔧 Creating menu data for cafe:", cafeId);
    
    // Add categories
    const categoriesData = [
      { 
        id: '11111111-1111-1111-1111-111111111111', 
        cafe_id: cafeId, 
        name: 'Appetizers', 
        description: 'Start your meal with our delicious appetizers', 
        order: 1 
      },
      { 
        id: '22222222-2222-2222-2222-222222222222', 
        cafe_id: cafeId, 
        name: 'Main Dishes', 
        description: 'Hearty and satisfying main courses', 
        order: 2 
      },
      { 
        id: '33333333-3333-3333-3333-333333333333', 
        cafe_id: cafeId, 
        name: 'Beverages', 
        description: 'Refreshing drinks and hot beverages', 
        order: 3 
      },
      { 
        id: '44444444-4444-4444-4444-444444444444', 
        cafe_id: cafeId, 
        name: 'Desserts', 
        description: 'Sweet treats to end your meal', 
        order: 4 
      }
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
      // Appetizers
      {
        id: 'a1111111-1111-1111-1111-111111111111',
        category_id: '11111111-1111-1111-1111-111111111111',
        name: 'Caesar Salad',
        description: 'Fresh romaine lettuce with parmesan cheese and croutons',
        price: 8.99,
        weight: '10 oz',
        variants: [
          { id: 'v1', name: 'Regular', price: 0, isDefault: true },
          { id: 'v2', name: 'With Chicken', price: 3.00, isDefault: false }
        ],
        order: 1
      },
      {
        id: 'a2222222-2222-2222-2222-222222222222',
        category_id: '11111111-1111-1111-1111-111111111111',
        name: 'Garlic Bread',
        description: 'Toasted bread with garlic butter and herbs',
        price: 5.99,
        weight: '6 pieces',
        variants: null,
        order: 2
      },
      {
        id: 'a3333333-3333-3333-3333-333333333333',
        category_id: '11111111-1111-1111-1111-111111111111',
        name: 'Buffalo Wings',
        description: 'Spicy chicken wings with blue cheese dip',
        price: 12.99,
        weight: '12 pieces',
        variants: [
          { id: 'v3', name: 'Mild', price: 0, isDefault: true },
          { id: 'v4', name: 'Hot', price: 0, isDefault: false },
          { id: 'v5', name: 'Extra Hot', price: 1.00, isDefault: false }
        ],
        order: 3
      },
      
      // Main Dishes
      {
        id: 'b1111111-1111-1111-1111-111111111111',
        category_id: '22222222-2222-2222-2222-222222222222',
        name: 'Grilled Chicken',
        description: 'Tender grilled chicken breast with seasonal vegetables',
        price: 16.99,
        weight: '8 oz',
        variants: [
          { id: 'v6', name: 'Regular', price: 0, isDefault: true },
          { id: 'v7', name: 'BBQ Sauce', price: 1.00, isDefault: false }
        ],
        order: 1
      },
      {
        id: 'b2222222-2222-2222-2222-222222222222',
        category_id: '22222222-2222-2222-2222-222222222222',
        name: 'Beef Burger',
        description: 'Juicy beef burger with lettuce, tomato, and fries',
        price: 14.99,
        weight: '12 oz',
        variants: [
          { id: 'v8', name: 'Regular', price: 0, isDefault: true },
          { id: 'v9', name: 'With Cheese', price: 2.00, isDefault: false },
          { id: 'v10', name: 'Double Patty', price: 4.00, isDefault: false }
        ],
        order: 2
      },
      {
        id: 'b3333333-3333-3333-3333-333333333333',
        category_id: '22222222-2222-2222-2222-222222222222',
        name: 'Pasta Carbonara',
        description: 'Creamy pasta with bacon and parmesan cheese',
        price: 13.99,
        weight: '14 oz',
        variants: null,
        order: 3
      },
      {
        id: 'b4444444-4444-4444-4444-444444444444',
        category_id: '22222222-2222-2222-2222-222222222222',
        name: 'Fish & Chips',
        description: 'Fresh fish fillet with crispy fries and tartar sauce',
        price: 15.99,
        weight: '10 oz',
        variants: [
          { id: 'v11', name: 'Cod', price: 0, isDefault: true },
          { id: 'v12', name: 'Salmon', price: 3.00, isDefault: false }
        ],
        order: 4
      },
      
      // Beverages
      {
        id: 'c1111111-1111-1111-1111-111111111111',
        category_id: '33333333-3333-3333-3333-333333333333',
        name: 'Coffee',
        description: 'Freshly brewed coffee',
        price: 3.99,
        weight: '12 oz',
        variants: [
          { id: 'v13', name: 'Regular', price: 0, isDefault: true },
          { id: 'v14', name: 'Decaf', price: 0, isDefault: false },
          { id: 'v15', name: 'Large', price: 1.00, isDefault: false }
        ],
        order: 1
      },
      {
        id: 'c2222222-2222-2222-2222-222222222222',
        category_id: '33333333-3333-3333-3333-333333333333',
        name: 'Fresh Orange Juice',
        description: 'Freshly squeezed orange juice',
        price: 4.99,
        weight: '16 oz',
        variants: null,
        order: 2
      },
      {
        id: 'c3333333-3333-3333-3333-333333333333',
        category_id: '33333333-3333-3333-3333-333333333333',
        name: 'Iced Tea',
        description: 'Refreshing iced tea with lemon',
        price: 2.99,
        weight: '20 oz',
        variants: [
          { id: 'v16', name: 'Sweet', price: 0, isDefault: true },
          { id: 'v17', name: 'Unsweetened', price: 0, isDefault: false }
        ],
        order: 3
      },
      
      // Desserts
      {
        id: 'd1111111-1111-1111-1111-111111111111',
        category_id: '44444444-4444-4444-4444-444444444444',
        name: 'Chocolate Cake',
        description: 'Rich chocolate cake with chocolate frosting',
        price: 6.99,
        weight: '4 oz',
        variants: null,
        order: 1
      },
      {
        id: 'd2222222-2222-2222-2222-222222222222',
        category_id: '44444444-4444-4444-4444-444444444444',
        name: 'Cheesecake',
        description: 'Classic New York style cheesecake',
        price: 7.99,
        weight: '5 oz',
        variants: [
          { id: 'v18', name: 'Plain', price: 0, isDefault: true },
          { id: 'v19', name: 'Strawberry', price: 1.00, isDefault: false },
          { id: 'v20', name: 'Blueberry', price: 1.00, isDefault: false }
        ],
        order: 2
      },
      {
        id: 'd3333333-3333-3333-3333-333333333333',
        category_id: '44444444-4444-4444-4444-444444444444',
        name: 'Ice Cream',
        description: 'Premium ice cream served in a bowl',
        price: 4.99,
        weight: '6 oz',
        variants: [
          { id: 'v21', name: 'Vanilla', price: 0, isDefault: true },
          { id: 'v22', name: 'Chocolate', price: 0, isDefault: false },
          { id: 'v23', name: 'Strawberry', price: 0, isDefault: false }
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
      .eq('cafe_id', cafeId);

    const { data: itemsCount, error: countError2 } = await supabaseAdmin
      .from('menu_items')
      .select('id', { count: 'exact' })
      .in('category_id', ['11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444']);

    console.log("📊 Created data verification:");
    console.log("Categories:", categoriesCount?.length || 0);
    console.log("Menu items:", itemsCount?.length || 0);

    return {
      success: true,
      categoriesCount: categoriesCount?.length || 0,
      itemsCount: itemsCount?.length || 0
    };

  } catch (error) {
    console.error("❌ Error creating menu for cafe:", error);
    return {
      success: false,
      error: error
    };
  }
}; 