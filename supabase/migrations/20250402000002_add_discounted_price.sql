-- Add discounted_price column to rental_booking
ALTER TABLE rental_booking
ADD COLUMN discounted_price NUMERIC(10,2);

-- Update RLS policies to include new column
CREATE POLICY "Users can view own rental bookings with discounts"
ON rental_booking
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own rental bookings with discounts"
ON rental_booking
FOR INSERT
WITH CHECK (auth.uid() = user_id);