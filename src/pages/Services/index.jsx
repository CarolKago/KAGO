import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Nav from '../../components/layout/Nav'
import Footer from '../../components/layout/Footer'
import PageTransition from '../../components/layout/PageTransition'
import Button from '../../components/ui/Button'
import { useApp } from '../../context/AppContext'
import styles from './Services.module.css'

const SERVICES = [
  {
    id: 's1',
    number: '01',
    name: 'Wardrobe Architecture',
    duration: 'Half or full day',
    description:
      'A complete audit and reconstruction of your wardrobe. We identify what serves you, remove what does not, and curate a precise capsule that speaks to your identity and ambitions. Every item earns its place.',
    includes: [
      'Pre-session style questionnaire',
      'Full wardrobe audit (4–6 hours)',
      'Curated edit of 30–50 pieces',
      'Outfit blueprint guide',
      'Priority shopping list',
    ],
  },
  {
    id: 's2',
    number: '02',
    name: 'The Power Edit',
    duration: 'Full day experience',
    description:
      'For the woman who commands every room she enters. We build a wardrobe of extraordinary pieces — sourced personally from the finest fashion houses — designed to project authority, femininity, and unforgettable presence.',
    includes: [
      'Personal shopping at curated boutiques',
      'Access to exclusive private showrooms',
      'Alterations coordination',
      'Six-month follow-up session',
      'Dedicated styling concierge',
    ],
  },
  {
    id: 's3',
    number: '03',
    name: 'Archive & Collector',
    duration: 'By arrangement',
    description:
      'Access to our private network of archive dealers, auction houses, and estate collections. We source singular vintage and heritage pieces — Chanel, Balenciaga, Dior, Halston — for the discerning collector.',
    includes: [
      'Access to private archive network',
      'Authentication consultation',
      'Condition and provenance reporting',
      'Storage and conservation advice',
      'Discreet acquisition handling',
    ],
  },
  {
    id: 's4',
    number: '04',
    name: 'Creative Direction',
    duration: 'By arrangement',
    description:
      'For campaigns, editorial shoots, and brand presentations requiring an elevated visual intelligence. We bring the full language of luxury fashion to your creative vision.',
    includes: [
      'Concept and mood development',
      'Talent and location scouting',
      'Full wardrobe sourcing and styling',
      'On-set creative direction',
      'Post-production styling consultation',
    ],
  },
]

function ServiceSection({ svc, index }) {
  const { openBooking } = useApp()
  const isReverse = index % 2 !== 0
  return (
    <motion.section
      className={`${styles.section} ${isReverse ? styles.reverse : ''}`}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7 }}
    >
      <div className={styles.visual}>
        <div className={`${styles.placeholder} ${styles[`ph${index}`]}`}>
          <span>{svc.number}</span>
        </div>
        <div className={styles.tag}>{svc.duration}</div>
      </div>

      <div className={styles.content}>
        <div className="eyebrow">{svc.number} &mdash; {svc.name}</div>
        <h2 className={styles.name}>{svc.name}</h2>
        <p className={styles.desc}>{svc.description}</p>
        <ul className={styles.includes}>
          {svc.includes.map(item => (
            <li key={item} className={styles.includesItem}>
              <span className={styles.bullet} />
              {item}
            </li>
          ))}
        </ul>
        <Button onClick={openBooking} variant="primary">
          Enquire &rsaquo;
        </Button>
      </div>
    </motion.section>
  )
}

export default function Services() {
  const { openBooking } = useApp()
  return (
    <PageTransition>
      <Nav />
      <main>
        <header className={styles.hero}>
          <div>
            <div className="eyebrow">Private Atelier</div>
            <h1 className={styles.heroTitle}>
              Our <em>Services</em>
            </h1>
          </div>
          <div className={styles.heroRight}>
            <div className={styles.heroDivider} />
            <p className={styles.heroBody}>
              Each engagement is private, considered, and utterly bespoke.
              No catalogues. No formulas. Only the precise intervention your
              wardrobe — and your life — requires.
            </p>
            <Button onClick={openBooking} variant="ghostDark">
              Book a Consultation &rsaquo;
            </Button>
          </div>
        </header>

        {SERVICES.map((svc, i) => (
          <ServiceSection key={svc.id} svc={svc} index={i} />
        ))}

        <section className={styles.cta}>
          <div className="eyebrow light center">Begin</div>
          <p className={styles.ctaTitle}>
            The right wardrobe changes<br /><em>everything</em>.
          </p>
          <Button onClick={openBooking} variant="ghostLight">
            Request a Private Consultation &rsaquo;
          </Button>
        </section>
      </main>
      <Footer />
    </PageTransition>
  )
}
