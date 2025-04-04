-- Create rental_base_fee table
CREATE TABLE rental_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hourly_rate NUMERIC(10,2) NOT NULL,
  per_km_rate NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE rental_pricing ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable read access for all users"
ON rental_pricing FOR SELECT
USING (true);