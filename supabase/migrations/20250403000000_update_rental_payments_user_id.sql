-- Update rental_payments table to use auth.users.id directly

-- Remove foreign key constraint to public.users
ALTER TABLE rental_payments 
DROP CONSTRAINT rental_payments_user_id_fkey;

-- Update RLS policies to use auth.uid() directly
DROP POLICY "Users can read own rental payments" ON rental_payments;
DROP POLICY "Users can insert own rental payments" ON rental_payments;

CREATE POLICY "Users can read own rental payments"
  ON rental_payments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own rental payments"
  ON rental_payments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);