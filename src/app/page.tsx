'use client'

import BenefitsSection from '@/components/services-section'
import HeroSection from '@/components/hero-section'
import NavBar from '@/components/nav-bar'

export default function Home () {
  return (
    <>
      <NavBar />
      <main className='px-10 md:px-28'>
        <HeroSection />
        <BenefitsSection />
      </main>
    </>
  )
}
