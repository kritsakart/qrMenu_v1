-- Script to add short IDs to existing records
-- This will optimize URL length from ~80 characters to ~20 characters

-- Add short_id columns if they don't exist
ALTER TABLE public.locations ADD COLUMN IF NOT EXISTS short_id TEXT;
ALTER TABLE public.tables ADD COLUMN IF NOT EXISTS short_id TEXT;

-- Create function to generate short IDs
CREATE OR REPLACE FUNCTION generate_short_id(length INTEGER DEFAULT 8)
RETURNS TEXT AS $$
BEGIN
  RETURN substring(replace(gen_random_uuid()::text, '-', ''), 1, length);
END;
$$ LANGUAGE plpgsql;

-- Update existing locations with short IDs (8 characters)
UPDATE public.locations 
SET short_id = generate_short_id(8)
WHERE short_id IS NULL;

-- Update existing tables with short IDs (6 characters)  
UPDATE public.tables
SET short_id = generate_short_id(6)
WHERE short_id IS NULL;

-- Add unique constraints if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'locations_short_id_unique') THEN
        ALTER TABLE public.locations ADD CONSTRAINT locations_short_id_unique UNIQUE (short_id);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tables_short_id_unique') THEN
        ALTER TABLE public.tables ADD CONSTRAINT tables_short_id_unique UNIQUE (short_id);
    END IF;
END $$;

-- Make short_id NOT NULL after populating
ALTER TABLE public.locations ALTER COLUMN short_id SET NOT NULL;
ALTER TABLE public.tables ALTER COLUMN short_id SET NOT NULL;

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_locations_short_id ON public.locations(short_id);
CREATE INDEX IF NOT EXISTS idx_tables_short_id ON public.tables(short_id);

-- Update QR code URLs to use short IDs instead of full UUIDs
-- This will change URLs from /menu/{uuid}/{uuid} to /menu/{8chars}/{6chars}
UPDATE public.tables 
SET qr_code_url = '/menu/' || (
  SELECT l.short_id 
  FROM public.locations l 
  WHERE l.id = tables.location_id
) || '/' || tables.short_id
WHERE qr_code_url IS NOT NULL;

-- Add comments
COMMENT ON COLUMN public.locations.short_id IS 'Short 8-character ID for URL optimization - reduces URL length significantly';
COMMENT ON COLUMN public.tables.short_id IS 'Short 6-character ID for URL optimization - reduces URL length significantly';

-- Drop the helper function as it's no longer needed
DROP FUNCTION IF EXISTS generate_short_id(INTEGER);

-- Show results
SELECT 'Locations updated:' as message, COUNT(*) as count FROM public.locations WHERE short_id IS NOT NULL
UNION ALL
SELECT 'Tables updated:' as message, COUNT(*) as count FROM public.tables WHERE short_id IS NOT NULL
UNION ALL
SELECT 'Sample URLs:' as message, 0 as count
UNION ALL
SELECT qr_code_url as message, 0 as count FROM public.tables LIMIT 3; 