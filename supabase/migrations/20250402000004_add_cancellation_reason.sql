-- Add cancellation_reason column to rental_booking table
ALTER TABLE rental_booking
ADD COLUMN cancellation_reason TEXT;

-- Update RLS policy to allow updating cancellation_reason
CREATE POLICY "Users can update cancellation status and reason" 
ON rental_booking FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id AND
  (status = 'cancelled' AND cancellation_reason IS NOT NULL)
);