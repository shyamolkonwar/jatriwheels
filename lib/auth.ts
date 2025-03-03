import bcrypt from 'bcryptjs';
import { supabase } from './supabase';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  // Convert $2y$ prefix to $2a$ prefix for bcryptjs compatibility
  const normalizedHash = hashedPassword.replace('$2y$', '$2a$');
  return await bcrypt.compare(password, normalizedHash);
}

export async function loginAdmin(email: string, password: string): Promise<boolean> {
  try {
    // Query the admin with the provided email
    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !admin) {
      console.error('Error fetching admin:', error);
      return false;
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, admin.password_hash);
    if (!isPasswordValid) {
      return false;
    }

    // Update last login and reset login attempts
    await supabase
      .from('admins')
      .update({
        last_login: new Date().toISOString(),
        login_attempts: 0
      })
      .eq('id', admin.id);

    // Store admin session
    localStorage.setItem('adminSession', JSON.stringify({
      id: admin.id,
      email: admin.email,
      role: admin.role
    }));

    return true;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
}