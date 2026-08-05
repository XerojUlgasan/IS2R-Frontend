import { createClient } from "@supabase/supabase-js";

// CRA exposes only REACT_APP_* env vars to the browser (see .env).
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Surface a clear message during development if the env vars are missing.
  // eslint-disable-next-line no-console
  console.error(
    "Missing Supabase env vars. Ensure REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY are set in .env, then restart the dev server."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
