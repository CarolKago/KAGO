import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Nav from '../../components/layout/Nav'
import Footer from '../../components/layout/Footer'
import PageTransition from '../../components/layout/PageTransition'
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
  { id: 'd1', brand: 'Loro Piana',        title: 'The Cashmere Power Suit', piece: 'Cashmere Tailored Suit', price: 'From £8,400', image_url: '', category: 'power',    ph_class: 'ph-a' },
  { id: 'd2', brand: 'Brunello Cucinelli', title: 'The Refined Neutral',    piece: 'Linen Blazer & Trousers', price: 'From £5,200', image_url: '', category: 'editorial', ph_class: 'ph-b' },
  { id: 'd3', brand: 'Alexander McQueen', title: 'The Sculpted Femme',      piece: 'Fitted Blazer & Sheath', price: 'From £4,800', image_url: '', category: 'editorial', ph_class: 'ph-c' },
  { id: 'd4', brand: 'Saint Laurent',     title: 'The Power Silhouette',    piece: 'Le Smoking Tuxedo', price: 'From £6,000', image_url: '', category: 'evening',   ph_class: 'ph-d' },
  { id: 'd5', brand: 'Ralph Lauren',      title: 'Understated Heritage',    piece: 'Purple Label Tweed', price: 'From £3,800', image_url: '', category: 'power',    ph_class: 'ph-e' },
  { id: 'd6', brand: 'Dior Vintage',      title: 'The New Look Reborn',     piece: 'Bar Jacket & Pencil Skirt', price: 'Upon Request', image_url: '', category: 'archive',  ph_class: 'ph-f' },
]

function LookCard({ item, index }) {
  const ph   = item.ph_class || PH[index % PH.length]
  const init = INIT[index % INIT.length]
  return (
    <motion.article
      className={styles.card}
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.45, delay: index * 0.04 }}
    >
      <div className={styles.cardMedia}>
        {item.image_url ? (
          <img src={item.image_url} alt={item.title} loading="lazy" className={styles.cardImg} />
        ) : (
          <div className={`${styles.cardPh} ${styles[ph]}`}>{init}</div>
        )}
        <div className={styles.cardOverlay}>
          <div className={styles.overlayBrand}>{item.brand}</div>
          <div className={styles.overlayPiece}>{item.piece}</div>
          <div className={styles.overlayPrice}>{item.price}</div>
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
                <LookCard key={item.id} item={item} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>
      <Footer />
    </PageTransition>
  )
}
