import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { insertRateCardRequest } from '../lib/supabase'
import styles from './RateCardModal.module.css'

const overlay = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.25 } },
  exit:   { opacity: 0, transition: { duration: 0.2 } },
}
const panel = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  show:   { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } },
  exit:   { opacity: 0, y: 12, scale: 0.98, transition: { duration: 0.2 } },
}

// phase: 'ask' | 'collect' | 'done' | 'declined'

export default function RateCardModal() {
  const { rateCardOpen, closeRateCard } = useApp()
  const [phase,   setPhase]   = useState('ask')
  const [loading, setLoading] = useState(false)
  const [form,    setForm]    = useState({ name: '', email: '' })

  function set(k) {
    return e => setForm(f => ({ ...f, [k]: e.target.value }))
  }

  function handleClose() {
    closeRateCard()
    setTimeout(() => { setPhase('ask'); setForm({ name: '', email: '' }) }, 350)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.email) return
    setLoading(true)

    const req = {
      name:       form.name || null,
      email:      form.email,
      requested_at: new Date().toISOString(),
      source:     'website',
    }

    const { error } = await insertRateCardRequest(req)

    // Fallback: save locally if Supabase not configured
    if (error) {
      try {
        const stored = JSON.parse(localStorage.getItem('kago_rate_requests') || '[]')
        stored.push(req)
        localStorage.setItem('kago_rate_requests', JSON.stringify(stored))
      } catch { /* silent */ }
    }

    setLoading(false)
    setPhase('done')
  }

  return (
    <AnimatePresence>
      {rateCardOpen && (
        <motion.div
          className={styles.overlay}
          variants={overlay}
          initial="hidden"
          animate="show"
          exit="exit"
          onClick={handleClose}
        >
          <motion.div
            className={styles.panel}
            variants={panel}
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Private Rate Card"
          >
            {/* Header */}
            <div className={styles.head}>
              <div className={styles.title}>Private Rate Card</div>
              <button className={styles.close} onClick={handleClose} aria-label="Close">&times;</button>
            </div>

            {/* Ask phase */}
            {phase === 'ask' && (
              <div className={styles.body}>
                <div className={styles.eyebrow}>Exclusively Private</div>
                <p className={styles.question}>
                  Our rates are bespoke and entirely private — tailored to each client
                  and the scope of their engagement.
                </p>
                <p className={styles.sub}>
                  Would you like to receive our private rate card by email?
                </p>
                <div className={styles.actions}>
                  <button className={styles.yes} onClick={() => setPhase('collect')}>
                    Yes — send me the rate card
                  </button>
                  <button className={styles.no} onClick={() => setPhase('declined')}>
                    Not right now
                  </button>
                </div>
              </div>
            )}

            {/* Collect email phase */}
            {phase === 'collect' && (
              <form className={styles.body} onSubmit={handleSubmit}>
                <div className={styles.eyebrow}>Your Details</div>
                <p className={styles.sub}>
                  Your rate card will arrive within 24 hours, handled with complete discretion.
                </p>
                <div className="form-field">
                  <label className="form-label" htmlFor="rc-name">Your Name</label>
                  <input
                    id="rc-name"
                    className="form-input"
                    type="text"
                    placeholder="Full name"
                    value={form.name}
                    onChange={set('name')}
                    autoComplete="name"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="rc-email">Email Address <span className={styles.req}>*</span></label>
                  <input
                    id="rc-email"
                    className="form-input"
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={set('email')}
                    required
                    autoComplete="email"
                  />
                </div>
                <button
                  type="submit"
                  className={styles.submit}
                  disabled={loading || !form.email}
                >
                  {loading ? 'Sending…' : 'Send My Rate Card'}
                </button>
              </form>
            )}

            {/* Done phase */}
            {phase === 'done' && (
              <div className={styles.done}>
                <div className={styles.doneIcon}>&#10003;</div>
                <p>
                  Your private rate card is on its way.<br />
                  <em>Expected within 24 hours.</em>
                </p>
                <p className={styles.doneSub}>
                  If you have any immediate questions, please contact us at{' '}
                  <strong>hello@kagoatelier.com</strong>
                </p>
                <button className={styles.submit} onClick={handleClose}>
                  Close
                </button>
              </div>
            )}

            {/* Declined phase */}
            {phase === 'declined' && (
              <div className={styles.declined}>
                <p className={styles.declinedText}>
                  For bespoke consultation and pricing, please reach out directly at{' '}
                  <strong>hello@kagoatelier.com</strong>
                </p>
                <p className={styles.declinedSub}>
                  We respond to all enquiries within 4 hours during atelier hours.
                </p>
                <button className={styles.submit} onClick={handleClose}>
                  Close
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
