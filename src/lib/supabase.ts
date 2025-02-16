import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJybmF5YWd6cWJ4bndwZ3h0amp5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODYwOTkyMSwiZXhwIjoyMDU0MTg1OTIxfQ.DM9J0yAzqXwUA0_G8pJw1to6oaMS6_DWD1OGl6dmpT0";

export const supabase = createClient<Database>(supabaseUrl, supabaseServiceRoleKey);