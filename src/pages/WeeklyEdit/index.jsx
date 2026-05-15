import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Nav from '../../components/layout/Nav'
import Footer from '../../components/layout/Footer'
import PageTransition from '../../components/layout/PageTransition'
import LookSlider from '../../components/LookSlider'
import Button from '../../components/ui/Button'
import { fetchAllWeeklyEdits, fetchWeeklyEditById } from '../../lib/supabase'
import { useApp } from '../../context/AppContext'
import styles from './WeeklyEdit.module.css'

const PH = ['ph-a', 'ph-b', 'ph-c', 'ph-d', 'ph-e', 'ph-f']

// Fallback content for when Supabase has no data
const FALLBACK_EDIT = {
  id: 'fallback',
  title: 'The Power Meridian',
  subtitle: 'Chalk-white linen. Absolute authority.',
  editorial_note: "This week's edit is built around the principle that summer's most powerful palette is the absence of colour. White, ivory, ecru — chosen with absolute precision for the woman who chairs the meeting and attends the opening on the same day.",
  week_of: '2026-05-11',
  looks: [
    { id: 'w1', brand: 'Loro Piana', title: 'The Ivory Column', image_url: '', ph_class: 'ph-a' },
    { id: 'w2', brand: 'The Row', title: 'Continental Ease', image_url: '', ph_class: 'ph-b' },
    { id: 'w3', brand: 'Brunello Cucinelli', title: 'The Refined Neutral', image_url: '', ph_class: 'ph-e' },
  ],
}

function formatWeekOf(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

function LookCard({ look, index }) {
  const ph = look.ph_class || PH[index % PH.length]
  return (
    <motion.div
      className={styles.lookCard}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: index * 0.08 }}
    >
      <div className={styles.lookCardMedia}>
        {look.image_url ? (
          <img src={look.image_url} alt={look.title} loading="lazy" className={styles.lookCardImg} />
        ) : (
          <div className={`${styles.lookCardPh} ${styles[ph]}`}>
            {look.brand?.slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>
      <div className={styles.lookCardMeta}>
        <div className={styles.lookCardBrand}>{look.brand}</div>
        <div className={styles.lookCardTitle}>{look.title}</div>
      </div>
    </motion.div>
  )
}

export default function WeeklyEdit() {
  const { openBooking } = useApp()
  const [edit, setEdit] = useState(null)
  const [all,  setAll]  = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      // Fetch latest edit with looks
      const { data: edits } = await fetchAllWeeklyEdits()
      if (edits && edits.length) {
        setAll(edits)
        const { data: full } = await fetchWeeklyEditById(edits[0].id)
        setEdit(full || FALLBACK_EDIT)
      } else {
        setEdit(FALLBACK_EDIT)
      }
      setLoading(false)
    }
    load()
  }, [])

  const display = edit || FALLBACK_EDIT

  return (
    <PageTransition>
      <Nav />
      <main className={styles.main}>

        {/* Header */}
        <header className={styles.header}>
          <motion.div className="eyebrow light"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}>
            The Weekly Edit
          </motion.div>
          <motion.h1 className={styles.headerTitle}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}>
            {display.title}
          </motion.h1>
          {display.subtitle && (
            <motion.p className={styles.headerSub}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.22 }}>
              {display.subtitle}
            </motion.p>
          )}
          {display.week_of && (
            <motion.div className={styles.headerDate}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.32 }}>
              Week of {formatWeekOf(display.week_of)}
            </motion.div>
          )}
        </header>

        {/* Editorial note */}
        {display.editorial_note && (
          <section className={styles.note}>
            <motion.blockquote className={styles.noteText}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7 }}>
              {display.editorial_note}
            </motion.blockquote>
          </section>
        )}

        {/* Hero image */}
        {display.hero_image_url && (
          <section className={styles.heroImg}>
            <img src={display.hero_image_url} alt={display.title} />
          </section>
        )}

        {/* Looks grid */}
        <section className={styles.looks}>
          <div className="eyebrow">The Selection</div>
          <div className={styles.looksGrid}>
            {(display.looks || []).map((look, i) => (
              <LookCard key={look.id} look={look} index={i} />
            ))}
          </div>
          <motion.div className={styles.looksCta}
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
            <Button onClick={openBooking} variant="primary">
              Request This Edit &rsaquo;
            </Button>
            <Button as={Link} to="/lookbook" variant="ghostDark">
              View Full Lookbook &rsaquo;
            </Button>
          </motion.div>
        </section>

        {/* Archive of past edits */}
        {all.length > 1 && (
          <section className={styles.archive}>
            <div className="eyebrow">Past Edits</div>
            <div className={styles.archiveList}>
              {all.slice(1, 6).map((e, i) => (
                <motion.div key={e.id} className={styles.archiveRow}
                  initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.06 }}>
                  <div>
                    <div className={styles.archiveTitle}>{e.title}</div>
                    {e.subtitle && <div className={styles.archiveSub}>{e.subtitle}</div>}
                  </div>
                  <div className={styles.archiveDate}>{formatWeekOf(e.week_of)}</div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

      </main>
      <Footer />
    </PageTransition>
  )
}
