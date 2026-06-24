-- Add video storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('hero-video', 'hero-video', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for hero-video
CREATE POLICY "Public read hero video" ON storage.objects
  FOR SELECT USING (bucket_id = 'hero-video');

CREATE POLICY "Admins upload hero video" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'hero-video' AND is_admin());

CREATE POLICY "Admins delete hero video" ON storage.objects
  FOR DELETE USING (bucket_id = 'hero-video' AND is_admin());

-- Add hero_video_url to settings
ALTER TABLE settings
  ADD COLUMN IF NOT EXISTS hero_video_url TEXT;
