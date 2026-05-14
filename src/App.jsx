import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AppProvider } from './context/AppContext'
import BookingModal from './components/BookingModal'
import ChatWidget from './components/ChatWidget'
import ToastArea from './components/Toast'
import Home          from './pages/Home'
import Lookbook      from './pages/Lookbook'
import Services      from './pages/Services'
import Contact       from './pages/Contact'
import SummerEdit    from './pages/SummerEdit'
import SummerLookbook from './pages/SummerLookbook'
import WeeklyEdit    from './pages/WeeklyEdit'

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function AppShell() {
  const location = useLocation()
  return (
    <>
      <ScrollTop />
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/"            element={<Home />} />
          <Route path="/lookbook"    element={<Lookbook />} />
          <Route path="/services"    element={<Services />} />
          <Route path="/contact"     element={<Contact />} />
          <Route path="/summer-edit"    element={<SummerEdit />} />
          <Route path="/summer-lookbook" element={<SummerLookbook />} />
          <Route path="/weekly-edit"  element={<WeeklyEdit />} />
          <Route path="*"            element={<Home />} />
        </Routes>
      </AnimatePresence>
      <BookingModal />
      <ChatWidget />
      <ToastArea />
    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  )
}
