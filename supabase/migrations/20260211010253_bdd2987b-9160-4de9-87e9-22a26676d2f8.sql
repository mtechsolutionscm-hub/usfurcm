-- Create proformas table
CREATE TABLE public.proformas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proforma_number TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT,
  user_id UUID,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal INTEGER NOT NULL DEFAULT 0,
  tax_rate INTEGER NOT NULL DEFAULT 0,
  tax_amount INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'FCFA',
  status TEXT NOT NULL DEFAULT 'draft',
  notes TEXT,
  valid_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID
);

-- Company info table for proforma header
CREATE TABLE public.company_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'USFUR Islamic Finance Training & Consulting',
  address TEXT,
  phone TEXT,
  email TEXT,
  niu TEXT,
  rccm TEXT,
  logo_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.proformas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_info ENABLE ROW LEVEL SECURITY;

-- Proformas policies
CREATE POLICY "Admins can manage all proformas" ON public.proformas FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view own proformas" ON public.proformas FOR SELECT USING (auth.uid() = user_id);

-- Company info policies
CREATE POLICY "Admins can manage company info" ON public.company_info FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can view company info" ON public.company_info FOR SELECT USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_proformas_updated_at BEFORE UPDATE ON public.proformas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_company_info_updated_at BEFORE UPDATE ON public.company_info FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.proformas;

-- Insert default company info
INSERT INTO public.company_info (name, phone, email, niu, rccm, address)
VALUES ('USFUR Islamic Finance Training & Consulting', '+237 690 895 554', 'admin@usfurcm.com', 'À mettre à jour', 'À mettre à jour', 'Cameroun - Zone CEMAC');