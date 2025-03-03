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