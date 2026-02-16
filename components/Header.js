// ============================================================
// FILE: components/Header.js
// FUNGSI: Header dengan tombol Admin Login & Dashboard
// COPY SELURUH CODE INI DAN PASTE KE FILE BARU
// ============================================================

import Link from 'next/link';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Header({ storeName, storeSlug }) {
  const user = useUser();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [isOwner, setIsOwner] = useState(false);

  // Cek apakah user ini pemilik toko
  useEffect(() => {
    async function checkOwner() {
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
    }
    checkOwner();
  }, [user, storeSlug]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
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
      {/* LOGO / NAMA TOKO */}
      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>
        <Link href="/" style={{ textDecoration: 'none', color: '#2563eb' }}>
          🏪 {storeName || 'UMKM Super App'}
        </Link>
      </div>

      {/* MENU KANAN */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        
        {/* TOMBOL KERANJANG - UNTUK PEMBELI */}
        <Link 
          href="/checkout" 
          style={{
            fontSize: '24px',
            textDecoration: 'none',
            position: 'relative'
          }}
        >
          🛒
          <span style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            background: '#ef4444',
            color: 'white',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            0
          </span>
        </Link>

        {/* DIVIDER */}
        <div style={{ width: '1px', height: '30px', background: '#ddd' }}></div>

        {/* JIKA BELUM LOGIN → TOMBOL ADMIN LOGIN */}
        {!user ? (
          <Link 
            href="/admin/login"
            style={{
              padding: '10px 20px',
              background: '#2563eb',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.3s'
            }}
          >
            🔐 Admin Login
          </Link>
        ) : (
          /* JIKA SUDAH LOGIN → MENU ADMIN */
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {isOwner && (
              <Link 
                href="/admin/dashboard"
                style={{
                  padding: '10px 20px',
                  background: '#10b981',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                ⚙️ Dashboard
              </Link>
            )}
            
            <div style={{ fontSize: '14px', color: '#666' }}>
              {user.email}
            </div>
            
            <button 
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              Logout
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
