// ============================================================
// FILE: pages/admin/login.js
// FUNGSI: Halaman login khusus ADMIN/PEMILIK TOKO
// BUAT FOLDER: pages/admin/
// COPY SELURUH CODE INI KE FILE BARU
// ============================================================

import { useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const supabase = useSupabaseClient();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Login dengan Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError('Email atau password salah!');
      setLoading(false);
      return;
    }

    // 2. Cek apakah user punya toko
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .select('*')
      .eq('user_id', authData.user.id)
      .single();

    if (storeError || !store) {
      setError('Anda belum memiliki toko. Silakan daftar terlebih dahulu.');
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    // 3. Sukses! Redirect ke dashboard
    setLoading(false);
    router.push('/admin/dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        padding: '50px',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        width: '100%',
        maxWidth: '450px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>🔐</div>
          <h1 style={{ fontSize: '28px', marginBottom: '10px', color: '#1f2937' }}>
            Login Admin
          </h1>
          <p style={{ color: '#6b7280' }}>
            Khusus pemilik toko
          </p>
        </div>

        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#dc2626',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151'
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@toko.com"
              required
              style={{
                width: '100%',
                padding: '15px',
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '16px',
                transition: 'border-color 0.3s'
              }}
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151'
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '15px',
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '16px',
                transition: 'border-color 0.3s'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              background: loading ? '#9ca3af' : '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              marginBottom: '20px'
            }}
          >
            {loading ? '⏳ Masuk...' : 'Masuk ke Dashboard'}
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#6b7280', marginBottom: '15px' }}>
            Belum punya toko?
          </p>
          <Link 
            href="/admin/register"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: '#f3f4f6',
              color: '#2563eb',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              transition: 'background 0.3s'
            }}
          >
            Daftar Toko Baru
          </Link>
        </div>

        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <Link 
            href="/"
            style={{ color: '#6b7280', textDecoration: 'none', fontSize: '14px' }}
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
