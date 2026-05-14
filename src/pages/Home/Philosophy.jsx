import { motion } from 'framer-motion'
import styles from './Philosophy.module.css'

export default function Philosophy() {
  return (
    <section className={styles.section}>
      <motion.div
        className="eyebrow light center"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
      >
        The Philosophy
      </motion.div>

      <motion.blockquote
        className={styles.quote}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.75, delay: 0.12 }}
      >
        &ldquo;She does not dress to be <em>seen</em>&thinsp;&mdash;&thinsp;she dresses to <em>conquer</em>.&rdquo;
      </motion.blockquote>

      <motion.div
        className={styles.attr}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        KAGO Atelier &middot; London &middot; Est. 2026
      </motion.div>
    </section>
  )
}
