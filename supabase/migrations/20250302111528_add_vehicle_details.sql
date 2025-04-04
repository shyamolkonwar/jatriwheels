/*
  # Add category and name columns to vehicles table

  1. Changes
    - Add `category` column to vehicles table
    - Add `name` column to vehicles table
    - Update existing vehicle records with appropriate categories and names
*/

-- Add new columns
ALTER TABLE vehicles
ADD COLUMN category text,
ADD COLUMN name text;

-- Update existing records
UPDATE vehicles
SET 
  category = CASE 
    WHEN type = 'sedan' THEN 'Standard'
    WHEN type = 'suv' THEN 'Premium'
    WHEN type = 'luxury' THEN 'Luxury'
    ELSE 'Standard'
  END,
  name = CASE
    WHEN type = 'sedan' THEN 'Toyota Camry'
    WHEN type = 'suv' THEN 'Honda CR-V'
    WHEN type = 'luxury' THEN 'Mercedes-Benz E-Class'
    ELSE type
  END;

-- Make the columns NOT NULL after data migration
ALTER TABLE vehicles
ALTER COLUMN category SET NOT NULL,
ALTER COLUMN name SET NOT NULL;