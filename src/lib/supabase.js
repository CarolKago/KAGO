import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = url && key ? createClient(url, key) : null

export const isConfigured = Boolean(url && key)

/* ── Typed table helpers ── */

export async function fetchFeaturedLooks(limit = 6) {
  if (!supabase) return { data: null, error: null }
  return supabase
    .from('lookbook_images')
    .select('id, title, brand, piece, price, image_url, category, featured, display_order, ph_class')
    .eq('featured', true)
    .eq('published', true)
    .order('display_order', { ascending: true })
    .limit(limit)
}

export async function fetchLooks(category = null) {
  if (!supabase) return { data: null, error: null }
  let q = supabase
    .from('lookbook_images')
    .select('id, title, brand, piece, price, image_url, category, featured, display_order, ph_class')
    .eq('published', true)
    .order('display_order', { ascending: true })
  if (category && category !== 'all') q = q.eq('category', category)
  return q
}

export async function fetchServices() {
  if (!supabase) return { data: null, error: null }
  return supabase
    .from('services')
    .select('*')
    .eq('published', true)
    .order('display_order', { ascending: true })
}

export async function fetchHeroContent() {
  if (!supabase) return { data: null, error: null }
  return supabase
    .from('site_content')
    .select('*')
    .eq('section', 'hero')
    .single()
}

export async function insertBooking(booking) {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') }
  return supabase.from('bookings').insert([booking])
}

export async function insertContact(contact) {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') }
  return supabase.from('contacts').insert([contact])
}
