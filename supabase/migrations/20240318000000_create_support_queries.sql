-- Create support_queries table
CREATE TABLE IF NOT EXISTS support_queries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    booking_code TEXT NOT NULL,
    query TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING',
    user_phone TEXT NOT NULL,
    response TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    resolved_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT status_check CHECK (status IN ('PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'))
);

-- Add RLS policies
ALTER TABLE support_queries ENABLE ROW LEVEL SECURITY;

-- Users can view their own queries
CREATE POLICY "Users can view their own queries"
    ON support_queries FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own queries
CREATE POLICY "Users can insert their own queries"
    ON support_queries FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_support_queries_updated_at
    BEFORE UPDATE ON support_queries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 