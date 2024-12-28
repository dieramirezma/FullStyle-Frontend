import BenefitsSection from '@/components/services-section'
import HeroSection from '@/components/hero-section'
import NavBar from '@/components/nav-bar'
import ContactSection from '@/components/contact-section'
import Footer from '@/components/footer'

export default function Home () {
  return (
    <>
      <NavBar />
      <main className='flex flex-col gap-20 px-10 md:px-28'>
        <HeroSection />
        <BenefitsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
