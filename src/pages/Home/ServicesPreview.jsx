import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '../../components/ui/Button'
import styles from './ServicesPreview.module.css'

const SERVICES = [
  { name: 'Wardrobe Architecture', price: 'From £1,200' },
  { name: 'The Power Edit',        price: 'From £2,500' },
  { name: 'Archive & Collector',   price: 'Upon Request' },
  { name: 'Creative Direction',    price: 'Upon Request' },
]

export default function ServicesPreview() {
  return (
    <section className={styles.section}>
      <motion.div
        className={styles.left}
        initial={{ opacity: 0, x: -24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.65 }}
      >
        <div className="eyebrow">02 &mdash; Services</div>
        <div className={`section-title ${styles.title}`}>
          What We <em>Offer</em>
        </div>
        <p className={`section-body ${styles.body}`}>
          Each engagement is private, considered, and utterly bespoke.
          No catalogues. No formulas.
        </p>
        <Button as={Link} to="/services" variant="ghostDark">
          Explore Services &rsaquo;
        </Button>
      </motion.div>

      <div className={styles.list}>
        {SERVICES.map(({ name, price }, i) => (
          <motion.div
            key={name}
            className={styles.row}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <Link to="/services" className={styles.rowLink}>
              <span className={styles.rowName}>{name}</span>
              <span className={styles.rowPrice}>{price}</span>
              <span className={styles.rowArrow}>&rsaquo;</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
