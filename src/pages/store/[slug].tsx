// ============================================================
// FILE: pages/store/[slug].js
// FUNGSI: Halaman toko publik untuk pembeli
// GANTI SELURUH CODE DI FILE INI
// ============================================================

import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import Header from '../../components/Header';

export default function StorePage({ store, products }) {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
    alert(`✅ ${product.name} ditambahkan ke keranjang!`);
  };

  if (!store) {
    return <div>Toko tidak ditemukan</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      <Header storeName={store.name} storeSlug={store.slug} />

      {/* BANNER TOKO */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '60px 20px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '42px', marginBottom: '10px' }}>{store.name}</h1>
        <p style={{ fontSize: '18px', opacity: '0.9' }}>
          Selamat datang di toko kami 🛍️
        </p>
      </div>

      {/* PRODUK */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '30px' }}>📦 Produk Kami</h2>
        
        {products.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666' }}>
            Belum ada produk
          </p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '30px'
          }}>
            {products.map((product) => (
              <div key={product.id} style={{
                background: 'white',
                borderRadius: '15px',
                overflow: 'hidden',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s'
              }}>
                {/* GAMBAR PRODUK */}
                <div style={{
                  height: '250px',
                  background: '#e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '80px'
                }}>
                  📷
                </div>

                {/* INFO PRODUK */}
                <div style={{ padding: '20px' }}>
                  <h3 style={{ 
                    fontSize: '20px', 
                    marginBottom: '10px',
                    color: '#1f2937'
                  }}>
                    {product.name}
                  </h3>
                  
                  <p style={{ 
                    fontSize: '24px', 
                    fontWeight: 'bold',
                    color: '#2563eb',
                    marginBottom: '15px'
                  }}>
                    Rp {product.price?.toLocaleString('id-ID')}
                  </p>

                  <button
                    onClick={() => addToCart(product)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'background 0.3s'
                    }}
                  >
                    🛒 Tambah ke Keranjang
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FLOATING CART BUTTON */}
      {cart.length > 0 && (
        <a
          href="/checkout"
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            background: '#ef4444',
            color: 'white',
            padding: '20px 30px',
            borderRadius: '50px',
            textDecoration: 'none',
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          🛒 {cart.length} Item → Checkout
        </a>
      )}
    </div>
  );
}

// Ambil data toko dan produk
export async function getServerSideProps({ params }) {
  const { slug } = params;

  // Ambil toko
  const { data: store } = await supabase
    .from('stores')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!store) {
    return { notFound: true };
  }

  // Ambil produk toko ini
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('store_id', store.id);

  return {
    props: {
      store,
      products: products || []
    }
  };
}
