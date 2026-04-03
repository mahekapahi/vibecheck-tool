
-- Bids table
CREATE TABLE public.bids (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id integer NOT NULL REFERENCES public.auctions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  amount numeric NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Bids are viewable by everyone" ON public.bids FOR SELECT TO public USING (true);
CREATE POLICY "Authenticated users can place bids" ON public.bids FOR INSERT TO public WITH CHECK (auth.uid() = user_id);

-- Comments table
CREATE TABLE public.comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id integer NOT NULL REFERENCES public.auctions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  text text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments are viewable by everyone" ON public.comments FOR SELECT TO public USING (true);
CREATE POLICY "Authenticated users can add comments" ON public.comments FOR INSERT TO public WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON public.comments FOR DELETE TO public USING (auth.uid() = user_id);
