-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable admin read access for rental_booking" ON rental_booking;
DROP POLICY IF EXISTS "Enable admin insert access for rental_booking" ON rental_booking;
DROP POLICY IF EXISTS "Enable admin update access for rental_booking" ON rental_booking;
DROP POLICY IF EXISTS "Enable admin read access for rental_payments" ON rental_payments;

-- Disable RLS temporarily
ALTER TABLE rental_booking DISABLE ROW LEVEL SECURITY;
ALTER TABLE rental_payments DISABLE ROW LEVEL SECURITY;

-- Enable RLS again
ALTER TABLE rental_booking ENABLE ROW LEVEL SECURITY;
ALTER TABLE rental_payments ENABLE ROW LEVEL SECURITY;

-- Create simple public policies
CREATE POLICY "Allow public read access to rental_booking"
  ON rental_booking
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Allow public write access to rental_booking"
  ON rental_booking
  FOR ALL
  TO PUBLIC
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read access to rental_payments"
  ON rental_payments
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Allow public write access to rental_payments"
  ON rental_payments
  FOR ALL
  TO PUBLIC
  USING (true)
  WITH CHECK (true);