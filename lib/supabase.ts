import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Key must be defined in environment variables');
}

interface AdminSession {
  id: string;
  email: string;
  role: string;
}

let currentAdminSession: AdminSession | null = null;

// Create Supabase client with dynamic headers
const createSupabaseClient = (adminEmail?: string) => {
  return createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Accept: 'application/json',
        'admin-email': adminEmail || '',
      },
    },
  });
};

// Initialize with no admin email
export let supabase = createSupabaseClient();

export const loginAdmin = async (email: string, password: string) => {
  try {
    // Create a temporary client without admin headers for login
    const tempClient = createSupabaseClient();
    const { data, error } = await tempClient
      .from('admins')
      .select('id, email, role')
      .eq('email', email)
      .eq('password_hash', password) // Note: In a real app, you should hash the password before comparing
      .single();

    if (error) throw error;
    if (!data) return false;

    // Store admin session
    currentAdminSession = data;
    // Store in localStorage for persistence
    localStorage.setItem('adminSession', JSON.stringify(data));

    // Update the global supabase client with admin email
    supabase = createSupabaseClient(data.email);

    return true;
  } catch (error) {
    console.error('Error logging in:', error);
    return false;
  }
};

export const logoutAdmin = () => {
  currentAdminSession = null;
  localStorage.removeItem('adminSession');
  // Reset the supabase client without admin headers
  supabase = createSupabaseClient();
};

// Helper function to check if the current user is an admin
export const isAdmin = async () => {
  try {
    // First check memory
    if (currentAdminSession) {
      return true;
    }

    // Then check localStorage
    const storedSession = localStorage.getItem('adminSession');
    if (storedSession) {
      const sessionData = JSON.parse(storedSession) as AdminSession;
      currentAdminSession = sessionData;
      // Update the supabase client with admin email
      supabase = createSupabaseClient(sessionData.email);
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

export const getCurrentAdmin = (): AdminSession | null => {
  if (currentAdminSession) {
    return currentAdminSession;
  }

  const storedSession = localStorage.getItem('adminSession');
  if (storedSession) {
    const sessionData = JSON.parse(storedSession) as AdminSession;
    currentAdminSession = sessionData;
    // Update the supabase client with admin email
    supabase = createSupabaseClient(sessionData.email);
    return currentAdminSession;
  }

  return null;
};