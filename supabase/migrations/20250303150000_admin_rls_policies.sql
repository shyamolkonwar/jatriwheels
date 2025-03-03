/*
  # Create admin role and RLS policies for admin access

  1. Create admin role
  2. Add RLS policies for admin access to all tables
  3. Enable admin to view and manage all data
*/

-- Create admin role if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'admin') THEN
    CREATE ROLE admin;
  END IF;
END
$$;

-- Grant admin role to authenticated users with admin privileges
CREATE OR REPLACE FUNCTION public.handle_admin_users()
RETURNS trigger AS $$
BEGIN
  IF NEW.is_admin = true THEN
    GRANT admin TO authenticated;
  ELSE
    REVOKE admin FROM authenticated;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bookings table policies
CREATE POLICY "Admins can view all bookings"
  ON bookings
  FOR SELECT
  TO admin
  USING (true);

CREATE POLICY "Admins can insert bookings"
  ON bookings
  FOR INSERT
  TO admin
  WITH CHECK (true);

CREATE POLICY "Admins can update bookings"
  ON bookings
  FOR UPDATE
  TO admin
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete bookings"
  ON bookings
  FOR DELETE
  TO admin
  USING (true);

-- Users table policies
CREATE POLICY "Admins can view all users"
  ON users
  FOR SELECT
  TO admin
  USING (true);

CREATE POLICY "Admins can update users"
  ON users
  FOR UPDATE
  TO admin
  USING (true)
  WITH CHECK (true);

-- Vehicles table policies
CREATE POLICY "Admins can view all vehicles"
  ON vehicles
  FOR ALL
  TO admin
  USING (true);

-- Payments table policies
CREATE POLICY "Admins can view all payments"
  ON payments
  FOR SELECT
  TO admin
  USING (true);

CREATE POLICY "Admins can update payments"
  ON payments
  FOR UPDATE
  TO admin
  USING (true)
  WITH CHECK (true);

-- Add is_admin column to auth.users if it doesn't exist
ALTER TABLE auth.users 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Create trigger for handling admin role assignments
CREATE TRIGGER handle_admin_users
  AFTER UPDATE OF is_admin ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_admin_users();

-- Grant initial admin access (you'll need to replace 'your-admin-user-id' with actual admin user id)
-- UPDATE auth.users SET is_admin = true WHERE id = 'your-admin-user-id'; 