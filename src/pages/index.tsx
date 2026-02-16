// ============================================================
// FILE: pages/index.js
// FUNGSI: Halaman welcome + daftar toko
// GANTI SELURUH CODE DI FILE INI
// ============================================================

import Link from 'next/link';
import { supabase } from '../lib/supabase';

export default function Home({ stores }) {
  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      {/* HERO SECTION */}
      <div style={{
        background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
        color: 'white',
        padding: '80px 20px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>
          🚀 UMKM Super App
        </h1>
        <p style={{ fontSize: '20px', marginBottom: '30px' }}>
          Platform e-commerce untuk UMKM Indonesia
        </p>
        <Link 
          href="/admin/login"
          style={{
            display: 'inline-block',
            padding: '15px 30px',
            background: 'white',
            color: '#2563eb',
            textDecoration: 'none',
            borderRadius: '10px',
            fontWeight: 'bold',
            fontSize: '18px'
          }}
        >
          Mulai Jualan →
        </Link>
      </div>

      {/* DAFTAR TOKO */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <h2 style={{ fontSize: '32px', marginBottom: '30px', textAlign: 'center' }}>
          🏪 Jelajahi Toko
        </h2>
        
        {stores.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666' }}>
            Belum ada toko terdaftar
          </p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '30px'
          }}>
            {stores.map((store) => (
              <Link 
                key={store.id} 
                href={`/store/${store.slug}`}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  background: 'white',
                  borderRadius: '15px',
                  padding: '30px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s',
                  cursor: 'pointer'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '15px' }}>🏪</div>
                  <h3 style={{ fontSize: '24px', color: '#1f2937', marginBottom: '10px' }}>
                    {store.name}
                  </h3>
                  <p style={{ color: '#6b7280' }}>
                    Kunjungi toko →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Ambil data toko dari database
export async function getServerSideProps() {
  const { data: stores } = await supabase
    .from('stores')
    .select('*')
    .order('created_at', { ascending: false });

  return {
    props: { stores: stores || [] }
  };
}
