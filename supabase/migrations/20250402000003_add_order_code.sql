-- Add order_code column to rental_booking table
ALTER TABLE rental_booking
ADD COLUMN order_code VARCHAR(6) NOT NULL DEFAULT (
  LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0')
);

-- Create index for faster lookups
CREATE INDEX idx_rental_booking_order_code ON rental_booking(order_code);