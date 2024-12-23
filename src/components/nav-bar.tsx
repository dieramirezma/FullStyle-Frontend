import Link from 'next/link'
import { Button } from './ui/button'
import BurgerIcon from './icons/burger-icon'
import { useState } from 'react'
import Fullstyle from './icons/fullstyle'

function NavBar () {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className='flex justify-between items-center bg-background rounded-lg mx-4 my-4 px-8'>
      <div className='hidden md:block'>
        <Fullstyle width='50'/>
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
