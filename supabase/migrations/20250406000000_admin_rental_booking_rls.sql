-- Add admin access to rental_booking table
CREATE POLICY "Admins can read all rental bookings" 
ON rental_booking FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'super admin'
  )
);

-- Keep existing user policies
CREATE POLICY "Users can view their own bookings" 
ON rental_booking FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookings"
ON rental_booking FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
ON rental_booking FOR UPDATE
USING (auth.uid() = user_id);