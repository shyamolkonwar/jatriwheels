/*
  # Create rental_payments table

  1. New Tables
    - `rental_payments`
      - `id` (uuid, primary key)
      - `booking_id` (uuid, foreign key to rental_booking)
      - `user_id` (uuid, foreign key to users)
      - `amount` (decimal)
      - `payment_method` (text)
      - `status` (text)
      - `transaction_id` (text)
      - `created_at` (timestamptz)
  2. Security
    - Enable RLS on `rental_payments` table
    - Add policy for authenticated users to read their own payments
    - Add policy for authenticated users to insert their own payments
*/

CREATE TABLE IF NOT EXISTS rental_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES rental_booking(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  amount decimal NOT NULL,
  payment_method text NOT NULL,
  status text NOT NULL DEFAULT 'PENDING',
  transaction_id text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE rental_payments ENABLE ROW LEVEL SECURITY;

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