
-- 1. Teacher enrollment access policy
CREATE POLICY "Teachers can view course enrollments"
ON public.enrollments
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.courses c
    WHERE c.id = course_id AND c.teacher_id = auth.uid()
  )
);

-- 2. Live message validation trigger (using trigger instead of CHECK for immutability safety)
CREATE OR REPLACE FUNCTION public.validate_live_message()
RETURNS TRIGGER AS $$
BEGIN
  NEW.content := trim(NEW.content);
  IF char_length(NEW.content) = 0 THEN
    RAISE EXCEPTION 'Message cannot be empty';
  END IF;
  IF char_length(NEW.content) > 2000 THEN
    RAISE EXCEPTION 'Message too long';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER validate_live_message_trigger
BEFORE INSERT ON public.live_messages
FOR EACH ROW EXECUTE FUNCTION public.validate_live_message();
