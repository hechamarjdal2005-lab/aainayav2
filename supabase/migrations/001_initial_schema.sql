-- 3INAYA Initial Schema
-- Premium Moroccan Beauty & Ritual Products E-Commerce

-- 1. profiles (linked to auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'client' CHECK (role IN ('admin', 'client')),
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. produits
CREATE TABLE produits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  description TEXT,
  ingredients TEXT,
  conseils_utilisation TEXT,
  prix NUMERIC(10,2) NOT NULL,
  stock INTEGER DEFAULT 0,
  image_url TEXT,
  categorie_id UUID REFERENCES categories(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. packs
CREATE TABLE packs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  description TEXT,
  prix_promo NUMERIC(10,2) NOT NULL,
  prix_origine NUMERIC(10,2),
  image_url TEXT,
  categorie TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. pack_produits (join table)
CREATE TABLE pack_produits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pack_id UUID REFERENCES packs(id) ON DELETE CASCADE,
  produit_id UUID REFERENCES produits(id) ON DELETE CASCADE,
  quantite INTEGER DEFAULT 1,
  UNIQUE(pack_id, produit_id)
);

-- 6. commandes
CREATE TABLE commandes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES profiles(id),
  nom_client TEXT NOT NULL,
  telephone TEXT NOT NULL,
  adresse TEXT,
  ville TEXT,
  total NUMERIC(10,2) NOT NULL,
  statut TEXT DEFAULT 'en_attente'
    CHECK (statut IN ('en_attente','confirmee','expediee','livree','annulee')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. commande_items
CREATE TABLE commande_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commande_id UUID REFERENCES commandes(id) ON DELETE CASCADE,
  produit_id UUID REFERENCES produits(id),
  pack_id UUID REFERENCES packs(id),
  quantite INTEGER NOT NULL DEFAULT 1,
  prix_unitaire NUMERIC(10,2) NOT NULL,
  CHECK (
    (produit_id IS NOT NULL AND pack_id IS NULL) OR
    (produit_id IS NULL AND pack_id IS NOT NULL)
  )
);

-- 8. certifications
CREATE TABLE certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  description TEXT,
  icone TEXT DEFAULT 'verified',
  ordre INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. settings (single-row table)
CREATE TABLE settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  site_name TEXT DEFAULT '3INAYA',
  tagline_fr TEXT,
  tagline_ar TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  whatsapp TEXT,
  instagram_url TEXT,
  facebook_url TEXT,
  tiktok_url TEXT,
  youtube_url TEXT,
  pinterest_url TEXT,
  footer_description TEXT,
  footer_copyright TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Indexes
CREATE INDEX idx_produits_categorie ON produits(categorie_id);
CREATE INDEX idx_commandes_statut ON commandes(statut);
CREATE INDEX idx_commandes_client ON commandes(client_id);
CREATE INDEX idx_pack_produits_pack ON pack_produits(pack_id);
CREATE INDEX idx_commande_items_commande ON commande_items(commande_id);

-- Triggers

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_produits_updated_at
  BEFORE UPDATE ON produits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_packs_updated_at
  BEFORE UPDATE ON packs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_commandes_updated_at
  BEFORE UPDATE ON commandes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-compute prix_origine for packs
CREATE OR REPLACE FUNCTION compute_pack_prix_origine()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE packs SET prix_origine = (
    SELECT COALESCE(SUM(p.prix * pp.quantite), 0)
    FROM pack_produits pp
    JOIN produits p ON p.id = pp.produit_id
    WHERE pp.pack_id = NEW.pack_id
  ) WHERE id = NEW.pack_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_pack_prix_compute
  AFTER INSERT OR UPDATE OR DELETE ON pack_produits
  FOR EACH ROW EXECUTE FUNCTION compute_pack_prix_origine();

-- Row Level Security

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE produits ENABLE ROW LEVEL SECURITY;
ALTER TABLE packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pack_produits ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE commandes ENABLE ROW LEVEL SECURITY;
ALTER TABLE commande_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Helper function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- profiles
CREATE POLICY "Users see own profile" ON profiles
  FOR SELECT USING (id = auth.uid() OR is_admin());
CREATE POLICY "Users update own profile" ON profiles
  FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Admins manage profiles" ON profiles
  FOR ALL USING (is_admin());

-- produits (public read, admin write)
CREATE POLICY "Public can view active produits" ON produits
  FOR SELECT USING (is_active = TRUE OR is_admin());
CREATE POLICY "Admins manage produits" ON produits
  FOR ALL USING (is_admin());

-- packs (public read, admin write)
CREATE POLICY "Public can view active packs" ON packs
  FOR SELECT USING (is_active = TRUE OR is_admin());
CREATE POLICY "Admins manage packs" ON packs
  FOR ALL USING (is_admin());

-- pack_produits
CREATE POLICY "Public read pack_produits" ON pack_produits FOR SELECT USING (TRUE);
CREATE POLICY "Admins manage pack_produits" ON pack_produits FOR ALL USING (is_admin());

-- categories
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (TRUE);
CREATE POLICY "Admins manage categories" ON categories FOR ALL USING (is_admin());

-- commandes
CREATE POLICY "Clients see own commandes" ON commandes
  FOR SELECT USING (client_id = auth.uid() OR is_admin());
CREATE POLICY "Anyone can create commandes" ON commandes
  FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admins manage commandes" ON commandes
  FOR ALL USING (is_admin());

-- commande_items
CREATE POLICY "See own items" ON commande_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM commandes c WHERE c.id = commande_id AND (c.client_id = auth.uid() OR is_admin()))
  );
