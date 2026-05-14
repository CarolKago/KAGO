import { useState } from 'react'
import { motion } from 'framer-motion'
import Nav from '../../components/layout/Nav'
import Footer from '../../components/layout/Footer'
import PageTransition from '../../components/layout/PageTransition'
import { insertContact } from '../../lib/supabase'
import { useApp } from '../../context/AppContext'
import styles from './Contact.module.css'

const CONTACT_INFO = [
  { label: 'General', value: 'hello@kagoatelier.com' },
  { label: 'Styling', value: 'styling@kagoatelier.com' },
  { label: 'Archive', value: 'archive@kagoatelier.com' },
  { label: 'Press',   value: 'press@kagoatelier.com' },
]

export default function Contact() {
  const { addToast } = useApp()
  const [sent, setSent]     = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm]     = useState({ name: '', email: '', subject: '', message: '' })

  function set(k) { return e => setForm(f => ({ ...f, [k]: e.target.value })) }

  async function submit(e) {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      addToast('Please fill in all required fields', 'err')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      addToast('Please enter a valid email address', 'err')
      return
    }
    setLoading(true)
    const { error } = await insertContact({
      name:    form.name,
      email:   form.email,
      subject: form.subject || null,
      message: form.message,
    })
    if (error) {
      // Persist locally as fallback
      try {
        const msgs = JSON.parse(localStorage.getItem('kago_contacts') || '[]')
        msgs.push({ ...form, id: `c_${Date.now()}` })
        localStorage.setItem('kago_contacts', JSON.stringify(msgs))
      } catch {}
    }
    setLoading(false)
    setSent(true)
    addToast('Message sent — we will respond within 4 hours', 'ok')
  }

  return (
    <PageTransition>
      <Nav />
      <main className={styles.main}>
        <div className={styles.layout}>

          <motion.div
            className={styles.left}
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65 }}
          >
            <div className="eyebrow light">Get in Touch</div>
            <h1 className={styles.title}>Contact<br /><em>KAGO</em></h1>
            <p className={styles.body}>
              All enquiries are handled personally and responded to within four hours.
              We maintain the highest level of discretion.
            </p>
            <div className={styles.infoList}>
              {CONTACT_INFO.map(({ label, value }) => (
                <div key={label} className={styles.infoRow}>
                  <span className={styles.infoLabel}>{label}</span>
                  <a href={`mailto:${value}`} className={styles.infoValue}>{value}</a>
                </div>
              ))}
            </div>
            <div className={styles.socials}>
              <a href="https://instagram.com/kagosatelier" target="_blank" rel="noopener noreferrer" className={styles.social}>
                Instagram
              </a>
              <span className={styles.socialDot} />
              <a href="https://pinterest.com/kagosatelier" target="_blank" rel="noopener noreferrer" className={styles.social}>
                Pinterest
              </a>
            </div>
          </motion.div>

          <motion.div
            className={styles.right}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
          >
            {sent ? (
              <div className={styles.thankYou}>
                <p className={styles.thankYouTitle}>Message received.</p>
                <p className={styles.thankYouSub}>
                  <em>We will be in touch within 4 hours.</em>
                </p>
              </div>
            ) : (
              <form className={styles.form} onSubmit={submit} noValidate>
                <div className="form-field">
                  <label className="form-label" htmlFor="cName">Name *</label>
                  <input className="form-input on-dark" id="cName" type="text"
                    placeholder="Your name" value={form.name} onChange={set('name')} autoComplete="name" />
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="cEmail">Email *</label>
                  <input className="form-input on-dark" id="cEmail" type="email"
                    placeholder="your@email.com" value={form.email} onChange={set('email')} autoComplete="email" />
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="cSubject">Subject</label>
                  <input className="form-input on-dark" id="cSubject" type="text"
                    placeholder="General enquiry" value={form.subject} onChange={set('subject')} />
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="cMessage">Message *</label>
                  <textarea className="form-textarea on-dark" id="cMessage"
                    placeholder="How can we assist you?"
                    rows={6} value={form.message} onChange={set('message')} />
                </div>
                <button type="submit" className={styles.submit} disabled={loading}>
                  {loading ? 'Sending…' : 'Send Message ›'}
                </button>
              </form>
            )}
          </motion.div>

        </div>
      </main>
      <Footer />
    </PageTransition>
  )
}
