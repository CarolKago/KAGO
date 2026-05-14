import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import Button from '../../components/ui/Button'
import { Link } from 'react-router-dom'
import styles from './Hero.module.css'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.4, 0, 0.2, 1] } },
}

export default function Hero({ heroImage }) {
  const { openBooking } = useApp()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])

  return (
    <section className={styles.hero} ref={ref}>
      <div className={styles.noise} aria-hidden />

      {heroImage && (
        <motion.img
          className={styles.bg}
          src={heroImage}
          alt=""
          aria-hidden
          style={{ y: imgY }}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 0.18, scale: 1 }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
        />
      )}

      <motion.div
        className={styles.content}
        style={{ y: contentY }}
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        <motion.div className={styles.eyebrow} variants={fadeUp}>
          <span className={styles.eyebrowLine} />
          Private Atelier &mdash; London
          <span className={styles.eyebrowLine} />
        </motion.div>

        <motion.h1 className={styles.name} variants={fadeUp}>
          KAGO
        </motion.h1>

        <motion.div className={styles.est} variants={fadeUp}>
          Est. 2026
        </motion.div>

        <motion.div className={styles.rule} variants={fadeUp} />

        <motion.p className={styles.tagline} variants={fadeUp}>
          A private styling atelier for the discerning woman.<br />
          Curated from the world&rsquo;s most revered fashion houses.
        </motion.p>

        <motion.div className={styles.cta} variants={fadeUp}>
          <Button as={Link} to="/lookbook" variant="primary">
            Enter the Atelier &rsaquo;
          </Button>
          <Button variant="ghostLight" onClick={openBooking}>
            Request Consultation
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        className={styles.scroll}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        onClick={() => document.querySelector('#featured')?.scrollIntoView({ behavior: 'smooth' })}
        role="button"
        tabIndex={0}
        aria-label="Scroll down"
        onKeyDown={e => { if (e.key === 'Enter') document.querySelector('#featured')?.scrollIntoView({ behavior: 'smooth' }) }}
      >
        <span>Scroll</span>
        <div className={styles.scrollLine} />
      </motion.div>
    </section>
  )
}
