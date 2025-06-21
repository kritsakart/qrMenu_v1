-- Add password column to cafe_owners table

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'cafe_owners' 
        AND column_name = 'password'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.cafe_owners 
        ADD COLUMN password TEXT;
    END IF;
END $$;

-- Update existing demo user with password
UPDATE public.cafe_owners 
SET password = 'demo123' 
WHERE username = 'demo' AND password IS NULL;

-- Add comment
COMMENT ON COLUMN public.cafe_owners.password IS 'Plain text password for cafe owner authentication'; 