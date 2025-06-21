-- Create basic tables with proper initial schema

-- Create cafe_owners table
CREATE TABLE IF NOT EXISTS public.cafe_owners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create locations table with short_id and branding fields
CREATE TABLE IF NOT EXISTS public.locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cafe_id UUID REFERENCES public.cafe_owners(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  short_id TEXT UNIQUE NOT NULL DEFAULT substring(replace(gen_random_uuid()::text, '-', ''), 1, 8),
  cover_image TEXT,
  promo_images JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create menu_categories table with order field
CREATE TABLE IF NOT EXISTS public.menu_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cafe_id UUID REFERENCES public.cafe_owners(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create menu_items table with variants and order
CREATE TABLE IF NOT EXISTS public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.menu_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  weight TEXT,
  image_url TEXT,
  "order" INTEGER DEFAULT 0,
  variants JSONB DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create tables table with short_id
CREATE TABLE IF NOT EXISTS public.tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID REFERENCES public.locations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  short_id TEXT UNIQUE NOT NULL DEFAULT substring(replace(gen_random_uuid()::text, '-', ''), 1, 6),
  qr_code TEXT NOT NULL,
  qr_code_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for optimization
CREATE INDEX IF NOT EXISTS idx_locations_short_id ON public.locations(short_id);
CREATE INDEX IF NOT EXISTS idx_tables_short_id ON public.tables(short_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category_order ON public.menu_items(category_id, "order");
CREATE INDEX IF NOT EXISTS idx_menu_categories_cafe_order ON public.menu_categories(cafe_id, "order");

-- Disable RLS for development
ALTER TABLE public.cafe_owners DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tables DISABLE ROW LEVEL SECURITY;

-- Enable realtime for menu_items
ALTER publication supabase_realtime ADD TABLE public.menu_items;

-- Add comments
COMMENT ON COLUMN public.menu_items.variants IS 'JSON array of item variants with fields: id, name, price (price adjustment), isDefault';
COMMENT ON COLUMN public.locations.short_id IS 'Short 8-character ID for URL optimization';
COMMENT ON COLUMN public.tables.short_id IS 'Short 6-character ID for URL optimization';
COMMENT ON COLUMN public.locations.cover_image IS 'Base64 encoded cover image for branding page (recommended: 800x600px)';
COMMENT ON COLUMN public.locations.promo_images IS 'Array of promotional images with url and title fields (recommended: 800x400px each)';

-- Insert initial data for development
INSERT INTO public.cafe_owners (email, name, username, status) VALUES 
('demo@foodlist.pro', 'Demo Restaurant', 'demo', 'active')
ON CONFLICT (email) DO NOTHING;

-- Update QR code URLs to point to branding page (not menu page)
-- This ensures new tables will have correct URLs from the start 