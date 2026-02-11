-- Add institution/company fields to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS organization_name TEXT,
ADD COLUMN IF NOT EXISTS organization_type TEXT DEFAULT 'individual',
ADD COLUMN IF NOT EXISTS position TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'Cameroun',
ADD COLUMN IF NOT EXISTS responsible_name TEXT,
ADD COLUMN IF NOT EXISTS responsible_phone TEXT,
ADD COLUMN IF NOT EXISTS responsible_email TEXT,
ADD COLUMN IF NOT EXISTS subscribed_services JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS subscribed_products JSONB DEFAULT '[]'::jsonb;

-- Allow admins to view all profiles for proforma generation
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));