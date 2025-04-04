-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert their own support queries" ON support_queries;
DROP POLICY IF EXISTS "Users can view their own support queries" ON support_queries;
DROP POLICY IF EXISTS "Users can update their own support queries" ON support_queries;

-- Enable RLS
ALTER TABLE support_queries ENABLE ROW LEVEL SECURITY;

-- Policy for inserting support queries - more permissive
CREATE POLICY "Users can insert their own support queries"
ON support_queries
FOR INSERT
TO authenticated
WITH CHECK (
    true  -- Allow all authenticated users to insert
);

-- Policy for viewing own support queries
CREATE POLICY "Users can view their own support queries"
ON support_queries
FOR SELECT
TO authenticated
USING (
    auth.uid() = user_id
);

-- Policy for updating own support queries
CREATE POLICY "Users can update their own support queries"
ON support_queries
FOR UPDATE
TO authenticated
USING (
    auth.uid() = user_id
)
WITH CHECK (
    auth.uid() = user_id
); 