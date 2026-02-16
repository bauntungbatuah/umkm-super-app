-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE user_role AS ENUM ('super_admin', 'store_owner', 'store_admin', 'customer');
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'shipped', 'completed', 'cancelled');

-- Super Admin
CREATE TABLE super_admin_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    UNIQUE(user_id), UNIQUE(email)
);

-- Stores
CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    phone TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Store Users
CREATE TABLE store_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    role user_role DEFAULT 'store_admin',
    UNIQUE(user_id, store_id)
);

-- Store Themes
CREATE TABLE store_themes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    primary_color VARCHAR(7) DEFAULT '#2563eb',
    hero_title TEXT,
    hero_subtitle TEXT,
    UNIQUE(store_id)
);

-- Products
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    stock INTEGER DEFAULT 0,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true
);

-- Orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    grand_total DECIMAL(12, 2) DEFAULT 0,
    status order_status DEFAULT 'pending',
    payment_method VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order Items
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    quantity INTEGER NOT NULL
);

-- Order Device Info
CREATE TABLE order_device_info (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    device_type VARCHAR(50),
    device_brand VARCHAR(100),
    os VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    device_fingerprint VARCHAR(64)
);

-- OTP Codes
CREATE TABLE otp_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone TEXT NOT NULL,
    code TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Functions
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (SELECT 1 FROM super_admin_profiles WHERE user_id = auth.uid() AND is_active = true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public view stores" ON stores FOR SELECT USING (is_active = true);
CREATE POLICY "Public view products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Store admin orders" ON orders FOR ALL USING (EXISTS (SELECT 1 FROM store_users WHERE store_id = orders.store_id AND user_id = auth.uid()));
CREATE POLICY "Super admin all" ON orders FOR ALL USING (is_super_admin());

-- Seed
INSERT INTO stores (name, slug, phone) VALUES ('Toko Contoh', 'toko-contoh', '08123456789');
INSERT INTO store_themes (store_id) SELECT id FROM stores WHERE slug = 'toko-contoh';
INSERT INTO products (store_id, name, price, stock) VALUES 
    ((SELECT id FROM stores WHERE slug = 'toko-contoh'), 'Produk A', 50000, 10),
    ((SELECT id FROM stores WHERE slug = 'toko-contoh'), 'Produk B', 75000, 5);