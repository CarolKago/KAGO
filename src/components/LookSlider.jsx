import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLightbox } from './Lightbox'
import styles from './LookSlider.module.css'

const VIEW_LABELS = { front: 'Front', back: 'Back', side: 'Profile', detail: 'Detail', hero: '' }
const PH = ['ph-a', 'ph-b', 'ph-c', 'ph-d', 'ph-e', 'ph-f']

const slide = {
  enter:  d => ({ opacity: 0, x: d > 0 ?  40 : -40 }),
  center:   { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } },
  exit:   d => ({ opacity: 0, x: d > 0 ? -40 :  40, transition: { duration: 0.3 } }),
}

// images: array of { url, view_type, alt_text }
// primaryUrl: fallback single image
// phClass: placeholder class
// title: look title (for lightbox)
// brand: look brand (for lightbox)
export default function LookSlider({ images = [], primaryUrl, phClass, title, brand, phInit }) {
  const allImages = primaryUrl
    ? [{ url: primaryUrl, view_type: 'front', alt_text: title }, ...images]
    : images

  const [idx, setIdx]       = useState(0)
  const [direction, setDir] = useState(1)

  const go = (next) => {
    setDir(next > idx ? 1 : -1)
    setIdx(next)
  }
  const prev = () => go((idx - 1 + allImages.length) % allImages.length)
  const next = () => go((idx + 1) % allImages.length)

  const lightboxImages = allImages.map(i => ({ url: i.url, alt: i.alt_text, title, brand }))
  const { openAt, LightboxComponent } = useLightbox(lightboxImages)

  const current = allImages[idx]
  const ph = phClass || PH[0]

  return (
    <div className={styles.root}>
      <div
        className={styles.main}
        onClick={() => { if (current?.url) openAt(idx) }}
        role={current?.url ? 'button' : undefined}
        tabIndex={current?.url ? 0 : undefined}
        aria-label={current?.url ? `View ${title} fullscreen` : undefined}
        onKeyDown={e => { if (e.key === 'Enter' && current?.url) openAt(idx) }}
        style={{ cursor: current?.url ? 'zoom-in' : 'default' }}
      >
        <AnimatePresence custom={direction} mode="wait" initial={false}>
          {current?.url ? (
            <motion.img
              key={idx}
              src={current.url}
              alt={current.alt_text || title || ''}
              className={styles.img}
              custom={direction}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              draggable={false}
            />
          ) : (
            <motion.div
              key="ph"
              className={`${styles.placeholder} ${styles[ph]}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {phInit && <span className={styles.phInit}>{phInit}</span>}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Swipe hint on mobile — invisible drag area */}
        {allImages.length > 1 && (
          <motion.div
            className={styles.dragArea}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragEnd={(_, info) => {
              if (info.offset.x < -50) next()
              if (info.offset.x >  50) prev()
            }}
            onClick={e => e.stopPropagation()}
          />
        )}

        {current?.view_type && VIEW_LABELS[current.view_type] && (
          <div className={styles.viewLabel}>{VIEW_LABELS[current.view_type]}</div>
        )}

        {allImages.length > 1 && current?.url && (
          <div className={styles.zoomHint}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
          </div>
        )}
      </div>

      {allImages.length > 1 && (
        <>
          <button className={`${styles.arrow} ${styles.prevArrow}`} onClick={prev} aria-label="Previous">‹</button>
          <button className={`${styles.arrow} ${styles.nextArrow}`} onClick={next} aria-label="Next">›</button>
          <div className={styles.dots}>
            {allImages.map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === idx ? styles.dotActive : ''}`}
                onClick={() => go(i)}
                aria-label={`Image ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}

      <AnimatePresence>{LightboxComponent}</AnimatePresence>
    </div>
  )
}
