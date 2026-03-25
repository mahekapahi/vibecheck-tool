-- Fix overly permissive INSERT policy on contact_messages
DROP POLICY "Anyone can insert messages" ON public.contact_messages;
CREATE POLICY "Authenticated users can insert messages" ON public.contact_messages FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);