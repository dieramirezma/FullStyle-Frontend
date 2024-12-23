'use client'

import HeroSection from '@/components/hero-section'
import NavBar from '@/components/nav-bar'

export default function Home () {
  return (
    <>
      <NavBar />
      <main className='px-16'>
        <HeroSection />
      </main>
    </>
  )
}
