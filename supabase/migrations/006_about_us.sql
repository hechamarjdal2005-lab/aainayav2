CREATE TABLE IF NOT EXISTS about_us (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_fr TEXT DEFAULT '3INAYA Cosmétique',
  title_ar TEXT DEFAULT 'عناية كوزميتيك',
  subtitle_fr TEXT DEFAULT 'L''art du rituel de beauté marocain',
  subtitle_ar TEXT DEFAULT 'فن طقوس التجميل المغربية',
  story_fr TEXT DEFAULT 'Née d une passion profonde pour les rituels de beauté ancestraux marocains, 3INAYA propose des produits soigneusement sélectionnés et fabriqués artisanalement au cœur du Maroc. Chaque produit raconte une histoire, celle d un savoir-faire transmis de génération en génération.',
  story_ar TEXT DEFAULT 'وُلدت عناية من شغف عميق بطقوس التجميل المغربية العريقة. نقدم منتجات مختارة بعناية ومصنوعة يدوياً في قلب المغرب. كل منتج يحكي قصة، قصة معرفة تتوارثها الأجيال.',
  mission_fr TEXT DEFAULT 'Notre mission est de vous offrir le meilleur des cosmétiques naturels marocains, certifiés et authentiques.',
  mission_ar TEXT DEFAULT 'مهمتنا تقديم أفضل مستحضرات التجميل الطبيعية المغربية، المعتمدة والأصيلة.',
  image_url TEXT,
  video_url TEXT,
  founded_year TEXT DEFAULT '2020',
  products_count TEXT DEFAULT '50+',
  clients_count TEXT DEFAULT '1000+',
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default row
INSERT INTO about_us (id) VALUES (gen_random_uuid())
ON CONFLICT DO NOTHING;

ALTER TABLE about_us ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read about_us" ON about_us FOR SELECT USING (is_active = true);
CREATE POLICY "Admin about_us" ON about_us FOR ALL USING (auth.role() = 'authenticated');
