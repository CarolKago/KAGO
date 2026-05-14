import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <span className={styles.brandName}>KAGO</span>
          <span className={styles.brandSub}>Private Styling Atelier &middot; London &middot; Est. 2026</span>
        </div>
        <nav className={styles.links} aria-label="Footer navigation">
          <Link to="/lookbook">Lookbook</Link>
          <Link to="/services">Services</Link>
          <Link to="/contact">Contact</Link>
          <a href="https://instagram.com/kagosatelier" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://pinterest.com/kagosatelier" target="_blank" rel="noopener noreferrer">Pinterest</a>
        </nav>
      </div>
      <div className={styles.copy}>
        &copy; 2026 KAGO Atelier &middot; All Rights Reserved &middot; London
      </div>
    </footer>
  )
}
