/*
  # Create admins table

  1. New Tables
    - `admins`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `email` (text, unique, not null)
      - `password_hash` (text, not null)
      - `role` (text, not null)
      - `last_login` (timestamptz)
      - `login_attempts` (integer, default 0)
      - `account_locked` (boolean, default false)
      - `created_at` (timestamptz, default now())
      - `created_by` (uuid, references admins.id)
  2. Security
    - Enable RLS on `admins` table
    - Add policy for authenticated admins to read their own data
    - Add policy for super admins to read all admin data
*/

CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role text NOT NULL,
  last_login timestamptz,
  login_attempts integer DEFAULT 0,
  account_locked boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES admins(id)
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Policy for public access to check login credentials
CREATE POLICY "Allow public to check login credentials"
  ON admins
  FOR SELECT
  TO PUBLIC
  USING (true);

-- Policy for public access to update login attempts and last login
CREATE POLICY "Allow public to update login attempts"
  ON admins
  FOR UPDATE
  TO PUBLIC
  USING (true)
  WITH CHECK (
    -- Only allow updating login_attempts and last_login columns
    (
      (OLD.* IS NOT DISTINCT FROM NEW.* OR NEW.last_login IS NOT NULL)
      OR
      (OLD.* IS NOT DISTINCT FROM NEW.* OR NEW.login_attempts IS NOT NULL)
    )
    AND
    NEW.password_hash = OLD.password_hash
    AND NEW.email = OLD.email
    AND NEW.name = OLD.name
    AND NEW.role = OLD.role
    AND NEW.account_locked = OLD.account_locked
    AND NEW.created_at = OLD.created_at
    AND NEW.created_by IS NOT DISTINCT FROM OLD.created_by
  );

-- Policy for admins to read their own data
CREATE POLICY "Admins can read own data"
  ON admins
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy for super admins to read all admin data
CREATE POLICY "Super admins can read all admin data"
  ON admins
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE id = auth.uid() AND role = 'Super Admin'
    )
  );

-- Policy for super admins to insert new admins
CREATE POLICY "Super admins can insert new admins"
  ON admins
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE id = auth.uid() AND role = 'Super Admin'
    )
  );

-- Policy for super admins to update admin data
CREATE POLICY "Super admins can update admin data"
  ON admins
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE id = auth.uid() AND role = 'Super Admin'
    )
  );

-- Insert initial super admin (password would be hashed in a real application)
INSERT INTO admins (name, email, password_hash, role)
VALUES ('Admin User', 'admin@example.com', '$2a$10$X9xIFu1d5KlYDIj7.B.Qu.rLJOZP3QAh9Jl5wYLKx8fGYpzMxKlTi', 'Super Admin')
ON CONFLICT (email) DO NOTHING;