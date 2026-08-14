import { supabase } from "../lib/supabaseClient";

// Fetches the current authenticated user's metadata (full_name, email, etc.).
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
}

// Updates the user's full_name in Supabase user_metadata.
export async function updateFullName(fullName) {
  const { data, error } = await supabase.auth.updateUser({
    data: { full_name: fullName },
  });
  if (error) throw error;
  return data.user;
}

// Updates the user's password via Supabase.
export async function updatePassword(newPassword) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  if (error) throw error;
  return data.user;
}
