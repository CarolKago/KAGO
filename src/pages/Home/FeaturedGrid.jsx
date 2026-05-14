import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchFeaturedLooks } from '../../lib/supabase'
import Button from '../../components/ui/Button'
import styles from './FeaturedGrid.module.css'

const PH_CLASSES = ['ph-a', 'ph-b', 'ph-c', 'ph-d', 'ph-e', 'ph-f']
const INITIALS   = ['LP', 'BC', 'AMQ', 'YSL', 'RL', 'CD']
const FALLBACK   = [
  { id: 'd1', brand: 'Loro Piana',        title: 'The Cashmere Power Suit', image_url: '', ph_class: 'ph-a' },
  { id: 'd2', brand: 'Brunello Cucinelli', title: 'The Refined Neutral',    image_url: '', ph_class: 'ph-b' },
  { id: 'd3', brand: 'Alexander McQueen', title: 'The Sculpted Femme',      image_url: '', ph_class: 'ph-c' },
  { id: 'd4', brand: 'Saint Laurent',     title: 'The Power Silhouette',    image_url: '', ph_class: 'ph-d' },
  { id: 'd5', brand: 'Ralph Lauren',      title: 'Understated Heritage',    image_url: '', ph_class: 'ph-e' },
  { id: 'd6', brand: 'Dior Vintage',      title: 'The New Look Reborn',     image_url: '', ph_class: 'ph-f' },
]

function GridItem({ item, index }) {
  const ph = item.ph_class || PH_CLASSES[index % PH_CLASSES.length]
  const init = INITIALS[index % INITIALS.length]
  return (
    <motion.div
      className={styles.item}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.07 }}
    >
      <Link to="/lookbook" className={styles.itemInner} aria-label={item.title}>
        {item.image_url ? (
          <img src={item.image_url} alt={item.title} loading="lazy" className={styles.img} />
        ) : (
          <div className={`${styles.placeholder} ${styles[ph]}`}>{init}</div>
        )}
        <div className={styles.caption}>
          <div className={styles.captionBrand}>{item.brand}</div>
          <div className={styles.captionName}>{item.title}</div>
        </div>
      </Link>
    </motion.div>
  )
}

export default function FeaturedGrid({ onHeroImage }) {
  const [items, setItems] = useState(null)

  useEffect(() => {
    async function load() {
      const { data, error } = await fetchFeaturedLooks(6)
      if (!error && data && data.length) {
        setItems(data)
        if (data[0]?.image_url && onHeroImage) onHeroImage(data[0].image_url)
      } else {
        // Try localStorage cache
        try {
          const stored = localStorage.getItem('kago_outfits_v1')
          const local  = stored ? JSON.parse(stored) : FALLBACK
          const feat   = local.filter(o => o.featured).slice(0, 6)
          setItems(feat.length ? feat : FALLBACK)
        } catch {
          setItems(FALLBACK)
        }
      }
    }
    load()
    const bc = window.BroadcastChannel ? new BroadcastChannel('kago_sync') : null
    if (bc) bc.onmessage = e => { if (e.data?.type === 'outfits_updated') load() }
    const onStorage = e => { if (e.key === 'kago_outfits_v1') load() }
    window.addEventListener('storage', onStorage)
    return () => { bc?.close(); window.removeEventListener('storage', onStorage) }
  }, [onHeroImage])

  return (
    <section className={styles.section} id="featured">
      <div className={styles.head}>
        <div>
          <div className="eyebrow">01 &mdash; Featured Looks</div>
          <div className="section-title" style={{ fontSize: 'clamp(30px, 4vw, 52px)' }}>
            The <em>Lookbook</em>
          </div>
        </div>
        <Button as={Link} to="/lookbook" variant="text">
          View Full Collection &rsaquo;
        </Button>
      </div>

      {items === null ? (
        <div className="load-state">
          <div className="spinner dark" />
          Loading&hellip;
        </div>
      ) : (
        <div className={styles.grid}>
          {items.map((item, i) => <GridItem key={item.id} item={item} index={i} />)}
        </div>
      )}
    </section>
  )
}
