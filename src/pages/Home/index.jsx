import { useState } from 'react'
import Nav from '../../components/layout/Nav'
import Footer from '../../components/layout/Footer'
import PageTransition from '../../components/layout/PageTransition'
import Hero from './Hero'
import FeaturedGrid from './FeaturedGrid'
import Philosophy from './Philosophy'
import ServicesPreview from './ServicesPreview'

export default function Home() {
  const [heroImage, setHeroImage] = useState(null)
  return (
    <PageTransition>
      <Nav transparent />
      <main>
        <Hero heroImage={heroImage} />
        <FeaturedGrid onHeroImage={setHeroImage} />
        <Philosophy />
        <ServicesPreview />
      </main>
      <Footer />
    </PageTransition>
  )
}