CREATE POLICY "Anyone can create commande_items" ON commande_items
  FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admins manage items" ON commande_items FOR ALL USING (is_admin());

-- settings (public read, admin write)
CREATE POLICY "Public read settings" ON settings FOR SELECT USING (TRUE);
CREATE POLICY "Admins manage settings" ON settings FOR ALL USING (is_admin());

-- certifications (public read, admin write)
CREATE POLICY "Public read certifs" ON certifications FOR SELECT USING (is_active = TRUE OR is_admin());
CREATE POLICY "Admins manage certifs" ON certifications FOR ALL USING (is_admin());

-- Storage Buckets via SQL
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('produits-images', 'produits-images', TRUE),
  ('packs-images', 'packs-images', TRUE),
  ('brand-assets', 'brand-assets', TRUE);

-- Storage RLS policies
CREATE POLICY "Public read produits images" ON storage.objects
  FOR SELECT USING (bucket_id = 'produits-images');
CREATE POLICY "Admins upload produits images" ON storage.objects
  FOR INSERT USING (bucket_id = 'produits-images' AND is_admin());
CREATE POLICY "Admins delete produits images" ON storage.objects
  FOR DELETE USING (bucket_id = 'produits-images' AND is_admin());

CREATE POLICY "Public read packs images" ON storage.objects
  FOR SELECT USING (bucket_id = 'packs-images');
CREATE POLICY "Admins upload packs images" ON storage.objects
  FOR INSERT USING (bucket_id = 'packs-images' AND is_admin());

-- Seed data
INSERT INTO categories (nom, slug) VALUES
  ('Visage', 'visage'),
  ('Corps', 'corps'),
  ('Cheveux', 'cheveux');

INSERT INTO certifications (nom, description, icone, ordre) VALUES
  ('100% Naturels', 'Ingrédients naturels et bio', 'leaf', 1),
  ('Fabriqué au Maroc', 'Artisanat traditionnel marocain', 'map-pin', 2),
  ('Halal', 'Certifié halal', 'heart', 3),
  ('Livraison Offerte', 'Dès 500 MAD d''achat', 'truck', 4);

-- Default settings row
INSERT INTO settings (id, site_name, tagline_fr, tagline_ar, footer_description, footer_copyright)
VALUES (1, '3INAYA', 'L''art du rituel de beauté marocain', 'عناية — فن الجمال المغربي', 'L''art du rituel de beauté marocain. Produits naturels artisanaux issus du terroir marocain.', '© 3INAYA. Tous droits réservés.')
ON CONFLICT (id) DO NOTHING;
