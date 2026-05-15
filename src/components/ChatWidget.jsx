import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import styles from './ChatWidget.module.css'

const RESPONSES = {
  archive: 'Archive enquiries: <strong>archive@kagoatelier.com</strong> — handled personally.',
  press:   'Press and collaborations: <strong>press@kagoatelier.com</strong>',
  general: 'General enquiries: <strong>hello@kagoatelier.com</strong> — we respond within 4 hours.',
}

const QUICK_MAIN = [
  { label: 'Book a consultation', key: 'book_form'  },
  { label: 'Pricing & rate card', key: 'rate_card'  },
  { label: 'Archive & collector', key: 'archive'    },
  { label: 'Press & media',       key: 'press'      },
  { label: 'General enquiry',     key: 'general'    },
]

const QUICK_RATE = [
  { label: 'Yes — book consultation', key: 'rate_yes' },
  { label: 'No — I\'ll email instead', key: 'rate_no' },
]

const QUICK_FOLLOW = [
  { label: 'Book consultation', key: 'book_form' },
  { label: 'Archive enquiry',   key: 'archive'   },
]

function Message({ text, from }) {
  return (
    <div
      className={`${styles.msg} ${from === 'bot' ? styles.bot : styles.usr}`}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  )
}

export default function ChatWidget() {
  const { openBooking } = useApp()
  const [open,  setOpen]  = useState(false)
  const [badge, setBadge] = useState(true)
  const [phase, setPhase] = useState(0)
  const [name,  setName]  = useState('')
  const [input, setInput] = useState('')
  const [msgs,  setMsgs]  = useState([])
  const [quick, setQuick] = useState([])
  const msgsRef = useRef(null)

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight
  }, [msgs])

  function addMsg(text, from) {
    setMsgs(m => [...m, { text, from }])
  }

  function handleOpen() {
    setOpen(v => !v)
    setBadge(false)
    if (msgs.length === 0) {
      setTimeout(() => addMsg('Welcome to KAGO. You are speaking with our private concierge.', 'bot'), 300)
      setTimeout(() => addMsg('May I ask your name?', 'bot'), 1000)
    }
  }

  function handleQuick(key) {
    setQuick([])

    if (key === 'book_form') {
      addMsg('Opening the consultation booking for you now.', 'bot')
      setTimeout(() => { openBooking(); setOpen(false) }, 500)
      return
    }

    if (key === 'rate_card') {
      addMsg(
        `Our services are entirely bespoke${name ? ', ' + name : ''}. We don't publish a standard price list — every engagement is scoped to your needs.<br><br>` +
        'Would you like to book a private consultation? You will receive our <strong>exclusive rate card</strong> directly following your booking.',
        'bot'
      )
      setTimeout(() => setQuick(QUICK_RATE), 600)
      return
    }

    if (key === 'rate_yes') {
      addMsg('Wonderful. Let me open the consultation form — your rate card will follow by return.', 'bot')
      setTimeout(() => { openBooking(); setOpen(false) }, 600)
      return
    }

    if (key === 'rate_no') {
      addMsg(
        'Of course. Please reach out directly at <strong>hello@kagoatelier.com</strong> and we will be happy to assist you.',
        'bot'
      )
      setTimeout(() => {
        addMsg('Is there anything else I can help with?', 'bot')
        setQuick(QUICK_FOLLOW)
      }, 800)
      return
    }

    // General responses
    addMsg(RESPONSES[key], 'bot')
    setTimeout(() => {
      addMsg('Is there anything else I can help with?', 'bot')
      setQuick(QUICK_FOLLOW)
    }, 700)
  }

  function send() {
    const v = input.trim()
    if (!v) return
    addMsg(v, 'usr')
    setInput('')

    if (phase === 0) {
      const n = v.split(' ')[0]
      setName(n)
      setPhase(1)
      setTimeout(() => {
        addMsg(`How lovely to meet you, ${n}. How may I assist you today?`, 'bot')
        setQuick(QUICK_MAIN)
      }, 600)
    } else {
      setTimeout(() => {
        addMsg('Please select an option below, or email <strong>hello@kagoatelier.com</strong> directly.', 'bot')
        setQuick(QUICK_FOLLOW)
      }, 600)
    }
  }

  return (
    <>
      <button className={styles.trigger} onClick={handleOpen} aria-label="Open chat">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        {badge && <span className={styles.badge}>1</span>}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.panel}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className={styles.head}>
              <div className={styles.headLeft}>
                <div className={styles.avatar}>K</div>
                <div>
                  <div className={styles.agentName}>KAGO Concierge</div>
                  <div className={styles.agentStatus}>Private Atelier &middot; Online</div>
                </div>
              </div>
              <button className={styles.closeBtn} onClick={() => setOpen(false)}>&times;</button>
            </div>

            <div className={styles.msgs} ref={msgsRef}>
              {msgs.map((m, i) => <Message key={i} {...m} />)}
            </div>

            {quick.length > 0 && (
              <div className={styles.quick}>
                {quick.map(q => (
                  <button key={q.key} className={styles.qb} onClick={() => handleQuick(q.key)}>
                    {q.label}
                  </button>
                ))}
              </div>
            )}

            <div className={styles.inputRow}>
              <input
                className={styles.input}
                placeholder="Write your message…"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') send() }}
                autoComplete="off"
                autoCorrect="off"
              />
              <button className={styles.sendBtn} onClick={send}>Send</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
