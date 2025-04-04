-- Add discount rate columns to rental_pricing table
ALTER TABLE rental_pricing
ADD COLUMN discount_rate_under_6_hours numeric,
ADD COLUMN discount_rate_over_6_hours numeric;

-- Set default discount rates
UPDATE rental_pricing
SET 
  discount_rate_under_6_hours = 0.10, -- 10% discount
  discount_rate_over_6_hours = 0.05;   -- 5% discount