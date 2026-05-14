import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Nav from '../../components/layout/Nav'
import Footer from '../../components/layout/Footer'
import PageTransition from '../../components/layout/PageTransition'
import LookSlider from '../../components/LookSlider'
import { useLightbox } from '../../components/Lightbox'
import Button from '../../components/ui/Button'
import { fetchSummerLooks, fetchLookImages } from '../../lib/supabase'
import { useApp } from '../../context/AppContext'
import styles from './SummerLookbook.module.css'

// ── Editorial fallback (mirrors kago_summer_edit_2026.html) ────
const FALLBACK_LOOKS = [
  {
    id: 'se-1', look_number: 1, brand: 'Brunello Cucinelli', title: 'The Terrace Edit',
    occasion: "Private Members' Club · Al Fresco Lunch · Afternoon Meetings",
    story: "She arrives at Annabel's at 12:45 for a lunch that was “casual” only in the calendar description. The sand linen blazer catches the light coming through the garden doors. Nothing matches exactly. Everything coordinates precisely. This is the difference between dressing and styling. She orders sparkling water. She is the most powerful woman at the table. Nobody needed to be told.",
    image_url: '', ph_class: 'ph-b',
    pieces: [
      { house: 'Brunello Cucinelli', piece: 'Double-breasted linen blazer in sand', price: '~£2,800', href: 'https://shop.brunellocucinelli.com/en-gb/women/ready-to-wear/blazers/' },
      { house: 'Loro Piana', piece: 'Goldie linen wide-leg trousers, natural undyed', price: '~£1,750', href: 'https://uk.loropiana.com/en/c/woman/trousers-and-shorts' },
      { house: 'Christian Louboutin', piece: 'Just Nothing mule 55mm, blush', price: '~£595', href: 'https://uk.christianlouboutin.com/uk_en/ladies/shoes/mules/' },
      { house: 'Bottega Veneta', piece: 'Andiamo bag, natural tan intrecciato', price: '~£4,200', href: 'https://www.bottegaveneta.com/en-gb/bags/andiamo' },
    ],
  },
  {
    id: 'se-2', look_number: 2, brand: 'The Row', title: 'The Garden Evening',
    occasion: "Serpentine Gallery · Garden Party · Summer Opening · Champagne at Dusk",
    story: "The silk catches the last light of a London July evening at 8:47pm. She is holding a glass of Ruinart Blanc de Blancs and saying very little. The art on the walls is interesting. She is more interesting. Three people ask who she is. One of them is the artist.",
    image_url: '', ph_class: 'ph-f',
    pieces: [
      { house: 'The Row', piece: 'Guinevere silk charmeuse slip dress in ivory', price: '~£2,100', href: 'https://www.therow.com/collections/women-dresses' },
      { house: 'The Row', piece: 'Cashmere-silk wrap in cognac', price: '~£980', href: 'https://www.therow.com/collections/women-accessories' },
      { house: 'Christian Louboutin', piece: 'Miss Z strappy sandal 100mm, Vintage Rose', price: '~£875', href: 'https://uk.christianlouboutin.com/uk_en/ladies/shoes/sandals-slides/' },
      { house: 'Cartier', piece: 'Tank Must watch, yellow gold', price: 'From £2,800', href: 'https://www.cartier.com/en-gb/collections/watches/women-watches/' },
    ],
  },
  {
    id: 'se-3', look_number: 3, brand: 'Loro Piana', title: 'The Power Meridian',
    occasion: "Client Board · Advisory Meeting · City Lunch · Canary Wharf or Mayfair",
    story: "The chalk-white suit walks into the room before she does. Nobody calls the meeting to order. She does. There are fourteen people at the table. She is the only one in linen-silk. The rest are in polyester they are pretending is wool. She notices. She says nothing. She does not need to.",
    image_url: '', ph_class: 'ph-e',
    pieces: [
      { house: 'Loro Piana', piece: 'Spagna linen-silk jacket in chalk white', price: '~£3,200', href: 'https://uk.loropiana.com/en/lp-spring-summer/woman' },
      { house: 'Loro Piana', piece: 'Hector silk-linen trousers in chalk white', price: '~£1,930', href: 'https://uk.loropiana.com/en/c/woman/trousers-and-shorts' },
      { house: 'Christian Louboutin', piece: 'So Kate pump 120mm, black patent', price: '~£695', href: 'https://uk.christianlouboutin.com/uk_en/ladies/shoes/pumps/' },
      { house: 'Bottega Veneta', piece: 'Andiamo large, black intrecciato', price: '~£6,800', href: 'https://www.bottegaveneta.com/en-gb/bags/andiamo' },
    ],
  },
  {
    id: 'se-4', look_number: 4, brand: 'The Row', title: 'The Archive Weekend',
    occasion: "Portobello Market · Auction Preview · Saturday in Chelsea · Collector's Afternoon",
    story: "She is not at Portobello to browse. She is there to acquire. The dealers know her. They bring things out from the back. The cream trouser hems skim the cobblestones without touching. She finds a 1968 Chanel chain belt in a velvet tray. She negotiates quietly. She wins. She was going to win before she arrived.",
    image_url: '', ph_class: 'ph-a',
    pieces: [
      { house: 'The Row', piece: 'Nori wide-leg trouser in cream cotton', price: '~£940', href: 'https://www.therow.com/collections/women-trousers' },
      { house: 'Loro Piana', piece: 'Linen-silk blouse in natural ecru', price: '~£1,100', href: 'https://uk.loropiana.com/en/c/woman/shirts-and-blouses' },
      { house: 'Christian Louboutin', piece: 'Her In Roma flat sandal, Saharienne nubuck', price: '~£595', href: 'https://uk.christianlouboutin.com/uk_en/ladies/shoes/sandals-slides/' },
      { house: 'Bottega Veneta', piece: 'Cabat tote in natural intrecciato', price: '~£5,200', href: 'https://www.bottegaveneta.com/en-gb/bags/totes' },
    ],
  },
  {
    id: 'se-5', look_number: 5, brand: 'Saint Laurent', title: 'The Evening Reckoning',
    occasion: "Private Dinner · Mayfair Restaurant · Opera · The Moment She Walks In",
    story: "She does not enter the restaurant. The restaurant becomes the place she is in. The maître d' escorts her to the table before she asks. The man she is dining with stands up when she arrives. They all do. The tuxedo is summer because she made it summer. That is what dressing with intention means.",
    image_url: '', ph_class: 'ph-d',
    pieces: [
      { house: 'Saint Laurent', piece: 'Le Smoking tuxedo jacket in black crepe', price: '~£3,800', href: 'https://www.ysl.com/en-gb/clothing/women-jackets-and-coats' },
      { house: 'Saint Laurent', piece: 'High-waisted cigarette trouser, black satin-crepe', price: '~£1,200', href: 'https://www.ysl.com/en-gb/clothing/women-trousers' },
      { house: 'Christian Louboutin', piece: 'Pigalle Follies pump 100mm, black patent', price: '~£745', href: 'https://uk.christianlouboutin.com/uk_en/ladies/shoes/pumps/' },
      { house: 'Cartier', piece: 'Tank Must watch, yellow gold', price: 'From £2,800', href: 'https://www.cartier.com/en-gb/collections/watches/women-watches/' },
    ],
  },
]

