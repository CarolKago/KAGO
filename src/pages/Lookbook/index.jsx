import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Nav from '../../components/layout/Nav'
import Footer from '../../components/layout/Footer'
import PageTransition from '../../components/layout/PageTransition'
import { useLightbox } from '../../components/Lightbox'
import { fetchLooks } from '../../lib/supabase'
import styles from './Lookbook.module.css'

const FILTERS = [
  { key: 'all',       label: 'All Looks' },
  { key: 'editorial', label: 'Editorial' },
  { key: 'power',     label: 'Power' },
  { key: 'evening',   label: 'Evening' },
  { key: 'archive',   label: 'Archive' },
]
const PH = ['ph-a', 'ph-b', 'ph-c', 'ph-d', 'ph-e', 'ph-f']
const INIT = ['LP', 'BC', 'AMQ', 'YSL', 'RL', 'CD']

const FALLBACK = [
  // Editorial (3)
  { id: 'd2',  brand: 'Brunello Cucinelli', title: 'The Refined Neutral',      piece: 'Linen Blazer & Trousers',          price: 'From £5,200',   image_url: '', category: 'editorial', ph_class: 'ph-b' },
  { id: 'd3',  brand: 'Alexander McQueen',  title: 'The Sculpted Femme',       piece: 'Fitted Blazer & Sheath Dress',     price: 'From £4,800',   image_url: '', category: 'editorial', ph_class: 'ph-c' },
  { id: 'd7',  brand: 'Chanel',             title: 'The Atelier Classic',      piece: 'Bouclé Jacket & Wide-Leg Trouser', price: 'From £9,200',   image_url: '', category: 'editorial', ph_class: 'ph-e' },

  // Power (3)
  { id: 'd1',  brand: 'Loro Piana',         title: 'The Cashmere Power Suit',  piece: 'Cashmere Tailored Suit',           price: 'From £8,400',   image_url: '', category: 'power',     ph_class: 'ph-a' },
  { id: 'd5',  brand: 'Ralph Lauren',       title: 'Understated Heritage',     piece: 'Purple Label Tweed Blazer',        price: 'From £3,800',   image_url: '', category: 'power',     ph_class: 'ph-e' },
  { id: 'd8',  brand: 'Hermès',             title: 'The Boardroom Standard',   piece: 'Cashmere-Silk Coat & Tailoring',   price: 'From £12,000',  image_url: '', category: 'power',     ph_class: 'ph-f' },

  // Evening (3)
  { id: 'd4',  brand: 'Saint Laurent',      title: 'The Power Silhouette',     piece: 'Le Smoking Tuxedo',                price: 'From £6,000',   image_url: '', category: 'evening',   ph_class: 'ph-d' },
  { id: 'd9',  brand: 'Valentino',          title: 'The Couture Evening',      piece: 'Cape-Back Silk Gown',              price: 'From £8,800',   image_url: '', category: 'evening',   ph_class: 'ph-a' },
  { id: 'd10', brand: 'Givenchy',           title: 'The Midnight Edit',        piece: 'Structured Velvet Column Dress',   price: 'From £5,600',   image_url: '', category: 'evening',   ph_class: 'ph-c' },

  // Archive (3)
  { id: 'd6',  brand: 'Dior Vintage',       title: 'The New Look Reborn',      piece: 'Bar Jacket & Pencil Skirt',        price: 'Upon Request',  image_url: '', category: 'archive',   ph_class: 'ph-f' },
  { id: 'd11', brand: 'Chanel Vintage',     title: 'The Maison Original',      piece: 'Numbered Couture Bouclé Suit',     price: 'Upon Request',  image_url: '', category: 'archive',   ph_class: 'ph-b' },
  { id: 'd12', brand: 'Balenciaga Archive', title: 'The Cristóbal Silhouette', piece: 'Sculptural Wool Evening Coat',     price: 'Upon Request',  image_url: '', category: 'archive',   ph_class: 'ph-d' },
]

