-- Add branding fields to locations table (only if they don't exist)

-- Add cover_image column
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'locations' 
        AND column_name = 'cover_image'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.locations 
        ADD COLUMN cover_image TEXT;
    END IF;
END $$;

-- Add promo_images column  
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'locations' 
        AND column_name = 'promo_images'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.locations 
        ADD COLUMN promo_images JSONB DEFAULT '[]'::jsonb;
    END IF;
END $$;

-- Add comments explaining the recommended image sizes
COMMENT ON COLUMN public.locations.cover_image IS 'URL for cover/logo image. Recommended size: 800x600px (4:3 aspect ratio)';
COMMENT ON COLUMN public.locations.promo_images IS 'Array of promotional images with titles. Recommended size: 800x400px (2:1 aspect ratio). Format: [{"url": "string", "title": "string"}]'; 