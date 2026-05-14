import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import Button from '../../components/ui/Button'
import styles from './SummerPreview.module.css'

const LOOKS = [
  { id: 1, ph: 'ph-b', brand: 'Brunello Cucinelli', title: 'The Terrace Edit' },
  { id: 2, ph: 'ph-f', brand: 'The Row', title: 'The Garden Evening' },
  { id: 3, ph: 'ph-e', brand: 'Loro Piana', title: 'The Power Meridian' },
]

export default function SummerPreview() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-4%', '4%'])

  return (
    <section className={styles.root} ref={ref}>
      <motion.div className={styles.bg} style={{ y }} aria-hidden />

      <div className={styles.inner}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65 }}
          className={styles.head}
        >
          <div className="eyebrow light">Summer 2026</div>
          <h2 className={styles.title}>The Summer<br />Lookbook</h2>
          <p className={styles.sub}>
            Five curated looks for a season of quiet authority.
            Chalk-white linen, ivory silk, sun-warmed cashmere.
          </p>
        </motion.div>

        <div className={styles.grid}>
          {LOOKS.map((look, i) => (
            <motion.div
              key={look.id}
              className={styles.card}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
            >
              <div className={`${styles.cardPh} ${styles[look.ph]}`}>
                <span className={styles.cardInit}>{look.brand.slice(0, 2).toUpperCase()}</span>
              </div>
              <div className={styles.cardMeta}>
                <div className={styles.cardBrand}>{look.brand}</div>
                <div className={styles.cardTitle}>{look.title}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className={styles.cta}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Button as={Link} to="/summer-lookbook" variant="primary">
            View the Lookbook &rsaquo;
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
