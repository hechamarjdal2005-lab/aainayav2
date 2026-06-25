-- CERTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS certifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PACKS TABLE
CREATE TABLE IF NOT EXISTS packs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  original_price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PACK ITEMS (which products are in each pack)
CREATE TABLE IF NOT EXISTS pack_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pack_id UUID REFERENCES packs(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  UNIQUE(pack_id, product_id)
);

-- RLS
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pack_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read certifications" ON certifications FOR SELECT USING (is_active = true);
CREATE POLICY "Public read packs" ON packs FOR SELECT USING (is_active = true);
CREATE POLICY "Public read pack_items" ON pack_items FOR SELECT USING (true);
CREATE POLICY "Admin certifications" ON certifications FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin packs" ON packs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin pack_items" ON pack_items FOR ALL USING (auth.role() = 'authenticated');
