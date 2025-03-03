-- Add support_code column to bookings table
ALTER TABLE bookings ADD COLUMN support_code VARCHAR(6);

-- Create a function to generate random 6-digit number
CREATE OR REPLACE FUNCTION generate_support_code()
RETURNS TRIGGER AS $$
BEGIN
    -- Generate a random 6-digit number
    NEW.support_code = LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically generate support_code for new bookings
CREATE TRIGGER set_support_code
    BEFORE INSERT ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION generate_support_code();

-- Generate support codes for existing bookings
UPDATE bookings 
SET support_code = LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0')
WHERE support_code IS NULL; 