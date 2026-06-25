alter table settings add column if not exists nav_home_fr text default 'Accueil';
alter table settings add column if not exists nav_home_ar text default 'الرئيسية';
alter table settings add column if not exists nav_shop_fr text default 'Boutique';
alter table settings add column if not exists nav_shop_ar text default 'المتجر';
alter table settings add column if not exists nav_packs_fr text default 'Coffrets';
alter table settings add column if not exists nav_packs_ar text default 'المجموعات';
alter table settings add column if not exists nav_about_fr text default 'À propos';
alter table settings add column if not exists nav_about_ar text default 'من نحن';
alter table settings add column if not exists hero_title_fr text default '3INAYA';
alter table settings add column if not exists hero_title_ar text default 'عناية';
alter table settings add column if not exists hero_subtitle_fr text default 'L''art du rituel de beauté marocain';
alter table settings add column if not exists hero_subtitle_ar text default 'فن طقوس الجمال المغربي';
alter table settings add column if not exists hero_kicker_fr text default 'Huile d''argan · Eau de rose · Savon beldi';
alter table settings add column if not exists hero_kicker_ar text default 'زيت الأركان · ماء الورد · الصابون البلدي';
alter table settings add column if not exists hero_button_primary_fr text default 'Découvrir nos produits';
alter table settings add column if not exists hero_button_primary_ar text default 'اكتشفي منتجاتنا';
alter table settings add column if not exists hero_button_secondary_fr text default 'Notre histoire';
alter table settings add column if not exists hero_button_secondary_ar text default 'قصتنا';
alter table settings add column if not exists products_title_fr text default 'Nos Produits';
alter table settings add column if not exists products_title_ar text default 'منتجاتنا';
alter table settings add column if not exists products_text_fr text default 'Des soins naturels pour révéler votre beauté';
alter table settings add column if not exists products_text_ar text default 'عناية طبيعية لإبراز جمالك';
alter table settings add column if not exists packs_title_fr text default 'Coffrets & Rituels';
alter table settings add column if not exists packs_title_ar text default 'مجموعات وطقوس';
alter table settings add column if not exists packs_text_fr text default 'Des packs composés avec soin pour des rituels complets';
alter table settings add column if not exists packs_text_ar text default 'مجموعات مختارة بعناية لطقوس متكاملة';
alter table settings add column if not exists product_button_fr text default 'Ajouter au panier';
alter table settings add column if not exists product_button_ar text default 'أضيفي إلى السلة';
alter table settings add column if not exists pack_button_fr text default 'Ajouter au panier';
alter table settings add column if not exists pack_button_ar text default 'أضيفي إلى السلة';
alter table settings add column if not exists certifications_title_fr text default 'Nos Certifications';
alter table settings add column if not exists certifications_title_ar text default 'شهاداتنا';
alter table settings add column if not exists certifications_text_fr text default 'Des garanties de qualité et d''authenticité';
alter table settings add column if not exists certifications_text_ar text default 'ضمانات الجودة والأصالة';
alter table settings add column if not exists trust_badge_1_fr text default '100% Naturels';
alter table settings add column if not exists trust_badge_1_ar text default 'طبيعي 100%';
alter table settings add column if not exists trust_badge_2_fr text default 'Fabriqué au Maroc';
alter table settings add column if not exists trust_badge_2_ar text default 'صنع في المغرب';
alter table settings add column if not exists trust_badge_3_fr text default 'Halal';
alter table settings add column if not exists trust_badge_3_ar text default 'حلال';
alter table settings add column if not exists trust_badge_4_fr text default 'Livraison Offerte';
alter table settings add column if not exists trust_badge_4_ar text default 'توصيل مجاني';
alter table settings add column if not exists footer_description_fr text;
alter table settings add column if not exists footer_description_ar text;
alter table settings add column if not exists footer_links_title_fr text default 'Liens rapides';
alter table settings add column if not exists footer_links_title_ar text default 'روابط سريعة';
alter table settings add column if not exists footer_contact_title_fr text default 'Contact';
alter table settings add column if not exists footer_contact_title_ar text default 'اتصل بنا';
alter table settings add column if not exists primary_color text default '#9F2638';
alter table settings add column if not exists secondary_color text default '#B64A5A';
alter table settings add column if not exists gold_color text default '#C8945B';
alter table settings add column if not exists background_color text default '#FAF4EF';

alter table produits add column if not exists name_fr text;
alter table produits add column if not exists name_ar text;
alter table produits add column if not exists description_fr text;
alter table produits add column if not exists description_ar text;

alter table packs add column if not exists name_fr text;
alter table packs add column if not exists name_ar text;
alter table packs add column if not exists description_fr text;
alter table packs add column if not exists description_ar text;

alter table certifications add column if not exists title_fr text;
alter table certifications add column if not exists title_ar text;
alter table certifications add column if not exists image_url text;

alter table about_us add column if not exists text_fr text;
alter table about_us add column if not exists text_ar text;
alter table about_us add column if not exists subtitle_ar text;
alter table about_us add column if not exists mission_ar text;

insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do nothing;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Public read site-media') then
    create policy "Public read site-media" on storage.objects
      for select using (bucket_id = 'site-media');
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Authenticated upload site-media') then
    create policy "Authenticated upload site-media" on storage.objects
      for insert with check (bucket_id = 'site-media' and auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Authenticated update site-media') then
    create policy "Authenticated update site-media" on storage.objects
      for update using (bucket_id = 'site-media' and auth.role() = 'authenticated');
  end if;
end $$;
