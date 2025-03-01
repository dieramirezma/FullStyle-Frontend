import ServicesSection from '@/components/services-section'
import HeroSection from '@/components/hero-section'
import NavBar from '@/components/nav-bar'
import ContactSection from '@/components/contact-section'
import Footer from '@/components/footer'
import BlogSection from '@/components/blog-section'

export default function Home () {
  return (
    <>
      <NavBar />
      <main className='flex flex-col gap-20 px-10 md:px-28'>
        <HeroSection />
        <BlogSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
