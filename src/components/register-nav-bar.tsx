import { Button } from './ui/button'
import Link from 'next/link'

function RegisterNavBar () {

  return (
      <div className='flex flex-row-reverse sticky top-0 w-full justify-between items-center bg-background rounded-lg mx-4 mt-4 px-8'>
        <Button variant='outline' className='px-10'>
          <Link href="/">IR AL HOMEPAGE</Link>
        </Button>
        <div className='hidden md:block'>
          <h1 className='title'>FullStyle</h1>
        </div>
      </div>
      
  )
}

export default RegisterNavBar
