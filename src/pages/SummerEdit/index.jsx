import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import Nav from '../../components/layout/Nav'
import Footer from '../../components/layout/Footer'
import PageTransition from '../../components/layout/PageTransition'
import Button from '../../components/ui/Button'
import { useApp } from '../../context/AppContext'
import styles from './SummerEdit.module.css'

const LOOKS = [
  {
    id: 'se1',
    brand: 'Jil Sander',
    title: 'The Ivory Column',
    desc:  'A sculpted linen shift — precise, minimal, unstoppable.',
    price: 'From £3,200',
    ph:    'ph-a',
  },
  {
    id: 'se2',
    brand: 'The Row',
    title: 'Continental Ease',
    desc:  'Oversized silk suiting in warm ecru. Effortless authority.',
    price: 'From £4,800',
    ph:    'ph-b',
  },
  {
    id: 'se3',
    brand: 'Loro Piana',
    title: 'The Shore Edit',
    desc:  'Coastal cashmere for the woman who owns every room.',
    price: 'From £6,200',
    ph:    'ph-c',
  },
  {
    id: 'se4',
    brand: 'Brunello Cucinelli',
    title: 'Golden Hour',
    desc:  'Washed silk separates in warm amber. Luxury in motion.',
    price: 'Upon Request',
    ph:    'ph-d',
  },
]

function LookItem({ look, index }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [30, -30])
  const isEven = index % 2 === 0

  return (
    <motion.div
      ref={ref}
      className={`${styles.look} ${isEven ? '' : styles.lookReverse}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className={styles.lookMedia}>
        <motion.div
          className={`${styles.lookPh} ${styles[look.ph]}`}
          style={{ y }}
        >
          <span className={styles.lookInit}>{look.brand.slice(0, 2).toUpperCase()}</span>
        </motion.div>
      </div>
      <div className={styles.lookContent}>
        <div className="eyebrow">{String(index + 1).padStart(2, '0')} &mdash; {look.brand}</div>
        <h2 className={styles.lookTitle}>{look.title}</h2>
        <p className={styles.lookDesc}>{look.desc}</p>
        <div className={styles.lookPrice}>{look.price}</div>
      </div>
    </motion.div>
  )
}

export default function SummerEdit() {
  const { openBooking } = useApp()
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '28%'])

  return (
    <PageTransition>
      <Nav transparent />
      <main className={styles.main}>

        {/* Cover */}
        <section className={styles.cover} ref={heroRef}>
          <div className={styles.coverNoise} aria-hidden />
          <motion.div className={styles.coverBg} style={{ y: heroY }} aria-hidden />
          <motion.div
            className={styles.coverContent}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
            <motion.div
              className={styles.coverSeason}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              The Summer Edit &mdash; London 2026
            </motion.div>
            <motion.h1
              className={styles.coverTitle}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.9 }}
            >
              Season<br />of<br /><em>Power</em>
            </motion.h1>
            <motion.p
              className={styles.coverSub}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.8 }}
            >
              Curated for the woman who does not wait<br />
              for permission to be extraordinary.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.7 }}
            >
              <Button variant="ghostLight" onClick={openBooking}>
                Request the Edit &rsaquo;
              </Button>
            </motion.div>
          </motion.div>
          <motion.div
            className={styles.coverScroll}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.8 }}
          >
            <span>Explore</span>
            <div className={styles.coverScrollLine} />
          </motion.div>
        </section>

        {/* Editorial intro */}
        <section className={styles.intro}>
          <motion.blockquote
            className={styles.introQuote}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.75 }}
          >
            &ldquo;Summer is not a season. It is a<br />
            state of <em>absolute certainty</em>.&rdquo;
          </motion.blockquote>
          <motion.p
            className={styles.introText}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.15 }}
          >
            KAGO&rsquo;s Summer Edit 2026 is a curation of restraint and
            intensity in equal measure. Linen, silk, fine cotton — chosen
            not for the season, but for the woman who understands that
            true luxury requires no explanation.
          </motion.p>
        </section>

        {/* Look editorial */}
        <section className={styles.looks}>
          {LOOKS.map((look, i) => (
            <LookItem key={look.id} look={look} index={i} />
          ))}
        </section>

        {/* Final CTA */}
        <section className={styles.finalCta}>
          <div className="eyebrow light center">The Edit Awaits</div>
          <p className={styles.finalTitle}>
            Secure your <em>Summer Edit</em><br />
            consultation.
          </p>
          <div className={styles.finalBtns}>
            <Button variant="ghostLight" onClick={openBooking}>
              Request a Consultation &rsaquo;
            </Button>
            <Button as={Link} to="/lookbook" variant="textLight">
              View Full Lookbook &rsaquo;
            </Button>
          </div>
        </section>

      </main>
      <Footer />
    </PageTransition>
  )
}
