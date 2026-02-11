-- Allow authenticated users to insert their own proformas
CREATE POLICY "Users can create own proformas"
ON public.proformas
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow users to update own proformas  
CREATE POLICY "Users can update own proformas"
ON public.proformas
FOR UPDATE
USING (auth.uid() = user_id);