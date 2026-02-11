
-- Create institutions table
CREATE TABLE public.institutions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'institution_financiere',
  address TEXT,
  city TEXT,
  country TEXT DEFAULT 'Cameroun',
  phone TEXT,
  email TEXT,
  website TEXT,
  responsible_name TEXT,
  responsible_phone TEXT,
  responsible_email TEXT,
  responsible_position TEXT,
  niu TEXT,
  rccm TEXT,
  notes TEXT,
  subscribed_services JSONB DEFAULT '[]'::jsonb,
  subscribed_products JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;

-- Admins can manage institutions
CREATE POLICY "Admins can manage institutions"
ON public.institutions
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Anyone authenticated can view active institutions
CREATE POLICY "Authenticated can view active institutions"
ON public.institutions
FOR SELECT
USING (is_active = true);

-- Timestamp trigger
CREATE TRIGGER update_institutions_updated_at
BEFORE UPDATE ON public.institutions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.institutions;
