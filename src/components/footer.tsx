import Link from 'next/link'
import Facebook from './icons/facebook'
import Twitter from './icons/twitter'
import LinkedIn from './icons/linkedin'

function Footer () {
  return (
    <footer className='flex justify-between gap-10 py-10 px-10 bg-primary md:px-28 md:flex-row flex-col'>
      <div>
        <h3 className="subtitle2">Nosotros</h3>
        <ul className='text-base text-secondary font-medium'>
          <li><Link href='/about-us'>Misión</Link></li>
          <li><Link href='/about-us'>Visión</Link></li>
        </ul>
      </div>
      <div>
        <h3 className="subtitle2">Legal</h3>
        <ul className='text-base text-secondary font-medium'>
          <li><Link href='/legal/habeas-data'>Tratamiento de datos</Link></li>
        </ul>
      </div>
      <div>
        <h3 className="subtitle2">Soporte</h3>
        <ul className='text-base text-secondary font-medium'>
          <li><Link href='mailto:oficial.fullstyle@gmail.com'>Contáctanos</Link></li>
          <li><Link href='mailto:oficial.fullstyle@gmail.com'>Contacta con el equipo de privacidad</Link></li>
        </ul>
      </div>
      <div className='flex gap-1 items-start'>
        <Link href='https://www.linkedin.com/' target='_blank' aria-label='LinkedIn Fullstyle'>
          <LinkedIn width={30}/>
        </Link>
        <Link href='https://www.facebook.com/' target='_blank' aria-label='Facebook Fullstyle'>
          <Facebook width={30}/>
        </Link>
        <Link href='https://www.x.com/' target='_blank' aria-label='Twitter Fullstyle'>
          <Twitter width={30} />
        </Link>
      </div>
    </footer>
  )
}

export default Footer