function LookCard({ item, index, onOpen }) {
  const ph      = item.ph_class || PH[index % PH.length]
  const init    = INIT[index % INIT.length]
  const hasImg  = !!item.image_url

  const handleClick = () => {
    if (hasImg && onOpen) onOpen()
  }

  return (
    <motion.article
      className={`${styles.card} ${!hasImg ? styles.cardPlaceholder : ''}`}
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.45, delay: index * 0.04 }}
    >
      <div
        className={styles.cardMedia}
        onClick={handleClick}
        style={{ cursor: hasImg ? 'zoom-in' : 'default' }}
      >
        {hasImg ? (
          <img src={item.image_url} alt={item.title} loading="lazy" className={styles.cardImg} />
        ) : (
          <div className={`${styles.cardPh} ${styles[ph]}`}>{init}</div>
        )}
        <div className={styles.cardOverlay}>
          <div className={styles.overlayBrand}>{item.brand}</div>
          <div className={styles.overlayPiece}>{item.piece}</div>
          <div className={styles.overlayPrice}>{item.price}</div>
          {hasImg && (
            <div className={styles.overlayZoom}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                <line x1="11" y1="8" x2="11" y2="14"/>
                <line x1="8" y1="11" x2="14" y2="11"/>
              </svg>
            </div>
          )}
        </div>
      </div>
      <div className={styles.cardMeta}>
        <div className={styles.cardTitle}>{item.title}</div>
        <div className={styles.cardBrand}>{item.brand}</div>
      </div>
    </motion.article>
  )
}

export default function Lookbook() {
  const [filter,  setFilter]  = useState('all')
  const [items,   setItems]   = useState(null)
  const [loading, setLoading] = useState(false)

  const load = useCallback(async (cat) => {
    setLoading(true)
    const { data, error } = await fetchLooks(cat)
    if (!error && data && data.length) {
      setItems(data)
    } else {
      const filtered = cat === 'all'
        ? FALLBACK
        : FALLBACK.filter(i => i.category === cat)
      setItems(filtered)
    }
    setLoading(false)
  }, [])

  useEffect(() => { load(filter) }, [filter, load])

  const lightboxImages = (items || [])
    .filter(i => i.image_url)
    .map(i => ({ url: i.image_url, alt: i.title, title: i.title, brand: i.brand }))

  const { openAt, LightboxComponent } = useLightbox(lightboxImages)

  const imageIndexMap = (items || []).reduce((acc, item, i) => {
    if (item.image_url) {
      const lightboxIdx = lightboxImages.findIndex(l => l.url === item.image_url)
      acc[i] = lightboxIdx
    }
    return acc
  }, {})

  return (
    <PageTransition>
      <Nav />
      <main className={styles.main}>
        <header className={styles.header}>
          <div className="eyebrow light center">The Collection</div>
          <h1 className={styles.title}>Lookbook</h1>
          <p className={styles.subtitle}>
            Curated from the world&rsquo;s most revered fashion houses
          </p>
        </header>

        <div className={styles.filterBar} role="tablist" aria-label="Filter by category">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              className={`${styles.filterBtn} ${filter === key ? styles.filterActive : ''}`}
              onClick={() => setFilter(key)}
              role="tab"
              aria-selected={filter === key}
            >
              {label}
            </button>
          ))}
        </div>

        {loading && items === null ? (
          <div className="load-state">
            <div className="spinner" />
            Loading collection&hellip;
          </div>
        ) : (
          <motion.div className={styles.grid} layout>
            <AnimatePresence mode="popLayout">
              {(items || []).map((item, i) => (
                <LookCard
                  key={item.id}
                  item={item}
                  index={i}
                  onOpen={imageIndexMap[i] != null ? () => openAt(imageIndexMap[i]) : null}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>
      <Footer />
      <AnimatePresence>{LightboxComponent}</AnimatePresence>
    </PageTransition>
  )
}
