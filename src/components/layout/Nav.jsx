import { useState, useEffect, useRef } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import styles from './Nav.module.css'

const LINKS = [
  { to: '/',          label: 'Home' },
  { to: '/lookbook',  label: 'Lookbook' },
  { to: '/services',  label: 'Services' },
  { to: '/contact',   label: 'Contact' },
]

export default function Nav({ transparent = false }) {
  const { openBooking } = useApp()
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const navRef = useRef(null)

  useEffect(() => {
    if (!transparent) return
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [transparent])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const theme = !transparent ? 'light' : scrolled ? 'dark' : 'transparent'

  return (
    <>
      <nav ref={navRef} className={`${styles.nav} ${styles[theme]}`}>
        <Link to="/" className={styles.brand} onClick={() => setMenuOpen(false)}>
          KAGO
        </Link>

        <ul className={styles.links}>
          {LINKS.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  isActive ? `${styles.link} ${styles.active}` : styles.link
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <button
          className={styles.cta}
          onClick={openBooking}
          aria-label="Book a consultation"
        >
          Book Now
        </button>

        <button
          className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ''}`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(v => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className={styles.mobile}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
          >
            {LINKS.map(({ to, label }, i) => (
              <motion.div
                key={to}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 * i, duration: 0.32 }}
              >
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    isActive ? `${styles.mobileLink} ${styles.mobileLinkActive}` : styles.mobileLink
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </NavLink>
              </motion.div>
            ))}
            <motion.button
              className={styles.mobileCta}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.32 }}
              onClick={() => { setMenuOpen(false); openBooking() }}
            >
              Book a Consultation
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