// ── Cover with parallax ─────────────────────────────────────────
function Cover() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y    = useTransform(scrollYProgress, [0, 1], ['0%', '28%'])
  const fade = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section className={styles.cover} ref={ref}>
      <div className={styles.coverNoise} aria-hidden />
      <motion.div className={styles.coverBg} style={{ y }} aria-hidden />

      <motion.div className={styles.coverContent} style={{ opacity: fade }}>
        <motion.div className={styles.coverRule}
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.4, 0, 0.2, 1] }} />
        <motion.div className={styles.coverEye}
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}>
          KAGO Private Atelier &middot; Curated Summer Edit &middot; London 2026
        </motion.div>
        <motion.h1 className={styles.coverTitle}
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.9 }}>
          The Summer
        </motion.h1>
        <motion.div className={styles.coverSub}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}>
          LONDON
        </motion.div>
        <motion.p className={styles.coverMeta}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}>
          Five complete looks for the discerning woman.<br />
          Summer 2026 &middot; Curated for warmth, power and occasion.
        </motion.p>
        <motion.div className={styles.coverRuleBot}
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 1.3 }} />
      </motion.div>

      <motion.div className={styles.scrollHint}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}>
        <span>Scroll</span>
        <div className={styles.scrollLine} />
      </motion.div>
    </section>
  )
}

// ── Intro ───────────────────────────────────────────────────────
function Intro() {
  return (
    <section className={styles.intro}>
      <motion.div className="eyebrow center"
        initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6 }}>
        A Note from the Atelier
      </motion.div>
      <motion.h2 className={styles.introTitle}
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7, delay: 0.1 }}>
        Dressed for a London Summer<br />That Means Something
      </motion.h2>
      <motion.p className={styles.introBody}
        initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.65, delay: 0.2 }}>
        London in summer is not Ibiza. It is Serpentine Gallery openings, Glyndebourne,
        private members&rsquo; terrace lunches, boardroom windows left ajar. It calls for
        clothing that is cool to the touch but never casual in intention. These five looks
        are curated for a woman who moves between worlds with the same assurance.
      </motion.p>
    </section>
  )
}

