/*
  # Update RLS policies for admin access
  
  1. Drop existing policies
  2. Create simple public policies for admin access
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can view all bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can insert bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can update bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can delete bookings" ON bookings;
DROP POLICY IF EXISTS "Super Admin can view all bookings" ON bookings;
DROP POLICY IF EXISTS "Super Admin can insert bookings" ON bookings;
DROP POLICY IF EXISTS "Super Admin can update bookings" ON bookings;
DROP POLICY IF EXISTS "Super Admin can delete bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can update users" ON users;
DROP POLICY IF EXISTS "Super Admin can view all users" ON users;
DROP POLICY IF EXISTS "Super Admin can update users" ON users;
DROP POLICY IF EXISTS "Admins can view all vehicles" ON vehicles;
DROP POLICY IF EXISTS "Super Admin can manage vehicles" ON vehicles;
DROP POLICY IF EXISTS "Admins can view all payments" ON payments;
DROP POLICY IF EXISTS "Admins can update payments" ON payments;
DROP POLICY IF EXISTS "Super Admin can view all payments" ON payments;
DROP POLICY IF EXISTS "Super Admin can update payments" ON payments;

-- Disable RLS temporarily
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles DISABLE ROW LEVEL SECURITY;
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;

-- Enable RLS again
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create simple public policies
CREATE POLICY "Allow public read access to bookings"
  ON bookings
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Allow public read access to users"
  ON users
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Allow public read access to vehicles"
  ON vehicles
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Allow public read access to payments"
  ON payments
  FOR SELECT
  TO PUBLIC
  USING (true);

-- Allow all write operations for public (we'll control this at the application level)
CREATE POLICY "Allow public write access to bookings"
  ON bookings
  FOR ALL
  TO PUBLIC
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public write access to users"
  ON users
  FOR ALL
  TO PUBLIC
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public write access to vehicles"
  ON vehicles
  FOR ALL
  TO PUBLIC
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public write access to payments"
  ON payments
  FOR ALL
  TO PUBLIC
  USING (true)
  WITH CHECK (true); 