
-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Parking lots
CREATE TABLE public.parking_lots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  total_slots INT NOT NULL DEFAULT 0,
  hourly_rate NUMERIC(10,2) NOT NULL DEFAULT 2.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.parking_lots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view parking lots" ON public.parking_lots FOR SELECT USING (true);

-- Parking slots
CREATE TABLE public.parking_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lot_id UUID REFERENCES public.parking_lots(id) ON DELETE CASCADE NOT NULL,
  slot_number TEXT NOT NULL,
  floor TEXT NOT NULL DEFAULT 'G',
  slot_type TEXT NOT NULL DEFAULT 'standard',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(lot_id, slot_number)
);
ALTER TABLE public.parking_slots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view parking slots" ON public.parking_slots FOR SELECT USING (true);

-- Bookings
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  slot_id UUID REFERENCES public.parking_slots(id) ON DELETE CASCADE NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  total_cost NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  vehicle_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bookings" ON public.bookings FOR UPDATE USING (auth.uid() = user_id);

-- Seed parking lot and slots
INSERT INTO public.parking_lots (id, name, address, total_slots, hourly_rate) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Downtown Central Parking', '123 Main Street, Downtown', 30, 3.50),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Mall Parking Complex', '456 Shopping Ave, Westside', 24, 2.50);

INSERT INTO public.parking_slots (lot_id, slot_number, floor, slot_type) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'A1', 'G', 'standard'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'A2', 'G', 'standard'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'A3', 'G', 'compact'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'A4', 'G', 'standard'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'A5', 'G', 'standard'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'A6', 'G', 'handicap'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'B1', '1', 'standard'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'B2', '1', 'standard'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'B3', '1', 'compact'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'B4', '1', 'standard'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'B5', '1', 'standard'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'B6', '1', 'standard'),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'C1', 'G', 'standard'),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'C2', 'G', 'standard'),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'C3', 'G', 'compact'),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'C4', 'G', 'standard'),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'C5', 'G', 'handicap'),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'C6', 'G', 'standard');
