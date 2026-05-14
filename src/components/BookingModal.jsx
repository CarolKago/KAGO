import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { insertBooking } from '../lib/supabase'
import styles from './BookingModal.module.css'

const SERVICES = [
  'Wardrobe Architecture — From £1,200',
  'The Power Edit — From £2,500',
  'Archive & Collector — Upon Request',
  'Creative Direction — Upon Request',
]

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

export default function BookingModal() {
  const { bookingOpen, closeBooking, addToast } = useApp()
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', phone: '', service: '', date: '', message: '',
  })

  function set(k) {
    return e => setForm(f => ({ ...f, [k]: e.target.value }))
  }

  function handleClose() {
    closeBooking()
    setTimeout(() => { setDone(false); setForm({ name: '', email: '', phone: '', service: '', date: '', message: '' }) }, 350)
  }

  async function submit() {
    if (!form.name || !form.email || !form.service) {
      addToast('Please fill in name, email and service', 'err')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      addToast('Please enter a valid email address', 'err')
      return
    }
    setLoading(true)
    const booking = {
      client_name:    form.name,
      client_email:   form.email,
      client_phone:   form.phone || null,
      service:        form.service,
      preferred_date: form.date || null,
      message:        form.message || null,
      status:         'new',
    }
    const { error } = await insertBooking(booking)
    if (error) {
      // Persist locally as fallback
      try {
        const bks = JSON.parse(localStorage.getItem('kago_bookings') || '[]')
        bks.push({ ...booking, id: `b_${Date.now()}` })
        localStorage.setItem('kago_bookings', JSON.stringify(bks))
      } catch {}
    }
    setLoading(false)
    setDone(true)
    addToast('Enquiry received — we will be in touch within 24 hours', 'ok')
    if (window.BroadcastChannel) {
      new BroadcastChannel('kago_sync').postMessage({ type: 'new_booking', client: form.name })
    }
  }

  return (
    <AnimatePresence>
      {bookingOpen && (
        <motion.div
          className={styles.overlay}
          variants={overlay}
          initial="hidden"
          animate="show"
          exit="exit"
          onClick={e => { if (e.target === e.currentTarget) handleClose() }}
        >
          <motion.div className={styles.panel} variants={panel}>
            <div className={styles.head}>
              <div className={styles.title}>Request a Consultation</div>
              <button className={styles.close} onClick={handleClose} aria-label="Close">&times;</button>
            </div>

            {done ? (
              <div className={styles.done}>
                Enquiry received.<br />
                <em>We will be in touch within 24 hours.</em>
              </div>
            ) : (
              <div className={styles.body}>
                <div className="form-field">
                  <label className="form-label" htmlFor="bName">Name *</label>
                  <input className="form-input" id="bName" type="text"
                    placeholder="Full name" value={form.name} onChange={set('name')} autoComplete="name" />
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="bEmail">Email *</label>
                  <input className="form-input" id="bEmail" type="email"
                    placeholder="your@email.com" value={form.email} onChange={set('email')} autoComplete="email" />
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="bPhone">Phone</label>
                  <input className="form-input" id="bPhone" type="tel"
                    placeholder="+44 7700 000000" value={form.phone} onChange={set('phone')} autoComplete="tel" />
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="bService">Service *</label>
                  <select className="form-select" id="bService" value={form.service} onChange={set('service')}>
                    <option value="">Select a service</option>
                    {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="bDate">Preferred Date</label>
                  <input className="form-input" id="bDate" type="date"
                    value={form.date} onChange={set('date')} />
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="bMsg">Message</label>
                  <textarea className="form-textarea" id="bMsg"
                    placeholder="Tell us what you are looking for…"
                    value={form.message} onChange={set('message')} />
                </div>
                <button
                  className={styles.submit}
                  onClick={submit}
                  disabled={loading}
                >
                  {loading ? 'Sending…' : 'Send Enquiry ›'}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
