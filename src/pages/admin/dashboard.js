// ============================================================
// FILE: pages/admin/dashboard.js
// FUNGSI: Dashboard admin (HARUS LOGIN)
// COPY SELURUH CODE INI KE FILE BARU
// ============================================================

import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const user = useUser();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [store, setStore] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Proteksi: Redirect jika belum login
  useEffect(() => {
    if (!user) {
      router.push('/admin/login');
      return;
    }

    // Ambil data toko dan statistik
    async function loadData() {
      // Ambil toko user ini
      const { data: storeData } = await supabase
        .from('stores')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (storeData) {
        setStore(storeData);

        // Ambil pesanan toko ini
        const { data: ordersData } = await supabase
          .from('orders')
          .select('*')
          .eq('store_id', storeData.id)
          .order('created_at', { ascending: false });

        setOrders(ordersData || []);

        // Ambil produk toko ini
        const { data: productsData } = await supabase
          .from('products')
          .select('*')
          .eq('store_id', storeData.id);

        setProducts(productsData || []);
      }

      setLoading(false);
    }

    loadData();
  }, [user, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (!user || loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ fontSize: '24px' }}>⏳ Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      {/* HEADER DASHBOARD */}
      <header style={{
        background: 'white',
        padding: '20px 30px',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ fontSize: '24px', color: '#1f2937' }}>
            ⚙️ Dashboard Admin
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            {store?.name}
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <span style={{ color: '#6b7280', fontSize: '14px' }}>
            {user.email}
          </span>
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px' }}>
        {/* STAT CARDS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <StatCard 
            title="Total Produk" 
            value={products.length} 
            icon="📦"
            color="#3b82f6"
          />
          <StatCard 
            title="Pesanan Baru" 
            value={orders.filter(o => o.status === 'pending').length} 
            icon="🛒"
            color="#f59e0b"
          />
          <StatCard 
            title="Total Pesanan" 
            value={orders.length} 
            icon="📊"
            color="#10b981"
          />
          <StatCard 
            title="Pendapatan" 
            value={`Rp ${orders.reduce((sum, o) => sum + (o.total_amount || 0), 0).toLocaleString('id-ID')}`} 
            icon="💰"
            color="#8b5cf6"
          />
        </div>

        {/* MENU CEPAT */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '20px', color: '#1f2937' }}>
            Menu Cepat
          </h2>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <Link href={`/store/${store?.slug}`} target="_blank">
              <button style={quickButtonStyle('#3b82f6')}>
                🌐 Lihat Toko
              </button>
            </Link>
            <Link href="/admin/products">
              <button style={quickButtonStyle('#10b981')}>
                ➕ Tambah Produk
              </button>
            </Link>
            <Link href="/admin/orders">
              <button style={quickButtonStyle('#f59e0b')}>
                📋 Kelola Pesanan
              </button>
            </Link>
            <Link href="/admin/settings">
              <button style={quickButtonStyle('#6b7280')}>
                ⚙️ Pengaturan
              </button>
            </Link>
          </div>
        </div>

        {/* DAFTAR PESANAN TERBARU */}
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '20px', marginBottom: '20px', color: '#1f2937' }}>
            Pesanan Terbaru
          </h2>
          
          {orders.length === 0 ? (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '40px' }}>
              Belum ada pesanan
            </p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Pelanggan</th>
                  <th style={thStyle}>Total</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={tdStyle}>#{order.id.slice(0, 8)}</td>
                    <td style={tdStyle}>{order.guest_name}</td>
                    <td style={tdStyle}>
                      Rp {order.total_amount?.toLocaleString('id-ID')}
                    </td>
                    <td style={tdStyle}>
                      <span style={{
                        padding: '5px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        background: order.status === 'pending' ? '#fef3c7' : 
                                   order.status === 'completed' ? '#d1fae5' : '#fee2e2',
                        color: order.status === 'pending' ? '#92400e' : 
                               order.status === 'completed' ? '#065f46' : '#991b1b',
                      }}>
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      {new Date(order.created_at).toLocaleDateString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

// Component Stat Card
function StatCard({ title, value, icon, color }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '15px',
      padding: '25px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '20px'
    }}>
      <div style={{
        width: '60px',
        height: '60px',
        borderRadius: '15px',
        background: `${color}20`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '30px'
      }}>
        {icon}
      </div>
      <div>
        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '5px' }}>
          {title}
        </p>
        <p style={{ fontSize: '28px', fontWeight: 'bold', color }}>
          {value}
        </p>
      </div>
    </div>
  );
}

const quickButtonStyle = (bg) => ({
  padding: '15px 25px',
  background: bg,
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '14px',
  transition: 'transform 0.2s',
  ':hover': {
    transform: 'translateY(-2px)'
  }
});

const thStyle = {
  textAlign: 'left',
  padding: '15px',
  color: '#6b7280',
  fontSize: '12px',
  textTransform: 'uppercase',
  fontWeight: '600'
};

const tdStyle = {
  padding: '15px',
  color: '#1f2937',
  fontSize: '14px'
};
