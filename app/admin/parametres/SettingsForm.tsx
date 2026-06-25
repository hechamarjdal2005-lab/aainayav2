'use client'

import { useState, useRef } from 'react'
import { Resolver, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Setting } from '@/types'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { saveSettings } from '@/lib/actions/settings'
import { createClient } from '@/lib/supabase/client'
import {
  Settings,
  Globe,
  Camera,
  Sparkles,
  CheckCircle,
  Info,
} from 'lucide-react'
import Image from 'next/image'

const schema = z.object({
  site_name: z.string().min(1, 'Le nom du site est requis'),
  tagline_fr: z.string().optional(),
  tagline_ar: z.string().optional(),
  contact_email: z.string().email('Email invalide').optional().or(z.literal('')),
  contact_phone: z.string().optional(),
  whatsapp: z.string().optional(),
  instagram_url: z.string().url('URL invalide').optional().or(z.literal('')),
  facebook_url: z.string().url('URL invalide').optional().or(z.literal('')),
  tiktok_url: z.string().url('URL invalide').optional().or(z.literal('')),
  youtube_url: z.string().url('URL invalide').optional().or(z.literal('')),
  pinterest_url: z.string().url('URL invalide').optional().or(z.literal('')),
  footer_description: z.string().optional(),
  footer_copyright: z.string().optional(),
  about_title: z.string().optional(),
  about_description: z.string().optional(),
  about_image_url: z.string().optional(),
  logo_url: z.string().optional(), // ← زيد هاد السطر
  hero_video_url: z.string().optional(),
  product_button_fr: z.string().optional(),
  product_button_ar: z.string().optional(),
  pack_button_fr: z.string().optional(),
  pack_button_ar: z.string().optional(),
}).passthrough()

type SettingsFormData = z.infer<typeof schema> & Record<string, string | undefined>

type Tab = 'general' | 'social' | 'footer' | 'about'

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'general', label: 'Général', icon: <Globe className="h-4 w-4" /> },
  { id: 'about', label: 'À propos', icon: <Info className="h-4 w-4" /> },
  { id: 'social', label: 'Réseaux sociaux', icon: <Camera className="h-4 w-4" /> },
  { id: 'footer', label: 'Footer', icon: <Settings className="h-4 w-4" /> },
]

