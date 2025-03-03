/*
  # Create saved locations table

  1. New Tables
    - `saved_locations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `name` (text)
      - `address` (text)
      - `latitude` (float)
      - `longitude` (float)
      - `is_favorite` (boolean)
      - `created_at` (timestamptz)
  2. Security
    - Enable RLS on `saved_locations` table
    - Add policy for authenticated users to read their own saved locations
    - Add policy for authenticated users to insert their own saved locations
    - Add policy for authenticated users to update their own saved locations
    - Add policy for authenticated users to delete their own saved locations
*/

CREATE TABLE IF NOT EXISTS saved_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  address text NOT NULL,
  latitude float NOT NULL,
  longitude float NOT NULL,
  is_favorite boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE saved_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own saved locations"
  ON saved_locations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved locations"
  ON saved_locations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own saved locations"
  ON saved_locations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved locations"
  ON saved_locations
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);