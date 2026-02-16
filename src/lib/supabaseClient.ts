// ============================================================
// FILE: src/lib/supabaseClient.ts
// FUNGSI: Client Supabase untuk browser (frontend)
// GANTI SELURUH CODE DI FILE INI
// ============================================================

import { createBrowserClient } from '@supabase/ssr';

// Untuk Next.js 13+ dengan App Router
export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

// Export singleton untuk pages router
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export const supabase = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
