import { AnimatePresence, motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import styles from './Toast.module.css'

export default function ToastArea() {
  const { toasts } = useApp()
  return (
    <div id="toastArea" className={styles.area}>
      <AnimatePresence>
        {toasts.map(({ id, msg, type }) => (
          <motion.div
            key={id}
            className={`${styles.toast} ${styles[type]}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
          >
            {msg}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
