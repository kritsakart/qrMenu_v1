-- Enable realtime for menu_items table
-- This allows real-time subscriptions to work across devices
ALTER TABLE menu_items REPLICA IDENTITY FULL;

-- Enable publication for realtime changes
ALTER PUBLICATION supabase_realtime ADD TABLE menu_items; 