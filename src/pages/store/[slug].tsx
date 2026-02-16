import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { supabase } from '../../lib/supabaseClient';
import { ShoppingCart, Plus, Minus, Search } from 'lucide-react';

export default function StorePublic() {
  const router = useRouter();
  const { slug } = router.query;
  const [store, setStore] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [showCart, setShowCart] = useState(false);

  useEffect(() => { if (slug) fetchData(); }, [slug]);

  const fetchData = async () => {
    const { data: storeData } = await supabase.from('stores').select('*, theme:store_themes(*)').eq('slug', slug).single();
    if (!storeData) { router.push('/404'); return; }
    setStore(storeData);
    const { data: productsData } = await supabase.from('products').select('*').eq('store_id', storeData.id).eq('is_active', true);
    setProducts(productsData || []);
  };

  const addToCart = (product: any) => {
    const newCart = { ...cart, [product.id]: (cart[product.id] || 0) + 1 };
    setCart(newCart);
    localStorage.setItem(`cart_${store.id}`, JSON.stringify(Object.entries(newCart).map(([id, qty]) => ({ ...products.find((p: any) => p.id === id), quantity: qty }))));
  };

  const cartItems = Object.entries(cart).map(([id, qty]) => ({ ...products.find((p: any) => p.id === id), quantity: qty })).filter(i => i.id);
  const cartTotal = cartItems.reduce((sum, i: any) => sum + (i.price * i.quantity), 0);

  if (!store) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>;

  return (
    <>
      <Head><title>{store.name}</title></Head>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm sticky top-0 z-20">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-blue-600">{store.name}</h1>
            <button onClick={() => setShowCart(true)} className="relative p-2">
              <ShoppingCart className="w-6 h-6" />
              {Object.keys(cart).length > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">{Object.values(cart).reduce((a: any, b: any) => a + b, 0)}</span>}
            </button>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="aspect-square bg-gray-200">{product.image_url && <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />}</div>
                <div className="p-4">
                  <h3 className="font-medium text-sm">{product.name}</h3>
                  <p className="font-bold text-blue-600">Rp {product.price.toLocaleString()}</p>
                  {cart[product.id] ? (
                    <div className="flex items-center justify-center gap-2 mt-2 bg-gray-100 rounded-lg p-1">
                      <button onClick={() => setCart({ ...cart, [product.id]: Math.max(0, cart[product.id] - 1) })} className="w-8 h-8 bg-white rounded flex items-center justify-center">-</button>
                      <span>{cart[product.id]}</span>
                      <button onClick={() => addToCart(product)} className="w-8 h-8 bg-white rounded flex items-center justify-center">+</button>
                    </div>
                  ) : (
                    <button onClick={() => addToCart(product)} disabled={product.stock === 0} className="w-full mt-2 py-2 bg-green-500 text-white rounded-lg text-sm disabled:bg-gray-300">{product.stock === 0 ? 'Habis' : 'Tambah'}</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {showCart && (
          <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
            <div className="bg-white w-full max-w-md h-full p-4 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Keranjang</h2>
                <button onClick={() => setShowCart(false)}>✕</button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {cartItems.map((item: any) => (
                  <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg mb-2">
                    <div className="w-16 h-16 bg-gray-200 rounded">{item.image_url && <img src={item.image_url} className="w-full h-full object-cover rounded" />}</div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-sm">Rp {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              {cartItems.length > 0 && (
                <div className="border-t pt-4">
                  <div className="flex justify-between mb-4"><span className="font-medium">Total</span><span className="font-bold text-xl">Rp {cartTotal.toLocaleString()}</span></div>
                  <button onClick={() => router.push(`/checkout/wa?store_id=${store.id}`)} className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium">Checkout via WhatsApp</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}