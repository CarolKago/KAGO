import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = url && key ? createClient(url, key) : null
export const isConfigured = Boolean(url && key)

// ── Lookbook ────────────────────────────────────────────────────

export async function fetchFeaturedLooks(limit = 6) {
  if (!supabase) return { data: null, error: null }
  return supabase
    .from('lookbook_images')
    .select('id, title, brand, piece, price, image_url, category, featured, display_order, ph_class, season_slug, occasion')
    .eq('featured', true)
    .eq('published', true)
    .order('display_order', { ascending: true })
    .limit(limit)
}

export async function fetchLooks(category = null) {
  if (!supabase) return { data: null, error: null }
  let q = supabase
    .from('lookbook_images')
    .select('id, title, brand, piece, price, image_url, category, featured, display_order, ph_class, season_slug, occasion')
    .eq('published', true)
    .order('display_order', { ascending: true })
  if (category && category !== 'all') q = q.eq('category', category)
  return q
}

export async function fetchLookWithImages(lookId) {
  if (!supabase) return { data: null, error: null }
  const [look, images] = await Promise.all([
    supabase
      .from('lookbook_images')
      .select('*')
      .eq('id', lookId)
      .single(),
    supabase
      .from('look_images')
      .select('*')
      .eq('look_id', lookId)
      .order('display_order', { ascending: true }),
  ])
  if (look.error) return { data: null, error: look.error }
  return {
    data: { ...look.data, extra_images: images.data || [] },
    error: null,
  }
}

export async function fetchLookImages(lookId) {
  if (!supabase) return { data: null, error: null }
  return supabase
    .from('look_images')
    .select('*')
    .eq('look_id', lookId)
    .order('display_order', { ascending: true })
}

// ── Summer Lookbook ─────────────────────────────────────────────

export async function fetchSummerLooks(limit = 20) {
  if (!supabase) return { data: null, error: null }
  return supabase
    .from('lookbook_images')
    .select('id, title, brand, piece, price, image_url, category, ph_class, season_slug, occasion, story, look_number, display_order')
    .eq('published', true)
    .or('season_slug.eq.summer-2026,collection_slug.eq.summer-lookbook-2026')
    .order('look_number', { ascending: true })
    .limit(limit)
}

// ── Weekly Edit ─────────────────────────────────────────────────

export async function fetchLatestWeeklyEdit() {
  if (!supabase) return { data: null, error: null }
  const edit = await supabase
    .from('weekly_edits')
    .select('*')
    .eq('published', true)
    .order('week_of', { ascending: false })
    .limit(1)
    .single()
  if (edit.error) return { data: null, error: edit.error }

  const looks = await supabase
    .from('weekly_edit_looks')
    .select('display_order, lookbook_images(id, title, brand, piece, price, image_url, ph_class, category)')
    .eq('edit_id', edit.data.id)
    .order('display_order', { ascending: true })

  return {
    data: { ...edit.data, looks: (looks.data || []).map(r => r.lookbook_images) },
    error: null,
  }
}

export async function fetchAllWeeklyEdits() {
  if (!supabase) return { data: null, error: null }
  return supabase
    .from('weekly_edits')
    .select('id, title, subtitle, week_of, hero_image_url, published, display_order')
    .eq('published', true)
    .order('week_of', { ascending: false })
}

export async function fetchWeeklyEditById(id) {
  if (!supabase) return { data: null, error: null }
  const edit = await supabase
    .from('weekly_edits')
    .select('*')
    .eq('id', id)
    .eq('published', true)
    .single()
  if (edit.error) return { data: null, error: edit.error }

  const looks = await supabase
    .from('weekly_edit_looks')
    .select('display_order, lookbook_images(id, title, brand, piece, price, image_url, ph_class, category, occasion, story)')
    .eq('edit_id', id)
    .order('display_order', { ascending: true })

  return {
    data: { ...edit.data, looks: (looks.data || []).map(r => r.lookbook_images) },
    error: null,
  }
}

// ── Site Content ────────────────────────────────────────────────

export async function fetchSiteContent(section = null) {
  if (!supabase) return { data: null, error: null }
  let q = supabase.from('site_content').select('key, value, type, section')
  if (section) q = q.eq('section', section)
  return q
}

// ── Bookings & Contacts ─────────────────────────────────────────

export async function insertBooking(booking) {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') }
  return supabase.from('bookings').insert([booking])
}

export async function insertContact(contact) {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') }
  return supabase.from('contacts').insert([contact])
}

export async function insertRateCardRequest(req) {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') }
  return supabase.from('rate_card_requests').insert([req])
}
