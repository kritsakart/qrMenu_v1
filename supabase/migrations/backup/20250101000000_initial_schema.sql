-- Create basic tables
CREATE TABLE IF NOT EXISTS public.cafe_owners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add short_id columns for locations and tables to optimize URL length
CREATE TABLE IF NOT EXISTS public.locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cafe_id UUID REFERENCES public.cafe_owners(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  short_id TEXT UNIQUE NOT NULL DEFAULT substring(replace(gen_random_uuid()::text, '-', ''), 1, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.menu_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cafe_id UUID REFERENCES public.cafe_owners(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

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

CREATE TABLE IF NOT EXISTS public.tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID REFERENCES public.locations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  short_id TEXT UNIQUE NOT NULL DEFAULT substring(replace(gen_random_uuid()::text, '-', ''), 1, 6),
  qr_code TEXT NOT NULL,
  qr_code_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for short_id lookups
CREATE INDEX IF NOT EXISTS idx_locations_short_id ON public.locations(short_id);
CREATE INDEX IF NOT EXISTS idx_tables_short_id ON public.tables(short_id);

-- Disable RLS for development
ALTER TABLE public.cafe_owners DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tables DISABLE ROW LEVEL SECURITY;

-- Enable realtime for menu_items
ALTER publication supabase_realtime ADD TABLE public.menu_items;

-- Add comment to variants column
COMMENT ON COLUMN public.menu_items.variants IS 'JSON array of item variants with fields: id, name, price (price adjustment), isDefault';

-- Add comments for short_id columns
COMMENT ON COLUMN public.locations.short_id IS 'Short 8-character ID for URL optimization';
COMMENT ON COLUMN public.tables.short_id IS 'Short 6-character ID for URL optimization'; 