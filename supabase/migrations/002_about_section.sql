-- Add about section fields to settings table
ALTER TABLE settings
  ADD COLUMN IF NOT EXISTS about_title TEXT DEFAULT 'L''Art du Rituel Marocain',
  ADD COLUMN IF NOT EXISTS about_description TEXT DEFAULT '3INAYA (عناية) puise son inspiration dans les traditions de beauté marocaines transmises de génération en génération. Chaque produit est confectionné avec des ingrédients naturels soigneusement sélectionnés, pour vous offrir une expérience sensorielle unique.',
  ADD COLUMN IF NOT EXISTS about_image_url TEXT;

-- Update default row with about values
UPDATE settings SET
  about_title = 'L''Art du Rituel Marocain',
  about_description = '3INAYA (عناية) puise son inspiration dans les traditions de beauté marocaines transmises de génération en génération. Chaque produit est confectionné avec des ingrédients naturels soigneusement sélectionnés, pour vous offrir une expérience sensorielle unique.'
WHERE id = 1;
