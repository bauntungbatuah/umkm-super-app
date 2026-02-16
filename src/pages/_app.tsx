// ============================================================
// FILE: pages/_app.js
// FUNGSI: Wrapper utama aplikasi dengan Supabase Auth
// GANTI SELURUH CODE DI FILE INI
// ============================================================

import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { useState } from 'react';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  // Buat client Supabase
  const [supabaseClient] = useState(() => createPagesBrowserClient());

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      <Component {...pageProps} />
    </SessionContextProvider>
  );
}
