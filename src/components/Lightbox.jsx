import { useEffect, useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import styles from './Lightbox.module.css'

const overlay = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.3 } },
  exit:   { opacity: 0, transition: { duration: 0.25 } },
}
const img = {
  hidden: { opacity: 0, scale: 0.94 },
  show:   { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
  exit:   { opacity: 0, scale: 0.96, transition: { duration: 0.22 } },
}

// images: [{ url, alt, brand, title }]
// index: current index
// onClose: fn
// onPrev: fn
// onNext: fn
export function Lightbox({ images, index, onClose, onPrev, onNext }) {
  const current = images?.[index]

  const handleKey = useCallback((e) => {
    if (e.key === 'Escape')    onClose()
    if (e.key === 'ArrowLeft') onPrev()
    if (e.key === 'ArrowRight')onNext()
  }, [onClose, onPrev, onNext])

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [handleKey])

  if (!current) return null

  return createPortal(
    <motion.div
      className={styles.overlay}
      variants={overlay}
      initial="hidden"
      animate="show"
      exit="exit"
      onClick={onClose}
    >
      {/* Prev */}
      {images.length > 1 && (
        <button
          className={`${styles.arrow} ${styles.prev}`}
          onClick={e => { e.stopPropagation(); onPrev() }}
          aria-label="Previous image"
        >
          ‹
        </button>
      )}

      {/* Image */}
      <motion.div
        className={styles.frame}
        onClick={e => e.stopPropagation()}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.18}
        onDragEnd={(_, info) => {
          if (info.offset.x < -60) onNext()
          if (info.offset.x >  60) onPrev()
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={index}
            src={current.url}
            alt={current.alt || current.title || ''}
            className={styles.img}
            variants={img}
            initial="hidden"
            animate="show"
            exit="exit"
            draggable={false}
          />
        </AnimatePresence>

        {(current.brand || current.title) && (
          <div className={styles.caption}>
            {current.brand && <span className={styles.captionBrand}>{current.brand}</span>}
            {current.title && <span className={styles.captionTitle}>{current.title}</span>}
          </div>
        )}
      </motion.div>

      {/* Next */}
      {images.length > 1 && (
        <button
          className={`${styles.arrow} ${styles.next}`}
          onClick={e => { e.stopPropagation(); onNext() }}
          aria-label="Next image"
        >
          ›
        </button>
      )}

      {/* Dots */}
      {images.length > 1 && (
        <div className={styles.dots}>
          {images.map((_, i) => (
            <div key={i} className={`${styles.dot} ${i === index ? styles.dotActive : ''}`} />
          ))}
        </div>
      )}

      {/* Close */}
      <button className={styles.close} onClick={onClose} aria-label="Close">
        &times;
      </button>

      {/* Counter */}
      {images.length > 1 && (
        <div className={styles.counter}>{index + 1} / {images.length}</div>
      )}
    </motion.div>,
    document.body
  )
}

// Hook: manages lightbox state for a list of images
export function useLightbox(images = []) {
  const [open, setOpen]   = useState(false)
  const [index, setIndex] = useState(0)

  const openAt  = useCallback((i) => { setIndex(i); setOpen(true)  }, [])
  const close   = useCallback(()  => setOpen(false), [])
  const prev    = useCallback(()  => setIndex(i => (i - 1 + images.length) % images.length), [images.length])
  const next    = useCallback(()  => setIndex(i => (i + 1) % images.length), [images.length])

  const LightboxComponent = open ? (
    <Lightbox images={images} index={index} onClose={close} onPrev={prev} onNext={next} />
  ) : null

  return { openAt, LightboxComponent }
}
