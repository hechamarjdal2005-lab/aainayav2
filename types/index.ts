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
  description: string | null
  ingredients: string | null
  conseils_utilisation: string | null
  prix: number
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
  description: string | null
  prix_promo: number
  prix_origine: number | null
  image_url: string | null
  categorie: string | null
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

export type Certification = {
  id: string
  nom: string
  description: string | null
  icone: string
  ordre: number
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
  type: 'produit' | 'pack'
  nom: string
  prix: number
  quantite: number
  image_url: string | null
}

export type Setting = {
  id: number
  site_name: string
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
