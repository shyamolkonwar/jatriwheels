-- Update rental_booking user_id foreign key to reference public.users
BEGIN;

-- Drop existing foreign key constraint
ALTER TABLE rental_booking 
DROP CONSTRAINT rental_booking_user_id_fkey;

-- Add new foreign key constraint referencing public.users
ALTER TABLE rental_booking 
ADD CONSTRAINT rental_booking_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE NOT NULL;

COMMIT;