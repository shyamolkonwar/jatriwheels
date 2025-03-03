/*
  # Create bookings table

  1. New Tables
    - `bookings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `vehicle_type_id` (uuid, foreign key to vehicles)
      - `pickup_location` (jsonb)
      - `drop_location` (jsonb)
      - `scheduled_date` (date)
      - `scheduled_time` (time)
      - `trip_type` (text)
      - `estimated_distance` (decimal)
      - `base_fare` (decimal)
      - `total_fare` (decimal)
      - `status` (text)
      - `payment_status` (text)
      - `cancellation_reason` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  2. Security
    - Enable RLS on `bookings` table
    - Add policy for authenticated users to read their own bookings
    - Add policy for authenticated users to insert their own bookings
    - Add policy for authenticated users to update their own bookings
*/

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  vehicle_type_id uuid REFERENCES vehicles(id) NOT NULL,
  pickup_location jsonb NOT NULL,
  drop_location jsonb NOT NULL,
  scheduled_date date NOT NULL,
  scheduled_time time NOT NULL,
  trip_type text NOT NULL,
  estimated_distance decimal NOT NULL,
  base_fare decimal NOT NULL,
  total_fare decimal NOT NULL,
  status text NOT NULL DEFAULT 'PENDING',
  payment_status text DEFAULT 'PENDING',
  cancellation_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);