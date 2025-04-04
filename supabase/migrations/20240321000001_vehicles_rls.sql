-- Add RLS policies for vehicles table

-- Allow public read access to active vehicles
CREATE POLICY "Anyone can read active vehicles"
  ON vehicles
  FOR SELECT
  TO public
  USING (is_active = true);

-- Allow authenticated users to read all vehicles
CREATE POLICY "Authenticated users can read all vehicles"
  ON vehicles
  FOR SELECT
  TO authenticated
  USING (true);

-- Only allow administrators to modify vehicle data
CREATE POLICY "Only administrators can modify vehicles"
  ON vehicles
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');