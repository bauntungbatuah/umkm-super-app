// ============================================================
// FILE: src/lib/supabaseAdmin.ts
// FUNGSI: Admin Supabase untuk server-side (bypass RLS)
// GANTI SELURUH CODE DI FILE INI
// ============================================================

import { createClient } from '@supabase/supabase-js';

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Service role key (jangan expose ke client!)
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
