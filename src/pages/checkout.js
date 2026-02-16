// ============================================================
// FILE: pages/checkout.js
// FUNGSI: Checkout untuk PEMBELI (tanpa login)
// COPY SELURUH CODE INI DAN PASTE KE FILE BARU
// ============================================================

import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';

export default function Checkout() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    items: 'Produk A x1, Produk B x2' // Nanti ambil dari localStorage/cart
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simpan order sebagai GUEST (tanpa login)
    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          // Data pembeli (guest)
          guest_name: formData.name,
          guest_email: formData.email,
          guest_phone: formData.phone,
          guest_address: formData.address,
          
          // Data order
          store_id: 'YOUR_STORE_ID', // Ganti dengan ID toko
          items: formData.items,
          total_amount: 125000, // Nanti hitung dari cart
          status: 'pending',
          
          // user_id kosong karena guest
          user_id: null
        }
      ]);

    setLoading(false);

    if (error) {
      alert('Error: ' + error.message);
    } else {
      alert('✅ Pesanan berhasil! Cek email Anda untuk konfirmasi.');
      router.push('/order-success');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '15px',
    marginBottom: '15px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'border-color 0.3s'
  };

  return (
    <div>
      <Header storeName="Checkout" />
      
      <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '40px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ fontSize: '28px', marginBottom: '10px' }}>🛒 Checkout</h1>
          <p style={{ color: '#666', marginBottom: '30px' }}>
            Isi data pengiriman. Tidak perlu login!
          </p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nama Lengkap"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              style={inputStyle}
            />

            <input
              type="email"
              placeholder="Email Aktif"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              style={inputStyle}
            />

            <input
              type="tel"
              placeholder="No. WhatsApp"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
              style={inputStyle}
            />

            <textarea
              placeholder="Alamat Lengkap (Kecamatan, Kota, Kode Pos)"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              required
              rows="4"
              style={{...inputStyle, resize: 'vertical'}}
            />

            {/* RINGKASAN ORDER */}
            <div style={{
              background: '#f3f4f6',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <h3 style={{ marginBottom: '10px' }}>Ringkasan Pesanan:</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Total:</span>
                <span style={{ fontWeight: 'bold', fontSize: '20px' }}>
                  Rp 125.000
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '18px',
                background: loading ? '#9ca3af' : '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s'
              }}
            >
              {loading ? '⏳ Memproses...' : '✅ Pesan Sekarang'}
            </button>
          </form>

          <p style={{ 
            textAlign: 'center', 
            marginTop: '20px',
            color: '#666',
            fontSize: '14px'
          }}>
            🔒 Data Anda aman & terenkripsi
          </p>
        </div>
      </div>
    </div>
  );
}
