-- Add logo storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('logo', 'logo', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for logo
CREATE POLICY "Public read logo" ON storage.objects
  FOR SELECT USING (bucket_id = 'logo');

CREATE POLICY "Admins upload logo" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'logo' AND is_admin());

CREATE POLICY "Admins delete logo" ON storage.objects
  FOR DELETE USING (bucket_id = 'logo' AND is_admin());

-- Add logo_url to settings
ALTER TABLE settings
  ADD COLUMN IF NOT EXISTS logo_url TEXT;
