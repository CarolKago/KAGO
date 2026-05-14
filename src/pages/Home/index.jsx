import { useState } from 'react'
import Nav from '../../components/layout/Nav'
import Footer from '../../components/layout/Footer'
import PageTransition from '../../components/layout/PageTransition'
import Hero from './Hero'
import FeaturedGrid from './FeaturedGrid'
import SummerPreview from './SummerPreview'
import Philosophy from './Philosophy'
import WeeklyEditPreview from './WeeklyEditPreview'
import ServicesPreview from './ServicesPreview'

export default function Home() {
  const [heroImage, setHeroImage] = useState(null)
  return (
    <PageTransition>
      <Nav transparent />
      <main>
        <Hero heroImage={heroImage} />
        <FeaturedGrid onHeroImage={setHeroImage} />
        <SummerPreview />
        <Philosophy />
        <WeeklyEditPreview />
        <ServicesPreview />
      </main>
      <Footer />
    </PageTransition>
  )
}
