-- Check which cafe this QR code belongs to
-- Location Short ID: 179cf4ed
-- Table Short ID: H5ACDc

SELECT 
  l.name as location_name,
  l.cafe_id as cafe_id,
  l.short_id as location_short_id,
  t.name as table_name,
  t.short_id as table_short_id,
  t.qr_code_url
FROM locations l 
JOIN tables t ON l.id = t.location_id 
WHERE l.short_id = '179cf4ed' 
  AND t.short_id = 'H5ACDc';

-- Also check if there are any menu categories for this cafe
SELECT 
  'Categories for this cafe:' as info,
  COUNT(*) as count
FROM menu_categories mc
JOIN locations l ON mc.cafe_id = l.cafe_id
WHERE l.short_id = '179cf4ed';

-- And check menu items
SELECT 
  'Menu items for this cafe:' as info,
  COUNT(*) as count
FROM menu_items mi
JOIN menu_categories mc ON mi.category_id = mc.id
JOIN locations l ON mc.cafe_id = l.cafe_id
WHERE l.short_id = '179cf4ed'; 