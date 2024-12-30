import { Button } from './ui/button'
import Link from 'next/link'

function RegisterNavBar () {
  return (
      <div className='flex justify-between items-center bg-background my-4 px-12'>
        <div className='hidden md:block'>
          <h1 className='title'>FullStyle</h1>
        </div>
        <Button variant='outline' className='px-10'>
          <Link href="/">IR AL HOMEPAGE</Link>
        </Button>
      </div>
  )
}

export default RegisterNavBar
