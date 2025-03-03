/*
  # Create vehicles table

  1. New Tables
    - `vehicles`
      - `id` (uuid, primary key)
      - `type` (text)
      - `base_fare` (decimal)
      - `per_km_rate` (decimal)
      - `capacity` (integer)
      - `image_url` (text)
      - `is_active` (boolean)
  2. Security
    - Enable RLS on `vehicles` table
    - Add policy for anyone to read vehicles data
*/

CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  base_fare decimal NOT NULL,
  per_km_rate decimal NOT NULL,
  capacity integer NOT NULL,
  image_url text,
  is_active boolean DEFAULT true
);

ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read vehicles data"
  ON vehicles
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Insert default vehicle types
INSERT INTO vehicles (type, base_fare, per_km_rate, capacity, image_url, is_active)
VALUES
  ('sedan', 5.00, 1.20, 4, 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop', true),
  ('suv', 7.00, 1.50, 6, 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop', true),
  ('luxury', 10.00, 2.00, 4, 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop', true);