'use client'

import Link from 'next/link'
import { Button } from './ui/button'
import BurgerIcon from './icons/burger-icon'
import { useEffect, useState } from 'react'

function NavBar () {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  // Show header on scroll
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let lastScrollY = window.scrollY

    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        // Scrolling down
        setHidden(true)
      } else {
        // Scrolling up
        setHidden(false)
      }
      lastScrollY = window.scrollY
    }

    window.addEventListener('scroll', handleScroll)

    // Clean up event listener on unmount
    return () => { window.removeEventListener('scroll', handleScroll) }
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className={`flex sticky top-0 w-full justify-between items-center bg-background rounded-lg mx-4 mt-4 px-8 border-b-2 transition-transform duration-700 ease-in-out ${hidden ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
      <div className='hidden md:block'>
        <Link
          href='/'
          className='title'
        >
          FullStyle
        </Link>
      </div>
      <div className='md:hidden'>
        <button onClick={toggleMenu}>
          <BurgerIcon />
        </button>
      </div>
      <nav
        className={`${
          isMenuOpen ? 'block' : 'hidden'
        } md:flex flex-col md:flex-row md:items-center md:justify-center flex-grow py-4 px-6 rounded-lg`}
      >
        <ul className='flex justify-evenly text-gray-primary w-full'>
          <Link
            className='font-bold hover:text-secondary'
            href="#hero"
          >
            Inicio
          </Link>
          <Link
            className='font-bold hover:text-secondary'
            href="#services"
          >
            Servicios
          </Link>
          <Link
            className='font-bold hover:text-secondary'
            href="#contact"
          >
            Contacto
          </Link>
        </ul>
      </nav>
      <Button
        variant='outline'
      >
        SOLICITA UNA DEMO
      </Button>
    </header>
  )
}

export default NavBar
