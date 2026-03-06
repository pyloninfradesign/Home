import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.warn("Supabase admin client not initialized: missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
}

export const supabaseAdmin =
  url && serviceRoleKey
    ? createClient(url, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
        global: { headers: { "X-Client-Info": "pylon-admin" } },
      })
    : null;
