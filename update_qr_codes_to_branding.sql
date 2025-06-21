-- Update existing QR codes to point to branding page instead of menu page
-- This changes URLs from /menu/{locationShortId}/{tableShortId} to /{locationShortId}/{tableShortId}

UPDATE public.tables 
SET qr_code_url = REPLACE(qr_code_url, '/menu/', '/')
WHERE qr_code_url LIKE '/menu/%';

-- Show updated results
SELECT 
  t.name as table_name,
  l.name as location_name,
  t.qr_code_url as updated_qr_url
FROM public.tables t
JOIN public.locations l ON t.location_id = l.id
ORDER BY l.name, t.name; 