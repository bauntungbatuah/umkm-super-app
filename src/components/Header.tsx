// ============================================================
// FILE: src/components/Header.tsx
// FUNGSI: Header dengan tombol Admin
// BUAT FILE BARU INI
// ============================================================

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabaseClient';

export default function Header({ storeName, storeSlug }: { 
  storeName?: string; 
  storeSlug?: string 
}) {
  const [user, setUser] = useState<any>(null);
  const [isOwner, setIsOwner] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Cek user yang login
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      // Cek apakah owner toko ini
      if (user && storeSlug) {
        const { data: store } = await supabase
          .from('stores')
          .select('user_id')
          .eq('slug', storeSlug)
          .single();
        
        if (store && store.user_id === user.id) {
          setIsOwner(true);
        }
      }
    };

    getUser();

    // Listen auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [storeSlug]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 30px',
      background: 'white',
      borderBottom: '2px solid #e5e7eb',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      {/* LOGO */}
      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>
        <Link href="/" style={{ textDecoration: 'none', color: '#2563eb' }}>
          🏪 {storeName || 'UMKM Super App'}
        </Link>
      </div>

      {/* MENU */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        
        {/* KERANJANG */}
        <Link href="/checkout" style={{ fontSize: '24px', textDecoration: 'none' }}>
          🛒
        </Link>

        <div style={{ width: '1px', height: '30px', background: '#ddd' }}></div>

        {/* AUTH BUTTONS */}
        {!user ? (
          <Link href="/admin/login" style={{
            padding: '10px 20px',
            background: '#2563eb',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            🔐 Admin Login
          </Link>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {isOwner && (
              <Link href="/admin/dashboard" style={{
                padding: '10px 20px',
                background: '#10b981',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                ⚙️ Dashboard
              </Link>
            )}
            
            <span style={{ fontSize: '14px', color: '#666' }}>
              {user.email}
            </span>
            
            <button onClick={handleLogout} style={{
              padding: '8px 16px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px'
            }}>
              Logout
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