// ── Single Look Section ─────────────────────────────────────────
function LookSection({ look, extraImages = [], index }) {
  const isEven = index % 2 === 0
  const { openBooking } = useApp()

  const allImages = look.image_url
    ? [{ url: look.image_url, view_type: 'front' }, ...extraImages]
    : extraImages

  const lightboxImgs = allImages.map(i => ({ url: i.url, alt: i.alt_text, title: look.title, brand: look.brand }))
  const { openAt, LightboxComponent } = useLightbox(lightboxImgs)

  return (
    <motion.article
      className={`${styles.look} ${!isEven ? styles.lookReverse : ''}`}
      id={`look-${look.look_number || index + 1}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Image area */}
      <div className={styles.lookMedia}>
        {look.image_url ? (
          <div
            className={styles.lookImgWrap}
            onClick={() => openAt(0)}
            role="button"
            tabIndex={0}
            aria-label={`View ${look.title} fullscreen`}
            onKeyDown={e => { if (e.key === 'Enter') openAt(0) }}
          >
            <img src={look.image_url} alt={look.title} className={styles.lookImg} loading="lazy" />
            {extraImages.length > 0 && (
              <div className={styles.lookThumbRow}>
                {extraImages.slice(0, 2).map((img, i) => (
                  <div key={i} className={styles.lookThumb} onClick={e => { e.stopPropagation(); openAt(i + 1) }}>
                    <img src={img.url} alt={img.alt_text || ''} />
                  </div>
                ))}
              </div>
            )}
            <div className={styles.lookZoom}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
              </svg>
            </div>
          </div>
        ) : (
          <LookSlider
            images={extraImages}
            primaryUrl={null}
            phClass={look.ph_class}
            phInit={look.brand?.slice(0, 2).toUpperCase()}
            title={look.title}
            brand={look.brand}
          />
        )}
      </div>

      {/* Content */}
      <div className={styles.lookContent}>
        <div className={styles.lookNum}>
          {String(look.look_number || index + 1).padStart(2, '0')} of 05
        </div>
        <div className="eyebrow">{look.brand}</div>
        <h2 className={styles.lookTitle}>{look.title}</h2>
        {look.occasion && (
          <div className={styles.lookOccasion}>{look.occasion}</div>
        )}

        {look.pieces && look.pieces.length > 0 && (
          <div className={styles.pieces}>
            <div className={styles.piecesLabel}>The Look</div>
            {look.pieces.map((p, i) => (
              <div key={i} className={styles.piece}>
                <div className={styles.pieceHouse}>{p.house}</div>
                <div className={styles.pieceName}>{p.piece}</div>
                <div className={styles.piecePrice}>{p.price}</div>
                {p.href && (
                  <a href={p.href} target="_blank" rel="noopener noreferrer" className={styles.pieceLink}>
                    Shop {p.house.split(' ')[0]} &rsaquo;
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {look.story && (
          <blockquote className={styles.lookStory}>
            {look.story}
          </blockquote>
        )}

        <Button onClick={openBooking} variant="ghostDark">
          Request This Look &rsaquo;
        </Button>
      </div>

      <AnimatePresence>{LightboxComponent}</AnimatePresence>
    </motion.article>
  )
}

// ── Divider ─────────────────────────────────────────────────────
function Divider({ label }) {
  return (
    <motion.div className={styles.divider}
      initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
      viewport={{ once: true }} transition={{ duration: 0.6 }}>
      <div className={styles.dividerLine} />
      <div className={styles.dividerMark}>{label}</div>
      <div className={styles.dividerLine} />
    </motion.div>
  )
}

// ── Page ────────────────────────────────────────────────────────
const LOOK_LABELS = ['Look One', 'Look Two', 'Look Three', 'Look Four', 'Look Five']

export default function SummerLookbook() {
  const { openBooking } = useApp()
  const [looks, setLooks]       = useState(null)
  const [lookImages, setImages] = useState({})

  useEffect(() => {
    async function load() {
      const { data, error } = await fetchSummerLooks(10)
      if (!error && data && data.length) {
        setLooks(data)
        // Fetch extra images for each look
        data.forEach(async (look) => {
          const { data: imgs } = await fetchLookImages(look.id)
          if (imgs && imgs.length) {
            setImages(prev => ({ ...prev, [look.id]: imgs }))
          }
        })
      } else {
        setLooks(FALLBACK_LOOKS)
      }
    }
    load()
  }, [])

  const displayLooks = looks || FALLBACK_LOOKS

  return (
    <PageTransition>
      <Nav transparent />
      <main className={styles.main}>
        <Cover />
        <Intro />

        {displayLooks.map((look, i) => (
          <div key={look.id}>
            {i > 0 && <Divider label={LOOK_LABELS[i] || `Look ${i + 1}`} />}
            <LookSection look={look} extraImages={lookImages[look.id] || []} index={i} />
          </div>
        ))}

        <section className={styles.editorial}>
          <motion.p className={styles.editorialNote}
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}>
            All pieces are sourced directly from the maisons listed.<br />
            Pricing is approximate and subject to change.<br />
            For private acquisition assistance, contact the atelier directly.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}>
            <Button onClick={openBooking} variant="ghostLight">
              Request a Private Consultation &rsaquo;
            </Button>
          </motion.div>
        </section>
      </main>
      <Footer />
    </PageTransition>
  )
}