interface SettingsFormProps {
  settings: Setting | null
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const [activeTab, setActiveTab] = useState<Tab>('general')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [aboutPreview, setAboutPreview] = useState<string | null>(settings?.about_image_url || null)
  const [videoUploading, setVideoUploading] = useState(false)
  const [heroVideoPreview, setHeroVideoPreview] = useState<string | null>(settings?.hero_video_url || null)
  const [logoUploading, setLogoUploading] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(settings?.logo_url || null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(schema) as Resolver<SettingsFormData>,
    defaultValues: {
      site_name: settings?.site_name || '3INAYA',
      tagline_fr: settings?.tagline_fr || '',
      tagline_ar: settings?.tagline_ar || '',
      contact_email: settings?.contact_email || '',
      contact_phone: settings?.contact_phone || '',
      whatsapp: settings?.whatsapp || '',
      instagram_url: settings?.instagram_url || '',
      facebook_url: settings?.facebook_url || '',
      tiktok_url: settings?.tiktok_url || '',
      youtube_url: settings?.youtube_url || '',
      pinterest_url: settings?.pinterest_url || '',
      footer_description: settings?.footer_description || '',
      footer_copyright: settings?.footer_copyright || '',
      about_title: settings?.about_title || '',
      about_description: settings?.about_description || '',
      about_image_url: settings?.about_image_url || '',
      hero_video_url: settings?.hero_video_url || '',
      logo_url: settings?.logo_url || '',
      nav_home_fr: settings?.nav_home_fr || '',
      nav_home_ar: settings?.nav_home_ar || '',
      nav_shop_fr: settings?.nav_shop_fr || '',
      nav_shop_ar: settings?.nav_shop_ar || '',
      nav_packs_fr: settings?.nav_packs_fr || '',
      nav_packs_ar: settings?.nav_packs_ar || '',
      nav_about_fr: settings?.nav_about_fr || '',
      nav_about_ar: settings?.nav_about_ar || '',
      hero_title_fr: settings?.hero_title_fr || '',
      hero_title_ar: settings?.hero_title_ar || '',
      hero_subtitle_fr: settings?.hero_subtitle_fr || '',
      hero_subtitle_ar: settings?.hero_subtitle_ar || '',
      hero_kicker_fr: settings?.hero_kicker_fr || '',
      hero_kicker_ar: settings?.hero_kicker_ar || '',
      hero_button_primary_fr: settings?.hero_button_primary_fr || '',
      hero_button_primary_ar: settings?.hero_button_primary_ar || '',
      hero_button_secondary_fr: settings?.hero_button_secondary_fr || '',
      hero_button_secondary_ar: settings?.hero_button_secondary_ar || '',
      products_title_fr: settings?.products_title_fr || '',
      products_title_ar: settings?.products_title_ar || '',
      products_text_fr: settings?.products_text_fr || '',
      products_text_ar: settings?.products_text_ar || '',
      product_button_fr: settings?.product_button_fr || '',
      product_button_ar: settings?.product_button_ar || '',
      packs_title_fr: settings?.packs_title_fr || '',
      packs_title_ar: settings?.packs_title_ar || '',
      packs_text_fr: settings?.packs_text_fr || '',
      packs_text_ar: settings?.packs_text_ar || '',
      pack_button_fr: settings?.pack_button_fr || '',
      pack_button_ar: settings?.pack_button_ar || '',
      certifications_title_fr: settings?.certifications_title_fr || '',
      certifications_title_ar: settings?.certifications_title_ar || '',
      certifications_text_fr: settings?.certifications_text_fr || '',
      certifications_text_ar: settings?.certifications_text_ar || '',
      trust_badge_1_fr: settings?.trust_badge_1_fr || '',
      trust_badge_1_ar: settings?.trust_badge_1_ar || '',
      trust_badge_2_fr: settings?.trust_badge_2_fr || '',
      trust_badge_2_ar: settings?.trust_badge_2_ar || '',
      trust_badge_3_fr: settings?.trust_badge_3_fr || '',
      trust_badge_3_ar: settings?.trust_badge_3_ar || '',
      trust_badge_4_fr: settings?.trust_badge_4_fr || '',
      trust_badge_4_ar: settings?.trust_badge_4_ar || '',
      footer_description_fr: settings?.footer_description_fr || '',
      footer_description_ar: settings?.footer_description_ar || '',
      footer_links_title_fr: settings?.footer_links_title_fr || '',
      footer_links_title_ar: settings?.footer_links_title_ar || '',
      footer_contact_title_fr: settings?.footer_contact_title_fr || '',
      footer_contact_title_ar: settings?.footer_contact_title_ar || '',
      primary_color: settings?.primary_color || '#9F2638',
      secondary_color: settings?.secondary_color || '#B64A5A',
      gold_color: settings?.gold_color || '#C8945B',
      background_color: settings?.background_color || '#FAF4EF',
    },
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const fileName = `about-${Date.now()}.${ext}`
      const { data, error } = await supabase.storage
        .from('site-media')
        .upload(fileName, file)

      if (error) throw error

      const { data: urlData } = supabase.storage
        .from('site-media')
        .getPublicUrl(data.path)

      const url = urlData.publicUrl
      setAboutPreview(url)
      setValue('about_image_url', url)
    } catch (err) {
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const removeImage = () => {
    setAboutPreview(null)
    setValue('about_image_url', '')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setVideoUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const fileName = `hero-${Date.now()}.${ext}`
      const { data, error } = await supabase.storage
        .from('site-media')
        .upload(fileName, file)

      if (error) throw error

      const { data: urlData } = supabase.storage
        .from('site-media')
        .getPublicUrl(data.path)

      const url = urlData.publicUrl
      setHeroVideoPreview(url)
      setValue('hero_video_url', url)
    } catch (err) {
      console.error(err)
    } finally {
      setVideoUploading(false)
    }
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLogoUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const fileName = `logo-${Date.now()}.${ext}`
      const { data, error } = await supabase.storage
        .from('site-media')
        .upload(fileName, file)

      if (error) throw error

      const { data: urlData } = supabase.storage
        .from('site-media')
        .getPublicUrl(data.path)

      const url = urlData.publicUrl
      setLogoPreview(url)
      setValue('logo_url', url)
    } catch (err) {
      console.error(err)
    } finally {
      setLogoUploading(false)
    }
  }

  const removeLogo = () => {
    setLogoPreview(null)
    setValue('logo_url', '')
    if (logoInputRef.current) logoInputRef.current.value = ''
  }

  const removeVideo = () => {
    setHeroVideoPreview(null)
    setValue('hero_video_url', '')
    if (videoInputRef.current) videoInputRef.current.value = ''
  }

  const onSubmit = async (data: SettingsFormData) => {
    setSaving(true)
    setSuccess(false)

    const formData = new FormData()
    ;(Object.entries(data) as [string, string][]).forEach(([key, value]) => {
      formData.append(key, value || '')
    })

    const result = await saveSettings(formData)

    setSaving(false)
    if (result.success) {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <div className="flex gap-1 bg-surface-card rounded-lg p-1 border border-outline-variant/20 w-fit flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-primary text-white shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'general' && (
        <Card className="space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="font-serif text-lg font-semibold">
              Informations générales
            </h3>
          </div>

          <Input
            id="site_name"
            label="Nom du site"
            error={errors.site_name?.message as string}
            {...register('site_name')}
          />

          <Input
            id="tagline_fr"
            label="Tagline (français)"
            {...register('tagline_fr')}
          />

          <Input
            id="tagline_ar"
            label="Tagline (arabe)"
            dir="rtl"
            {...register('tagline_ar')}
          />

          <Input
            id="contact_email"
            label="Email de contact"
            type="email"
            error={errors.contact_email?.message as string}
            {...register('contact_email')}
          />

          <Input
            id="contact_phone"
            label="Téléphone"
            type="tel"
            {...register('contact_phone')}
          />

          <Input
            id="whatsapp"
            label="WhatsApp (numéro avec indicatif)"
            placeholder="+2126XXXXXXXX"
            {...register('whatsapp')}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input id="nav_home_fr" label="Navbar Accueil FR" {...register('nav_home_fr')} />
            <Input id="nav_home_ar" label="Navbar Accueil AR" dir="rtl" {...register('nav_home_ar')} />
            <Input id="nav_shop_fr" label="Navbar Boutique FR" {...register('nav_shop_fr')} />
            <Input id="nav_shop_ar" label="Navbar Boutique AR" dir="rtl" {...register('nav_shop_ar')} />
            <Input id="nav_packs_fr" label="Navbar Coffrets FR" {...register('nav_packs_fr')} />
            <Input id="nav_packs_ar" label="Navbar Coffrets AR" dir="rtl" {...register('nav_packs_ar')} />
            <Input id="nav_about_fr" label="Navbar A propos FR" {...register('nav_about_fr')} />
            <Input id="nav_about_ar" label="Navbar A propos AR" dir="rtl" {...register('nav_about_ar')} />
            <Input id="primary_color" label="Couleur principale" type="color" {...register('primary_color')} />
            <Input id="secondary_color" label="Couleur secondaire" type="color" {...register('secondary_color')} />
            <Input id="gold_color" label="Couleur or" type="color" {...register('gold_color')} />
            <Input id="background_color" label="Couleur fond" type="color" {...register('background_color')} />
            <Input id="hero_title_fr" label="Hero titre FR" {...register('hero_title_fr')} />
            <Input id="hero_title_ar" label="Hero titre AR" dir="rtl" {...register('hero_title_ar')} />
            <Input id="hero_subtitle_fr" label="Hero sous-titre FR" {...register('hero_subtitle_fr')} />
            <Input id="hero_subtitle_ar" label="Hero sous-titre AR" dir="rtl" {...register('hero_subtitle_ar')} />
            <Input id="hero_kicker_fr" label="Hero texte court FR" {...register('hero_kicker_fr')} />
            <Input id="hero_kicker_ar" label="Hero texte court AR" dir="rtl" {...register('hero_kicker_ar')} />
            <Input id="hero_button_primary_fr" label="Bouton principal FR" {...register('hero_button_primary_fr')} />
            <Input id="hero_button_primary_ar" label="Bouton principal AR" dir="rtl" {...register('hero_button_primary_ar')} />
            <Input id="hero_button_secondary_fr" label="Bouton secondaire FR" {...register('hero_button_secondary_fr')} />
            <Input id="hero_button_secondary_ar" label="Bouton secondaire AR" dir="rtl" {...register('hero_button_secondary_ar')} />
            <Input id="products_title_fr" label="Titre produits FR" {...register('products_title_fr')} />
            <Input id="products_title_ar" label="Titre produits AR" dir="rtl" {...register('products_title_ar')} />
            <Input id="products_text_fr" label="Texte produits FR" {...register('products_text_fr')} />
            <Input id="products_text_ar" label="Texte produits AR" dir="rtl" {...register('products_text_ar')} />
            <Input id="product_button_fr" label="Bouton produit FR" {...register('product_button_fr')} />
            <Input id="product_button_ar" label="Bouton produit AR" dir="rtl" {...register('product_button_ar')} />
            <Input id="packs_title_fr" label="Titre packs FR" {...register('packs_title_fr')} />
            <Input id="packs_title_ar" label="Titre packs AR" dir="rtl" {...register('packs_title_ar')} />
            <Input id="packs_text_fr" label="Texte packs FR" {...register('packs_text_fr')} />
            <Input id="packs_text_ar" label="Texte packs AR" dir="rtl" {...register('packs_text_ar')} />
            <Input id="pack_button_fr" label="Bouton pack FR" {...register('pack_button_fr')} />
            <Input id="pack_button_ar" label="Bouton pack AR" dir="rtl" {...register('pack_button_ar')} />
            <Input id="certifications_title_fr" label="Titre certifications FR" {...register('certifications_title_fr')} />
            <Input id="certifications_title_ar" label="Titre certifications AR" dir="rtl" {...register('certifications_title_ar')} />
            <Input id="certifications_text_fr" label="Texte certifications FR" {...register('certifications_text_fr')} />
            <Input id="certifications_text_ar" label="Texte certifications AR" dir="rtl" {...register('certifications_text_ar')} />
            <Input id="trust_badge_1_fr" label="Badge 1 FR" {...register('trust_badge_1_fr')} />
            <Input id="trust_badge_1_ar" label="Badge 1 AR" dir="rtl" {...register('trust_badge_1_ar')} />
            <Input id="trust_badge_2_fr" label="Badge 2 FR" {...register('trust_badge_2_fr')} />
            <Input id="trust_badge_2_ar" label="Badge 2 AR" dir="rtl" {...register('trust_badge_2_ar')} />
            <Input id="trust_badge_3_fr" label="Badge 3 FR" {...register('trust_badge_3_fr')} />
            <Input id="trust_badge_3_ar" label="Badge 3 AR" dir="rtl" {...register('trust_badge_3_ar')} />
            <Input id="trust_badge_4_fr" label="Badge 4 FR" {...register('trust_badge_4_fr')} />
            <Input id="trust_badge_4_ar" label="Badge 4 AR" dir="rtl" {...register('trust_badge_4_ar')} />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-on-surface">
              Vidéo d&apos;arrière-plan (Hero)
            </label>
            <input
              ref={videoInputRef}
              type="file"
              accept="video/mp4,video/webm"
              onChange={handleVideoUpload}
              className="w-full text-sm text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
            {videoUploading && (
              <p className="text-sm text-on-surface-variant">Upload en cours...</p>
            )}
            {heroVideoPreview && (
              <div className="relative mt-2">
                <video
                  src={heroVideoPreview}
                  className="rounded-lg w-full max-h-48 object-cover"
                  muted
                  loop
                  playsInline
                  controls
                />
                <button
                  type="button"
                  onClick={removeVideo}
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-on-surface">
              Logo du site
            </label>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/png,image/jpg,image/svg+xml,image/webp"
              onChange={handleLogoUpload}
              className="w-full text-sm text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
            {logoUploading && (
              <p className="text-sm text-on-surface-variant">Upload en cours...</p>
            )}
            {logoPreview && (
              <div className="relative inline-block mt-2">
                <Image
                  src={logoPreview}
                  alt="Logo"
                  width={160}
                  height={56}
                  className="rounded-lg object-contain h-14 w-40 border border-outline-variant/20"
                />
                <button
                  type="button"
                  onClick={removeLogo}
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </Card>
      )}

      {activeTab === 'about' && (
        <Card className="space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Info className="h-5 w-5 text-primary" />
            <h3 className="font-serif text-lg font-semibold">
              Section À propos
            </h3>
          </div>

          <Input
            id="about_title"
            label="Titre"
            {...register('about_title')}
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-on-surface">
              Description
            </label>
            <textarea
              rows={5}
              className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
              {...register('about_description')}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-on-surface">
              Image
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full text-sm text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
            {uploading && (
              <p className="text-sm text-on-surface-variant">Upload en cours...</p>
            )}
            {aboutPreview && (
              <div className="relative inline-block mt-2">
                <Image
                  src={aboutPreview}
                  alt="Aperçu"
                  width={200}
                  height={120}
                  className="rounded-lg object-cover h-32 w-64"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </Card>
      )}

      {activeTab === 'social' && (
        <Card className="space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Camera className="h-5 w-5 text-primary" />
            <h3 className="font-serif text-lg font-semibold">
              Réseaux sociaux
            </h3>
          </div>

          <Input
            id="instagram_url"
            label="Instagram"
            placeholder="https://instagram.com/..."
            error={errors.instagram_url?.message as string}
            {...register('instagram_url')}
          />

          <Input
            id="facebook_url"
            label="Facebook"
            placeholder="https://facebook.com/..."
            error={errors.facebook_url?.message as string}
            {...register('facebook_url')}
          />

          <Input
            id="tiktok_url"
            label="TikTok"
            placeholder="https://tiktok.com/@..."
            error={errors.tiktok_url?.message as string}
            {...register('tiktok_url')}
          />

          <Input
            id="youtube_url"
            label="YouTube"
            placeholder="https://youtube.com/@..."
            error={errors.youtube_url?.message as string}
            {...register('youtube_url')}
          />

          <Input
            id="pinterest_url"
            label="Pinterest"
            placeholder="https://pinterest.com/..."
            error={errors.pinterest_url?.message as string}
            {...register('pinterest_url')}
          />
        </Card>
      )}

      {activeTab === 'footer' && (
        <Card className="space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Settings className="h-5 w-5 text-primary" />
            <h3 className="font-serif text-lg font-semibold">Footer</h3>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-on-surface">
              Description du footer
            </label>
            <textarea
              rows={3}
              className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
              {...register('footer_description')}
            />
          </div>

          <Input
            id="footer_description_fr"
            label="Description footer FR"
            {...register('footer_description_fr')}
          />
          <Input
            id="footer_description_ar"
            label="Description footer AR"
            dir="rtl"
            {...register('footer_description_ar')}
          />
          <Input
            id="footer_links_title_fr"
            label="Titre liens FR"
            {...register('footer_links_title_fr')}
          />
          <Input
            id="footer_links_title_ar"
            label="Titre liens AR"
            dir="rtl"
            {...register('footer_links_title_ar')}
          />
          <Input
            id="footer_contact_title_fr"
            label="Titre contact FR"
            {...register('footer_contact_title_fr')}
          />
          <Input
            id="footer_contact_title_ar"
            label="Titre contact AR"
            dir="rtl"
            {...register('footer_contact_title_ar')}
          />

          <Input
            id="footer_copyright"
            label="Texte de copyright"
            {...register('footer_copyright')}
          />
        </Card>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" loading={saving}>
          Enregistrer
        </Button>
        {success && (
          <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
            <CheckCircle className="h-4 w-4" />
            Paramètres enregistrés
          </span>
        )}
      </div>
    </form>
  )
}
