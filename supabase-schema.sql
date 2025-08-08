-- Create products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  sizes TEXT[] DEFAULT '{}',
  colors TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  description TEXT,
  material VARCHAR(255),
  fit VARCHAR(100),
  care_instructions TEXT,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name VARCHAR(255),
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  shipping_address JSONB NOT NULL,
  payment_method VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders ON DELETE CASCADE,
  product_id UUID REFERENCES products ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  size VARCHAR(10),
  color VARCHAR(50),
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cart table
CREATE TABLE cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  product_id UUID REFERENCES products ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  size VARCHAR(10),
  color VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id, size, color)
);

-- Insert sample products
INSERT INTO products (name, brand, category, price, sizes, colors, images, description, material, fit) VALUES
('Urban Edge Tee', 'Urban Threads', 'Men', 120.00, ARRAY['S', 'M', 'L', 'XL'], ARRAY['Black', 'White', 'Gray'], ARRAY['/images/tee1.jpg'], 'Elevate your streetwear game with the Urban Edge Tee. Crafted from premium cotton, this tee features a bold graphic print and a relaxed fit for ultimate comfort and style.', '100% Cotton', 'Relaxed Fit'),
('Streetwear Joggers', 'Street Style Co.', 'Women', 150.00, ARRAY['S', 'M', 'L'], ARRAY['White', 'Black'], ARRAY['/images/joggers1.jpg'], 'Premium joggers for the modern street style enthusiast.', 'Cotton blend', 'Regular Fit'),
('City Gear Hoodie', 'City Gear', 'Unisex', 180.00, ARRAY['S', 'M', 'L', 'XL'], ARRAY['Light Blue', 'Navy', 'Black'], ARRAY['/images/hoodie1.jpg'], 'Unisex hoodie perfect for any urban adventure.', 'Cotton/Polyester blend', 'Regular Fit'),
('Metro Wear Sneakers', 'Metro Wear', 'Men', 250.00, ARRAY['39', '40', '41', '42', '43'], ARRAY['Brown', 'Black', 'White'], ARRAY['/images/sneakers1.jpg'], 'High-quality sneakers designed for urban lifestyle.', 'Leather/Synthetic', 'True to size'),
('Urban Edge Crop Top', 'Urban Edge', 'Women', 90.00, ARRAY['XS', 'S', 'M', 'L'], ARRAY['Tan', 'Black', 'White'], ARRAY['/images/croptop1.jpg'], 'Minimalist crop top for the fashion-forward individual.', '95% Cotton, 5% Spandex', 'Fitted');

-- Create RLS policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Products are publicly readable
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can read their own orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own orders
CREATE POLICY "Users can create own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can view their own cart items
CREATE POLICY "Users can view own cart" ON cart_items
  FOR SELECT USING (auth.uid() = user_id);

-- Users can manage their own cart items
CREATE POLICY "Users can manage own cart" ON cart_items
  FOR ALL USING (auth.uid() = user_id);