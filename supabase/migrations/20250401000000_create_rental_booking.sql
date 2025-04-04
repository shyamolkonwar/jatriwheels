-- Create rental_booking table
CREATE TABLE rental_booking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  pickup_location TEXT NOT NULL,
  pickup_place_id TEXT NOT NULL,
  pickup_date DATE NOT NULL,
  pickup_time TIME NOT NULL,
  total_price NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE rental_booking ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own bookings" 
ON rental_booking FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookings"
ON rental_booking FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
ON rental_booking FOR UPDATE
USING (auth.uid() = user_id);

-- Add vehicle_category column to link with rental_base_fee
ALTER TABLE rental_booking
ADD COLUMN vehicle_category TEXT NOT NULL;

-- Add columns for multiple destinations (up to 10)
ALTER TABLE rental_booking
ADD COLUMN destination_1_location TEXT;
ALTER TABLE rental_booking
ADD COLUMN destination_1_place_id TEXT;
ALTER TABLE rental_booking
ADD COLUMN destination_2_location TEXT;
ALTER TABLE rental_booking
ADD COLUMN destination_2_place_id TEXT;
ALTER TABLE rental_booking
ADD COLUMN destination_3_location TEXT;
ALTER TABLE rental_booking
ADD COLUMN destination_3_place_id TEXT;
ALTER TABLE rental_booking
ADD COLUMN destination_4_location TEXT;
ALTER TABLE rental_booking
ADD COLUMN destination_4_place_id TEXT;
ALTER TABLE rental_booking
ADD COLUMN destination_5_location TEXT;
ALTER TABLE rental_booking
ADD COLUMN destination_5_place_id TEXT;
ALTER TABLE rental_booking
ADD COLUMN destination_6_location TEXT;
ALTER TABLE rental_booking
ADD COLUMN destination_6_place_id TEXT;
ALTER TABLE rental_booking
ADD COLUMN destination_7_location TEXT;
ALTER TABLE rental_booking
ADD COLUMN destination_7_place_id TEXT;
ALTER TABLE rental_booking
ADD COLUMN destination_8_location TEXT;
ALTER TABLE rental_booking
ADD COLUMN destination_8_place_id TEXT;
ALTER TABLE rental_booking
ADD COLUMN destination_9_location TEXT;
ALTER TABLE rental_booking
ADD COLUMN destination_9_place_id TEXT;
ALTER TABLE rental_booking
ADD COLUMN destination_10_location TEXT;
ALTER TABLE rental_booking
ADD COLUMN destination_10_place_id TEXT;