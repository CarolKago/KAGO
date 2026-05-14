import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '../../components/ui/Button'
import { fetchLatestWeeklyEdit } from '../../lib/supabase'
import styles from './WeeklyEditPreview.module.css'

const PH = ['ph-a', 'ph-b', 'ph-c', 'ph-d', 'ph-e', 'ph-f']

const FALLBACK = {
  title: 'The Power Meridian',
  subtitle: 'Chalk-white linen. Absolute authority.',
  week_of: '2026-05-11',
  looks: [
    { id: 'w1', brand: 'Loro Piana',         title: 'The Ivory Column',   ph_class: 'ph-a' },
    { id: 'w2', brand: 'The Row',             title: 'Continental Ease',   ph_class: 'ph-b' },
    { id: 'w3', brand: 'Brunello Cucinelli',  title: 'The Refined Neutral', ph_class: 'ph-e' },
  ],
}

function formatWeekOf(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function WeeklyEditPreview() {
  const [edit, setEdit] = useState(null)

  useEffect(() => {
    fetchLatestWeeklyEdit().then(({ data }) => {
      if (data) setEdit(data)
    })
  }, [])

  const e = edit || FALLBACK
  const looks = (e.looks || []).slice(0, 3)

  return (
    <section className={styles.root}>
      <div className={styles.inner}>
        <div className={styles.layout}>

          {/* Left: editorial text */}
          <motion.div
            className={styles.text}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65 }}
          >
            <div className="eyebrow">The Weekly Edit</div>
            {e.week_of && (
              <div className={styles.date}>Week of {formatWeekOf(e.week_of)}</div>
            )}
            <h2 className={styles.title}>{e.title}</h2>
            {e.subtitle && (
              <p className={styles.sub}>{e.subtitle}</p>
            )}
            <Button as={Link} to="/weekly-edit" variant="ghostDark">
              Read This Edit &rsaquo;
            </Button>
          </motion.div>

          {/* Right: look thumbnails */}
          <div className={styles.looks}>
            {looks.map((look, i) => {
              const ph = look.ph_class || PH[i % PH.length]
              return (
                <motion.div
                  key={look.id}
                  className={styles.lookThumb}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className={`${styles.thumbImg} ${styles[ph]}`}>
                    {look.image_url
                      ? <img src={look.image_url} alt={look.title} loading="lazy" />
                      : <span className={styles.thumbInit}>{look.brand?.slice(0, 2).toUpperCase()}</span>
                    }
                  </div>
                  <div className={styles.thumbBrand}>{look.brand}</div>
                  <div className={styles.thumbTitle}>{look.title}</div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
