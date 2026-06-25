export type Profile = {
  id: string
  email: string | null
  full_name: string | null
  role: 'admin' | 'client'
  phone: string | null
  created_at: string
}

export type Category = {
  id: string
  nom: string
  slug: string
  created_at: string
}

export type Produit = {
  id: string
  nom: string
  name?: string | null
  name_fr?: string | null
  name_ar?: string | null
  description: string | null
  description_fr?: string | null
  description_ar?: string | null
  ingredients: string | null
  conseils_utilisation: string | null
  prix: number
  price?: number | null
  stock: number
  image_url: string | null
  categorie_id: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  categories?: Category
}

export type Pack = {
  id: string
  nom: string
  name?: string | null
  name_fr?: string | null
  name_ar?: string | null
  slug?: string | null
  description: string | null
  description_fr?: string | null
  description_ar?: string | null
  prix_promo: number
  sale_price?: number | null
  prix_origine: number | null
  original_price?: number | null
  image_url: string | null
  categorie: string | null
  stock_quantity?: number | null
  stock?: number | null
  is_active: boolean
  created_at: string
  updated_at: string
  pack_produits?: PackProduit[]
}

export type PackProduit = {
  id: string
  pack_id: string
  produit_id: string
  quantite: number
  produits?: Produit
}

export type Commande = {
  id: string
  order_number?: string
  client_name?: string
  phone?: string
  address?: string
  status?: 'pending' | 'confirmed' | 'delivered' | 'cancelled'
  client_id: string | null
  nom_client: string
  telephone: string
  adresse: string | null
  ville: string | null
  total: number
  statut: 'en_attente' | 'confirmee' | 'expediee' | 'livree' | 'annulee'
  notes: string | null
  created_at: string
  updated_at: string
  profiles?: Profile
  commande_items?: CommandeItem[]
  order_items?: OrderItem[]
}

export type CommandeItem = {
  id: string
  commande_id: string
  produit_id: string | null
  pack_id: string | null
  quantite: number
  prix_unitaire: number
  produits?: Produit
  packs?: Pack
}

export type OrderItem = {
  id: string
  order_id: string
  item_id: string | null
  item_type: 'product' | 'pack'
  title: string
  image_url: string | null
  price: number
  quantity: number
  subtotal: number
}

export type Order = {
  id: string
  order_number: string
  client_name: string
  phone: string
  address: string
  total: number
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled'
  created_at: string
  order_items?: OrderItem[]
}

export type Certification = {
  id: string
  nom: string
  name?: string | null
  title_fr?: string | null
  title_ar?: string | null
  description: string | null
  icone?: string
  logo_url?: string | null
  image_url?: string | null
  ordre: number
  display_order?: number | null
  is_active: boolean
  created_at: string
}

export type CommandeStats = {
  total: number
  en_attente: number
  confirmee: number
  expediee: number
  livree: number
  annulee: number
  revenu_total: number
}

export type RevenuJour = {
  date: string
  revenu: number
}

export type CartItem = {
  id: string
  item_type: 'product' | 'pack'
  title: string
  price: number
  quantity: number
  image_url: string | null
  type?: 'produit' | 'pack'
  nom?: string
  prix?: number
  quantite?: number
}

export type Setting = {
  id: number
  site_name: string
  nav_home_fr?: string | null
  nav_home_ar?: string | null
  nav_shop_fr?: string | null
  nav_shop_ar?: string | null
  nav_packs_fr?: string | null
  nav_packs_ar?: string | null
  nav_about_fr?: string | null
  nav_about_ar?: string | null
  hero_title_fr?: string | null
  hero_title_ar?: string | null
  hero_subtitle_fr?: string | null
  hero_subtitle_ar?: string | null
  hero_kicker_fr?: string | null
  hero_kicker_ar?: string | null
  hero_button_primary_fr?: string | null
  hero_button_primary_ar?: string | null
  hero_button_secondary_fr?: string | null
  hero_button_secondary_ar?: string | null
  products_title_fr?: string | null
  products_title_ar?: string | null
  products_text_fr?: string | null
  products_text_ar?: string | null
  packs_title_fr?: string | null
  packs_title_ar?: string | null
  packs_text_fr?: string | null
  packs_text_ar?: string | null
  product_button_fr?: string | null
  product_button_ar?: string | null
  pack_button_fr?: string | null
  pack_button_ar?: string | null
  certifications_title_fr?: string | null
  certifications_title_ar?: string | null
  certifications_text_fr?: string | null
  certifications_text_ar?: string | null
  trust_badge_1_fr?: string | null
  trust_badge_1_ar?: string | null
  trust_badge_2_fr?: string | null
  trust_badge_2_ar?: string | null
  trust_badge_3_fr?: string | null
  trust_badge_3_ar?: string | null
  trust_badge_4_fr?: string | null
  trust_badge_4_ar?: string | null
  footer_description_fr?: string | null
  footer_description_ar?: string | null
  footer_links_title_fr?: string | null
  footer_links_title_ar?: string | null
  footer_contact_title_fr?: string | null
  footer_contact_title_ar?: string | null
  primary_color?: string | null
  secondary_color?: string | null
  gold_color?: string | null
  background_color?: string | null
  tagline_fr: string | null
  tagline_ar: string | null
  contact_email: string | null
  contact_phone: string | null
  whatsapp: string | null
  instagram_url: string | null
  facebook_url: string | null
  tiktok_url: string | null
  youtube_url: string | null
  pinterest_url: string | null
  footer_description: string | null
  footer_copyright: string | null
  about_title: string | null
  about_description: string | null
  about_image_url: string | null
  hero_video_url: string | null
  logo_url: string | null
  updated_at: string
}
