-- Auto-notify admin when a student creates a proforma
CREATE OR REPLACE FUNCTION public.notify_admin_new_proforma()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Notify all admins
  INSERT INTO public.notifications (user_id, title, message, type, course_id)
  SELECT ur.user_id,
         '📄 Nouveau Proforma',
         'Un proforma (' || NEW.proforma_number || ') de ' || NEW.client_name || ' pour ' || NEW.total || ' FCFA a été créé.',
         'info',
         NULL
  FROM public.user_roles ur
  WHERE ur.role = 'admin'
    AND NEW.created_by IS NOT NULL
    AND NOT public.has_role(NEW.created_by, 'admin');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER notify_admin_on_new_proforma
AFTER INSERT ON public.proformas
FOR EACH ROW
EXECUTE FUNCTION public.notify_admin_new_proforma();